import { NextResponse, type NextRequest } from "next/server";

import { requireAdmin } from "@/lib/api/require-admin";

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { items }: { items: { id: string; orderIndex: number }[] } =
    await request.json();

  const results = await Promise.all(
    items.map(({ id, orderIndex }) =>
      auth.supabase
        .from("reading_passages")
        .update({ order_index: orderIndex })
        .eq("id", id)
    )
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return NextResponse.json({ error: failed.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
