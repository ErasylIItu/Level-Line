import { NextResponse, type NextRequest } from "next/server";

import { requireAdmin } from "@/lib/api/require-admin";

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await auth.supabase.storage
    .from("listening-audio")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData } = auth.supabase.storage
    .from("listening-audio")
    .getPublicUrl(fileName);

  return NextResponse.json({ audioUrl: publicUrlData.publicUrl });
}
