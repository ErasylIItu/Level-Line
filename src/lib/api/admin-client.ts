"use client";

import { mapAudioRow, mapPassageRow, mapQuestionRow, mapResultRow } from "@/lib/api/mappers";
import type { BaseQuestion, ListeningAudio, QuestionOption, ReadingPassage, TestResult } from "@/types";
import type { QuestionType } from "@/lib/constants";
import type { Database } from "@/types/database";

type QuestionRow = Database["public"]["Tables"]["questions"]["Row"];
type PassageRow = Database["public"]["Tables"]["reading_passages"]["Row"];
type AudioRow = Database["public"]["Tables"]["listening_audios"]["Row"];
type ResultRow = Database["public"]["Tables"]["test_results"]["Row"];

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // no body
  }

  if (!res.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String((data as { error?: unknown }).error)
        : `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as T;
}

export interface QuestionInput {
  prompt: string;
  options: QuestionOption[];
  correctOptionId: string;
}

// ── Questions (vocabulary / grammar / reading / listening) ──────────

export async function fetchQuestions(filters: {
  type?: QuestionType;
  passageId?: string;
  audioId?: string;
}): Promise<BaseQuestion[]> {
  const params = new URLSearchParams();
  if (filters.type) params.set("type", filters.type);
  if (filters.passageId) params.set("passageId", filters.passageId);
  if (filters.audioId) params.set("audioId", filters.audioId);

  const data = await request<{ questions: QuestionRow[] }>(
    `/api/admin/questions?${params.toString()}`
  );
  return data.questions.map(mapQuestionRow);
}

export async function createQuestion(
  type: QuestionType,
  input: QuestionInput,
  scope?: { passageId?: string; audioId?: string }
): Promise<BaseQuestion> {
  const data = await request<{ question: QuestionRow }>("/api/admin/questions", {
    method: "POST",
    body: JSON.stringify({ type, ...input, ...scope }),
  });
  return mapQuestionRow(data.question);
}

export async function updateQuestion(
  id: string,
  input: QuestionInput
): Promise<BaseQuestion> {
  const data = await request<{ question: QuestionRow }>(
    `/api/admin/questions/${id}`,
    { method: "PATCH", body: JSON.stringify(input) }
  );
  return mapQuestionRow(data.question);
}

export async function deleteQuestion(id: string): Promise<void> {
  await request(`/api/admin/questions/${id}`, { method: "DELETE" });
}

export async function reorderQuestions(
  items: { id: string; orderIndex: number }[]
): Promise<void> {
  await request("/api/admin/questions/reorder", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}

// ── Reading passages ─────────────────────────────────────────────────

export async function fetchPassages(): Promise<ReadingPassage[]> {
  const [passagesData, questionsData] = await Promise.all([
    request<{ passages: PassageRow[] }>("/api/admin/passages"),
    request<{ questions: QuestionRow[] }>("/api/admin/questions?type=reading"),
  ]);

  return passagesData.passages.map((row) => {
    const questions = questionsData.questions
      .filter((q) => q.passage_id === row.id)
      .map(mapQuestionRow);
    return mapPassageRow(row, questions);
  });
}

export async function createPassage(input: {
  title: string;
  body: string;
}): Promise<ReadingPassage> {
  const data = await request<{ passage: PassageRow }>("/api/admin/passages", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return mapPassageRow(data.passage);
}

export async function updatePassage(
  id: string,
  input: { title: string; body: string }
): Promise<ReadingPassage> {
  const data = await request<{ passage: PassageRow }>(
    `/api/admin/passages/${id}`,
    { method: "PATCH", body: JSON.stringify(input) }
  );
  return mapPassageRow(data.passage);
}

export async function deletePassage(id: string): Promise<void> {
  await request(`/api/admin/passages/${id}`, { method: "DELETE" });
}

export async function reorderPassages(
  items: { id: string; orderIndex: number }[]
): Promise<void> {
  await request("/api/admin/passages/reorder", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}

// ── Listening audio ──────────────────────────────────────────────────

export async function fetchAudios(): Promise<ListeningAudio[]> {
  const [audiosData, questionsData] = await Promise.all([
    request<{ audios: AudioRow[] }>("/api/admin/audios"),
    request<{ questions: QuestionRow[] }>("/api/admin/questions?type=listening"),
  ]);

  return audiosData.audios.map((row) => {
    const questions = questionsData.questions
      .filter((q) => q.audio_id === row.id)
      .map(mapQuestionRow);
    return mapAudioRow(row, questions);
  });
}

export async function createAudio(input: {
  title: string;
  audioUrl: string;
}): Promise<ListeningAudio> {
  const data = await request<{ audio: AudioRow }>("/api/admin/audios", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return mapAudioRow(data.audio);
}

export async function updateAudio(
  id: string,
  input: { title: string; audioUrl: string }
): Promise<ListeningAudio> {
  const data = await request<{ audio: AudioRow }>(`/api/admin/audios/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return mapAudioRow(data.audio);
}

export async function deleteAudio(id: string): Promise<void> {
  await request(`/api/admin/audios/${id}`, { method: "DELETE" });
}

export async function reorderAudios(
  items: { id: string; orderIndex: number }[]
): Promise<void> {
  await request("/api/admin/audios/reorder", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}

export async function uploadAudioFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/admin/audio-upload", {
    method: "POST",
    body: formData,
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // no body
  }

  if (!res.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String((data as { error?: unknown }).error)
        : "Upload failed";
    throw new Error(message);
  }

  return (data as { audioUrl: string }).audioUrl;
}

// ── Results ──────────────────────────────────────────────────────────

export async function fetchAdminResults(): Promise<TestResult[]> {
  const data = await request<{ results: ResultRow[] }>("/api/admin/results");
  return data.results.map(mapResultRow);
}
