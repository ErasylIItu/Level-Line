import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

/**
 * Uses the service role key, which bypasses Row Level Security.
 * Only ever call this from Route Handlers / Server Actions —
 * never expose it to the browser.
 *
 * Used for writing test_sessions / test_results (Phase 7), which are
 * intentionally locked out of direct client access (see 0002_row_level_security.sql).
 */
export function createServiceClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
