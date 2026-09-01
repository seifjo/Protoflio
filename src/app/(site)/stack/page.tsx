import type { Metadata } from "next";
import { Container, SectionLabel } from "@/components/public/Container";
import { getSkills } from "@/lib/queries";
import { SKILL_CATEGORIES } from "@/lib/types";

export const metadata: Metadata = {
  title: "Stack",
  description: "Tools and technologies used by Seif Kamel.",
};

export default async function StackPage() {
  const skills = await getSkills();

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionLabel index="01" label="Stack" />
        <h1 className="display mt-4 text-5xl sm:text-7xl">
          Tools I actually use
        </h1>
        <p className="mt-4 max-w-xl text-[var(--muted)]">
          Skills are managed from the admin dashboard and grouped by category.
        </p>
        <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {SKILL_CATEGORIES.map((category) => {
            const items = skills.filter((skill) => skill.category === category);
            if (!items.length) return null;
            return (
              <div key={category} className="border border-[var(--line)] p-6">
                <p className="mono text-[11px] tracking-[0.2em] text-[var(--accent)] uppercase">
                  {category}
                </p>
                <ul className="mt-5 space-y-3">
                  {items.map((skill) => (
                    <li
                      key={skill.id}
                      className="flex items-center justify-between border-b border-[var(--line)] pb-3 last:border-0"
                    >
                      <span>{skill.name}</span>
                      {skill.icon ? (
                        <span className="text-sm text-[var(--dim)]">
                          {skill.icon}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
