-- ============================================================
-- Migration 0003: pgvector — Lead embeddings for few-shot retrieval
-- Requires: pgvector extension available on Supabase projects.
-- The Qualification Agent queries this table for similar past
-- leads to use as few-shot context, improving consistency.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS vector;

-- ── lead_embeddings ──────────────────────────────────────────
-- Stores OpenAI text-embedding-ada-002 vectors (1536 dims) for
-- every lead that has been through qualification.
CREATE TABLE IF NOT EXISTS public.lead_embeddings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     UUID UNIQUE NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  -- 1536 dimensions = OpenAI text-embedding-ada-002
  embedding   vector(1536) NOT NULL,
  -- Label captured after the pipeline run completes
  outcome     TEXT CHECK (outcome IN ('qualified', 'disqualified', 'needs_review')),
  -- Snapshot of the text that was embedded (for debugging)
  embedded_text TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- IVFFlat index for approximate nearest-neighbour cosine similarity.
-- lists = 100 is appropriate for up to ~1M rows.
-- Re-run VACUUM ANALYZE lead_embeddings after bulk inserts.
CREATE INDEX IF NOT EXISTS lead_embeddings_ivfflat_idx
  ON public.lead_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- ── RLS for lead_embeddings ───────────────────────────────────
ALTER TABLE public.lead_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lead_embeddings_workspace_isolation"
  ON public.lead_embeddings FOR ALL
  USING (
    lead_id IN (
      SELECT id FROM public.leads
      WHERE public.user_in_workspace(workspace_id)
    )
  )
  WITH CHECK (
    lead_id IN (
      SELECT id FROM public.leads
      WHERE public.user_in_workspace(workspace_id)
    )
  );

-- ── match_leads function ──────────────────────────────────────
-- Called by the Python agent-service to retrieve similar historical
-- leads as few-shot context for the Qualification Agent.
-- Returns top-k leads ordered by cosine distance.
CREATE OR REPLACE FUNCTION public.match_leads(
  query_embedding  vector(1536),
  match_threshold  FLOAT   DEFAULT 0.7,
  match_count      INT     DEFAULT 5,
  p_workspace_id   UUID    DEFAULT NULL
)
RETURNS TABLE (
  lead_id       UUID,
  company_name  TEXT,
  outcome       TEXT,
  similarity    FLOAT
)
LANGUAGE sql STABLE SECURITY INVOKER AS $$
  SELECT
    le.lead_id,
    l.company_name,
    le.outcome,
    1 - (le.embedding <=> query_embedding) AS similarity
  FROM public.lead_embeddings le
  JOIN public.leads l ON l.id = le.lead_id
  WHERE
    (p_workspace_id IS NULL OR l.workspace_id = p_workspace_id)
    AND (1 - (le.embedding <=> query_embedding)) >= match_threshold
    AND le.outcome IS NOT NULL
  ORDER BY le.embedding <=> query_embedding
  LIMIT match_count;
$$;
