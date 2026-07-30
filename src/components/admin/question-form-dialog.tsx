"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  questionFormSchema,
  type QuestionFormValues,
} from "@/lib/validations/admin";
import type { BaseQuestion } from "@/types";

interface QuestionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question?: BaseQuestion | null;
  onSave: (values: QuestionFormValues) => Promise<void>;
  saving?: boolean;
}

const OPTION_LETTERS = ["a", "b", "c", "d"] as const;

export function QuestionFormDialog({
  open,
  onOpenChange,
  question,
  onSave,
  saving = false,
}: QuestionFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      prompt: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctOption: "a",
    },
  });

  useEffect(() => {
    if (!open) return;
    if (question) {
      const byId = Object.fromEntries(
        question.options.map((o) => [o.id, o.label])
      );
      reset({
        prompt: question.prompt,
        optionA: byId["a"] ?? "",
        optionB: byId["b"] ?? "",
        optionC: byId["c"] ?? "",
        optionD: byId["d"] ?? "",
        correctOption: question.correctOptionId as QuestionFormValues["correctOption"],
      });
    } else {
      reset({
        prompt: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctOption: "a",
      });
    }
  }, [open, question, reset]);

  const correctOption = watch("correctOption");

  async function onSubmit(values: QuestionFormValues) {
    await onSave(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {question ? "Edit question" : "New question"}
          </DialogTitle>
          <DialogDescription>
            Fill in the question text, four answer options, and mark the
            correct one.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="prompt">Question text</Label>
            <Textarea id="prompt" {...register("prompt")} />
            {errors.prompt && (
              <p className="text-xs text-destructive">
                {errors.prompt.message}
              </p>
            )}
          </div>

          {OPTION_LETTERS.map((letter) => {
            const fieldName = `option${letter.toUpperCase()}` as
              | "optionA"
              | "optionB"
              | "optionC"
              | "optionD";
            return (
              <div key={letter} className="grid gap-1.5">
                <Label htmlFor={fieldName}>
                  Option {letter.toUpperCase()}
                </Label>
                <Input id={fieldName} {...register(fieldName)} />
                {errors[fieldName] && (
                  <p className="text-xs text-destructive">
                    {errors[fieldName]?.message}
                  </p>
                )}
              </div>
            );
          })}

          <div className="grid gap-1.5">
            <Label>Correct answer</Label>
            <Select
              value={correctOption}
              onValueChange={(v) =>
                setValue("correctOption", v as QuestionFormValues["correctOption"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OPTION_LETTERS.map((letter) => (
                  <SelectItem key={letter} value={letter}>
                    Option {letter.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : question
                  ? "Save changes"
                  : "Add question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
