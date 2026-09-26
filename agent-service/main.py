"""
agent-service/main.py

FastAPI entry point for the Leadwise agent pipeline.

Exposes:
  POST /run        — trigger a new pipeline run
  GET  /run/:id/status — poll run status (via LangGraph checkpointer state)

Changes from Member 3's original:
- Accepts run_id in the request body (assigned by Next.js before calling us)
- Writes run status updates to Supabase agent_runs via db/event_logger
- Persists the final lead record to Supabase leads via upsert_lead_from_state
"""
import logging
import sys
import os
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI
from pydantic import BaseModel

# Add current directory to path for module resolution
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ── Lifespan ─────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Warm up the LangGraph app on startup to fail fast on config errors."""
    logger.info("[main] Starting agent service...")
    try:
        from graph.graph import app as langgraph_app  # noqa: F401
        logger.info("[main] LangGraph pipeline compiled successfully")
    except Exception as exc:
        logger.error("[main] Failed to compile LangGraph pipeline: %s", exc)
    yield
    logger.info("[main] Agent service shutting down")


api = FastAPI(title="Leadwise Agent Service", lifespan=lifespan)


# ── Request / Response models ─────────────────────────────────

class RunRequest(BaseModel):
    run_id: str | None = None           # Provided by Next.js /api/agent route
    target_query: str
    icp_config: dict = {}
    budget_config: dict = {
        "max_tokens": 50000,
        "max_api_calls": 30,
        "score_threshold": 50,
    }


# ── Routes ────────────────────────────────────────────────────

@api.post("/run")
async def run_pipeline(req: RunRequest):
    """
    Triggers the full lead pipeline for a given query and ICP config.

    The Next.js /api/agent route creates an agent_runs row before calling
    this endpoint, passing its UUID as run_id. If omitted, a new UUID is
    generated locally (useful for direct testing).
    """
    from graph.graph import app as langgraph_app
    from db.event_logger import update_run_status, upsert_lead_from_state

    run_id = req.run_id or str(uuid.uuid4())

    initial_state = {
        "run_id": run_id,
        "icp_config": req.icp_config,
        "target_query": req.target_query,
        "qualified": False,
        "needs_human_review": False,
        "pipeline_stage": "starting",
        "tokens_used": 0,
        "api_calls_used": 0,
        "budget_config": req.budget_config,
        "error": None,
        # Stage outputs — filled progressively by agents
        "candidate": None,
        "qualification": None,
        "enriched": None,
        "score": None,
        "draft": None,
    }

    config = {"configurable": {"thread_id": run_id}}

    try:
        result = await langgraph_app.ainvoke(initial_state, config)

        final_stage = result.get("pipeline_stage", "completed")
        has_error = result.get("error")

        # Persist lead to DB if we got a candidate
        lead_id = await upsert_lead_from_state(result)

        # Mark the run as completed in agent_runs
        import datetime
        await update_run_status(
            run_id=run_id,
            pipeline_stage=final_stage,
            status="failed" if has_error else "completed",
            tokens_used=result.get("tokens_used", 0),
            api_calls_used=result.get("api_calls_used", 0),
            error=has_error,
            completed_at=datetime.datetime.utcnow().isoformat() + "Z",
        )

        return {
            "run_id": run_id,
            "lead_id": lead_id,
            "result": result,
        }

    except Exception as exc:
        logger.error("[run_pipeline] Pipeline failed for run %s: %s", run_id, exc)
        import datetime
        await update_run_status(
            run_id=run_id,
            status="failed",
            pipeline_stage="failed",
            error=str(exc),
            completed_at=datetime.datetime.utcnow().isoformat() + "Z",
        )
        return {
            "run_id": run_id,
            "lead_id": None,
            "error": str(exc),
        }


@api.get("/run/{run_id}/status")
async def get_status(run_id: str):
    """
    Returns the current state of a pipeline run via the LangGraph checkpointer.

    Note: For full status with DB-persisted data, prefer the Next.js
    GET /api/agent/:runId/status endpoint which queries agent_runs directly.
    """
    from graph.graph import app as langgraph_app

    config = {"configurable": {"thread_id": run_id}}
    state = await langgraph_app.aget_state(config)
    return state.values if state else {"error": "Run not found"}


@api.get("/health")
async def health():
    """Simple health check for container orchestration."""
    return {"status": "ok"}
