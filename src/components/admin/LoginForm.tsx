"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ from }: { from: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(payload.error || "Sign in failed.");
        setLoading(false);
        return;
      }

      const destination = from.startsWith("/admin") ? from : "/admin";
      router.replace(destination);
      router.refresh();
    } catch {
      setError("Network error while signing in. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block">
        <span className="admin-label">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="admin-input"
        />
      </label>
      <label className="block">
        <span className="admin-label">Password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="admin-input"
        />
      </label>
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full min-h-12 bg-[var(--accent)] text-sm font-medium tracking-[0.12em] text-white uppercase transition hover:bg-[var(--accent-hover)] disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
