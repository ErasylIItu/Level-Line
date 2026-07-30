import "server-only";

import { createClient } from "@/lib/supabase/server";
import { buildTestSteps, type TestStep } from "@/lib/test-flow";
import type { BaseQuestion, ReadingPassage, ListeningAudio } from "@/types";
import type { Database } from "@/types/database";

type QuestionRow = Database["public"]["Tables"]["questions"]["Row"];
type PassageRow = Database["public"]["Tables"]["reading_passages"]["Row"];
type AudioRow = Database["public"]["Tables"]["listening_audios"]["Row"];

function toBaseQuestion(row: QuestionRow): BaseQuestion {
  return {
    id: row.id,
    type: row.type,
    orderIndex: row.order_index,
    prompt: row.prompt,
    options: row.options,
    correctOptionId: row.correct_option_id,
  };
}

/**
 * Fetches all published test content and assembles it into the same
 * ordered TestStep[] flow the UI consumes. Used by /api/test routes.
 */
export async function getFullTestFlow(): Promise<TestStep[]> {
  const supabase = await createClient();

  const [{ data: questions }, { data: passages }, { data: audios }] =
    await Promise.all([
      supabase.from("questions").select("*").order("order_index"),
      supabase.from("reading_passages").select("*").order("order_index"),
      supabase.from("listening_audios").select("*").order("order_index"),
    ]);

  const allQuestions = (questions ?? []).map(toBaseQuestion);

  const vocabulary = allQuestions.filter((q) => q.type === "vocabulary");
  const grammar = allQuestions.filter((q) => q.type === "grammar");

  const readingPassages: ReadingPassage[] = (passages ?? []).map(
    (p: PassageRow) => ({
      id: p.id,
      title: p.title,
      body: p.body,
      orderIndex: p.order_index,
      questions: allQuestions
        .filter((q) => q.type === "reading")
        .filter((q, _i, arr) =>
          // match by looking up the original row's passage_id
          (questions ?? []).find((row) => row.id === q.id)?.passage_id === p.id
        ),
    })
  );

  const listeningAudios: ListeningAudio[] = (audios ?? []).map(
    (a: AudioRow) => ({
      id: a.id,
      title: a.title,
      audioUrl: a.audio_url,
      orderIndex: a.order_index,
      questions: allQuestions
        .filter((q) => q.type === "listening")
        .filter(
          (q) =>
            (questions ?? []).find((row) => row.id === q.id)?.audio_id ===
            a.id
        ),
    })
  );

  return buildTestSteps({ vocabulary, grammar, readingPassages, listeningAudios });
}

/** Strips correct_option_id / correctOptionId before sending to the client. */
export function stripAnswers(steps: TestStep[]) {
  const scrub = (q: BaseQuestion) => {
    const { correctOptionId: _correctOptionId, ...rest } = q;
    return rest;
  };

  return steps.map((step) => {
    if (step.kind === "simple") {
      return { ...step, question: scrub(step.question) };
    }
    if (step.kind === "reading") {
      return { ...step, question: scrub(step.question) };
    }
    return { ...step, question: scrub(step.question) };
  });
}
