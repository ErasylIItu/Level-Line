import "server-only";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * Verifies the current request is from a logged-in admin
 * (session exists AND a matching row exists in admin_users — see RLS).
 * Returns the authenticated Supabase client + user, or a 401/403 response.
 */
export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }),
    } as const;
  }

  // admin_users has no RLS policies at all (by design), so this lookup
  // must go through the service client, which bypasses RLS.
  const service = createServiceClient();
  const { data: adminRow } = await service
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminRow) {
    return {
      error: NextResponse.json({ error: "Not authorized" }, { status: 403 }),
    } as const;
  }

  return { supabase, user } as const;
}
