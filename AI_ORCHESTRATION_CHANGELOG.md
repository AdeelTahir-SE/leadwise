# 🧠 AI Orchestration (Member 3) — Branch Work Summary

This document summarizes the work completed on the `feature/ai-orchestration` (or `ai-orchestration`) branch. It establishes the core "brain" of ProspectPilot using LangGraph and a Python-based FastAPI sidecar.

## 📁 What Was Built

### 1. Python `agent-service` Scaffold
Since LangGraph is Python-native, we created a dedicated backend service inside the `agent-service/` directory.
- **`main.py`**: A FastAPI entry point that exposes the `/run` endpoint to trigger the lead generation pipeline.
- **`requirements.txt`**: Captures all Python dependencies (`langgraph`, `langchain`, `fastapi`, etc.).
- **`config.py`**: Handles loading environment variables (OpenAI keys, Supabase URLs).

### 2. State Management & Contracts
- **`graph/state.py`**: Defined the `LeadState` schema (using `TypedDict` and Pydantic). This is the **most critical file** as it defines the exact JSON structure of a lead moving through the pipeline, serving as the data contract for Member 2 (Database) and Member 4 (Sub-Agents).

### 3. Graph Architecture & Routing
- **`graph/graph.py`**: Designed and wired the LangGraph `StateGraph`. 
  - Connected the 5 core nodes: Research → Qualification → Enrichment → Scoring → Outreach.
  - Built conditional routing logic (e.g., skip enrichment if a lead is unqualified, skip outreach if the score is below the budget threshold).
- **`graph/checkpointer.py`**: Implemented state persistence. (Currently using `MemorySaver` for immediate testing, with stubs prepared for a Supabase `PostgresSaver`).

### 4. Agent Stubs
- **`agents/*.py`**: Created stub implementations for all 5 sub-agents (`research.py`, `qualification.py`, `enrichment.py`, `scoring.py`, `outreach.py`) using a common `BaseAgent` interface. 
- *Note:* These currently return hardcoded dummy data so the graph can be tested end-to-end immediately, unblocking frontend integration while Member 4 builds the real AI logic.

### 5. Reliability & Budgeting
- **`reliability/retry.py`**: A wrapper to provide exponential backoff for transient API failures.
- **`supervisor/budget.py`**: A guardrail wrapper to prevent infinite loops and cap token/API usage per lead.

### 6. Next.js Bridge
- **`src/app/api/agent/route.ts`**: Created a Next.js API route that securely proxies frontend requests to the Python FastAPI service.

---

## 🚀 How to Run the AI Layer Locally

To test the orchestration graph with the dummy agent stubs:

1. Open a terminal and navigate to the agent service:
   ```bash
   cd agent-service
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Mac/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn main:api --reload --port 8000
   ```
5. You can now test the API via the Next.js frontend by making a POST request to `http://localhost:3000/api/agent`.

---

## 🤝 Handoff Notes
- **For Member 4 (Agents):** You can now replace the dummy data in `agent-service/agents/*.py` with actual LangChain/LLM calls. Just ensure your functions return data matching the schemas in `graph/state.py`.
- **For Member 2 (Backend):** You can look at `graph/state.py` to finalize the Supabase table columns for `LeadCandidate`, `ScoreResult`, etc.
- **For Member 1 (Frontend):** You can send a `POST` to `/api/agent` with `{ "target_query": "...", "icp_config": {...} }` to trigger the mock pipeline and see the dummy data flow through!
