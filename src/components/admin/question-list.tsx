"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { QuestionFormDialog } from "@/components/admin/question-form-dialog";
import type { BaseQuestion, QuestionOption } from "@/types";
import type { QuestionFormValues } from "@/lib/validations/admin";

interface QuestionListProps {
  questions: BaseQuestion[];
  questionType: BaseQuestion["type"];
  onCreate: (input: {
    prompt: string;
    options: QuestionOption[];
    correctOptionId: string;
  }) => Promise<void>;
  onUpdate: (
    id: string,
    input: { prompt: string; options: QuestionOption[]; correctOptionId: string }
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReorder: (items: { id: string; orderIndex: number }[]) => Promise<void>;
}

function formValuesToOptions(values: QuestionFormValues): QuestionOption[] {
  return [
    { id: "a", label: values.optionA },
    { id: "b", label: values.optionB },
    { id: "c", label: values.optionC },
    { id: "d", label: values.optionD },
  ];
}

export function QuestionList({
  questions,
  onCreate,
  onUpdate,
  onDelete,
  onReorder,
}: QuestionListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<BaseQuestion | null>(
    null
  );
  const [busyId, setBusyId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setEditingQuestion(null);
    setDialogOpen(true);
  }

  function openEdit(question: BaseQuestion) {
    setEditingQuestion(question);
    setDialogOpen(true);
  }

  async function handleSave(values: QuestionFormValues) {
    setSaving(true);
    setError(null);
    try {
      if (editingQuestion) {
        await onUpdate(editingQuestion.id, {
          prompt: values.prompt,
          options: formValuesToOptions(values),
          correctOptionId: values.correctOption,
        });
      } else {
        await onCreate({
          prompt: values.prompt,
          options: formValuesToOptions(values),
          correctOptionId: values.correctOption,
        });
      }
      setDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save question");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    setError(null);
    try {
      await onDelete(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete question");
    } finally {
      setBusyId(null);
    }
  }

  async function moveQuestion(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= questions.length) return;
    const next = [...questions];
    [next[index], next[target]] = [next[target], next[index]];
    const items = next.map((q, i) => ({ id: q.id, orderIndex: i + 1 }));
    setError(null);
    try {
      await onReorder(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reorder questions");
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card card-shadow">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <p className="text-sm font-semibold text-foreground">
          {questions.length} question{questions.length === 1 ? "" : "s"}
        </p>
        <Button size="sm" onClick={openCreate}>
          <Plus className="size-4" />
          Add question
        </Button>
      </div>

      {error && (
        <p className="border-b border-border px-5 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {questions.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-muted-foreground">
          No questions yet. Click &ldquo;Add question&rdquo; to create one.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Order</TableHead>
              <TableHead>Question</TableHead>
              <TableHead className="w-24">Correct</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((q, i) => (
              <TableRow key={q.id}>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveQuestion(i, -1)}
                      disabled={i === 0}
                      className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      <ArrowUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveQuestion(i, 1)}
                      disabled={i === questions.length - 1}
                      className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      <ArrowDown className="size-3.5" />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="max-w-md">
                  <p className="line-clamp-2 text-sm">{q.prompt}</p>
                </TableCell>
                <TableCell>
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold uppercase text-accent-foreground">
                    {q.correctOptionId}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEdit(q)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={busyId === q.id}
                      onClick={() => handleDelete(q.id)}
                    >
                      {busyId === q.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <QuestionFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        question={editingQuestion}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
