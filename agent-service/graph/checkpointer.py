"""
agent-service/graph/checkpointer.py

LangGraph state checkpointer backed by Postgres (Supabase).

Uses PostgresSaver from langgraph-checkpoint-postgres when DATABASE_URL is
configured. Falls back to MemorySaver so the agent-service can still start
for local development without a Postgres connection (e.g. Member 4's testing).

Member 3 left the PostgresSaver stub here with the comment:
  "Member 2 (Backend) will swap this out for PostgresSaver once Supabase is setup."
"""
import logging
try:
    from langgraph.checkpoint.memory import MemorySaver  # type: ignore[import-not-found,import-untyped]  # pyright: ignore[reportMissingImports]
except ImportError:
    MemorySaver = object  # type: ignore[misc,assignment]

logger = logging.getLogger(__name__)

_checkpointer = None


def get_checkpointer():
    """
    Returns the configured LangGraph checkpointer.

    Priority:
    1. PostgresSaver when DATABASE_URL is set (production / Supabase)
    2. MemorySaver fallback (local development without DB)

    The PostgresSaver persists every state transition to a Supabase Postgres
    table, making pipeline runs resumable, debuggable, and auditable.
    """
    global _checkpointer
    if _checkpointer is not None:
        return _checkpointer

    from config import DATABASE_URL

    if DATABASE_URL:
        try:
            # langgraph-checkpoint-postgres must be installed.
            # See requirements.txt — it's listed as a dependency.
            from langgraph.checkpoint.postgres import PostgresSaver
            import psycopg2

            conn = psycopg2.connect(
                DATABASE_URL,
                # Use autocommit so the checkpointer doesn't interfere with
                # the agent graph's own transaction boundaries.
                options="-c statement_timeout=30000",
            )
            conn.autocommit = True
            saver = PostgresSaver(conn)
            # Create the checkpoint tables if they don't exist yet.
            saver.setup()
            _checkpointer = saver
            logger.info("[checkpointer] Using PostgresSaver (Supabase Postgres)")
        except Exception as exc:  # noqa: BLE001
            logger.warning(
                "[checkpointer] PostgresSaver init failed (%s). "
                "Falling back to MemorySaver. Set DATABASE_URL correctly to fix.",
                exc,
            )
            _checkpointer = MemorySaver()
    else:
        logger.warning(
            "[checkpointer] DATABASE_URL not set. Using MemorySaver (state is not persisted)."
        )
        _checkpointer = MemorySaver()

    return _checkpointer
