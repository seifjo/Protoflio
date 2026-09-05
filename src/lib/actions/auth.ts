"use server";

import { redirect } from "next/navigation";
import {
  clearSessionCookie,
  createSessionToken,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.password))) {
      return { error: "Invalid email or password." };
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
    await setSessionCookie(token);
    return { ok: true as const };
  } catch (error) {
    console.error("Login failed:", error);
    return {
      error:
        "Sign in failed. Check AUTH_SECRET / DATABASE_URL on Vercel and try again.",
    };
  }
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}
