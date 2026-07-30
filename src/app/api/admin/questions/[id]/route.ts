import { NextResponse, type NextRequest } from "next/server";

import { requireAdmin } from "@/lib/api/require-admin";
import type { Database } from "@/types/database";

type QuestionUpdate = Database["public"]["Tables"]["questions"]["Update"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await request.json();

  const update: QuestionUpdate = {};
  if (body.prompt !== undefined) update.prompt = body.prompt;
  if (body.options !== undefined) update.options = body.options;
  if (body.correctOptionId !== undefined)
    update.correct_option_id = body.correctOptionId;
  if (body.orderIndex !== undefined) update.order_index = body.orderIndex;

  const { data, error } = await auth.supabase
    .from("questions")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ question: data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;

  const { error } = await auth.supabase.from("questions").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
