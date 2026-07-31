"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { AudioPlayer } from "@/components/test/audio-player";
import { OptionButton } from "@/components/test/option-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { BaseQuestion, ListeningAudio } from "@/types";

interface ListeningPanelProps {
  sessionId: string;
  audio: ListeningAudio;
  question: BaseQuestion;
  questionNumber: number;
  totalInAudio: number;
  selectedOptionId?: string;
  onSelect: (optionId: string) => void;
  /** Whether questions were already revealed (e.g. navigated back) */
  initiallyRevealed?: boolean;
  /** Plays already used for this audio, from the session snapshot */
  initialPlaysUsed?: number;
}

export function ListeningPanel({
  sessionId,
  audio,
  question,
  questionNumber,
  totalInAudio,
  selectedOptionId,
  onSelect,
  initiallyRevealed = false,
  initialPlaysUsed = 0,
}: ListeningPanelProps) {
  const [revealed, setRevealed] = useState(initiallyRevealed);

  return (
    <div className="grid gap-5">
      <div>
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary">
          Тыңдалым (Listening)
        </span>
        <AudioPlayer
          sessionId={sessionId}
          audioId={audio.id}
          src={audio.audioUrl}
          title={audio.title}
          initialPlaysUsed={initialPlaysUsed}
        />
      </div>

      <AnimatePresence>
        {!revealed ? (
          <motion.div
            key="reveal-cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card>
              <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
                <p className="max-w-sm text-sm text-muted-foreground">
                  Мұқият тыңдаңыз. Дайын болған соң, осы аудио бойынша
                  сұрақтарды көру үшін жалғастырыңыз.
                </p>
                <Button onClick={() => setRevealed(true)}>
                  Сұрақтарға өту
                  <ChevronRight className="size-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card>
              <CardContent className="pt-6">
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
                <p className="mt-5 text-xs font-medium text-muted-foreground">
                  Осы аудио бойынша сұрақ {questionNumber} / {totalInAudio}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}