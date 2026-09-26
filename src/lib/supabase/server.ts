/**
 * src/lib/supabase/server.ts
 *
 * Server-side Supabase client using the SERVICE_ROLE key.
 *
 * SECURITY: This client bypasses Row-Level Security (RLS).
 * - ONLY import this in Next.js API routes (server-side code).
 * - NEVER import in components, hooks, or any file that could
 *   be bundled for the browser (i.e. no "use client" files).
 * - The service role key must NEVER appear in NEXT_PUBLIC_* env vars.
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Returns a typed Supabase client using the service role key.
 * Creates a new client per call (safe for serverless / Edge environments).
 *
 * Throws at runtime if required env vars are missing.
 */
export function createServerClient(): SupabaseClient<Database> {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  if (!supabaseUrl) {
    throw new Error("[createServerClient] Missing env var: SUPABASE_URL");
  }
  if (!supabaseServiceKey) {
    throw new Error("[createServerClient] Missing env var: SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      // Disable cookie-based session persistence — this is a pure server client.
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
