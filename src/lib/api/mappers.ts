import type { BaseQuestion, ListeningAudio, ReadingPassage, TestResult } from "@/types";
import type { Database } from "@/types/database";

type QuestionRow = Database["public"]["Tables"]["questions"]["Row"];
type PassageRow = Database["public"]["Tables"]["reading_passages"]["Row"];
type AudioRow = Database["public"]["Tables"]["listening_audios"]["Row"];
type ResultRow = Database["public"]["Tables"]["test_results"]["Row"];

export function mapQuestionRow(row: QuestionRow): BaseQuestion {
  return {
    id: row.id,
    type: row.type,
    orderIndex: row.order_index,
    prompt: row.prompt,
    options: row.options,
    correctOptionId: row.correct_option_id,
  };
}

export function mapPassageRow(
  row: PassageRow,
  questions: BaseQuestion[] = []
): ReadingPassage {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    orderIndex: row.order_index,
    questions,
  };
}

export function mapAudioRow(
  row: AudioRow,
  questions: BaseQuestion[] = []
): ListeningAudio {
  return {
    id: row.id,
    title: row.title,
    audioUrl: row.audio_url,
    orderIndex: row.order_index,
    questions,
  };
}

export function mapResultRow(row: ResultRow): TestResult {
  return {
    id: row.id,
    sessionId: row.session_id,
    overallScore: row.overall_score,
    totalQuestions: row.total_questions,
    cefrLevel: row.cefr_level as TestResult["cefrLevel"],
    recommendedCourse: row.recommended_course,
    sectionScores: row.section_scores,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    durationSeconds: row.duration_seconds,
  };
}
