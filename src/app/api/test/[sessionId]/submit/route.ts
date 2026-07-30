import { NextResponse, type NextRequest } from "next/server";

import { createServiceClient } from "@/lib/supabase/service";
import { getFullTestFlow } from "@/lib/api/test-content";
import { scoreTest, type ScorableQuestion } from "@/lib/scoring/score-test";
import { TOTAL_QUESTIONS } from "@/lib/constants";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const service = createServiceClient();

  const { data: session, error: fetchError } = await service
    .from("test_sessions")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();

  if (fetchError || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.status === "completed") {
    // Already submitted — return the existing result instead of erroring.
    const { data: existingResult } = await service
      .from("test_results")
      .select("id")
      .eq("session_id", sessionId)
      .maybeSingle();

    if (existingResult) {
      return NextResponse.json({ resultId: existingResult.id });
    }
  }

  const steps = await getFullTestFlow();
  const questions: ScorableQuestion[] = steps.map((step) => ({
    id: step.question.id,
    type: step.question.type,
    correct_option_id: step.question.correctOptionId,
  }));

  const scoring = scoreTest(questions, session.answers);

  const finishedAt = new Date().toISOString();

  const { data: result, error: resultError } = await service
    .from("test_results")
    .insert({
      session_id: sessionId,
      overall_score: scoring.overallScore,
      total_questions: scoring.totalQuestions || TOTAL_QUESTIONS,
      cefr_level: scoring.cefrLevel,
      recommended_course: scoring.recommendedCourse,
      section_scores: scoring.sectionScores,
      started_at: session.started_at,
      finished_at: finishedAt,
      duration_seconds: Math.round(
        (new Date(finishedAt).getTime() -
          new Date(session.started_at).getTime()) /
          1000
      ),
    })
    .select()
    .single();

  if (resultError || !result) {
    return NextResponse.json(
      { error: "Could not save test result" },
      { status: 500 }
    );
  }

  await service
    .from("test_sessions")
    .update({ status: "completed", finished_at: finishedAt })
    .eq("id", sessionId);

  return NextResponse.json({ resultId: result.id });
}
