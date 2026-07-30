import { NextResponse, type NextRequest } from "next/server";

import { requireAdmin } from "@/lib/api/require-admin";
import type { QuestionType } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const type = request.nextUrl.searchParams.get("type") as QuestionType | null;
  const passageId = request.nextUrl.searchParams.get("passageId");
  const audioId = request.nextUrl.searchParams.get("audioId");

  let query = auth.supabase.from("questions").select("*").order("order_index");
  if (type) query = query.eq("type", type);
  if (passageId) query = query.eq("passage_id", passageId);
  if (audioId) query = query.eq("audio_id", audioId);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ questions: data });
}

interface CreateQuestionBody {
  type: QuestionType;
  prompt: string;
  options: { id: string; label: string }[];
  correctOptionId: string;
  passageId?: string | null;
  audioId?: string | null;
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const body: CreateQuestionBody = await request.json();

  // Determine next order_index within the same scope (type, or passage/audio).
  let countQuery = auth.supabase
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("type", body.type);
  if (body.passageId) countQuery = countQuery.eq("passage_id", body.passageId);
  if (body.audioId) countQuery = countQuery.eq("audio_id", body.audioId);
  const { count } = await countQuery;

  const { data, error } = await auth.supabase
    .from("questions")
    .insert({
      type: body.type,
      prompt: body.prompt,
      options: body.options,
      correct_option_id: body.correctOptionId,
      passage_id: body.passageId ?? null,
      audio_id: body.audioId ?? null,
      order_index: (count ?? 0) + 1,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ question: data }, { status: 201 });
}
