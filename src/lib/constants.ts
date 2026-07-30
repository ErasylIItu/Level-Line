export const TOTAL_QUESTIONS = 40;
export const TEST_DURATION_MINUTES = 40;
export const MAX_AUDIO_PLAYS = 2;

export type CefrLevel = "A1" | "A2" | "A2+" | "B1" | "B2";

export interface CefrBand {
  level: CefrLevel;
  label: string;
  minScore: number;
  maxScore: number;
  colorVar: string; // maps to CSS var, e.g. var(--level-a1)
}

/**
 * Score → CEFR level mapping.
 * Score is the number of correct answers out of 40.
 */
export const CEFR_BANDS: CefrBand[] = [
  { level: "A1", label: "Beginner", minScore: 0, maxScore: 10, colorVar: "var(--level-a1)" },
  { level: "A2", label: "Elementary", minScore: 11, maxScore: 20, colorVar: "var(--level-a2)" },
  { level: "A2+", label: "Pre-Intermediate", minScore: 21, maxScore: 30, colorVar: "var(--level-a2plus)" },
  { level: "B1", label: "Intermediate", minScore: 31, maxScore: 37, colorVar: "var(--level-b1)" },
  { level: "B2", label: "Upper Intermediate", minScore: 38, maxScore: 40, colorVar: "var(--level-b2)" },
];

export function getCefrBand(score: number): CefrBand {
  const clamped = Math.max(0, Math.min(TOTAL_QUESTIONS, score));
  return (
    CEFR_BANDS.find((b) => clamped >= b.minScore && clamped <= b.maxScore) ??
    CEFR_BANDS[0]
  );
}

export const QUESTION_TYPES = [
  "vocabulary",
  "grammar",
  "reading",
  "listening",
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];
