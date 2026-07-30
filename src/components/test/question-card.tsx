"use client";

import { motion, AnimatePresence } from "framer-motion";

import { OptionButton } from "@/components/test/option-button";
import { Card, CardContent } from "@/components/ui/card";
import type { BaseQuestion } from "@/types";

interface QuestionCardProps {
  question: BaseQuestion;
  selectedOptionId?: string;
  onSelect: (optionId: string) => void;
  eyebrow?: string;
}

export function QuestionCard({
  question,
  selectedOptionId,
  onSelect,
  eyebrow,
}: QuestionCardProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -16 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card>
          <CardContent className="pt-6">
            {eyebrow && (
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary">
                {eyebrow}
              </span>
            )}
            <h2 className="mb-6 text-xl font-semibold leading-snug text-foreground">
              {question.prompt}
            </h2>

            <div className="grid gap-3">
              {question.options.map((option, i) => (
                <OptionButton
                  key={option.id}
                  option={option}
                  index={i}
                  selected={selectedOptionId === option.id}
                  onSelect={() => onSelect(option.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
