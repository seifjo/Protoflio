import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, SectionLabel } from "@/components/public/Container";
import { ContactForm } from "@/components/public/ContactForm";
import { ProjectCard } from "@/components/public/ProjectCard";
import { Reveal } from "@/components/public/Reveal";
import {
  getFeaturedProject,
  getPublishedProjects,
  getSettings,
  getSkills,
  getSocialLinks,
} from "@/lib/queries";
import { isBlank } from "@/lib/utils";
import { SKILL_CATEGORIES } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, projects, featured, skills, socials] = await Promise.all([
    getSettings(),
    getPublishedProjects(),
    getFeaturedProject(),
    getSkills(),
    getSocialLinks(),
  ]);

  const selected = featured
    ? projects.filter((project) => project.id !== featured.id)
    : projects;
  const skillNames = skills.map((skill) => skill.name);
  const visibleSocials = socials.filter((item) => !isBlank(item.url));

  return (
    <>
      <section className="hero-glow relative overflow-hidden border-b border-[var(--line)]">
        <Container className="grid items-end gap-10 py-16 sm:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
          <div>
            <p className="mono text-[12px] tracking-[0.22em] text-[var(--accent)] uppercase">
              {settings.heroLabel}
            </p>
            <h1 className="display mt-6 max-w-5xl text-6xl leading-[0.86] sm:text-8xl lg:text-[8.5rem]">
              {settings.heroName}
            </h1>
            <div className="mt-8 max-w-xl space-y-1">
              <p className="mono text-sm tracking-[0.22em] text-white uppercase">
                {settings.heroRole}
              </p>
              <p className="mono text-sm tracking-[0.18em] text-[var(--muted)] uppercase">
                {settings.heroSubtitle}
              </p>
            </div>
            <p className="mono mt-8 text-[12px] tracking-[0.2em] text-[var(--dim)] uppercase">
              {settings.heroMeta}
            </p>
            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/work"
                className="inline-flex min-h-12 items-center justify-center bg-[var(--accent)] px-6 text-sm tracking-[0.14em] text-white uppercase transition hover:bg-[var(--accent-hover)]"
              >
                View work
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center border border-[var(--line)] px-6 text-sm tracking-[0.14em] uppercase transition hover:border-white hover:text-white"
              >
                Get in touch
              </Link>
            </div>
          </div>
          {settings.profileImage ? (
            <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:justify-self-end">
              <div className="absolute -inset-px bg-[linear-gradient(135deg,rgba(255,83,22,0.45),transparent_45%,rgba(255,255,255,0.08))]" />
              <div className="relative overflow-hidden border border-[var(--line)] bg-[#0a0d14]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.profileImage}
                  alt={settings.name}
                  className="aspect-[4/5] w-full object-cover object-top"
                />
              </div>
              <p className="mono mt-3 text-[10px] tracking-[0.18em] text-[var(--dim)] uppercase">
                {settings.name} · {settings.jobTitle}
              </p>
            </div>
          ) : null}
        </Container>
      </section>

      <section className="border-b border-[var(--line)] py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <SectionLabel index="01" label="Introduction" />
            <h2 className="display mt-4 text-3xl sm:text-4xl">
              {settings.jobTitle}
            </h2>
          </Reveal>
          <Reveal>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
              {settings.bio ||
                "I build cross-platform applications with Flutter, focusing on clean architecture, backend integration and practical user experiences."}
            </p>
            {settings.available && settings.availability ? (
              <p className="mt-6 inline-flex items-center gap-2 border border-[var(--line)] px-3 py-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--ok)]" />
                <span className="mono text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase">
                  {settings.availability}
                </span>
              </p>
            ) : null}
          </Reveal>
        </Container>
      </section>

      {skillNames.length ? (
        <section className="border-b border-[var(--line)] py-12">
          <Container>
            <SectionLabel index="02" label="Stack" />
            <div className="mt-6 flex flex-wrap gap-2">
              {skillNames.map((name) => (
                <span key={name} className="tech-chip">
                  {name}
                </span>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="border-b border-[var(--line)] py-16">
        <Container className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {[
            { label: "Published projects", value: projects.length },
            { label: "Featured", value: projects.filter((p) => p.featured).length },
            { label: "Technologies", value: skills.length },
          ].map((stat) => (
            <div key={stat.label} className="border border-[var(--line)] p-5 sm:p-6">
              <p className="display text-4xl sm:text-5xl">{stat.value}</p>
              <p className="mono mt-2 text-[11px] tracking-[0.16em] text-[var(--dim)] uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </Container>
      </section>

      {featured ? (
        <section className="border-b border-[var(--line)] py-16 sm:py-20">
          <Container>
            <SectionLabel index="03" label="Featured project" />
            <div className="mt-8">
              <ProjectCard project={featured} index={0} featured />
            </div>
          </Container>
        </section>
      ) : null}

      <section className="border-b border-[var(--line)] py-16 sm:py-20">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <SectionLabel index="04" label="Selected projects" />
            <Link
              href="/work"
              className="mono hidden text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase hover:text-white sm:inline"
            >
              All work →
            </Link>
          </div>
          {selected.length ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {selected.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={featured ? index + 1 : index}
                />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-[var(--muted)]">
              No additional published projects yet.
            </p>
          )}
        </Container>
      </section>

      <section id="about" className="border-b border-[var(--line)] py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionLabel index="05" label="About" />
          <div>
            <div className="prose-lite max-w-2xl text-lg">
              {settings.aboutText}
            </div>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-1 text-sm text-white"
            >
              More about me <ArrowUpRight size={14} />
            </Link>
          </div>
        </Container>
      </section>

      {skills.length ? (
        <section className="border-b border-[var(--line)] py-16">
          <Container>
            <SectionLabel index="06" label="Skills" />
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {SKILL_CATEGORIES.map((category) => {
                const items = skills.filter((skill) => skill.category === category);
                if (!items.length) return null;
                return (
                  <div key={category}>
                    <p className="mono text-[11px] tracking-[0.18em] text-[var(--dim)] uppercase">
                      {category}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {items.map((skill) => (
                        <li key={skill.id} className="text-[var(--muted)]">
                          {skill.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      ) : null}

      <section id="contact" className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionLabel index="07" label="Contact" />
            <h2 className="display mt-4 text-4xl sm:text-5xl">
              Let’s build something.
            </h2>
            <p className="mt-4 max-w-md text-[var(--muted)]">
              For freelance, remote, or hybrid Flutter work — send a message
              and I’ll follow up from the dashboard inbox.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              {!isBlank(settings.email) ? (
                <a
                  href={`mailto:${settings.email}`}
                  className="mono text-[12px] tracking-[0.14em] text-[var(--accent)] uppercase"
                >
                  {settings.email}
                </a>
              ) : null}
              {visibleSocials.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mono text-[12px] tracking-[0.14em] text-[var(--muted)] uppercase hover:text-white"
                >
                  {item.label || item.platform}
                </a>
              ))}
            </div>
          </div>
          <ContactForm />
        </Container>
      </section>
    </>
  );
}
