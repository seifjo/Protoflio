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
  const from = String(formData.get("from") || "/admin");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

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
  redirect(from.startsWith("/admin") ? from : "/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}
