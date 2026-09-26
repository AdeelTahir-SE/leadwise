-- ============================================================
-- Migration 0002: Row-Level Security
-- Every table scoped to the authenticated user's workspace(s).
-- Service-role key bypasses RLS (used by server routes + agent-service).
-- Anon role has no access — all data requires auth session.
-- ============================================================

-- ── workspaces ───────────────────────────────────────────────
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- Users see only workspaces they own or are members of.
CREATE POLICY "workspaces_select_own"
  ON public.workspaces FOR SELECT
  USING (
    id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "workspaces_insert_own"
  ON public.workspaces FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "workspaces_update_owner"
  ON public.workspaces FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "workspaces_delete_owner"
  ON public.workspaces FOR DELETE
  USING (owner_id = auth.uid());

-- ── workspace_members ────────────────────────────────────────
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- Users can see memberships for workspaces they belong to.
CREATE POLICY "workspace_members_select"
  ON public.workspace_members FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members AS wm
      WHERE wm.user_id = auth.uid()
    )
  );

-- Only workspace owners/admins can manage members.
CREATE POLICY "workspace_members_insert_admin"
  ON public.workspace_members FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "workspace_members_delete_admin"
  ON public.workspace_members FOR DELETE
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

-- ── Helper: reusable workspace membership check ──────────────
-- Returns TRUE if the calling user belongs to the given workspace_id.
-- Used in all downstream table policies.
CREATE OR REPLACE FUNCTION public.user_in_workspace(ws_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY INVOKER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = ws_id
      AND user_id = auth.uid()
  );
$$;

-- ── icp_configs ──────────────────────────────────────────────
ALTER TABLE public.icp_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "icp_configs_workspace_isolation"
  ON public.icp_configs FOR ALL
  USING (public.user_in_workspace(workspace_id))
  WITH CHECK (public.user_in_workspace(workspace_id));

-- ── agent_runs ───────────────────────────────────────────────
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agent_runs_workspace_isolation"
  ON public.agent_runs FOR ALL
  USING (public.user_in_workspace(workspace_id))
  WITH CHECK (public.user_in_workspace(workspace_id));

-- ── leads ────────────────────────────────────────────────────
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_workspace_isolation"
  ON public.leads FOR ALL
  USING (public.user_in_workspace(workspace_id))
  WITH CHECK (public.user_in_workspace(workspace_id));

-- ── lead_events ──────────────────────────────────────────────
ALTER TABLE public.lead_events ENABLE ROW LEVEL SECURITY;

-- lead_events are read via their parent lead's workspace.
CREATE POLICY "lead_events_workspace_isolation"
  ON public.lead_events FOR SELECT
  USING (
    lead_id IN (
      SELECT id FROM public.leads
      WHERE public.user_in_workspace(workspace_id)
    )
  );

-- Only INSERT allowed from authenticated context (service role also inserts).
CREATE POLICY "lead_events_insert_auth"
  ON public.lead_events FOR INSERT
  WITH CHECK (
    lead_id IN (
      SELECT id FROM public.leads
      WHERE public.user_in_workspace(workspace_id)
    )
  );

-- ── lead_sources ─────────────────────────────────────────────
ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lead_sources_workspace_isolation"
  ON public.lead_sources FOR ALL
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

-- ── outreach_drafts ──────────────────────────────────────────
ALTER TABLE public.outreach_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "outreach_drafts_workspace_isolation"
  ON public.outreach_drafts FOR ALL
  USING (public.user_in_workspace(workspace_id))
  WITH CHECK (public.user_in_workspace(workspace_id));
