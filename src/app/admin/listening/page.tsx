"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AudioList } from "@/components/admin/audio-list";
import {
  fetchAudios,
  createAudio,
  updateAudio,
  deleteAudio,
  reorderAudios,
} from "@/lib/api/admin-client";
import type { ListeningAudio } from "@/types";

export default function ListeningAdminPage() {
  const [audios, setAudios] = useState<ListeningAudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAudios()
      .then(setAudios)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Could not load audio")
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(input: { title: string; audioUrl: string }) {
    const created = await createAudio(input);
    setAudios((prev) => [...prev, created]);
  }

  async function handleUpdate(
    id: string,
    input: { title: string; audioUrl: string }
  ) {
    const updated = await updateAudio(id, input);
    setAudios((prev) =>
      prev.map((a) => (a.id === id ? { ...updated, questions: a.questions } : a))
    );
  }

  async function handleDelete(id: string) {
    await deleteAudio(id);
    setAudios((prev) => prev.filter((a) => a.id !== id));
  }

  async function handleReorder(items: { id: string; orderIndex: number }[]) {
    await reorderAudios(items);
    const order = Object.fromEntries(items.map((i) => [i.id, i.orderIndex]));
    setAudios((prev) =>
      [...prev]
        .map((a) => ({ ...a, orderIndex: order[a.id] ?? a.orderIndex }))
        .sort((a, b) => a.orderIndex - b.orderIndex)
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Listening"
        description="Manage listening audio. Each audio can contain unlimited questions."
      />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <AudioList
          audios={audios}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      )}
    </div>
  );
}
