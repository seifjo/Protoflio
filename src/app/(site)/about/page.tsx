import type { Metadata } from "next";
import { Container, SectionLabel } from "@/components/public/Container";
import { getSettings, getSkills } from "@/lib/queries";
import { SKILL_CATEGORIES } from "@/lib/types";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const [settings, skills] = await Promise.all([getSettings(), getSkills()]);

  return (
    <section className="py-16 sm:py-24">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionLabel index="01" label="About" />
          <h1 className="display mt-4 text-5xl sm:text-6xl">{settings.name}</h1>
          <p className="mono mt-4 text-[12px] tracking-[0.18em] text-[var(--muted)] uppercase">
            {settings.jobTitle}
          </p>
        </div>
        <div>
          <div className="prose-lite max-w-2xl text-lg">{settings.aboutText}</div>
          {settings.profileImage ? (
            <div className="mt-10 max-w-sm overflow-hidden border border-[var(--line)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.profileImage}
                alt={settings.name}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          ) : null}
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
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
