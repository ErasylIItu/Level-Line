import { getCefrBand, type QuestionType } from "@/lib/constants";
import type { SectionScoreJson } from "@/types/database";

export interface ScorableQuestion {
  id: string;
  type: QuestionType;
  correct_option_id: string;
}

export interface ScoringResult {
  overallScore: number;
  totalQuestions: number;
  sectionScores: SectionScoreJson[];
  cefrLevel: string;
  recommendedCourse: string;
}

const SECTIONS: QuestionType[] = ["vocabulary", "grammar", "reading", "listening"];

/**
 * Maps a CEFR band to a human-readable recommended course name.
 * Kept separate from CEFR_BANDS so course names can be edited
 * independently of the scoring thresholds.
 */
const RECOMMENDED_COURSES: Record<string, string> = {
  A1: "Beginner Foundations",
  A2: "Elementary Foundations",
  "A2+": "Pre-Intermediate to Intermediate Bridge",
  B1: "Intermediate Course",
  B2: "Upper Intermediate Course",
};

export function scoreTest(
  questions: ScorableQuestion[],
  answers: Record<string, string>
): ScoringResult {
  const sectionScores: SectionScoreJson[] = SECTIONS.map((section) => {
    const sectionQuestions = questions.filter((q) => q.type === section);
    const correct = sectionQuestions.filter(
      (q) => answers[q.id] === q.correct_option_id
    ).length;
    return { section, correct, total: sectionQuestions.length };
  });

  const overallScore = sectionScores.reduce((sum, s) => sum + s.correct, 0);
  const totalQuestions = questions.length;

  const band = getCefrBand(overallScore);

  return {
    overallScore,
    totalQuestions,
    sectionScores,
    cefrLevel: band.level,
    recommendedCourse: RECOMMENDED_COURSES[band.level] ?? "General English Course",
  };
}
