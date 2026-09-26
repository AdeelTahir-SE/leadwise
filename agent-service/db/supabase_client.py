"""
agent-service/db/supabase_client.py

Shared Supabase Python client for the agent-service.

Uses the supabase-py library with the SERVICE_ROLE key so it bypasses
Row-Level Security (RLS). This is intentional — the agent runs in a
backend context with full trust.

SECURITY: Never expose SUPABASE_SERVICE_KEY to browser/frontend code.
"""
import logging
from typing import Optional

logger = logging.getLogger(__name__)

_client = None


def get_supabase_client():
    """
    Returns a singleton Supabase client configured with the service role key.

    Falls back gracefully to None if SUPABASE_URL or SUPABASE_SERVICE_KEY
    are not set (e.g. local dev without DB configured).
    The callers handle None by skipping DB writes rather than crashing.
    """
    global _client
    if _client is not None:
        return _client

    from config import SUPABASE_URL, SUPABASE_KEY

    if not SUPABASE_URL or not SUPABASE_KEY:
        logger.warning(
            "[supabase_client] SUPABASE_URL or SUPABASE_SERVICE_KEY not set. "
            "DB writes will be skipped."
        )
        return None

    try:
        from supabase import create_client  # type: ignore[import]
        _client = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("[supabase_client] Supabase client initialised")
    except Exception as exc:  # noqa: BLE001
        logger.error("[supabase_client] Failed to initialise Supabase client: %s", exc)
        return None

    return _client
