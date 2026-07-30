"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { QuestionList } from "@/components/admin/question-list";
import {
  fetchQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
} from "@/lib/api/admin-client";
import type { BaseQuestion, QuestionOption } from "@/types";

const TYPE = "vocabulary" as const;

export default function VocabularyAdminPage() {
  const [questions, setQuestions] = useState<BaseQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions({ type: TYPE })
      .then(setQuestions)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Could not load questions")
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(input: {
    prompt: string;
    options: QuestionOption[];
    correctOptionId: string;
  }) {
    const created = await createQuestion(TYPE, input);
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
      <AdminPageHeader
        title="Vocabulary"
        description="Manage vocabulary questions used in the placement test."
      />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
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
