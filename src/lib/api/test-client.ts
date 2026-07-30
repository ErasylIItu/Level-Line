"use client";

import type { TestStep } from "@/lib/test-flow";

async function parseJsonOrThrow(response: Response) {
  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    // ignore — some error responses may not have a body
  }
  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String((data as { error?: unknown }).error)
        : "Something went wrong. Please try again.";
    throw new Error(message);
  }
  return data;
}

/**
 * Steps returned by the test API have `correctOptionId` stripped from every
 * question (see stripAnswers in lib/api/test-content.ts) — the field is
 * simply absent at runtime. We reuse TestStep for convenience but never
 * read `correctOptionId` on the client.
 */
export interface StartTestResponse {
  sessionId: string;
  steps: TestStep[];
}


export async function startTestSession(): Promise<StartTestResponse> {
  const res = await fetch("/api/test/start", { method: "POST" });
  return (await parseJsonOrThrow(res)) as StartTestResponse;
}

export interface SessionSnapshot {
  id: string;
  status: "in_progress" | "completed" | "expired";
  currentQuestionIndex: number;
  answers: Record<string, string>;
  listeningPlays: Record<string, number>;
}

export interface FetchSessionResponse {
  session: SessionSnapshot;
  steps: TestStep[];
}

export async function fetchTestSession(
  sessionId: string
): Promise<FetchSessionResponse> {
  const res = await fetch(`/api/test/${sessionId}`);
  return (await parseJsonOrThrow(res)) as FetchSessionResponse;
}

export async function saveTestProgress(
  sessionId: string,
  body: { questionId?: string; optionId?: string; currentQuestionIndex?: number }
): Promise<void> {
  const res = await fetch(`/api/test/${sessionId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  await parseJsonOrThrow(res);
}

export interface ListeningPlayResponse {
  playsUsed: number;
  playsRemaining: number;
  locked: boolean;
}

export async function registerListeningPlay(
  sessionId: string,
  audioId: string
): Promise<ListeningPlayResponse> {
  const res = await fetch(`/api/test/${sessionId}/listening-play`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audioId }),
  });
  return (await parseJsonOrThrow(res)) as ListeningPlayResponse;
}

export async function submitTestSession(
  sessionId: string
): Promise<{ resultId: string }> {
  const res = await fetch(`/api/test/${sessionId}/submit`, { method: "POST" });
  return (await parseJsonOrThrow(res)) as { resultId: string };
}
