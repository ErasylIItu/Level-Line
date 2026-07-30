import { NextResponse, type NextRequest } from "next/server";

import { requireAdmin } from "@/lib/api/require-admin";
import type { Database } from "@/types/database";

type PassageUpdate = Database["public"]["Tables"]["reading_passages"]["Update"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await request.json();

  const update: PassageUpdate = {};
  if (body.title !== undefined) update.title = body.title;
  if (body.body !== undefined) update.body = body.body;
  if (body.orderIndex !== undefined) update.order_index = body.orderIndex;

  const { data, error } = await auth.supabase
    .from("reading_passages")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ passage: data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;

  // Deleting a passage cascades to its questions (see FK in schema).
  const { error } = await auth.supabase
    .from("reading_passages")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
