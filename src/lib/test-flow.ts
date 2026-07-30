import type { BaseQuestion, ReadingPassage, ListeningAudio } from "@/types";

export type TestStep =
  | { kind: "simple"; section: "vocabulary" | "grammar"; question: BaseQuestion }
  | {
      kind: "reading";
      question: BaseQuestion;
      passage: ReadingPassage;
      indexInPassage: number;
      totalInPassage: number;
    }
  | {
      kind: "listening";
      question: BaseQuestion;
      audio: ListeningAudio;
      indexInAudio: number;
      totalInAudio: number;
    };

export function buildTestSteps({
  vocabulary,
  grammar,
  readingPassages,
  listeningAudios,
}: {
  vocabulary: BaseQuestion[];
  grammar: BaseQuestion[];
  readingPassages: ReadingPassage[];
  listeningAudios: ListeningAudio[];
}): TestStep[] {
  const steps: TestStep[] = [];

  vocabulary.forEach((question) =>
    steps.push({ kind: "simple", section: "vocabulary", question })
  );
  grammar.forEach((question) =>
    steps.push({ kind: "simple", section: "grammar", question })
  );

  readingPassages.forEach((passage) => {
    passage.questions.forEach((question, i) => {
      steps.push({
        kind: "reading",
        question,
        passage,
        indexInPassage: i + 1,
        totalInPassage: passage.questions.length,
      });
    });
  });

  listeningAudios.forEach((audio) => {
    audio.questions.forEach((question, i) => {
      steps.push({
        kind: "listening",
        question,
        audio,
        indexInAudio: i + 1,
        totalInAudio: audio.questions.length,
      });
    });
  });

  return steps;
}
