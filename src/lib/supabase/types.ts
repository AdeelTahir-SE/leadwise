/**
 * src/lib/supabase/types.ts
 *
 * TypeScript type definitions for the Supabase database schema.
 * These match the tables defined in supabase/migrations/0001_init.sql.
 *
 * For production, generate this file automatically via:
 *   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts
 *
 * Keep in sync with any migration changes.
 */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// Supabase v2 foreign key relationship helper for join type inference.
export type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

// ── Stage enums (mirror CHECK constraints in SQL) ────────────

export type LeadStageDb =
  | "discovered"
  | "researching"
  | "qualified"
  | "enriched"
  | "scored"
  | "outreach_ready"
  | "contacted"
  | "disqualified"
  | "needs_review"
  | "failed";

export type LeadEventStep = "research" | "qualification" | "enrichment" | "scoring" | "outreach";

export type AgentRunStatus = "running" | "completed" | "failed" | "dead_letter";

export type OutreachStatus = "pending_approval" | "approved" | "rejected" | "sent";

export type WorkspaceMemberRole = "owner" | "admin" | "member";

// ── Row types ────────────────────────────────────────────────

export interface WorkspaceRow {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface WorkspaceMemberRow {
  workspace_id: string;
  user_id: string;
  role: WorkspaceMemberRole;
  joined_at: string;
}

export interface IcpConfigRow {
  id: string;
  workspace_id: string;
  target_industries: string[];
  min_employees: number;
  max_employees: number;
  target_locations: string[];
  required_tech_stack: string[];
  preferred_tech_stack: string[];
  negative_keywords: string[];
  min_qualification_score: number;
  auto_enrich_threshold: number;
  auto_draft_outreach: boolean;
  score_threshold: number;
  max_tokens_per_run: number;
  max_api_calls_per_run: number;
  updated_at: string;
}

export interface AgentRunRow {
  id: string;
  workspace_id: string;
  icp_config_id: string | null;
  target_query: string | null;
  pipeline_stage: string;
  status: AgentRunStatus;
  tokens_used: number;
  api_calls_used: number;
  total_cost_usd: number | null;
  error: string | null;
  started_at: string;
  completed_at: string | null;
}

export interface LeadRow {
  id: string;
  workspace_id: string;
  run_id: string | null;
  icp_config_id: string | null;
  company_name: string;
  domain: string;
  website: string | null;
  industry: string | null;
  employee_count: number | null;
  location: string | null;
  contact_name: string | null;
  contact_title: string | null;
  contact_email: string | null;
  contact_linkedin: string | null;
  stage: LeadStageDb;
  score: number | null;
  confidence: number | null;
  score_breakdown: Json | null;
  technologies: string[];
  intent_signals: string[];
  created_at: string;
  updated_at: string;
}

export interface LeadEventRow {
  id: string;
  lead_id: string;
  run_id: string | null;
  step: LeadEventStep;
  agent_name: string;
  reasoning: string | null;
  confidence: number | null;
  citations: string[];
  input_snapshot: Json | null;
  output_snapshot: Json | null;
  tokens_used: number;
  latency_ms: number | null;
  created_at: string;
}

export interface LeadSourceRow {
  id: string;
  lead_id: string;
  field_name: string;
  value: string | null;
  source_url: string | null;
  confidence: number | null;
  created_at: string;
}

export interface OutreachDraftRow {
  id: string;
  lead_id: string;
  workspace_id: string;
  channel: "email" | "linkedin";
  subject: string | null;
  body: string | null;
  personalized_hook: string | null;
  signals_cited: string[];
  human_approval_required: boolean;
  status: OutreachStatus;
  approved_by: string | null;
  approved_at: string | null;
  generated_at: string;
}

// ── Supabase Database type (passed as generic to createClient) ─

export interface Database {
  public: {
    Views: Record<never, never>;
    Tables: {
      workspaces: {
        Row: WorkspaceRow;
        Insert: Omit<WorkspaceRow, "created_at"> & { created_at?: string };
        Update: Partial<Omit<WorkspaceRow, "id">>;
        Relationships: [];
      };
      workspace_members: {
        Row: WorkspaceMemberRow;
        Insert: Omit<WorkspaceMemberRow, "joined_at"> & { joined_at?: string };
        Update: Partial<Omit<WorkspaceMemberRow, "workspace_id" | "user_id">>;
        Relationships: [
          { foreignKeyName: "workspace_members_workspace_id_fkey"; columns: ["workspace_id"]; referencedRelation: "workspaces"; referencedColumns: ["id"] },
          { foreignKeyName: "workspace_members_user_id_fkey"; columns: ["user_id"]; referencedRelation: "users"; referencedColumns: ["id"] }
        ];
      };
      icp_configs: {
        Row: IcpConfigRow;
        Insert: {
          // Required
          workspace_id: string;
          // Optional (all have DB defaults)
          id?: string;
          target_industries?: string[];
          min_employees?: number;
          max_employees?: number;
          target_locations?: string[];
          required_tech_stack?: string[];
          preferred_tech_stack?: string[];
          negative_keywords?: string[];
          min_qualification_score?: number;
          auto_enrich_threshold?: number;
          auto_draft_outreach?: boolean;
          score_threshold?: number;
          max_tokens_per_run?: number;
          max_api_calls_per_run?: number;
          updated_at?: string;
        };
        Update: Partial<Omit<IcpConfigRow, "id">>;
        Relationships: [
          { foreignKeyName: "icp_configs_workspace_id_fkey"; columns: ["workspace_id"]; referencedRelation: "workspaces"; referencedColumns: ["id"] }
        ];
      };
      agent_runs: {
        Row: AgentRunRow;
        Insert: {
          // Required
          workspace_id: string;
          // Optional (have DB defaults or are nullable)
          id?: string;
          icp_config_id?: string | null;
          target_query?: string | null;
          pipeline_stage?: string;
          status?: AgentRunStatus;
          tokens_used?: number;
          api_calls_used?: number;
          total_cost_usd?: number | null;
          error?: string | null;
          started_at?: string;
          completed_at?: string | null;
        };
        Update: Partial<Omit<AgentRunRow, "id">>;
        Relationships: [
          { foreignKeyName: "agent_runs_workspace_id_fkey"; columns: ["workspace_id"]; referencedRelation: "workspaces"; referencedColumns: ["id"] },
          { foreignKeyName: "agent_runs_icp_config_id_fkey"; columns: ["icp_config_id"]; referencedRelation: "icp_configs"; referencedColumns: ["id"] }
        ];
      };
      leads: {
        Row: LeadRow;
        Insert: {
          // Required
          workspace_id: string;
          company_name: string;
          domain: string;
          // Optional (nullable or have DB defaults)
          id?: string;
          run_id?: string | null;
          icp_config_id?: string | null;
          website?: string | null;
          industry?: string | null;
          employee_count?: number | null;
          location?: string | null;
          contact_name?: string | null;
          contact_title?: string | null;
          contact_email?: string | null;
          contact_linkedin?: string | null;
          stage?: LeadStageDb;
          score?: number | null;
          confidence?: number | null;
          score_breakdown?: Json | null;
          technologies?: string[];
          intent_signals?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<LeadRow, "id">>;
        Relationships: [
          { foreignKeyName: "leads_workspace_id_fkey"; columns: ["workspace_id"]; referencedRelation: "workspaces"; referencedColumns: ["id"] },
          { foreignKeyName: "leads_run_id_fkey"; columns: ["run_id"]; referencedRelation: "agent_runs"; referencedColumns: ["id"] },
          { foreignKeyName: "leads_icp_config_id_fkey"; columns: ["icp_config_id"]; referencedRelation: "icp_configs"; referencedColumns: ["id"] }
        ];
      };
      lead_events: {
        Row: LeadEventRow;
        Insert: {
          // Required
          lead_id: string;
          step: LeadEventStep;
          agent_name: string;
          // Optional
          id?: string;
          run_id?: string | null;
          reasoning?: string | null;
          confidence?: number | null;
          citations?: string[];
          input_snapshot?: Json | null;
          output_snapshot?: Json | null;
          tokens_used?: number;
          latency_ms?: number | null;
          created_at?: string;
        };
        Update: Partial<LeadEventRow>; // append-only in practice; type needed for client
        Relationships: [
          { foreignKeyName: "lead_events_lead_id_fkey"; columns: ["lead_id"]; referencedRelation: "leads"; referencedColumns: ["id"] },
          { foreignKeyName: "lead_events_run_id_fkey"; columns: ["run_id"]; referencedRelation: "agent_runs"; referencedColumns: ["id"] }
        ];
      };
      lead_sources: {
        Row: LeadSourceRow;
        Insert: Omit<LeadSourceRow, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<LeadSourceRow, "id">>;
        Relationships: [
          { foreignKeyName: "lead_sources_lead_id_fkey"; columns: ["lead_id"]; referencedRelation: "leads"; referencedColumns: ["id"] }
        ];
      };
      outreach_drafts: {
        Row: OutreachDraftRow;
        Insert: {
          // Required
          lead_id: string;
          workspace_id: string;
          // Optional (nullable or have defaults)
          id?: string;
          channel?: "email" | "linkedin";
          subject?: string | null;
          body?: string | null;
          personalized_hook?: string | null;
          signals_cited?: string[];
          human_approval_required?: boolean;
          status?: OutreachStatus;
          approved_by?: string | null;
          approved_at?: string | null;
          generated_at?: string;
        };
        Update: Partial<Omit<OutreachDraftRow, "id">>;
        Relationships: [
          { foreignKeyName: "outreach_drafts_lead_id_fkey"; columns: ["lead_id"]; referencedRelation: "leads"; referencedColumns: ["id"] },
          { foreignKeyName: "outreach_drafts_workspace_id_fkey"; columns: ["workspace_id"]; referencedRelation: "workspaces"; referencedColumns: ["id"] }
        ];
      };
    };
    Functions: {
      match_leads: {
        Args: {
          query_embedding: number[];
          match_threshold?: number;
          match_count?: number;
          p_workspace_id?: string;
        };
        Returns: {
          lead_id: string;
          company_name: string;
          outcome: string;
          similarity: number;
        }[];
      };
      user_in_workspace: {
        Args: { ws_id: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
}
