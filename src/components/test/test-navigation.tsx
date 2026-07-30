"use client";

import { ArrowLeft, ArrowRight, Flag } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TestNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLast: boolean;
}

export function TestNavigation({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  isLast,
}: TestNavigationProps) {
  return (
    <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-8">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={!canGoPrevious}
      >
        <ArrowLeft className="size-4" />
        Previous
      </Button>

      <Button type="button" onClick={onNext} disabled={!canGoNext}>
        {isLast ? (
          <>
            Finish test
            <Flag className="size-4" />
          </>
        ) : (
          <>
            Next
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>
    </div>
  );
}
