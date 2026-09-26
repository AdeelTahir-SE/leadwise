"""
agent-service/db/__init__.py

Database, checkpointer, and observability module for Leadwise AI service.
"""
from .supabase_client import get_supabase_client
from .event_logger import (
    log_lead_event,
    update_run_status,
    upsert_lead_from_state,
    observe_agent_step,
)
from .vector_store import store_lead_embedding, find_similar_leads

__all__ = [
    "get_supabase_client",
    "log_lead_event",
    "update_run_status",
    "upsert_lead_from_state",
    "observe_agent_step",
    "store_lead_embedding",
    "find_similar_leads",
]
