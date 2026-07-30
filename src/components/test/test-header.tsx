"use client";

import { Clock } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface TestHeaderProps {
  currentIndex: number;
  total: number;
  timeFormatted: string;
  isLowTime: boolean;
}

export function TestHeader({
  currentIndex,
  total,
  timeFormatted,
  isLowTime,
}: TestHeaderProps) {
  const progressValue = ((currentIndex + 1) / total) * 100;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
        <Logo className="text-base" />

        <div
          className={cn(
            "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold tabular-nums transition-colors",
            isLowTime
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-border bg-secondary text-secondary-foreground"
          )}
        >
          <Clock className="size-4" />
          {timeFormatted}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-4">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>
            Question {currentIndex + 1} of {total}
          </span>
          <span>{Math.round(progressValue)}%</span>
        </div>
        <Progress value={progressValue} />
      </div>
    </header>
  );
}
