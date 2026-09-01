import type { Metadata } from "next";
import { Container, SectionLabel } from "@/components/public/Container";
import { ProjectCard } from "@/components/public/ProjectCard";
import { getPublishedProjects } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected Flutter and cross-platform projects by Seif Kamel.",
};

export const dynamic = "force-dynamic";

export default async function WorkPage() {
  const projects = await getPublishedProjects();

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionLabel index="01" label="Work" />
        <h1 className="display mt-4 text-5xl sm:text-7xl">Selected projects</h1>
        <p className="mt-4 max-w-xl text-[var(--muted)]">
          Case studies are generated from the project database. Unpublished
          work stays in the admin dashboard until it’s ready.
        </p>
        {projects.length ? (
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                featured={index === 0 && project.featured}
              />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-[var(--muted)]">
            No published projects yet.
          </p>
        )}
      </Container>
    </section>
  );
}
