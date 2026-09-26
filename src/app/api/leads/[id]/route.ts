/**
 * src/app/api/leads/[id]/route.ts
 *
 * GET   /api/leads/:id  — fetch a single lead with its audit log
 * PATCH /api/leads/:id  — update stage or score
 *
 * Audit log (lead_events) is returned inside the lead as `auditLogs[]`,
 * matching the AuditLog shape in src/types/dashboard.ts.
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getWorkspaceId } from "@/lib/supabase/workspace";
import { mapLeadRow } from "@/lib/supabase/mappers";
import type { LeadRow, LeadEventRow, LeadStageDb } from "@/lib/supabase/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerClient();
  const workspaceId = getWorkspaceId();

  // Fetch lead (scoped to workspace for safety even with service role)
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .eq("workspace_id", workspaceId)
    .single() as unknown as { data: LeadRow | null; error: { message: string } | null };

  if (leadError || !lead) {
    return NextResponse.json(
      { success: false, error: "Lead not found" },
      { status: 404 }
    );
  }

  // Fetch audit log events, ordered chronologically
  const { data: events } = await supabase
    .from("lead_events")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", { ascending: true }) as unknown as {
      data: LeadEventRow[] | null;
      error: { message: string } | null;
    };

  return NextResponse.json({
    success: true,
    data: mapLeadRow(lead, events ?? []),
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const supabase = createServerClient();
    const workspaceId = getWorkspaceId();

    // Build the update object — only apply fields that are provided
    const updates: Record<string, unknown> = {};
    if (body.stage !== undefined) updates.stage = body.stage as LeadStageDb;
    if (body.score !== undefined) updates.score = body.score;
    if (body.confidence !== undefined) updates.confidence = body.confidence;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "No updatable fields provided" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from("leads") as any)
      .update(updates)
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .select()
      .single() as { data: LeadRow | null; error: { message: string } | null };

    if (error || !data) {
      console.error("[PATCH /api/leads/[id]] Supabase error:", error?.message);
      return NextResponse.json(
        { success: false, error: "Failed to update lead" },
        { status: error ? 500 : 404 }
      );
    }

    return NextResponse.json({ success: true, data: mapLeadRow(data) });
  } catch (err) {
    console.error("[PATCH /api/leads/[id]] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update lead" },
      { status: 500 }
    );
  }
}
