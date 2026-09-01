"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Save, Eye } from "lucide-react";
import { saveProjectAction, type ProjectInput } from "@/lib/actions/projects";
import { slugify } from "@/lib/slug";
import { FileUpload } from "./FileUpload";
import { ImageManager } from "./ImageManager";
import type { ProjectWithRelations } from "@/lib/types";
import { PROJECT_STATUSES } from "@/lib/types";

function getLink(project: ProjectWithRelations | undefined, kind: string) {
  return project?.links.find((l) => l.kind === kind && l.url.trim()) ?? null;
}

function getFile(project: ProjectWithRelations | undefined, kind: string) {
  return (
    project?.files.find(
      (f) => f.kind === kind && (f.fileUrl.trim() || f.externalUrl.trim()),
    ) ?? null
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-[var(--line)] bg-[#0a0d14]">
      <div className="border-b border-[var(--line)] px-5 py-3">
        <h2 className="mono text-[11px] tracking-[0.16em] text-[var(--accent)] uppercase">
          {title}
        </h2>
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      {children}
    </label>
  );
}

function toInput(project?: ProjectWithRelations): ProjectInput {
  const apk = getFile(project, "apk");
  const pdf = getFile(project, "pdf");
  const demo = getLink(project, "live_demo");
  const github = getLink(project, "github");
  const video = project?.videos[0];

  return {
    id: project?.id,
    title: project?.title || "",
    slug: project?.slug || "",
    shortDescription: project?.shortDescription || "",
    fullDescription: project?.fullDescription || "",
    category: project?.category || "",
    status: project?.status || "draft",
    date: project?.date
      ? new Date(project.date).toISOString().slice(0, 10)
      : "",
    role: project?.role || "",
    featured: project?.featured || false,
    published: project?.published || false,
    overview: project?.overview || "",
    problem: project?.problem || "",
    solution: project?.solution || "",
    challenges: project?.challenges || "",
    technicalImplementation: project?.technicalImplementation || "",
    results: project?.results || "",
    futureImprovements: project?.futureImprovements || "",
    isPrivate: project?.isPrivate || false,
    showQrCode: project?.showQrCode || false,
    qrMode: project?.qrMode || "apk",
    qrCustomUrl: project?.qrCustomUrl || "",
    seoTitle: project?.seoTitle || "",
    seoDescription: project?.seoDescription || "",
    ogTitle: project?.ogTitle || "",
    ogDescription: project?.ogDescription || "",
    ogImage: project?.ogImage || "",
    canonicalUrl: project?.canonicalUrl || "",
    technologies: project?.technologies.map((t) => t.name) || [],
    features:
      project?.features.map((f) => ({
        title: f.title,
        description: f.description,
      })) || [{ title: "", description: "" }],
    liveDemoUrl: demo?.url || "",
    githubUrl: github?.url || "",
    videoUrl: video?.url || "",
    apkFileUrl: apk?.fileUrl || "",
    apkExternalUrl: apk?.externalUrl || "",
    apkVersion: apk?.version || "",
    apkFileSize: apk?.fileSize || "",
    apkReleaseDate: apk?.releaseDate
      ? new Date(apk.releaseDate).toISOString().slice(0, 10)
      : "",
    pdfFileUrl: pdf?.fileUrl || "",
    pdfExternalUrl: pdf?.externalUrl || "",
  };
}

export function ProjectEditor({ project }: { project?: ProjectWithRelations }) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectInput>(() => toInput(project));
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedId, setSavedId] = useState(project?.id);

  function set<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(publish?: boolean) {
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      published: publish !== undefined ? publish : form.published,
    };
    const result = await saveProjectAction(payload);
    if (result.error) {
      setError(result.error);
      setSaving(false);
      return;
    }
    if (result.id && !savedId) {
      setSavedId(result.id);
      router.replace(`/admin/projects/${result.id}`);
    } else {
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {project ? "Edit project" : "New project"}
          </h1>
          {project?.slug ? (
            <p className="mt-1 text-sm text-[var(--muted)]">/{project.slug}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {savedId ? (
            <Link
              href={`/projects/${form.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 border border-[var(--line)] px-4 py-2 text-xs tracking-wider uppercase"
            >
              <Eye size={14} /> Preview
            </Link>
          ) : null}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(false)}
            className="inline-flex items-center gap-2 border border-[var(--line)] px-4 py-2 text-xs tracking-wider uppercase"
          >
            <Save size={14} /> Save draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(true)}
            className="inline-flex items-center gap-2 bg-[var(--accent)] px-4 py-2 text-xs tracking-wider text-white uppercase"
          >
            <ExternalLink size={14} /> Publish
          </button>
        </div>
      </div>

      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

      <Section title="1. Basic Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Project title">
            <input
              className="admin-input"
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                set("title", title);
                if (!project) set("slug", slugify(title));
              }}
            />
          </Field>
          <Field label="Slug">
            <input
              className="admin-input"
              value={form.slug}
              onChange={(e) => set("slug", slugify(e.target.value))}
            />
          </Field>
          <Field label="Category">
            <input
              className="admin-input"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            />
          </Field>
          <Field label="Status">
            <select
              className="admin-input"
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              {PROJECT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Date">
            <input
              type="date"
              className="admin-input"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </Field>
          <Field label="Role">
            <input
              className="admin-input"
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Short description">
          <textarea
            className="admin-input resize-y"
            rows={2}
            value={form.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value)}
          />
        </Field>
        <Field label="Full description">
          <textarea
            className="admin-input resize-y"
            rows={4}
            value={form.fullDescription}
            onChange={(e) => set("fullDescription", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="2. Case Study Content">
        {(
          [
            ["overview", "Overview"],
            ["problem", "The Problem"],
            ["solution", "The Solution"],
            ["challenges", "Challenges"],
            ["technicalImplementation", "Technical Implementation"],
            ["results", "Results"],
            ["futureImprovements", "Future Improvements"],
          ] as const
        ).map(([key, label]) => (
          <Field key={key} label={label}>
            <textarea
              className="admin-input resize-y"
              rows={4}
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
            />
          </Field>
        ))}
      </Section>

      <Section title="3. Technologies">
        <div className="flex flex-wrap gap-2">
          {form.technologies.map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="flex items-center gap-2 border border-[var(--line)] px-3 py-1 text-sm"
            >
              {tech}
              <button
                type="button"
                onClick={() =>
                  set(
                    "technologies",
                    form.technologies.filter((_, idx) => idx !== i),
                  )
                }
                className="text-[var(--dim)] hover:text-[var(--danger)]"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="admin-input"
            placeholder="Add technology"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (techInput.trim()) {
                  set("technologies", [...form.technologies, techInput.trim()]);
                  setTechInput("");
                }
              }
            }}
          />
          <button
            type="button"
            className="shrink-0 border border-[var(--line)] px-4 text-xs uppercase"
            onClick={() => {
              if (techInput.trim()) {
                set("technologies", [...form.technologies, techInput.trim()]);
                setTechInput("");
              }
            }}
          >
            Add
          </button>
        </div>
      </Section>

      <Section title="4. Features">
        {form.features.map((feature, i) => (
          <div key={i} className="flex gap-2">
            <input
              className="admin-input"
              placeholder="Feature title"
              value={feature.title}
              onChange={(e) => {
                const next = [...form.features];
                next[i] = { ...next[i], title: e.target.value };
                set("features", next);
              }}
            />
            <button
              type="button"
              className="shrink-0 px-3 text-[var(--dim)]"
              onClick={() =>
                set(
                  "features",
                  form.features.filter((_, idx) => idx !== i),
                )
              }
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-xs tracking-wider text-[var(--accent)] uppercase"
          onClick={() =>
            set("features", [...form.features, { title: "", description: "" }])
          }
        >
          + Add feature
        </button>
      </Section>

      {savedId ? (
        <Section title="5. Screenshots">
          <ImageManager projectId={savedId} images={project?.images || []} />
        </Section>
      ) : (
        <Section title="5. Screenshots">
          <p className="text-sm text-[var(--dim)]">
            Save the project first to upload screenshots.
          </p>
        </Section>
      )}

      <Section title="6. APK">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="APK URL">
            <input
              className="admin-input"
              value={form.apkExternalUrl}
              onChange={(e) => set("apkExternalUrl", e.target.value)}
              placeholder="https://..."
            />
          </Field>
          <Field label="Version">
            <input
              className="admin-input"
              value={form.apkVersion}
              onChange={(e) => set("apkVersion", e.target.value)}
            />
          </Field>
          <Field label="File size">
            <input
              className="admin-input"
              value={form.apkFileSize}
              onChange={(e) => set("apkFileSize", e.target.value)}
              placeholder="e.g. 24.5 MB"
            />
          </Field>
          <Field label="Release date">
            <input
              type="date"
              className="admin-input"
              value={form.apkReleaseDate}
              onChange={(e) => set("apkReleaseDate", e.target.value)}
            />
          </Field>
        </div>
        {form.apkFileUrl ? (
          <p className="text-sm text-[var(--muted)]">
            Uploaded: {form.apkFileUrl}
          </p>
        ) : null}
        <FileUpload
          kind="apk"
          accept=".apk"
          label="Upload APK file"
          onUploaded={(r) => {
            set("apkFileUrl", r.url);
            if (r.fileSize) set("apkFileSize", r.fileSize);
          }}
        />
      </Section>

      <Section title="7. Video">
        <Field label="Video URL (YouTube, Vimeo, or direct)">
          <input
            className="admin-input"
            value={form.videoUrl}
            onChange={(e) => set("videoUrl", e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
          />
        </Field>
      </Section>

      <Section title="8. Live Demo">
        <Field label="Live Demo URL">
          <input
            className="admin-input"
            value={form.liveDemoUrl}
            onChange={(e) => set("liveDemoUrl", e.target.value)}
            placeholder="https://..."
          />
        </Field>
      </Section>

      <Section title="9. GitHub">
        <Field label="Repository URL">
          <input
            className="admin-input"
            value={form.githubUrl}
            onChange={(e) => set("githubUrl", e.target.value)}
            placeholder="https://github.com/..."
          />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isPrivate}
            onChange={(e) => set("isPrivate", e.target.checked)}
          />
          Private project (hide GitHub button)
        </label>
      </Section>

      <Section title="10. PDF Case Study">
        <Field label="PDF URL">
          <input
            className="admin-input"
            value={form.pdfExternalUrl}
            onChange={(e) => set("pdfExternalUrl", e.target.value)}
          />
        </Field>
        {form.pdfFileUrl ? (
          <p className="text-sm text-[var(--muted)]">
            Uploaded: {form.pdfFileUrl}
          </p>
        ) : null}
        <FileUpload
          kind="pdf"
          accept=".pdf"
          label="Upload PDF"
          onUploaded={(r) => set("pdfFileUrl", r.url)}
        />
      </Section>

      <Section title="11. SEO">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="SEO title">
            <input
              className="admin-input"
              value={form.seoTitle}
              onChange={(e) => set("seoTitle", e.target.value)}
            />
          </Field>
          <Field label="Canonical URL">
            <input
              className="admin-input"
              value={form.canonicalUrl}
              onChange={(e) => set("canonicalUrl", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Meta description">
          <textarea
            className="admin-input resize-y"
            rows={2}
            value={form.seoDescription}
            onChange={(e) => set("seoDescription", e.target.value)}
          />
        </Field>
        <Field label="Open Graph title">
          <input
            className="admin-input"
            value={form.ogTitle}
            onChange={(e) => set("ogTitle", e.target.value)}
          />
        </Field>
        <Field label="Open Graph description">
          <textarea
            className="admin-input resize-y"
            rows={2}
            value={form.ogDescription}
            onChange={(e) => set("ogDescription", e.target.value)}
          />
        </Field>
        <Field label="Open Graph image URL">
          <input
            className="admin-input"
            value={form.ogImage}
            onChange={(e) => set("ogImage", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="12. Publish Settings">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />
          Featured project
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set("published", e.target.checked)}
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.showQrCode}
            onChange={(e) => set("showQrCode", e.target.checked)}
          />
          Show QR code on project page
        </label>
        {form.showQrCode ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="QR points to">
              <select
                className="admin-input"
                value={form.qrMode}
                onChange={(e) => set("qrMode", e.target.value)}
              >
                <option value="apk">APK download</option>
                <option value="demo">Live demo</option>
                <option value="custom">Custom URL</option>
              </select>
            </Field>
            {form.qrMode === "custom" ? (
              <Field label="Custom QR URL">
                <input
                  className="admin-input"
                  value={form.qrCustomUrl}
                  onChange={(e) => set("qrCustomUrl", e.target.value)}
                />
              </Field>
            ) : null}
          </div>
        ) : null}
      </Section>
    </div>
  );
}
