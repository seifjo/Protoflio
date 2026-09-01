import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const recent = new Map<string, number>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  const last = recent.get(ip) ?? 0;
  if (Date.now() - last < 8000) {
    return NextResponse.json({ error: "Please wait a moment." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const company = String(body.company || "");
  if (company) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();

  if (name.length < 2 || !email.includes("@") || message.length < 10) {
    return NextResponse.json(
      { error: "Please fill in a name, valid email, and a message." },
      { status: 400 },
    );
  }

  await prisma.contactMessage.create({ data: { name, email, message } });
  recent.set(ip, Date.now());
  return NextResponse.json({ ok: true });
}
