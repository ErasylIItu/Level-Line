"use client";

import { cn } from "@/lib/utils";
import type { QuestionOption } from "@/types";

interface OptionButtonProps {
  option: QuestionOption;
  index: number;
  selected: boolean;
  onSelect: () => void;
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function OptionButton({
  option,
  index,
  selected,
  onSelect,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all duration-200",
        selected
          ? "border-primary bg-accent text-accent-foreground shadow-sm"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent/40"
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
          selected
            ? "bg-brand-gradient text-primary-foreground"
            : "bg-secondary text-muted-foreground"
        )}
      >
        {LETTERS[index] ?? index + 1}
      </span>
      {option.label}
    </button>
  );
}
