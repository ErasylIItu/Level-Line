import { NextResponse, type NextRequest } from "next/server";

import { requireAdmin } from "@/lib/api/require-admin";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { data, error } = await auth.supabase
    .from("listening_audios")
    .select("*")
    .order("order_index");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ audios: data });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { title, audioUrl }: { title: string; audioUrl: string } =
    await request.json();

  const { count } = await auth.supabase
    .from("listening_audios")
    .select("id", { count: "exact", head: true });

  const { data, error } = await auth.supabase
    .from("listening_audios")
    .insert({ title, audio_url: audioUrl, order_index: (count ?? 0) + 1 })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ audio: data }, { status: 201 });
}
