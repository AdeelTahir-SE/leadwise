# ProspectPilot — System Architecture

## 1. Overview

ProspectPilot is a multi-agent lead generation system built on LangChain (LangGraph for orchestration), Next.js/TypeScript, and Supabase. A **Supervisor Agent** coordinates a team of specialized **Sub-Agents**, each responsible for one stage of the pipeline: research, qualification, enrichment, scoring, and outreach drafting. Agents communicate through a shared state object and persist intermediate results to Supabase, making the pipeline resumable, auditable, and horizontally scalable.

Design goals:
- **Accuracy over speed** — every claim a sub-agent makes is traceable to a source (URL, API response, or document) before it's trusted downstream.
- **Fault isolation** — a failure in one sub-agent (e.g., enrichment API down) doesn't kill the whole run; it degrades gracefully and flags the lead for retry.
- **Auditability** — every agent decision is logged with reasoning, inputs, and confidence score for debugging and client-facing transparency.
- **Composability** — sub-agents are independently testable LangChain runnables, not tightly coupled functions.

---

## 2. High-Level Architecture

```
                         ┌─────────────────────────┐
                         │      Next.js Frontend    │
                         │  (Dashboard / CRM view)  │
                         └────────────┬─────────────┘
                                      │ REST/tRPC
                         ┌────────────▼─────────────┐
                         │      API Gateway Layer     │
                         │   (Next.js API routes /    │
                         │    Edge Functions)         │
                         └────────────┬─────────────┘
                                      │
                         ┌────────────▼─────────────┐
                         │     SUPERVISOR AGENT       │
                         │   (LangGraph StateGraph)   │
                         │  - task routing            │
                         │  - retry/error handling     │
                         │  - budget & rate control    │
                         └──┬───┬───┬───┬───┬────────┘
        ┌───────────────────┘   │   │   │   └──────────────────┐
        ▼                       ▼   ▼   ▼                      ▼
┌───────────────┐   ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ Research Agent │   │ Qualification │ │  Enrichment    │ │ Outreach Agent │
│  (discovery)   │   │     Agent      │ │     Agent      │ │  (drafting)    │
└───────┬────────┘   └──────┬────────┘ └──────┬────────┘ └──────┬────────┘
        │                   │                  │                 │
        └───────────────────┴──────────────────┴─────────────────┘
                                      │
                         ┌────────────▼─────────────┐
                         │   Shared State + Memory    │
                         │  (LangGraph checkpointer)  │
                         └────────────┬─────────────┘
                                      │
                         ┌────────────▼─────────────┐
                         │        Supabase            │
                         │  Postgres + pgvector +     │
                         │  Auth + Storage             │
                         └────────────────────────────┘
```

---

## 3. Orchestration Layer

