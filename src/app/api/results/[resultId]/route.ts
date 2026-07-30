import { NextResponse, type NextRequest } from "next/server";

import { createServiceClient } from "@/lib/supabase/service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ resultId: string }> }
) {
  const { resultId } = await params;
  const service = createServiceClient();

  const { data: result, error } = await service
    .from("test_results")
    .select("*")
    .eq("id", resultId)
    .maybeSingle();

  if (error || !result) {
    return NextResponse.json({ error: "Result not found" }, { status: 404 });
  }

  return NextResponse.json({ result });
}
