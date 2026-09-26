"""
agent-service/db package.
"""
import os
import sys

_current_dir = os.path.dirname(os.path.abspath(__file__))
_agent_service_dir = os.path.dirname(_current_dir)
if _agent_service_dir not in sys.path:
    sys.path.insert(0, _agent_service_dir)

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