**Framework:** LangGraph (LangChain's graph-based orchestrator) — chosen over a simple `AgentExecutor` chain because lead generation is inherently stateful and conditional (a lead can fail qualification and short-circuit, or need re-enrichment).

### Supervisor Agent responsibilities
- Owns the `StateGraph` and defines transitions between sub-agents.
- Routes each lead through: `Research → Qualification → [pass/fail] → Enrichment → Scoring → Outreach`.
- Implements conditional edges — e.g., a lead scoring below threshold skips Outreach entirely.
- Enforces per-run budgets: max tokens, max API calls, max wall-clock time per lead.
- Handles retries with exponential backoff for transient sub-agent failures.
- Emits structured events (`lead.researched`, `lead.qualified`, `lead.enriched`, `lead.scored`, `lead.drafted`) to an event log table for observability.

```python
# supervisor/graph.py (conceptual)
from langgraph.graph import StateGraph, END

graph = StateGraph(LeadState)
graph.add_node("research", research_agent)
graph.add_node("qualify", qualification_agent)
graph.add_node("enrich", enrichment_agent)
graph.add_node("score", scoring_agent)
graph.add_node("outreach", outreach_agent)

graph.set_entry_point("research")
graph.add_edge("research", "qualify")
graph.add_conditional_edges(
    "qualify",
    lambda state: "enrich" if state["qualified"] else END,
)
graph.add_edge("enrich", "score")
graph.add_conditional_edges(
    "score",
    lambda state: "outreach" if state["score"] >= state["threshold"] else END,
)
graph.add_edge("outreach", END)

app = graph.compile(checkpointer=postgres_checkpointer)
```

---

## 4. Sub-Agents

### 4.1 Research Agent
**Purpose:** Discover candidate leads and gather raw public data.

- **Tools:** web search (Tavily/SerpAPI), `web_fetch`/scraper (Playwright headless), LinkedIn company/people search (via compliant API or user-provided connector), job-posting feeds (signals hiring = growth = budget).
- **Chain type:** ReAct agent with tool-calling — searches iteratively, decides when it has "enough" signal.
- **Output:** raw `LeadCandidate` object — company name, domain, size estimate, industry, key people, recent news, hiring signals — each field tagged with its **source URL**.
- **Accuracy control:** every extracted fact must cite a source; the agent is prompted to say "unknown" rather than infer/hallucinate a field it can't verify.

### 4.2 Qualification Agent
**Purpose:** Decide if a candidate matches the Ideal Customer Profile (ICP).

- **Chain type:** structured-output chain (Pydantic/JSON schema) — not freeform generation, so scoring is deterministic-ish and easy to grade.
- **Input:** `LeadCandidate` + ICP config (industry, size range, geography, tech stack signals, budget signals).
- **Output:** `{ qualified: bool, reasons: string[], confidence: float, missing_fields: string[] }`.
- **Guardrail:** if `confidence < 0.6`, route to a human-review queue instead of auto-passing/failing — avoids silently dropping good leads or wasting enrichment budget on bad ones.

### 4.3 Enrichment Agent
**Purpose:** Fill in missing structured data (verified email, direct role, LinkedIn URL, tech stack) for qualified leads only (cost control — never enrich unqualified leads).

- **Tools:** email-finder API (Hunter.io/Apollo-style), Clearbit/BuiltWith-style tech stack lookup, LinkedIn profile resolution.
- **Chain type:** tool-calling agent with strict fallbacks — if API A fails/rate-limits, fall back to API B before giving up and flagging `enrichment_incomplete`.
- **Output:** merged, deduplicated `EnrichedLead` record.

### 4.4 Scoring Agent
**Purpose:** Rank enriched leads by conversion likelihood.

- **Chain type:** hybrid — a deterministic weighted-feature score (firmographic fit, intent signals, recency of hiring/funding news) combined with an LLM judgment pass for qualitative signals (e.g., "does their recent blog post suggest they're evaluating tools like ours?").
- **Output:** `score: 0–100`, `score_breakdown: {...}`, `priority_tier: hot|warm|cold`.
- **Why hybrid, not pure-LLM:** deterministic scoring is auditable and consistent across runs; the LLM layer adds nuance without making the whole score a black box.

### 4.5 Outreach Agent
**Purpose:** Draft a personalized first-touch message for hot/warm leads only.

- **Chain type:** prompt-templated generation grounded in the specific research facts gathered (not generic templates) — cites the actual news item/hiring signal that triggered outreach.
- **Output:** subject line + body, saved as a draft (never auto-sent) with a `human_approval_required: true` flag by default.
- **Guardrail:** hard rule — outreach never fires automatically; a human always approves/edits before send, configurable per client.

---

## 5. Shared State & Memory

- **LangGraph checkpointer** backed by Postgres (Supabase) — every state transition is persisted, so a run can pause, resume, or be replayed for debugging.
- **State schema (`LeadState`)** carries the full audit trail: raw research → qualification verdict → enrichment data → score → draft, each with timestamps and the agent version that produced it.
- **Vector memory (pgvector):** past qualified/disqualified leads are embedded and stored so the Qualification Agent can retrieve similar historical cases as few-shot context — improving consistency over time without retraining.

---

## 6. Data Layer (Supabase)

Core tables:
- `leads` — canonical lead record, current pipeline stage, current score
- `lead_events` — append-only audit log of every agent action + reasoning
- `lead_sources` — source URL + extracted fact + confidence, per field
- `icp_configs` — per-client qualification criteria
- `outreach_drafts` — generated messages, approval status, send status
- `agent_runs` — run metadata: cost, token usage, duration, error count

Row-Level Security (RLS) scopes all tables per client/workspace, since this is a multi-tenant product.

---

## 7. Reliability & Accuracy Mechanisms

| Concern | Mitigation |
|---|---|
| Hallucinated facts | Every extracted field must cite a source; ungrounded claims are rejected in a self-check pass before being written to state |
| Cascading failures | Each sub-agent wrapped in try/retry/circuit-breaker; Supervisor routes failed leads to a dead-letter queue instead of crashing the run |
| Cost overruns | Per-run token/API budget enforced by Supervisor; enrichment only runs on qualified leads |
| Stale/duplicate leads | Dedup check (domain + normalized company name) before Research Agent re-runs work |
| Silent quality drift | `agent_runs` metrics (avg confidence, qualification rate, enrichment failure rate) tracked over time; alerts if qualification rate drifts outside expected band |
| Unsafe auto-send | Outreach Agent output is always a draft; send requires explicit human/client approval |

---

## 8. Observability

- Structured logging of every agent decision (input, output, reasoning, confidence, latency, token cost) to `lead_events`.
- LangSmith (or self-hosted tracing) integration for step-by-step chain tracing during development and debugging.
- Dashboard surfaces pipeline health: leads/hour, qualification rate, enrichment success rate, avg cost per qualified lead.

---

## 9. Tech Stack Summary

- **Orchestration:** LangChain + LangGraph
- **LLM:** OpenAI (GPT-4-class for research/qualification reasoning, cheaper model for structured extraction where possible)
- **Frontend:** Next.js + TypeScript
- **Backend/DB:** Supabase (Postgres, pgvector, Auth, RLS, Storage)
- **Tools/APIs:** web search API, headless browser scraping, email-finder API, tech-stack lookup API
- **Tracing:** LangSmith
- **Payments (if SaaS):** Stripe
