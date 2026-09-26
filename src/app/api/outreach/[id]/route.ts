/**
 * src/app/api/outreach/[id]/route.ts
 *
 * PATCH /api/outreach/:id  — update draft status, subject, body, or channel
 *
 * Used by Member 1's approval queue UI for approve/reject/edit actions.
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getWorkspaceId } from "@/lib/supabase/workspace";
import { mapOutreachDraftRow } from "@/lib/supabase/mappers";
import type { OutreachDraftRow, OutreachStatus } from "@/lib/supabase/types";

type DraftWithLead = OutreachDraftRow & {
  leads: {
    company_name: string;
    contact_name: string | null;
    contact_email: string | null;
    contact_title: string | null;
  } | null;
};

const VALID_STATUSES: OutreachStatus[] = [
  "pending_approval",
  "approved",
  "rejected",
  "sent",
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const supabase = createServerClient();
    const workspaceId = getWorkspaceId();

    // Build update object — only apply provided fields
    const updates: Record<string, unknown> = {};
    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json(
          { success: false, error: `Invalid status: ${body.status}` },
          { status: 400 }
        );
      }
      updates.status = body.status;
      // Record approval metadata when a draft is approved
      if (body.status === "approved") {
        updates.approved_at = new Date().toISOString();
      }
    }
    if (body.subject !== undefined) updates.subject = body.subject;
    if (body.body !== undefined) updates.body = body.body;
    if (body.channel !== undefined) updates.channel = body.channel;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "No updatable fields provided" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from("outreach_drafts") as any)
      .update(updates)
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .select(`
        *,
        leads (
          company_name,
          contact_name,
          contact_email,
          contact_title
        )
      `)
      .single() as { data: DraftWithLead | null; error: { message: string } | null };

    if (error || !data) {
      console.error("[PATCH /api/outreach/[id]] Supabase error:", error?.message);
      return NextResponse.json(
        { success: false, error: "Failed to update draft" },
        { status: error ? 500 : 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mapOutreachDraftRow(
        data,
        data.leads?.company_name ?? "",
        data.leads?.contact_name ?? "",
        data.leads?.contact_email ?? "",
        data.leads?.contact_title ?? ""
      ),
    });
  } catch (err) {
    console.error("[PATCH /api/outreach/[id]] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update draft" },
      { status: 500 }
    );
  }
}
