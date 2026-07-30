"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { QuestionList } from "@/components/admin/question-list";
import { Button } from "@/components/ui/button";
import {
  fetchPassages,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
} from "@/lib/api/admin-client";
import type { BaseQuestion, QuestionOption, ReadingPassage } from "@/types";

const TYPE = "reading" as const;

export default function PassageQuestionsPage({
  params,
}: {
  params: Promise<{ passageId: string }>;
}) {
  const { passageId } = use(params);

  const [passage, setPassage] = useState<ReadingPassage | null>(null);
  const [questions, setQuestions] = useState<BaseQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPassages()
      .then((passages) => {
        const found = passages.find((p) => p.id === passageId) ?? null;
        setPassage(found);
        setNotFound(!found);
        setQuestions(found?.questions ?? []);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Could not load passage")
      )
      .finally(() => setLoading(false));
  }, [passageId]);

  async function handleCreate(input: {
    prompt: string;
    options: QuestionOption[];
    correctOptionId: string;
  }) {
    const created = await createQuestion(TYPE, input, { passageId });
    setQuestions((prev) => [...prev, created]);
  }

  async function handleUpdate(
    id: string,
    input: { prompt: string; options: QuestionOption[]; correctOptionId: string }
  ) {
    const updated = await updateQuestion(id, input);
    setQuestions((prev) => prev.map((q) => (q.id === id ? updated : q)));
  }

  async function handleDelete(id: string) {
    await deleteQuestion(id);
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  async function handleReorder(items: { id: string; orderIndex: number }[]) {
    await reorderQuestions(items);
    const order = Object.fromEntries(items.map((i) => [i.id, i.orderIndex]));
    setQuestions((prev) =>
      [...prev]
        .map((q) => ({ ...q, orderIndex: order[q.id] ?? q.orderIndex }))
        .sort((a, b) => a.orderIndex - b.orderIndex)
    );
  }

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-4" asChild>
        <Link href="/admin/reading">
          <ArrowLeft className="size-4" />
          Back to passages
        </Link>
      </Button>

      <AdminPageHeader
        title={passage?.title ?? (loading ? "Loading..." : "Passage not found")}
        description="Manage the questions that belong to this reading passage."
      />

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : notFound ? (
        <p className="text-sm text-muted-foreground">
          This passage could not be found.
        </p>
      ) : (
        <QuestionList
          questions={questions}
          questionType={TYPE}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      )}
    </div>
  );
}
