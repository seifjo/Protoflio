"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus("error");
      setError(payload.error || "Could not send the message.");
      return;
    }
    setStatus("sent");
    form.reset();
  }

  if (status === "sent") {
    return (
      <div className="border border-[var(--line)] p-6">
        <p className="section-kicker">Message sent</p>
        <p className="mt-3 text-[var(--muted)]">
          Thanks for reaching out. I’ll get back to you as soon as I can.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <label className="block">
        <span className="admin-label">Name</span>
        <input name="name" required className="admin-input" />
      </label>
      <label className="block">
        <span className="admin-label">Email</span>
        <input name="email" type="email" required className="admin-input" />
      </label>
      <label className="block">
        <span className="admin-label">Message</span>
        <textarea
          name="message"
          required
          minLength={10}
          rows={6}
          className="admin-input resize-y"
        />
      </label>
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex min-h-12 items-center border border-[var(--accent)] bg-[var(--accent)] px-6 font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
