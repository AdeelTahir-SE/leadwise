/**
 * src/app/api/agent/route.ts
 *
 * POST /api/agent  — trigger a new lead pipeline run
 *
 * Creates an agent_runs row in Supabase, then forwards the request
 * to the Python FastAPI service (agent-service). Returns the run_id
 * immediately so the frontend can poll /api/agent/:runId/status.
 *
 * Request body:
 *   { target_query: string, icp_config?: object, budget_config?: object }
 *
 * Response:
 *   { run_id: string, status: "running" }
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getWorkspaceId } from "@/lib/supabase/workspace";
import type { IcpConfigRow, AgentRunRow } from "@/lib/supabase/types";

const AGENT_SERVICE_URL = process.env.AGENT_SERVICE_URL ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const supabase = createServerClient();
    const workspaceId = getWorkspaceId();

    // Resolve ICP config for budget_config if not explicitly provided.
    // This lets the frontend omit budget_config — the DB values are used.
    let budgetConfig = body.budget_config ?? null;
    let icpConfigId: string | null = null;

    if (!budgetConfig) {
      const { data: icpRow } = await supabase
        .from("icp_configs")
        .select("id, score_threshold, max_tokens_per_run, max_api_calls_per_run")
        .eq("workspace_id", workspaceId)
        .maybeSingle() as unknown as { data: Pick<IcpConfigRow, "id" | "score_threshold" | "max_tokens_per_run" | "max_api_calls_per_run"> | null; error: unknown };

      if (icpRow) {
        icpConfigId = icpRow.id;
        budgetConfig = {
          score_threshold: icpRow.score_threshold,
          max_tokens: icpRow.max_tokens_per_run,
          max_api_calls: icpRow.max_api_calls_per_run,
        };
      }
    }

    // Default budget if nothing configured yet
    budgetConfig ??= { score_threshold: 50, max_tokens: 50000, max_api_calls: 30 };

    // Create an agent_runs row so we can track this run's status
    const { data: runRow, error: runError } = await supabase
      .from("agent_runs")
      .insert({
        workspace_id: workspaceId,
        icp_config_id: icpConfigId,
        target_query: body.target_query ?? "",
        status: "running",
        pipeline_stage: "starting",
      } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .select("id")
      .single() as unknown as { data: Pick<AgentRunRow, "id"> | null; error: { message: string } | null };

    if (runError || !runRow) {
      console.error("[POST /api/agent] Failed to create run record:", runError?.message);
      return NextResponse.json(
        { error: "Failed to initialize agent run" },
        { status: 500 }
      );
    }

    const runId = runRow.id;

    // Forward to FastAPI agent service (fire and forget — async pipeline)
    const agentPayload = {
      run_id: runId,
      target_query: body.target_query,
      icp_config: body.icp_config ?? {},
      budget_config: budgetConfig,
    };

    // We don't await the agent result here — it can take minutes.
    // The agent-service should call back to update agent_runs on completion.
    // For now, we kick it off and return the run_id for polling.
    fetch(`${AGENT_SERVICE_URL}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(agentPayload),
    })
      .then(async (res) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const agentRunsTable = supabase.from("agent_runs") as any;
        if (!res.ok) {
          const text = await res.text();
          console.error(`[agent-service] Run ${runId} failed: ${text}`);
          await agentRunsTable
            .update({ status: "failed", error: text, completed_at: new Date().toISOString() })
            .eq("id", runId);
        } else {
          const result = await res.json();
          // Update run with final pipeline_stage from the returned state
          await agentRunsTable
            .update({
              status: "completed",
              pipeline_stage: result?.result?.pipeline_stage ?? "completed",
              tokens_used: result?.result?.tokens_used ?? 0,
              api_calls_used: result?.result?.api_calls_used ?? 0,
              completed_at: new Date().toISOString(),
            })
            .eq("id", runId);
        }
      })
      .catch(async (err) => {
        console.error(`[agent-service] Network error for run ${runId}:`, err);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("agent_runs") as any)
          .update({
            status: "failed",
            error: String(err),
            completed_at: new Date().toISOString(),
          })
          .eq("id", runId);
      });

    return NextResponse.json({ run_id: runId, status: "running" });
  } catch (error) {
    console.error("[POST /api/agent] Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to start agent run" },
      { status: 500 }
    );
  }
}
