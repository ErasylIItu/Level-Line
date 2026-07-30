import { NextResponse, type NextRequest } from "next/server";

import { requireAdmin } from "@/lib/api/require-admin";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { data, error } = await auth.supabase
    .from("reading_passages")
    .select("*")
    .order("order_index");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ passages: data });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { title, body }: { title: string; body: string } = await request.json();

  const { count } = await auth.supabase
    .from("reading_passages")
    .select("id", { count: "exact", head: true });

  const { data, error } = await auth.supabase
    .from("reading_passages")
    .insert({ title, body, order_index: (count ?? 0) + 1 })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ passage: data }, { status: 201 });
}
