import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { SignJWT } from "jose";
import { SESSION_COOKIE } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const SESSION_DAYS = 7;

function getSecret() {
  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function POST(request: Request) {
  try {
    const secret = getSecret();
    if (!secret) {
      return NextResponse.json(
        { error: "AUTH_SECRET is missing on the server." },
        { status: 500 },
      );
    }
    if (!process.env.DATABASE_URL?.trim()) {
      return NextResponse.json(
        { error: "DATABASE_URL is missing on the server." },
        { status: 500 },
      );
    }

    const body = await request.json().catch(() => null);
    const email = String(body?.email || "").trim();
    const password = String(body?.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await compare(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${SESSION_DAYS}d`)
      .sign(secret);

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_DAYS * 24 * 60 * 60,
    });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Login API failed:", error);
    return NextResponse.json(
      { error: `Login failed: ${message}` },
      { status: 500 },
    );
  }
}
