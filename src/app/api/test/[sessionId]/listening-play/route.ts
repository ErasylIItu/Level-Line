import { NextResponse, type NextRequest } from "next/server";

import { createServiceClient } from "@/lib/supabase/service";
import { MAX_AUDIO_PLAYS } from "@/lib/constants";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const { audioId }: { audioId?: string } = await request.json();

  if (!audioId) {
    return NextResponse.json({ error: "audioId is required" }, { status: 400 });
  }

  const service = createServiceClient();

  const { data: session, error: fetchError } = await service
    .from("test_sessions")
    .select("listening_plays, status")
    .eq("id", sessionId)
    .maybeSingle();

  if (fetchError || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.status !== "in_progress") {
    return NextResponse.json(
      { error: "This test session has already finished" },
      { status: 409 }
    );
  }

  const plays = { ...session.listening_plays };
  const current = plays[audioId] ?? 0;

  if (current >= MAX_AUDIO_PLAYS) {
    return NextResponse.json(
      { error: "Play limit reached", playsUsed: current, locked: true },
      { status: 409 }
    );
  }

  plays[audioId] = current + 1;

  const { error: updateError } = await service
    .from("test_sessions")
    .update({ listening_plays: plays })
    .eq("id", sessionId);

  if (updateError) {
    return NextResponse.json(
      { error: "Could not record playback" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    playsUsed: plays[audioId],
    playsRemaining: Math.max(0, MAX_AUDIO_PLAYS - plays[audioId]),
    locked: plays[audioId] >= MAX_AUDIO_PLAYS,
  });
}
