/**
 * src/app/api/icp-config/route.ts
 *
 * GET /api/icp-config  — fetch the workspace's active ICP configuration
 * PUT /api/icp-config  — upsert (create or update) the ICP configuration
 *
 * Each workspace has at most one ICP config (enforced by unique index).
 * PUT uses upsert so Member 1's form can call it without checking existence.
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getWorkspaceId } from "@/lib/supabase/workspace";
import { mapIcpConfigRow, mapIcpConfigToDb } from "@/lib/supabase/mappers";
import type { IcpConfigRow } from "@/lib/supabase/types";

export async function GET() {
  const supabase = createServerClient();
  const workspaceId = getWorkspaceId();

  const { data, error } = await supabase
    .from("icp_configs")
    .select("*")
    .eq("workspace_id", workspaceId)
    .maybeSingle() as unknown as { data: IcpConfigRow | null; error: { message: string } | null };

  if (error) {
    console.error("[GET /api/icp-config] Supabase error:", error.message);
    return NextResponse.json(
      { success: false, error: "Failed to fetch ICP configuration" },
      { status: 500 }
    );
  }

  if (!data) {
    // No config yet — return null so the form knows to POST on first save
    return NextResponse.json({ success: true, data: null });
  }

  return NextResponse.json({ success: true, data: mapIcpConfigRow(data) });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createServerClient();
    const workspaceId = getWorkspaceId();

    const dbFields = mapIcpConfigToDb(body, workspaceId);

    // Upsert — insert on first call, update on subsequent calls.
    // onConflict targets the unique index on workspace_id.
    const { data, error } = await supabase
      .from("icp_configs")
      .upsert(
        { ...dbFields, workspace_id: workspaceId } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        { onConflict: "workspace_id" }
      )
      .select()
      .single() as unknown as { data: IcpConfigRow | null; error: { message: string } | null };

    if (error) {
      console.error("[PUT /api/icp-config] Supabase error:", error.message);
      return NextResponse.json(
        { success: false, error: "Failed to update ICP configuration" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Failed to update ICP configuration" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "ICP configuration updated successfully",
      data: mapIcpConfigRow(data),
    });
  } catch (err) {
    console.error("[PUT /api/icp-config] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update ICP configuration" },
      { status: 500 }
    );
  }
}
