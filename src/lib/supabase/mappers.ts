/**
 * src/lib/supabase/mappers.ts
 *
 * Functions that convert Supabase DB row types → frontend API types.
 *
 * These ensure the API response shape is IDENTICAL to what Member 1's
 * frontend was developed against (src/types/dashboard.ts), even though
 * the DB uses snake_case and the frontend uses camelCase.
 *
 * Mapping rule:
 *   LeadRow          → Lead
 *   LeadEventRow     → AuditLog
 *   OutreachDraftRow → OutreachDraft
 *   IcpConfigRow     → IcpConfig
 *   AgentRunRow      → AgentRunStatus (for polling)
 */
import type {
  LeadRow,
  LeadEventRow,
  OutreachDraftRow,
  IcpConfigRow,
  AgentRunRow,
} from "./types";
import type {
  Lead,
  AuditLog,
  OutreachDraft,
  IcpConfig,
  ScoreBreakdown,
} from "@/types/dashboard";

// ── Lead ─────────────────────────────────────────────────────

/**
 * Maps a LeadRow (+ optional events) to the Lead frontend type.
 * @param row      - The lead row from Supabase.
 * @param events   - Optional lead_events rows for this lead (audit log).
 */
export function mapLeadRow(row: LeadRow, events: LeadEventRow[] = []): Lead {
  return {
    id: row.id,
    companyName: row.company_name,
    website: row.website ?? "",
    industry: row.industry ?? "",
    employeeCount: row.employee_count ?? 0,
    location: row.location ?? "",
    contactName: row.contact_name ?? "",
    contactTitle: row.contact_title ?? "",
    contactEmail: row.contact_email ?? "",
    contactLinkedin: row.contact_linkedin ?? undefined,
    stage: row.stage as Lead["stage"],
    score: row.score ?? 0,
    confidence: row.confidence ?? 0,
    scoreBreakdown: mapScoreBreakdown(row.score_breakdown),
    technologies: row.technologies ?? [],
    intentSignals: row.intent_signals ?? [],
    auditLogs: events.map(mapLeadEventRow),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapScoreBreakdown(raw: unknown): ScoreBreakdown {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>;
    return {
      industryMatch: Number(obj.industryMatch ?? 0),
      companySize: Number(obj.companySize ?? 0),
      techStack: Number(obj.techStack ?? 0),
      intentSignals: Number(obj.intentSignals ?? 0),
      overallScore: Number(obj.overallScore ?? 0),
    };
  }
  return { industryMatch: 0, companySize: 0, techStack: 0, intentSignals: 0, overallScore: 0 };
}

// ── AuditLog ─────────────────────────────────────────────────

export function mapLeadEventRow(row: LeadEventRow): AuditLog {
  return {
    id: row.id,
    step: row.step as AuditLog["step"],
    agentName: row.agent_name,
    reasoning: row.reasoning ?? "",
    confidence: row.confidence ?? 0,
    citations: row.citations.length > 0 ? row.citations : undefined,
    timestamp: formatRelativeTime(row.created_at),
  };
}

// ── OutreachDraft ─────────────────────────────────────────────

export function mapOutreachDraftRow(row: OutreachDraftRow, companyName = "", contactName = "", contactEmail = "", contactTitle = ""): OutreachDraft {
  return {
    id: row.id,
    leadId: row.lead_id,
    companyName,
    contactName,
    contactEmail,
    contactTitle,
    channel: row.channel,
    subject: row.subject ?? "",
    body: row.body ?? "",
    personalizedHook: row.personalized_hook ?? "",
    signalsCited: row.signals_cited ?? [],
    status: row.status as OutreachDraft["status"],
    generatedAt: formatRelativeTime(row.generated_at),
  };
}

// ── IcpConfig ─────────────────────────────────────────────────

export function mapIcpConfigRow(row: IcpConfigRow): IcpConfig {
  return {
    id: row.id,
    targetIndustries: row.target_industries,
    minEmployees: row.min_employees,
    maxEmployees: row.max_employees,
    targetLocations: row.target_locations,
    requiredTechStack: row.required_tech_stack,
    preferredTechStack: row.preferred_tech_stack,
    negativeKeywords: row.negative_keywords,
    minQualificationScore: row.min_qualification_score,
    autoEnrichThreshold: row.auto_enrich_threshold,
    autoDraftOutreach: row.auto_draft_outreach,
    updatedAt: row.updated_at,
  };
}

/**
 * Maps an IcpConfig frontend object back to a DB insert/update shape.
 */
export function mapIcpConfigToDb(
  config: Partial<IcpConfig>,
  workspaceId: string
): Partial<IcpConfigRow> {
  return {
    workspace_id: workspaceId,
    ...(config.targetIndustries !== undefined && { target_industries: config.targetIndustries }),
    ...(config.minEmployees !== undefined && { min_employees: config.minEmployees }),
    ...(config.maxEmployees !== undefined && { max_employees: config.maxEmployees }),
    ...(config.targetLocations !== undefined && { target_locations: config.targetLocations }),
    ...(config.requiredTechStack !== undefined && { required_tech_stack: config.requiredTechStack }),
    ...(config.preferredTechStack !== undefined && { preferred_tech_stack: config.preferredTechStack }),
    ...(config.negativeKeywords !== undefined && { negative_keywords: config.negativeKeywords }),
    ...(config.minQualificationScore !== undefined && {
      min_qualification_score: config.minQualificationScore,
    }),
    ...(config.autoEnrichThreshold !== undefined && {
      auto_enrich_threshold: config.autoEnrichThreshold,
    }),
    ...(config.autoDraftOutreach !== undefined && { auto_draft_outreach: config.autoDraftOutreach }),
  };
}

// ── AgentRun status response ──────────────────────────────────

export function mapAgentRunRow(row: AgentRunRow) {
  return {
    runId: row.id,
    status: row.status,
    pipelineStage: row.pipeline_stage,
    tokensUsed: row.tokens_used,
    apiCallsUsed: row.api_calls_used,
    error: row.error,
    startedAt: row.started_at,
    completedAt: row.completed_at,
  };
}

// ── Utility ───────────────────────────────────────────────────

/**
 * Formats an ISO timestamp as a human-readable relative time string.
 * Mirrors the "X mins ago" format used in mockData.ts.
 */
function formatRelativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
}
