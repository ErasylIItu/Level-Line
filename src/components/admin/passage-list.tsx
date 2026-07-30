"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus, ChevronRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PassageFormDialog } from "@/components/admin/passage-form-dialog";
import type { ReadingPassage } from "@/types";
import type { PassageFormValues } from "@/lib/validations/admin";

interface PassageListProps {
  passages: ReadingPassage[];
  onCreate: (input: { title: string; body: string }) => Promise<void>;
  onUpdate: (id: string, input: { title: string; body: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReorder: (items: { id: string; orderIndex: number }[]) => Promise<void>;
}

export function PassageList({
  passages,
  onCreate,
  onUpdate,
  onDelete,
  onReorder,
}: PassageListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ReadingPassage | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(values: PassageFormValues) {
    setSaving(true);
    setError(null);
    try {
      if (editing) {
        await onUpdate(editing.id, values);
      } else {
        await onCreate(values);
      }
      setDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save passage");
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
      setError(err instanceof Error ? err.message : "Could not delete passage");
    } finally {
      setBusyId(null);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= passages.length) return;
    const next = [...passages];
    [next[index], next[target]] = [next[target], next[index]];
    const items = next.map((p, i) => ({ id: p.id, orderIndex: i + 1 }));
    setError(null);
    try {
      await onReorder(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reorder passages");
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          size="sm"
          className="ml-auto"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="size-4" />
          Add passage
        </Button>
      </div>

      {passages.length === 0 ? (
        <Card>
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            No reading passages yet.
          </p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {passages.map((passage, i) => (
            <Card key={passage.id} className="flex-row items-center gap-4 px-5 py-4">
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ArrowUp className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === passages.length - 1}
                  className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ArrowDown className="size-3.5" />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {passage.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {passage.questions.length} question
                  {passage.questions.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(passage);
                    setDialogOpen(true);
                  }}
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={busyId === passage.id}
                  onClick={() => handleDelete(passage.id)}
                >
                  {busyId === passage.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4 text-destructive" />
                  )}
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/admin/reading/${passage.id}`}>
                    Questions
                    <ChevronRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <PassageFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        passage={editing}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
