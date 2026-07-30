import type { CefrLevel, QuestionType } from "@/lib/constants";

export interface QuestionOption {
  id: string;
  label: string;
}

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  orderIndex: number;
  prompt: string;
  options: QuestionOption[];
  correctOptionId: string;
}

export interface ReadingPassage {
  id: string;
  title: string;
  body: string;
  orderIndex: number;
  questions: BaseQuestion[];
}

export interface ListeningAudio {
  id: string;
  title: string;
  audioUrl: string;
  orderIndex: number;
  questions: BaseQuestion[];
}

export interface TestSession {
  id: string;
  startedAt: string;
  finishedAt: string | null;
  currentQuestionIndex: number;
  status: "in_progress" | "completed";
}

export interface SectionScore {
  section: QuestionType;
  correct: number;
  total: number;
}

export interface TestResult {
  id: string;
  sessionId: string;
  overallScore: number;
  totalQuestions: number;
  cefrLevel: CefrLevel;
  recommendedCourse: string;
  sectionScores: SectionScore[];
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
}
