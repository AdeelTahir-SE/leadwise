/**
 * src/lib/supabase/browser.ts
 *
 * Browser-side Supabase client using the publishable ANON key.
 *
 * Safe to use in React components and client-side hooks.
 * Row-Level Security policies enforce data isolation —
 * users can only access rows belonging to their workspace.
 *
 * Note: For this hackathon the dashboard pages use server-side
 * API routes for data fetching, so this client is provided for
 * any future client-side auth flows (e.g. sign-in, session refresh).
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[supabase/browser] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Browser client will be non-functional until env vars are set."
  );
}

// Singleton — one client instance per browser session.
let _client: SupabaseClient<Database> | null = null;

export function createBrowserClient(): SupabaseClient<Database> {
  if (_client) return _client;
  _client = createClient<Database>(supabaseUrl, supabaseAnonKey);
  return _client;
}
