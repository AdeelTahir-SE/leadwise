/**
 * src/app/api/dashboard/stats/route.ts
 *
 * GET /api/dashboard/stats  — aggregated pipeline metrics
 *
 * Returns PipelineMetrics shape (src/types/dashboard.ts) computed from
 * live Supabase data. Falls back to empty/zero values on error so the
 * dashboard always renders.
 */
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getWorkspaceId } from "@/lib/supabase/workspace";
import type { PipelineMetrics, LeadStage } from "@/types/dashboard";
import type { LeadStageDb } from "@/lib/supabase/types";

// Label + color config for stage distribution (matches mockData.ts)
const STAGE_META: Record<string, { label: string; color: string }> = {
  discovered:    { label: "Discovered",     color: "#94A3B8" },
  researching:   { label: "Researching",    color: "#38BDF8" },
  qualified:     { label: "Qualified",      color: "#2DD4BF" },
  enriched:      { label: "Enriched",       color: "#3B82F6" },
  outreach_ready:{ label: "Outreach Ready", color: "#FF5A36" },
  contacted:     { label: "Contacted",      color: "#10B981" },
  disqualified:  { label: "Disqualified",   color: "#F87171" },
  needs_review:  { label: "Needs Review",   color: "#FBBF24" },
  failed:        { label: "Failed",         color: "#6B7280" },
};

// Stages that the frontend's LeadStage type accepts
const FRONTEND_STAGES = new Set<string>([
  "discovered", "researching", "qualified", "enriched",
  "scored", "outreach_ready", "contacted", "disqualified"
]);

export async function GET() {
  const supabase = createServerClient();
  const workspaceId = getWorkspaceId();

  try {
    // ── 1. Stage distribution ────────────────────────────────
    const { data: stageData } = await supabase
      .from("leads")
      .select("stage")
      .eq("workspace_id", workspaceId) as unknown as {
        data: Array<{ stage: LeadStageDb }> | null;
        error: unknown;
      };

    const stageCounts: Record<string, number> = {};
    for (const row of stageData ?? []) {
      stageCounts[row.stage] = (stageCounts[row.stage] ?? 0) + 1;
    }

    // Only include stages the frontend's type accepts
    const stageDistribution = Object.entries(stageCounts)
      .filter(([stage]) => FRONTEND_STAGES.has(stage))
      .map(([stage, count]) => ({
        stage: stage as LeadStage,
        label: STAGE_META[stage]?.label ?? stage,
        count,
        color: STAGE_META[stage]?.color ?? "#94A3B8",
      }));

    // ── 2. Summary counts ────────────────────────────────────
    const totalLeadsDiscovered = stageData?.length ?? 0;
    const totalQualified =
      (stageCounts["qualified"] ?? 0) +
      (stageCounts["enriched"] ?? 0) +
      (stageCounts["scored"] ?? 0) +
      (stageCounts["outreach_ready"] ?? 0) +
      (stageCounts["contacted"] ?? 0);
    const totalEnriched =
      (stageCounts["enriched"] ?? 0) +
      (stageCounts["scored"] ?? 0) +
      (stageCounts["outreach_ready"] ?? 0) +
      (stageCounts["contacted"] ?? 0);
    const qualificationRate =
      totalLeadsDiscovered > 0
        ? Math.round((totalQualified / totalLeadsDiscovered) * 1000) / 10
        : 0;

    // ── 3. Pending outreach count ────────────────────────────
    const { count: totalOutreachPending } = await supabase
      .from("outreach_drafts")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .eq("status", "pending_approval");

    // ── 4. Active agent runs ─────────────────────────────────
    const { count: activeAgentRuns } = await supabase
      .from("agent_runs")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .eq("status", "running");

    // ── 5. Throughput history (last 8 hours) ─────────────────
    const eightHoursAgo = new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString();
    const { data: recentLeadData } = await supabase
      .from("leads")
      .select("stage, created_at")
      .eq("workspace_id", workspaceId)
      .gte("created_at", eightHoursAgo)
      .order("created_at", { ascending: true }) as unknown as {
        data: Array<{ stage: string; created_at: string }> | null;
        error: unknown;
      };

    const throughputHistory = buildThroughputHistory(recentLeadData ?? []);

    // ── 6. Leads per hour ────────────────────────────────────
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const leadsLastHour = (recentLeadData ?? []).filter(
      (r) => r.created_at >= oneHourAgo
    ).length;
    const leadsPerHour = leadsLastHour > 0 ? leadsLastHour : Math.max(1, Math.ceil(totalLeadsDiscovered / 8));

    // ── 7. Recent activity from lead_events ──────────────────
    const { data: recentEventData } = await supabase
      .from("lead_events")
      .select(`
        id,
        step,
        agent_name,
        reasoning,
        created_at,
        leads!inner (
          company_name,
          workspace_id
        )
      `)
      .eq("leads.workspace_id", workspaceId)
      .order("created_at", { ascending: false })
      .limit(10) as unknown as {
        data: Array<{
          id: string;
          step: string;
          agent_name: string;
          reasoning: string | null;
          created_at: string;
          leads: { company_name: string } | null;
        }> | null;
        error: unknown;
      };

    const recentActivity = buildRecentActivity(recentEventData ?? []);

    const metrics: PipelineMetrics = {
      leadsPerHour,
      qualificationRate,
      totalLeadsDiscovered,
      totalQualified,
      totalEnriched,
      totalOutreachPending: totalOutreachPending ?? 0,
      activeAgentRuns: activeAgentRuns ?? 0,
      throughputHistory,
      stageDistribution,
      recentActivity,
    };

    return NextResponse.json({ success: true, data: metrics });
  } catch (err) {
    console.error("[GET /api/dashboard/stats] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}

// ── Helpers ───────────────────────────────────────────────────

function buildThroughputHistory(
  leads: Array<{ stage: string; created_at: string }>
): PipelineMetrics["throughputHistory"] {
  const buckets: Record<string, { discovered: number; qualified: number }> = {};
  const QUALIFIED_STAGES = new Set(["qualified", "enriched", "scored", "outreach_ready", "contacted"]);

  for (const lead of leads) {
    const hour = new Date(lead.created_at).getHours();
    const label = `${String(hour).padStart(2, "0")}:00`;
    if (!buckets[label]) buckets[label] = { discovered: 0, qualified: 0 };
    buckets[label].discovered += 1;
    if (QUALIFIED_STAGES.has(lead.stage)) buckets[label].qualified += 1;
  }

  return Object.entries(buckets)
    .slice(-8)
    .map(([hour, counts]) => ({ hour, ...counts }));
}

function buildRecentActivity(
  events: Array<{
    id: string;
    step: string;
    agent_name: string;
    reasoning: string | null;
    created_at: string;
    leads: { company_name: string } | null;
  }>
): PipelineMetrics["recentActivity"] {
  const stepLabels: Record<string, PipelineMetrics["recentActivity"][number]["type"]> = {
    research:      "lead_discovered",
    qualification: "lead_qualified",
    outreach:      "outreach_generated",
  };

  return events.map((event) => ({
    id: event.id,
    type: stepLabels[event.step] ?? "lead_discovered",
    title: `${event.agent_name} processed ${event.leads?.company_name ?? "Unknown"}`,
    description: event.reasoning ?? `Step: ${event.step}`,
    time: formatRelativeTime(event.created_at),
  }));
}

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
