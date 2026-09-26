"""
agent-service/db/vector_store.py

pgvector integration for storing and querying lead embeddings.

Used by the Qualification Agent (Member 4) to retrieve similar historical
qualified/disqualified leads as few-shot context, and by the Supervisor (Member 3)
to maintain semantic lead memory.

Works with Supabase pgvector extension and the `match_leads` RPC function
defined in `supabase/migrations/0003_pgvector.sql`.
"""
import asyncio
import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


async def store_lead_embedding(
    *,
    lead_id: str,
    embedding: List[float],
    outcome: Optional[str] = None,
    embedded_text: Optional[str] = None,
) -> bool:
    """
    Persists a lead's vector embedding into public.lead_embeddings.

    Args:
        lead_id: UUID of the lead in public.leads.
        embedding: 1536-dimensional float vector (e.g. OpenAI text-embedding-ada-002 or text-embedding-3-small).
        outcome: Qualification verdict ('qualified', 'disqualified', 'needs_review').
        embedded_text: Snapshot of the raw text representation for auditing.

    Returns:
        True if inserted/upserted successfully, False otherwise.
    """
    from db.supabase_client import get_supabase_client

    client = get_supabase_client()
    if client is None:
        logger.debug("[vector_store] Supabase client not available — skipping embedding storage")
        return False

    payload = {
        "lead_id": lead_id,
        "embedding": embedding,
        "outcome": outcome,
        "embedded_text": embedded_text,
    }
    # Clean None values
    payload = {k: v for k, v in payload.items() if v is not None}

    try:
        await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: client.table("lead_embeddings")
            .upsert(payload, on_conflict="lead_id")
            .execute(),
        )
        logger.info("[vector_store] Stored embedding for lead %s (outcome: %s)", lead_id, outcome)
        return True
    except Exception as exc:  # noqa: BLE001
        logger.error("[vector_store] Failed to store embedding for lead %s: %s", lead_id, exc)
        return False


async def find_similar_leads(
    query_embedding: List[float],
    *,
    match_threshold: float = 0.7,
    match_count: int = 5,
    workspace_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Calls the `match_leads` Postgres RPC to retrieve top-k similar leads based on cosine distance.

    Args:
        query_embedding: 1536-dimensional float vector of candidate text.
        match_threshold: Minimum cosine similarity score (0.0 - 1.0). Default is 0.7.
        match_count: Maximum number of similar records to return. Default is 5.
        workspace_id: Optional workspace UUID filter for strict tenant isolation.

    Returns:
        List of dicts: [{ "lead_id": str, "company_name": str, "outcome": str, "similarity": float }]
    """
    from db.supabase_client import get_supabase_client

    client = get_supabase_client()
    if client is None:
        logger.debug("[vector_store] Supabase client not available — returning empty matches")
        return []

    rpc_params = {
        "query_embedding": query_embedding,
        "match_threshold": match_threshold,
        "match_count": match_count,
        "p_workspace_id": workspace_id,
    }

    try:
        res = await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: client.rpc("match_leads", rpc_params).execute(),
        )
        return res.data or []
    except Exception as exc:  # noqa: BLE001
        logger.error("[vector_store] Failed to query similar leads: %s", exc)
        return []
