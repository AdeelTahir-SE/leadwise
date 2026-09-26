/**
 * src/app/api/agent/[runId]/status/route.ts
 *
 * GET /api/agent/:runId/status  — poll the status of a pipeline run
 *
 * Member 1's frontend calls this endpoint to show live progress after
 * triggering a run via POST /api/agent.
 *
 * Response:
 *   {
 *     runId: string,
 *     status: "running" | "completed" | "failed" | "dead_letter",
 *     pipelineStage: string,
 *     tokensUsed: number,
 *     apiCallsUsed: number,
 *     error: string | null,
 *     startedAt: string,
 *     completedAt: string | null
 *   }
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getWorkspaceId } from "@/lib/supabase/workspace";
import { mapAgentRunRow } from "@/lib/supabase/mappers";
import type { AgentRunRow } from "@/lib/supabase/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  const { runId } = await params;
  const supabase = createServerClient();
  const workspaceId = getWorkspaceId();

  const { data, error } = await supabase
    .from("agent_runs")
    .select("*")
    .eq("id", runId)
    .eq("workspace_id", workspaceId)
    .single() as unknown as { data: AgentRunRow | null; error: { message: string } | null };

  if (error || !data) {
    return NextResponse.json(
      { error: "Run not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(mapAgentRunRow(data));
}
