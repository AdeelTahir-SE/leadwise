/**
 * src/app/api/outreach/route.ts
 *
 * GET /api/outreach  — list outreach drafts with optional status filter
 *
 * Returns outreach_drafts joined with lead contact info so the frontend
 * gets companyName, contactName, etc. in the same shape as before.
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const supabase = createServerClient();
  const workspaceId = getWorkspaceId();

  const { data, error } = await supabase
    .from("outreach_drafts")
    .select(`
      *,
      leads (
        company_name,
        contact_name,
        contact_email,
        contact_title
      )
    `)
    .eq("workspace_id", workspaceId)
    .order("generated_at", { ascending: false }) as unknown as {
      data: DraftWithLead[] | null;
      error: { message: string } | null;
    };

  if (error) {
    console.error("[GET /api/outreach] Supabase error:", error.message);
    return NextResponse.json(
      { success: false, error: "Failed to fetch outreach drafts" },
      { status: 500 }
    );
  }

  let drafts = (data ?? []);

  // Apply status filter in-memory after fetch
  if (status && status !== "all") {
    drafts = drafts.filter((d) => d.status === (status as OutreachStatus));
  }

  const mapped = drafts.map((row) =>
    mapOutreachDraftRow(
      row,
      row.leads?.company_name ?? "",
      row.leads?.contact_name ?? "",
      row.leads?.contact_email ?? "",
      row.leads?.contact_title ?? ""
    )
  );

  return NextResponse.json({ success: true, total: mapped.length, data: mapped });
}
