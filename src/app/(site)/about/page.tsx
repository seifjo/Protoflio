import type { Metadata } from "next";
import { Container, SectionLabel } from "@/components/public/Container";
import { getSettings, getSkills } from "@/lib/queries";
import { SKILL_CATEGORIES } from "@/lib/types";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const [settings, skills] = await Promise.all([getSettings(), getSkills()]);
  const photo = settings.profileImage || "/profile/seif-kamel.webp";

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <SectionLabel index="01" label="About" />
            <h1 className="display mt-4 text-5xl sm:text-6xl">{settings.name}</h1>
            <p className="mono mt-4 text-[12px] tracking-[0.18em] text-[var(--muted)] uppercase">
              {settings.jobTitle}
            </p>
          </div>
          <div className="relative max-w-md overflow-hidden border border-[var(--line)] bg-[#0a0d14] lg:justify-self-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt={settings.name}
              className="aspect-[4/5] w-full object-cover object-top"
            />
          </div>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="prose-lite max-w-2xl text-lg">{settings.aboutText}</div>
          <div className="grid gap-8 sm:grid-cols-2">
            {SKILL_CATEGORIES.map((category) => {
              const items = skills.filter((skill) => skill.category === category);
              if (!items.length) return null;
              return (
                <div key={category}>
                  <p className="mono text-[11px] tracking-[0.18em] text-[var(--dim)] uppercase">
                    {category}
                  </p>
                  <ul className="mt-3 space-y-2 text-[var(--muted)]">
                    {items.map((skill) => (
                      <li key={skill.id}>{skill.name}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
