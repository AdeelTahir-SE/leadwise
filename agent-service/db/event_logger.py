"""
agent-service/db/event_logger.py

Structured event logger and database synchronizer for the lead pipeline.

Key responsibilities:
1. `log_lead_event`: Writes an append-only row to public.lead_events after each agent step,
   creating the full audit trail displayed in Member 1's dashboard and lead drawer.
2. `update_run_status`: Updates public.agent_runs with the current pipeline_stage,
   token/API usage counters, and completion timestamps for status polling.
3. `upsert_lead_from_state`: Synchronizes the canonical lead record (public.leads),
   fact citations (public.lead_sources), and outreach drafts (public.outreach_drafts)
   from the LangGraph LeadState.
4. `observe_agent_step`: Wrapper to execute an agent node, capture latency, tokens,
   and audit logs, and update status in one clean call.

Design:
- All DB writes are non-blocking and safe from crashing the pipeline (try-except guarded).
- Uses DEV_WORKSPACE_ID for local development fallback.
"""
import asyncio
import functools
import logging
import os
import time
from typing import Any, Callable, Dict, List, Optional

logger = logging.getLogger(__name__)

DEV_WORKSPACE_ID = "00000000-0000-0000-0000-000000000001"


def _get(obj: Any, key: str) -> Any:
    """Helper to extract property from both Pydantic model and dict."""
    if obj is None:
        return None
    if hasattr(obj, key):
        return getattr(obj, key)
    return obj.get(key) if isinstance(obj, dict) else None


async def log_lead_event(
    *,
    lead_id: str,
    run_id: Optional[str],
    step: str,
    agent_name: str,
    reasoning: Optional[str] = None,
    confidence: Optional[int] = None,
    citations: Optional[List[str]] = None,
    input_snapshot: Optional[Dict[str, Any]] = None,
    output_snapshot: Optional[Dict[str, Any]] = None,
    tokens_used: int = 0,
    latency_ms: Optional[int] = None,
) -> None:
    """
    Inserts an audit row into public.lead_events.

    Safe to call in any async context. Exceptions are caught and logged
    so a DB write failure never interrupts the pipeline.
    """
    from db.supabase_client import get_supabase_client

    client = get_supabase_client()
    if client is None:
        logger.debug("[event_logger] Supabase client not available — skipping event log")
        return

    payload = {
        "lead_id": lead_id,
        "run_id": run_id,
        "step": step,
        "agent_name": agent_name,
        "reasoning": reasoning,
        "confidence": confidence,
        "citations": citations or [],
        "input_snapshot": input_snapshot,
        "output_snapshot": output_snapshot,
        "tokens_used": tokens_used,
        "latency_ms": latency_ms,
    }
    # Remove None values so DB defaults apply
    payload = {k: v for k, v in payload.items() if v is not None}

    try:
        await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: client.table("lead_events").insert(payload).execute(),
        )
    except Exception as exc:  # noqa: BLE001
        logger.error("[event_logger] Failed to write lead_event for lead %s: %s", lead_id, exc)


async def update_run_status(
    *,
    run_id: str,
    pipeline_stage: Optional[str] = None,
    status: Optional[str] = None,
    tokens_used: Optional[int] = None,
    api_calls_used: Optional[int] = None,
    error: Optional[str] = None,
    completed_at: Optional[str] = None,
) -> None:
    """
    Updates a row in public.agent_runs with the latest status and counters.
    """
    from db.supabase_client import get_supabase_client

    client = get_supabase_client()
    if client is None:
        return

    updates: Dict[str, Any] = {}
    if pipeline_stage is not None:
        updates["pipeline_stage"] = pipeline_stage
    if status is not None:
        updates["status"] = status
    if tokens_used is not None:
        updates["tokens_used"] = tokens_used
    if api_calls_used is not None:
        updates["api_calls_used"] = api_calls_used
    if error is not None:
        updates["error"] = error
    if completed_at is not None:
        updates["completed_at"] = completed_at

    if not updates:
        return

    try:
        await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: client.table("agent_runs").update(updates).eq("id", run_id).execute(),
        )
    except Exception as exc:  # noqa: BLE001
        logger.error("[event_logger] Failed to update run %s: %s", run_id, exc)


