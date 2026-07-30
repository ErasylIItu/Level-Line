import { NextResponse } from "next/server";

import { createServiceClient } from "@/lib/supabase/service";
import { getFullTestFlow, stripAnswers } from "@/lib/api/test-content";

export async function POST() {
  try {
    const service = createServiceClient();

    const { data: session, error } = await service
      .from("test_sessions")
      .insert({})
      .select()
      .single();

    if (error || !session) {
      return NextResponse.json(
        { error: "Could not create test session" },
        { status: 500 }
      );
    }

    const steps = await getFullTestFlow();

    return NextResponse.json({
      sessionId: session.id,
      steps: stripAnswers(steps),
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected error starting the test" },
      { status: 500 }
    );
  }
}
