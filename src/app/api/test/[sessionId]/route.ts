import { NextResponse, type NextRequest } from "next/server";

import { createServiceClient } from "@/lib/supabase/service";
import { getFullTestFlow, stripAnswers } from "@/lib/api/test-content";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const service = createServiceClient();

  const { data: session, error } = await service
    .from("test_sessions")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();

  if (error || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const steps = await getFullTestFlow();

  return NextResponse.json({
    session: {
      id: session.id,
      status: session.status,
      currentQuestionIndex: session.current_question_index,
      answers: session.answers,
      listeningPlays: session.listening_plays,
    },
    steps: stripAnswers(steps),
  });
}

interface PatchBody {
  questionId?: string;
  optionId?: string;
  currentQuestionIndex?: number;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const body: PatchBody = await request.json();
  const service = createServiceClient();

  const { data: session, error: fetchError } = await service
    .from("test_sessions")
    .select("answers, current_question_index, status")
    .eq("id", sessionId)
    .maybeSingle();

  if (fetchError || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.status !== "in_progress") {
    return NextResponse.json(
      { error: "This test session has already finished" },
      { status: 409 }
    );
  }

  const nextAnswers = { ...session.answers };
  if (body.questionId && body.optionId) {
    nextAnswers[body.questionId] = body.optionId;
  }

  const { error: updateError } = await service
    .from("test_sessions")
    .update({
      answers: nextAnswers,
      current_question_index:
        body.currentQuestionIndex ?? session.current_question_index,
    })
    .eq("id", sessionId);

  if (updateError) {
    return NextResponse.json(
      { error: "Could not save progress" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
