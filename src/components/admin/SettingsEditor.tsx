"use client";

import { useState } from "react";
import { saveSettingsAction, saveSocialLinkAction, deleteSocialLinkAction } from "@/lib/actions/settings";
import { FileUpload } from "./FileUpload";
import { SOCIAL_PLATFORMS } from "@/lib/types";

type Settings = {
  name: string;
  jobTitle: string;
  bio: string;
  availability: string;
  available: boolean;
  email: string;
  heroLabel: string;
  heroName: string;
  heroRole: string;
  heroSubtitle: string;
  heroMeta: string;
  aboutText: string;
  footerText: string;
  profileImage: string;
  favicon: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
};

type Social = {
  id: string;
  platform: string;
  url: string;
  label: string;
  visible: boolean;
  sortOrder: number;
};

export function SettingsEditor({
  settings,
  socials,
}: {
  settings: Settings;
  socials: Social[];
}) {
  const [form, setForm] = useState(settings);
  const [links, setLinks] = useState(socials);
  const [status, setStatus] = useState("");

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setStatus("Saving…");
    await saveSettingsAction(form as unknown as Record<string, string | boolean>);
    setStatus("Saved.");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Site settings</h1>
        <button
          type="button"
          onClick={save}
          className="bg-[var(--accent)] px-5 py-2 text-xs tracking-wider text-white uppercase"
        >
          Save settings
        </button>
      </div>
      {status ? <p className="text-sm text-[var(--muted)]">{status}</p> : null}

      <section className="space-y-4 border border-[var(--line)] p-5">
        <h2 className="mono text-[11px] tracking-wider text-[var(--accent)] uppercase">
          Profile
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(["name", "jobTitle", "email", "availability"] as const).map((key) => (
            <label key={key} className="block">
              <span className="admin-label">{key}</span>
              <input
                className="admin-input"
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
              />
            </label>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => set("available", e.target.checked)}
          />
          Show as available
        </label>
        <label className="block">
          <span className="admin-label">Bio</span>
          <textarea
            className="admin-input resize-y"
            rows={3}
            value={form.bio}
            onChange={(e) => set("bio", e.target.value)}
          />
        </label>
        <label className="block">
          <span className="admin-label">About text</span>
          <textarea
            className="admin-input resize-y"
            rows={6}
            value={form.aboutText}
            onChange={(e) => set("aboutText", e.target.value)}
          />
        </label>
        <label className="block">
          <span className="admin-label">Footer text</span>
          <input
            className="admin-input"
            value={form.footerText}
            onChange={(e) => set("footerText", e.target.value)}
          />
        </label>
      </section>

      <section className="space-y-4 border border-[var(--line)] p-5">
        <h2 className="mono text-[11px] tracking-wider text-[var(--accent)] uppercase">
          Hero
        </h2>
        {(
          [
            "heroLabel",
            "heroName",
            "heroRole",
            "heroSubtitle",
            "heroMeta",
          ] as const
        ).map((key) => (
          <label key={key} className="block">
            <span className="admin-label">{key}</span>
            <input
              className="admin-input"
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
            />
          </label>
        ))}
      </section>

      <section className="space-y-4 border border-[var(--line)] p-5">
        <h2 className="mono text-[11px] tracking-wider text-[var(--accent)] uppercase">
          Images
        </h2>
        <label className="block">
          <span className="admin-label">Profile image URL</span>
          <input
            className="admin-input"
            value={form.profileImage}
            onChange={(e) => set("profileImage", e.target.value)}
          />
        </label>
        <FileUpload
          kind="profile"
          accept="image/*"
          label="Upload profile image"
          onUploaded={(r) => set("profileImage", r.url)}
        />
        {form.profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.profileImage} alt="Profile" className="h-32 w-32 object-cover" />
        ) : null}
        <label className="block">
          <span className="admin-label">Favicon URL</span>
          <input
            className="admin-input"
            value={form.favicon}
            onChange={(e) => set("favicon", e.target.value)}
          />
        </label>
        <FileUpload
          kind="favicon"
          accept="image/*"
          label="Upload favicon"
          onUploaded={(r) => set("favicon", r.url)}
        />
      </section>

      <section className="space-y-4 border border-[var(--line)] p-5">
        <h2 className="mono text-[11px] tracking-wider text-[var(--accent)] uppercase">
          SEO defaults
        </h2>
        <label className="block">
          <span className="admin-label">SEO title</span>
          <input
            className="admin-input"
            value={form.seoTitle}
            onChange={(e) => set("seoTitle", e.target.value)}
          />
        </label>
        <label className="block">
          <span className="admin-label">SEO description</span>
          <textarea
            className="admin-input resize-y"
            rows={2}
            value={form.seoDescription}
            onChange={(e) => set("seoDescription", e.target.value)}
          />
        </label>
        <label className="block">
          <span className="admin-label">OG image URL</span>
          <input
            className="admin-input"
            value={form.ogImage}
            onChange={(e) => set("ogImage", e.target.value)}
          />
        </label>
      </section>

      <section className="space-y-4 border border-[var(--line)] p-5">
        <h2 className="mono text-[11px] tracking-wider text-[var(--accent)] uppercase">
          Social links
        </h2>
        {links.map((link) => (
          <div key={link.id} className="flex flex-wrap gap-2 border border-[var(--line)] p-3">
            <select
              className="admin-input w-32"
              value={link.platform}
              onChange={(e) =>
                setLinks((prev) =>
                  prev.map((l) =>
                    l.id === link.id ? { ...l, platform: e.target.value } : l,
                  ),
                )
              }
            >
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <input
              className="admin-input min-w-[200px] flex-1"
              value={link.url}
              onChange={(e) =>
                setLinks((prev) =>
                  prev.map((l) =>
                    l.id === link.id ? { ...l, url: e.target.value } : l,
                  ),
                )
              }
            />
            <button
              type="button"
              className="border border-[var(--line)] px-3 text-xs uppercase"
              onClick={async () => {
                await saveSocialLinkAction(link);
                setStatus("Social link saved.");
              }}
            >
              Save
            </button>
            <button
              type="button"
              className="px-3 text-xs text-[var(--danger)] uppercase"
              onClick={async () => {
                await deleteSocialLinkAction(link.id);
                setLinks((prev) => prev.filter((l) => l.id !== link.id));
              }}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-xs tracking-wider text-[var(--accent)] uppercase"
          onClick={async () => {
            await saveSocialLinkAction({
              platform: "GitHub",
              url: "https://",
              label: "",
              visible: true,
              sortOrder: links.length,
            });
            window.location.reload();
          }}
        >
          + Add social link
        </button>
      </section>
    </div>
  );
}
