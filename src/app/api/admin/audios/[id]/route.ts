import { NextResponse, type NextRequest } from "next/server";

import { requireAdmin } from "@/lib/api/require-admin";
import type { Database } from "@/types/database";

type AudioUpdate = Database["public"]["Tables"]["listening_audios"]["Update"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await request.json();

  const update: AudioUpdate = {};
  if (body.title !== undefined) update.title = body.title;
  if (body.audioUrl !== undefined) update.audio_url = body.audioUrl;
  if (body.orderIndex !== undefined) update.order_index = body.orderIndex;

  const { data, error } = await auth.supabase
    .from("listening_audios")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ audio: data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;

  const { error } = await auth.supabase
    .from("listening_audios")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
