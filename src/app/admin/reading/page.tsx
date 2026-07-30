"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PassageList } from "@/components/admin/passage-list";
import {
  fetchPassages,
  createPassage,
  updatePassage,
  deletePassage,
  reorderPassages,
} from "@/lib/api/admin-client";
import type { ReadingPassage } from "@/types";

export default function ReadingAdminPage() {
  const [passages, setPassages] = useState<ReadingPassage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPassages()
      .then(setPassages)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Could not load passages")
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(input: { title: string; body: string }) {
    const created = await createPassage(input);
    setPassages((prev) => [...prev, created]);
  }

  async function handleUpdate(id: string, input: { title: string; body: string }) {
    const updated = await updatePassage(id, input);
    setPassages((prev) =>
      prev.map((p) => (p.id === id ? { ...updated, questions: p.questions } : p))
    );
  }

  async function handleDelete(id: string) {
    await deletePassage(id);
    setPassages((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleReorder(items: { id: string; orderIndex: number }[]) {
    await reorderPassages(items);
    const order = Object.fromEntries(items.map((i) => [i.id, i.orderIndex]));
    setPassages((prev) =>
      [...prev]
        .map((p) => ({ ...p, orderIndex: order[p.id] ?? p.orderIndex }))
        .sort((a, b) => a.orderIndex - b.orderIndex)
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Reading"
        description="Manage reading passages. Each passage can contain unlimited questions."
      />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <PassageList
          passages={passages}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      )}
    </div>
  );
}
