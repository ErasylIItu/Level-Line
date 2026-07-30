"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus, ChevronRight, Volume2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AudioFormDialog } from "@/components/admin/audio-form-dialog";
import type { ListeningAudio } from "@/types";
import type { AudioFormValues } from "@/lib/validations/admin";

interface AudioListProps {
  audios: ListeningAudio[];
  onCreate: (input: { title: string; audioUrl: string }) => Promise<void>;
  onUpdate: (id: string, input: { title: string; audioUrl: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReorder: (items: { id: string; orderIndex: number }[]) => Promise<void>;
}

export function AudioList({
  audios,
  onCreate,
  onUpdate,
  onDelete,
  onReorder,
}: AudioListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ListeningAudio | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(values: AudioFormValues) {
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
      setError(err instanceof Error ? err.message : "Could not save audio");
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
      setError(err instanceof Error ? err.message : "Could not delete audio");
    } finally {
      setBusyId(null);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= audios.length) return;
    const next = [...audios];
    [next[index], next[target]] = [next[target], next[index]];
    const items = next.map((a, i) => ({ id: a.id, orderIndex: i + 1 }));
    setError(null);
    try {
      await onReorder(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reorder audio");
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
          Add audio
        </Button>
      </div>

      {audios.length === 0 ? (
        <Card>
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            No listening audio yet.
          </p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {audios.map((audio, i) => (
            <Card key={audio.id} className="flex-row items-center gap-4 px-5 py-4">
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
                  disabled={i === audios.length - 1}
                  className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ArrowDown className="size-3.5" />
                </button>
              </div>

              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Volume2 className="size-4" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {audio.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {audio.questions.length} question
                  {audio.questions.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(audio);
                    setDialogOpen(true);
                  }}
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={busyId === audio.id}
                  onClick={() => handleDelete(audio.id)}
                >
                  {busyId === audio.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4 text-destructive" />
                  )}
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/admin/listening/${audio.id}`}>
                    Questions
                    <ChevronRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AudioFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        audio={editing}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
