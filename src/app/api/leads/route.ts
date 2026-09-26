/**
 * src/app/api/leads/route.ts
 *
 * GET  /api/leads  — list leads with optional filters
 * POST /api/leads  — create a new lead record
 *
 * Backed by Supabase public.leads table.
 * Response shape is identical to the previous mock implementation
 * so Member 1's frontend requires no changes.
 *
 * Note: Explicit `as LeadRow[]` casts are used to work around a TS 5.9.x
 * inference limitation with @supabase/postgrest-js when Row types include
 * array fields (string[]). The runtime behaviour is unaffected.
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getWorkspaceId } from "@/lib/supabase/workspace";
import { mapLeadRow } from "@/lib/supabase/mappers";
import type { LeadRow, LeadStageDb } from "@/lib/supabase/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const stage = searchParams.get("stage") ?? "";
  const minScore = searchParams.get("minScore");
  const scoreVal = minScore ? parseInt(minScore, 10) : NaN;

  const supabase = createServerClient();
  const workspaceId = getWorkspaceId();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("workspace_id", workspaceId)
    // Apply stage and score filters directly in DB when provided
    .order("created_at", { ascending: false }) as unknown as {
      data: LeadRow[] | null;
      error: { message: string } | null;
    };

  if (error) {
    console.error("[GET /api/leads] Supabase error:", error.message);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leads" },
      { status: 500 }
    );
  }

  let rows: LeadRow[] = data ?? [];

  // Stage filter
  if (stage && stage !== "all") {
    rows = rows.filter((r) => r.stage === (stage as LeadStageDb));
  }

  // Score filter
  if (!isNaN(scoreVal)) {
    rows = rows.filter((r) => (r.score ?? 0) >= scoreVal);
  }

  // Text search filter in-memory
  const filtered = search
    ? rows.filter(
        (r) =>
          r.company_name.toLowerCase().includes(search) ||
          (r.contact_name ?? "").toLowerCase().includes(search) ||
          (r.industry ?? "").toLowerCase().includes(search) ||
          (r.contact_email ?? "").toLowerCase().includes(search)
      )
    : rows;

  const leads = filtered.map((row) => mapLeadRow(row));

  return NextResponse.json({ success: true, total: leads.length, data: leads });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const supabase = createServerClient();
    const workspaceId = getWorkspaceId();

    const insertPayload = {
      workspace_id: workspaceId,
      company_name: (body.companyName ?? "Sample New Account") as string,
      domain: (body.domain ?? body.website?.replace(/https?:\/\//, "") ?? "unknown.com") as string,
      website: (body.website ?? "") as string,
      industry: (body.industry ?? "B2B SaaS") as string,
      employee_count: (body.employeeCount ?? 100) as number,
      location: (body.location ?? "San Francisco, CA") as string,
      contact_name: (body.contactName ?? "Decision Maker") as string,
      contact_title: (body.contactTitle ?? "Head of Revenue") as string,
      contact_email: (body.contactEmail ?? "contact@example.com") as string,
      stage: "researching" as LeadStageDb,
      score: 85,
      confidence: 90,
      score_breakdown: {
        industryMatch: 90,
        companySize: 85,
        techStack: 80,
        intentSignals: 85,
        overallScore: 85,
      },
      technologies: (body.technologies ?? ["AWS", "React"]) as string[],
      intent_signals: ["New lead manually submitted for agent verification"] as string[],
    };

    const { data, error } = await (supabase
      .from("leads")
      .insert(insertPayload as any)  // eslint-disable-line @typescript-eslint/no-explicit-any
      .select()
      .single() as unknown as Promise<{ data: LeadRow | null; error: { message: string } | null }>);

    if (error) {
      console.error("[POST /api/leads] Supabase error:", error.message);
      return NextResponse.json(
        { success: false, error: "Failed to create lead" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Failed to create lead" },
        { status: 500 }
      );
    }

    // Insert initial audit log event for manually submitted leads
    await supabase
      .from("lead_events")
      .insert({
        lead_id: data.id,
        step: "research",
        agent_name: "Research Agent (Manual Ingestion Trigger)",
        reasoning: "Lead added to ingestion queue. Initiating automated web crawler.",
        confidence: 90,
        citations: [],
      } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    return NextResponse.json({ success: true, data: mapLeadRow(data) });
  } catch (err) {
    console.error("[POST /api/leads] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
