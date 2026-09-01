import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveAsset, saveImage } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const kind = String(form.get("kind") || "image");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  try {
    if (kind === "image" || kind === "favicon" || kind === "profile") {
      const saved = await saveImage(file);
      return NextResponse.json(saved);
    }
    if (kind === "apk" || kind === "pdf" || kind === "other") {
      const saved = await saveAsset(file, kind);
      return NextResponse.json(saved);
    }
    return NextResponse.json({ error: "Unknown upload kind." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
