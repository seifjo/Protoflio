import { ArrowUpRight, Download } from "lucide-react";
import QRCode from "qrcode";
import { Container, SectionLabel } from "./Container";
import { ScreenshotGallery } from "./ScreenshotGallery";
import { VideoEmbed } from "./VideoEmbed";
import { ProjectCard } from "./ProjectCard";
import { coverImage, fileHref, projectFile, projectLink } from "@/lib/queries";
import { absoluteUrl, isBlank, padIndex } from "@/lib/utils";
import type { ProjectWithRelations } from "@/lib/types";

function TextBlock({
  index,
  label,
  body,
}: {
  index: string;
  label: string;
  body?: string;
}) {
  if (isBlank(body)) return null;
  return (
    <section className="border-t border-[var(--line)] py-16 sm:py-20">
      <Container className="grid gap-8 lg:grid-cols-[200px_1fr]">
        <SectionLabel index={index} label={label} />
        <div className="prose-lite max-w-3xl text-base sm:text-lg">{body}</div>
      </Container>
    </section>
  );
}

export async function CaseStudy({
  project,
  more = [],
}: {
  project: ProjectWithRelations;
  more?: ProjectWithRelations[];
}) {
  const cover = coverImage(project);
  const demo = projectLink(project, "live_demo");
  const github = project.isPrivate ? null : projectLink(project, "github");
  const apk = projectFile(project, "apk");
  const pdf = projectFile(project, "pdf");
  const video = project.videos[0];
  const apkUrl = fileHref(apk);
  const pdfUrl = fileHref(pdf);

  let qrTarget = "";
  if (project.showQrCode) {
    if (project.qrMode === "demo" && demo?.url) qrTarget = demo.url;
    else if (project.qrMode === "custom" && project.qrCustomUrl)
      qrTarget = project.qrCustomUrl;
    else if (apkUrl) qrTarget = absoluteUrl(apkUrl);
  }
  const qrData = qrTarget
    ? await QRCode.toDataURL(qrTarget, {
        margin: 1,
        width: 220,
        color: { dark: "#07080c", light: "#ffffff" },
      })
    : "";

  const links = [
    demo
      ? {
          href: demo.url,
          label: "Live Demo",
          icon: ArrowUpRight,
          external: true,
        }
      : null,
    apkUrl
      ? {
          href: apkUrl,
          label: "Download APK",
          icon: Download,
          external: true,
          download: true,
        }
      : null,
    github
      ? {
          href: github.url,
          label: "View Source",
          icon: ArrowUpRight,
          external: true,
        }
      : null,
    pdfUrl
      ? {
          href: pdfUrl,
          label: "Download Case Study",
          icon: Download,
          external: true,
        }
      : null,
  ].filter(Boolean) as {
    href: string;
    label: string;
    icon: typeof ArrowUpRight;
    external?: boolean;
    download?: boolean;
  }[];

  const screenshots = project.images.filter((image) => !image.isCover);
  const gallery = screenshots.length ? screenshots : project.images;

  return (
    <article>
      <section className="hero-glow py-16 sm:py-24">
        <Container>
          <SectionLabel index="01" label="Selected work" />
          <h1 className="display mt-4 max-w-5xl text-4xl leading-[0.92] sm:text-6xl lg:text-7xl">
            {project.title}
          </h1>
          {project.shortDescription ? (
            <p className="mt-6 max-w-2xl text-lg text-[var(--muted)]">
              {project.shortDescription}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3 text-[var(--dim)]">
            {project.role ? (
              <span className="mono text-[11px] tracking-[0.16em] uppercase">
                {project.role}
              </span>
            ) : null}
            {project.status && project.status !== "draft" ? (
              <span className="mono text-[11px] tracking-[0.16em] uppercase">
                {project.status.replace("-", " ")}
              </span>
            ) : null}
          </div>
        </Container>
      </section>

      {cover ? (
        <Container className="pb-10">
          <div className="overflow-hidden border border-[var(--line)] bg-[#0a0d14]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover.url}
              alt={cover.altText || project.title}
              className="aspect-[16/9] w-full object-cover object-top"
            />
          </div>
        </Container>
      ) : null}

      {project.technologies.length ? (
        <Container className="flex flex-wrap gap-2 pb-16">
          {project.technologies.map((tech) => (
            <span key={tech.id} className="tech-chip">
              {tech.name}
            </span>
          ))}
        </Container>
      ) : null}

      <TextBlock index="02" label="Overview" body={project.overview} />
      <TextBlock index="03" label="The Problem" body={project.problem} />
      <TextBlock index="04" label="The Solution" body={project.solution} />

      {project.features.length ? (
        <section className="border-t border-[var(--line)] py-16 sm:py-20">
          <Container>
            <SectionLabel index="05" label="Features" />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {project.features.map((feature) => (
                <li
                  key={feature.id}
                  className="flex items-start gap-3 border border-[var(--line)] px-4 py-4"
                >
                  <span className="mt-1 text-[var(--accent)]">✓</span>
                  <div>
                    <p className="font-medium">{feature.title}</p>
                    {feature.description ? (
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {feature.description}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <TextBlock index="06" label="Challenges" body={project.challenges} />
      <TextBlock
        index="07"
        label="Technical Implementation"
        body={project.technicalImplementation}
      />
      <TextBlock index="08" label="Results" body={project.results} />
      <TextBlock
        index="09"
        label="Future Improvements"
        body={project.futureImprovements}
      />

      {gallery.length ? (
        <section className="border-t border-[var(--line)] py-16 sm:py-20">
          <Container>
            <SectionLabel index="10" label="Screenshots" />
            <div className="mt-8">
              <ScreenshotGallery images={gallery} />
            </div>
          </Container>
        </section>
      ) : null}

      {video?.url ? (
        <section className="border-t border-[var(--line)] py-16 sm:py-20">
          <Container>
            <SectionLabel index="11" label="Project Demo" />
            <div className="mt-8 max-w-4xl">
              <VideoEmbed url={video.url} title={video.title || project.title} />
            </div>
          </Container>
        </section>
      ) : null}

      {project.technologies.length ? (
        <section className="border-t border-[var(--line)] py-16 sm:py-20">
          <Container>
            <SectionLabel index="12" label="Technology" />
            <div className="mt-8 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech.id} className="tech-chip">
                  {tech.name}
                </span>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {links.length || qrData ? (
        <section className="border-t border-[var(--line)] py-16 sm:py-20">
          <Container className="grid gap-10 lg:grid-cols-[1fr_220px]">
            <div>
              <SectionLabel index="13" label="Project Links" />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-12 items-center justify-center gap-2 border border-[var(--line)] px-5 text-sm tracking-[0.12em] uppercase transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      {link.label} <Icon size={14} />
                    </a>
                  );
                })}
              </div>
            </div>
            {qrData ? (
              <div className="border border-[var(--line)] p-5">
                <p className="mono text-[11px] tracking-[0.18em] text-[var(--accent)] uppercase">
                  Scan to download
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrData} alt="QR code" className="mt-4 w-full" />
              </div>
            ) : null}
          </Container>
        </section>
      ) : null}

      {more.length ? (
        <section className="border-t border-[var(--line)] py-16 sm:py-20">
          <Container>
            <SectionLabel index={padIndex(13)} label="More projects" />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {more.map((item, index) => (
                <ProjectCard key={item.id} project={item} index={index} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </article>
  );
}
