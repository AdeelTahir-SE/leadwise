-- ============================================================
-- Migration 0001: Core schema
-- Creates all tables used by Leadwise.
-- Run this first; other migrations depend on it.
-- ============================================================

-- ── workspaces ───────────────────────────────────────────────
-- One workspace = one client / tenant.
CREATE TABLE IF NOT EXISTS public.workspaces (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  owner_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── workspace_members ────────────────────────────────────────
-- Many users can belong to many workspaces (future-proof for teams).
CREATE TABLE IF NOT EXISTS public.workspace_members (
  workspace_id  UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (workspace_id, user_id)
);

-- ── icp_configs ──────────────────────────────────────────────
-- Per-workspace Ideal Customer Profile criteria.
-- Used by the Qualification Agent to score leads.
CREATE TABLE IF NOT EXISTS public.icp_configs (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id              UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  target_industries         TEXT[]   NOT NULL DEFAULT '{}',
  min_employees             INT      NOT NULL DEFAULT 50  CHECK (min_employees >= 0),
  max_employees             INT      NOT NULL DEFAULT 500 CHECK (max_employees >= 0),
  target_locations          TEXT[]   NOT NULL DEFAULT '{}',
  required_tech_stack       TEXT[]   NOT NULL DEFAULT '{}',
  preferred_tech_stack      TEXT[]   NOT NULL DEFAULT '{}',
  negative_keywords         TEXT[]   NOT NULL DEFAULT '{}',
  min_qualification_score   INT      NOT NULL DEFAULT 75  CHECK (min_qualification_score BETWEEN 0 AND 100),
  auto_enrich_threshold     INT      NOT NULL DEFAULT 80  CHECK (auto_enrich_threshold BETWEEN 0 AND 100),
  auto_draft_outreach       BOOLEAN  NOT NULL DEFAULT TRUE,
  -- agent budget fields (passed as budget_config to LangGraph)
  score_threshold           INT      NOT NULL DEFAULT 50  CHECK (score_threshold BETWEEN 0 AND 100),
  max_tokens_per_run        INT      NOT NULL DEFAULT 50000,
  max_api_calls_per_run     INT      NOT NULL DEFAULT 30,
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure each workspace has at most one active ICP config.
CREATE UNIQUE INDEX IF NOT EXISTS icp_configs_one_per_workspace
  ON public.icp_configs (workspace_id);

-- ── agent_runs ───────────────────────────────────────────────
-- One row per pipeline execution. Tracks cost, status, errors.
CREATE TABLE IF NOT EXISTS public.agent_runs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  icp_config_id   UUID REFERENCES public.icp_configs(id),
  target_query    TEXT,
  pipeline_stage  TEXT NOT NULL DEFAULT 'starting',
  status          TEXT NOT NULL DEFAULT 'running'
                    CHECK (status IN ('running', 'completed', 'failed', 'dead_letter')),
  tokens_used     INT  NOT NULL DEFAULT 0,
  api_calls_used  INT  NOT NULL DEFAULT 0,
  total_cost_usd  NUMERIC(10, 6),
  error           TEXT,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at    TIMESTAMPTZ
);

-- ── leads ────────────────────────────────────────────────────
-- Canonical lead record. One row per discovered company/contact.
CREATE TABLE IF NOT EXISTS public.leads (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id     UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  run_id           UUID REFERENCES public.agent_runs(id),
  icp_config_id    UUID REFERENCES public.icp_configs(id),
  -- Company fields (from Research Agent)
  company_name     TEXT NOT NULL,
  domain           TEXT NOT NULL,
  website          TEXT,
  industry         TEXT,
  employee_count   INT,
  location         TEXT,
  -- Contact fields (from Enrichment Agent)
  contact_name     TEXT,
  contact_title    TEXT,
  contact_email    TEXT,
  contact_linkedin TEXT,
  -- Pipeline state
  stage            TEXT NOT NULL DEFAULT 'discovered'
                     CHECK (stage IN (
                       'discovered', 'researching', 'qualified', 'enriched',
                       'scored', 'outreach_ready', 'contacted',
                       'disqualified', 'needs_review', 'failed'
                     )),
  -- Scoring (from Scoring Agent)
  score            INT CHECK (score BETWEEN 0 AND 100),
  confidence       INT CHECK (confidence BETWEEN 0 AND 100),
  -- score_breakdown mirrors ScoreBreakdown in src/types/dashboard.ts
  score_breakdown  JSONB,
  -- Arrays from Research/Enrichment Agents
  technologies     TEXT[] NOT NULL DEFAULT '{}',
  intent_signals   TEXT[] NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast workspace + stage queries (used by dashboard stats).
CREATE INDEX IF NOT EXISTS leads_workspace_stage_idx
  ON public.leads (workspace_id, stage);

-- Index for deduplication checks (domain uniqueness per workspace).
CREATE UNIQUE INDEX IF NOT EXISTS leads_workspace_domain_unique
  ON public.leads (workspace_id, domain);

-- ── lead_events ──────────────────────────────────────────────
-- Append-only audit log. One row per agent action on a lead.
-- Never UPDATE this table — only INSERT.
CREATE TABLE IF NOT EXISTS public.lead_events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id          UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  run_id           UUID REFERENCES public.agent_runs(id),
  step             TEXT NOT NULL
                     CHECK (step IN ('research', 'qualification', 'enrichment', 'scoring', 'outreach')),
  agent_name       TEXT NOT NULL,
  reasoning        TEXT,
  confidence       INT  CHECK (confidence BETWEEN 0 AND 100),
  citations        TEXT[] NOT NULL DEFAULT '{}',
  -- Snapshots of agent input/output for full reproducibility
  input_snapshot   JSONB,
  output_snapshot  JSONB,
  tokens_used      INT NOT NULL DEFAULT 0,
  latency_ms       INT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for efficient lead detail queries (audit log fetches).
CREATE INDEX IF NOT EXISTS lead_events_lead_id_idx
  ON public.lead_events (lead_id, created_at);

-- ── lead_sources ─────────────────────────────────────────────
-- Per-field source citations from Research Agent.
-- Each extracted fact is stored with its source URL + confidence.
CREATE TABLE IF NOT EXISTS public.lead_sources (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  field_name  TEXT NOT NULL,
  value       TEXT,
  source_url  TEXT,
  confidence  FLOAT CHECK (confidence BETWEEN 0 AND 1),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── outreach_drafts ──────────────────────────────────────────
-- Generated messages pending human approval. Never auto-sent.
CREATE TABLE IF NOT EXISTS public.outreach_drafts (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id                  UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  workspace_id             UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  channel                  TEXT NOT NULL DEFAULT 'email' CHECK (channel IN ('email', 'linkedin')),
  subject                  TEXT,
  body                     TEXT,
  personalized_hook        TEXT,
  signals_cited            TEXT[] NOT NULL DEFAULT '{}',
  human_approval_required  BOOLEAN NOT NULL DEFAULT TRUE,
  status                   TEXT NOT NULL DEFAULT 'pending_approval'
                             CHECK (status IN ('pending_approval', 'approved', 'rejected', 'sent')),
  approved_by              UUID REFERENCES auth.users(id),
  approved_at              TIMESTAMPTZ,
  generated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Automatic updated_at trigger ─────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER leads_set_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER icp_configs_set_updated_at
  BEFORE UPDATE ON public.icp_configs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
