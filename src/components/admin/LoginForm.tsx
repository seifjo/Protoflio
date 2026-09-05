"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/actions/auth";

export function LoginForm({ from }: { from: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    const destination = from.startsWith("/admin") ? from : "/admin";
    router.replace(destination);
    router.refresh();
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
          defaultValue=""
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
