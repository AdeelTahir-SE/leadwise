/**
 * src/lib/supabase/workspace.ts
 *
 * Utilities for resolving the active workspace in API routes.
 *
 * For the hackathon, we support two modes:
 * 1. DEV_WORKSPACE_ID env var — bypasses auth, uses a hardcoded workspace.
 *    Useful for local development without a full Supabase auth setup.
 * 2. Future: extract workspace from the authenticated user session.
 *
 * All API routes call getWorkspaceId() to get the scoping UUID.
 */

/** Dev workspace UUID — matches seed.sql's stable dev ID. */
const DEV_WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";

/**
 * Returns the workspace ID to use for the current request.
 *
 * Order of precedence:
 *   1. DEV_WORKSPACE_ID env var (explicit override)
 *   2. Fallback to the stable seed workspace (local dev)
 *
 * TODO: In production, derive from the authenticated user's JWT/session.
 */
export function getWorkspaceId(): string {
  return process.env.DEV_WORKSPACE_ID ?? DEV_WORKSPACE_ID;
}