async def sync_lead_sources(
    lead_id: str, candidate: Any
) -> None:
    """
    Extracts SourcedFact items from candidate.recent_news and candidate.hiring_signals
    and inserts them into public.lead_sources.
    """
    from db.supabase_client import get_supabase_client

    client = get_supabase_client()
    if client is None or candidate is None:
        return

    sources_to_insert = []

    # Recent news facts
    recent_news = _get(candidate, "recent_news") or []
    for fact in recent_news:
        val = _get(fact, "value")
        url = _get(fact, "source_url")
        conf = _get(fact, "confidence")
        if val or url:
            sources_to_insert.append({
                "lead_id": lead_id,
                "field_name": "recent_news",
                "value": str(val) if val else None,
                "source_url": str(url) if url else None,
                "confidence": float(conf) if conf is not None else None,
            })

    # Hiring signals facts
    hiring_signals = _get(candidate, "hiring_signals") or []
    for fact in hiring_signals:
        val = _get(fact, "value")
        url = _get(fact, "source_url")
        conf = _get(fact, "confidence")
        if val or url:
            sources_to_insert.append({
                "lead_id": lead_id,
                "field_name": "hiring_signal",
                "value": str(val) if val else None,
                "source_url": str(url) if url else None,
                "confidence": float(conf) if conf is not None else None,
            })

    if not sources_to_insert:
        return

    try:
        await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: client.table("lead_sources").insert(sources_to_insert).execute(),
        )
    except Exception as exc:  # noqa: BLE001
        logger.error("[event_logger] Failed to sync lead_sources for lead %s: %s", lead_id, exc)


async def sync_outreach_draft(
    lead_id: str, workspace_id: str, draft: Any, candidate: Any
) -> None:
    """
    Inserts or updates a message in public.outreach_drafts when the Outreach Agent drafts copy.
    """
    from db.supabase_client import get_supabase_client

    client = get_supabase_client()
    if client is None or draft is None:
        return

    subject = _get(draft, "subject")
    body = _get(draft, "body")
    approval_required = _get(draft, "human_approval_required")

    # Construct hook and signals cited from candidate facts
    signals_cited: List[str] = []
    recent_news = _get(candidate, "recent_news") or []
    for fact in recent_news:
        v = _get(fact, "value")
        if v:
            signals_cited.append(str(v))
    hiring_signals = _get(candidate, "hiring_signals") or []
    for fact in hiring_signals:
        v = _get(fact, "value")
        if v:
            signals_cited.append(str(v))

    personalized_hook = signals_cited[0] if signals_cited else "Generated personalized outreach hook"

    draft_payload = {
        "lead_id": lead_id,
        "workspace_id": workspace_id,
        "channel": "email",
        "subject": subject,
        "body": body,
        "personalized_hook": personalized_hook,
        "signals_cited": signals_cited,
        "human_approval_required": approval_required if approval_required is not None else True,
        "status": "pending_approval",
    }

    try:
        await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: client.table("outreach_drafts").insert(draft_payload).execute(),
        )
    except Exception as exc:  # noqa: BLE001
        logger.error("[event_logger] Failed to sync outreach draft for lead %s: %s", lead_id, exc)


