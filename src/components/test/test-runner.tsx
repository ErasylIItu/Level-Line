"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { TestHeader } from "@/components/test/test-header";
import { TestNavigation } from "@/components/test/test-navigation";
import { QuestionCard } from "@/components/test/question-card";
import { ReadingPassagePanel } from "@/components/test/reading-passage-panel";
import { ListeningPanel } from "@/components/test/listening-panel";
import { useTimer } from "@/hooks/useTimer";
import { TEST_DURATION_MINUTES } from "@/lib/constants";
import type { TestStep } from "@/lib/test-flow";
import {
  fetchTestSession,
  saveTestProgress,
  submitTestSession,
  type SessionSnapshot,
} from "@/lib/api/test-client";

export function TestRunner({ sessionId }: { sessionId: string }) {
  const router = useRouter();

  const [steps, setSteps] = useState<TestStep[] | null>(null);
  const [session, setSession] = useState<SessionSnapshot | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const hasFinished = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchTestSession(sessionId);
        if (cancelled) return;

        if (data.session.status === "completed") {
          // Already finished (e.g. page reload after submit) — the submit
          // endpoint is idempotent and returns the existing result.
          const { resultId } = await submitTestSession(sessionId);
          router.replace(`/results/${resultId}`);
          return;
        }

        setSteps(data.steps);
        setSession(data.session);
        setAnswers(data.session.answers ?? {});
        setCurrentIndex(
          Math.min(data.session.currentQuestionIndex ?? 0, data.steps.length - 1)
        );
      } catch {
        if (!cancelled) {
          setLoadError(
            "We couldn't load your test session. It may have expired — please start again."
          );
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [sessionId, router]);

  const finishTest = useCallback(async () => {
    if (hasFinished.current) return;
    hasFinished.current = true;
    setSubmitting(true);
    try {
      const { resultId } = await submitTestSession(sessionId);
      router.push(`/results/${resultId}`);
    } catch {
      hasFinished.current = false;
      setSubmitting(false);
    }
  }, [sessionId, router]);

  const timer = useTimer({
    durationSeconds: TEST_DURATION_MINUTES * 60,
    onExpire: finishTest,
  });

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm text-muted-foreground">{loadError}</p>
      </div>
    );
  }

  if (!steps || !session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading your test...</p>
      </div>
    );
  }

  const step = steps[currentIndex];
  const isLast = currentIndex === steps.length - 1;
  const selectedOptionId = answers[step.question.id];
  const canGoNext = Boolean(selectedOptionId);

  function selectAnswer(optionId: string) {
    setAnswers((prev) => ({ ...prev, [step.question.id]: optionId }));
    // Fire-and-forget: persist progress so a reload doesn't lose answers.
    saveTestProgress(sessionId, {
      questionId: step.question.id,
      optionId,
      currentQuestionIndex: currentIndex,
    }).catch(() => {
      // Non-fatal — the student can keep going, and the next successful
      // save will carry this answer along too via local state.
    });
  }

  function handleNext() {
    if (isLast) {
      finishTest();
      return;
    }
    const nextIndex = Math.min(steps!.length - 1, currentIndex + 1);
    setCurrentIndex(nextIndex);
    saveTestProgress(sessionId, { currentQuestionIndex: nextIndex }).catch(() => {});
  }

  function handlePrevious() {
    const prevIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(prevIndex);
    saveTestProgress(sessionId, { currentQuestionIndex: prevIndex }).catch(() => {});
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TestHeader
        currentIndex={currentIndex}
        total={steps.length}
        timeFormatted={timer.formatted}
        isLowTime={timer.isLow}
      />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        {step.kind === "simple" && (
          <QuestionCard
            question={step.question}
            selectedOptionId={selectedOptionId}
            onSelect={selectAnswer}
            eyebrow={step.section}
          />
        )}

        {step.kind === "reading" && (
          <div className="grid gap-6">
            <ReadingPassagePanel
              passage={step.passage}
              questionNumber={step.indexInPassage}
              totalInPassage={step.totalInPassage}
            />
            <QuestionCard
              question={step.question}
              selectedOptionId={selectedOptionId}
              onSelect={selectAnswer}
              eyebrow="Reading"
            />
          </div>
        )}

        {step.kind === "listening" && (
          <ListeningPanel
            key={step.audio.id}
            sessionId={sessionId}
            audio={step.audio}
            question={step.question}
            questionNumber={step.indexInAudio}
            totalInAudio={step.totalInAudio}
            selectedOptionId={selectedOptionId}
            onSelect={selectAnswer}
            initialPlaysUsed={session.listeningPlays?.[step.audio.id] ?? 0}
            initiallyRevealed={Boolean(selectedOptionId)}
          />
        )}
      </main>

      <div className="border-t border-border">
        <TestNavigation
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoPrevious={currentIndex > 0}
          canGoNext={canGoNext && !submitting}
          isLast={isLast}
        />
      </div>
    </div>
  );
}