async def upsert_lead_from_state(state: Dict[str, Any]) -> Optional[str]:
    """
    Creates or updates the lead record in public.leads from the pipeline LeadState.
    Also synchronizes lead_sources and outreach_drafts.

    Returns the lead_id (UUID) if successful, None otherwise.
    """
    from db.supabase_client import get_supabase_client

    client = get_supabase_client()
    if client is None:
        return None

    candidate = state.get("candidate")
    if candidate is None:
        return None

    qualification = state.get("qualification")
    enriched = state.get("enriched")
    score_result = state.get("score")
    draft = state.get("draft")
    run_id = state.get("run_id")

    # Determine stage from pipeline_stage string
    pipeline_stage = state.get("pipeline_stage", "researching")
    stage_map = {
        "researched": "researching",
        "qualified": "qualified",
        "disqualified": "disqualified",
        "needs_review": "needs_review",
        "enriched": "enriched",
        "scored": "scored",
        "drafted": "outreach_ready",
        "failed": "failed",
        "dead_letter": "failed",
    }
    db_stage = stage_map.get(pipeline_stage, pipeline_stage)

    # Build the lead record
    lead_data: Dict[str, Any] = {
        "company_name": _get(candidate, "company_name") or "Unknown",
        "domain": _get(candidate, "domain") or "unknown.com",
        "industry": _get(candidate, "industry"),
        "stage": db_stage,
        "run_id": run_id,
    }

    # Size estimate -> employee_count
    size_estimate = _get(candidate, "size_estimate")
    if size_estimate and isinstance(size_estimate, str):
        try:
            lead_data["employee_count"] = int(size_estimate.split("-")[0].strip())
        except (ValueError, IndexError):
            pass

    # Key people -> contact_name (first entry)
    key_people = _get(candidate, "key_people") or []
    if key_people:
        name_part = str(key_people[0]).split("(")[0].strip()
        lead_data["contact_name"] = name_part

    # Intent signals (merge recent_news and hiring_signals to text[])
    signals = []
    for sourced_fact in (_get(candidate, "recent_news") or []):
        val = _get(sourced_fact, "value")
        if val:
            signals.append(str(val))
    for sourced_fact in (_get(candidate, "hiring_signals") or []):
        val = _get(sourced_fact, "value")
        if val:
            signals.append(str(val))
    if signals:
        lead_data["intent_signals"] = signals

    # Qualification fields
    if qualification:
        confidence = _get(qualification, "confidence")
        if confidence is not None:
            lead_data["confidence"] = int(confidence * 100)  # 0-1 -> 0-100

    # Enrichment fields
    if enriched:
        email = _get(enriched, "email")
        linkedin_url = _get(enriched, "linkedin_url")
        tech_stack = _get(enriched, "tech_stack")
        if email:
            lead_data["contact_email"] = email
        if linkedin_url:
            lead_data["contact_linkedin"] = linkedin_url
        if tech_stack:
            lead_data["technologies"] = tech_stack

    # Score fields
    if score_result:
        score_val = _get(score_result, "score")
        score_breakdown = _get(score_result, "score_breakdown")
        if score_val is not None:
            lead_data["score"] = score_val
        if score_breakdown:
            lead_data["score_breakdown"] = score_breakdown

    # Workspace ID scoping
    workspace_id = os.environ.get("DEV_WORKSPACE_ID", DEV_WORKSPACE_ID)
    lead_data["workspace_id"] = workspace_id

    lead_id: Optional[str] = None
    try:
        result = await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: client.table("leads")
            .upsert(lead_data, on_conflict="workspace_id,domain")
            .select("id")
            .execute(),
        )
        rows = result.data
        if rows:
            lead_id = rows[0].get("id")
    except Exception as exc:  # noqa: BLE001
        logger.error("[event_logger] Failed to upsert lead from state: %s", exc)

    # Sync citations and drafts if lead record exists
    if lead_id:
        if candidate:
            await sync_lead_sources(lead_id, candidate)
        if draft:
            await sync_outreach_draft(lead_id, workspace_id, draft, candidate)

    return lead_id


def observe_agent_step(step_name: str, agent_name: str):
    """
    Decorator for agent node functions in graph.py.
    Measures latency, updates run status, upserts lead snapshot, and writes lead_events.
    """
    def decorator(func: Callable):
        @functools.wraps(func)
        async def wrapper(state: Dict[str, Any], *args, **kwargs) -> Dict[str, Any]:
            start_time = time.time()
            res = await func(state, *args, **kwargs)
            latency_ms = int((time.time() - start_time) * 1000)

            merged_state = {**state, **res}
            run_id = merged_state.get("run_id")

            # Upsert live lead state to DB
            lead_id = await upsert_lead_from_state(merged_state)

            # Extract step reasoning and confidence if present
            reasoning = None
            confidence = None
            citations = []

            if step_name == "research":
                cand = merged_state.get("candidate")
                reasoning = f"Discovered candidate: {_get(cand, 'company_name')} ({_get(cand, 'domain')})"
                confidence = 90
            elif step_name == "qualification":
                qual = merged_state.get("qualification")
                reasons = _get(qual, "reasons") or []
                reasoning = f"Qualification: {', '.join(reasons) if reasons else 'Evaluated against ICP'}"
                conf_val = _get(qual, "confidence")
                confidence = int(conf_val * 100) if conf_val is not None else 85
            elif step_name == "enrichment":
                enr = merged_state.get("enriched")
                reasoning = f"Enriched contact: {_get(enr, 'email') or 'Verified profiles'}"
                confidence = 92
            elif step_name == "scoring":
                sc = merged_state.get("score")
                reasoning = f"Scoring pass completed: score {_get(sc, 'score')}/100 tier {_get(sc, 'priority_tier')}"
                confidence = 90
            elif step_name == "outreach":
                dr = merged_state.get("draft")
                reasoning = f"Outreach drafted: subject '{_get(dr, 'subject')}'"
                confidence = 95

            # If lead_id is available, log step event
            if lead_id:
                await log_lead_event(
                    lead_id=lead_id,
                    run_id=run_id,
                    step=step_name,
                    agent_name=agent_name,
                    reasoning=reasoning,
                    confidence=confidence,
                    citations=citations,
                    tokens_used=merged_state.get("tokens_used", 0),
                    latency_ms=latency_ms,
                )

            # Update agent_runs with current stage
            if run_id:
                await update_run_status(
                    run_id=run_id,
                    pipeline_stage=merged_state.get("pipeline_stage"),
                    tokens_used=merged_state.get("tokens_used", 0),
                    api_calls_used=merged_state.get("api_calls_used", 0),
                )

            return res
        return wrapper
    return decorator
