import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn, padIndex } from "@/lib/utils";
import { coverImage } from "@/lib/queries";
import type { ProjectWithRelations } from "@/lib/types";

export function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: ProjectWithRelations;
  index: number;
  featured?: boolean;
}) {
  const cover = coverImage(project);
  const techs = project.technologies.slice(0, featured ? 6 : 4);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group block border border-[var(--line)] bg-[rgba(255,255,255,0.015)] transition-colors hover:border-[var(--line-strong)] hover:bg-[var(--bg-card)]",
        featured && "lg:grid lg:grid-cols-[1.15fr_0.85fr]",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden border-b border-[var(--line)] bg-[#0a0d14]",
          featured ? "aspect-[16/10] lg:aspect-auto lg:min-h-[420px] lg:border-b-0 lg:border-r" : "aspect-[16/10]",
        )}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.url}
            alt={cover.altText || project.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-end p-6">
            <span className="display text-6xl text-white/8 sm:text-8xl">
              {padIndex(index)}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between p-6 sm:p-8">
        <div>
          <p className="mono text-[11px] tracking-[0.18em] text-[var(--accent)]">
            {padIndex(index)} / {project.category || "Selected work"}
          </p>
          <h3 className="display mt-3 text-3xl leading-none sm:text-4xl">
            {project.title}
          </h3>
          {project.shortDescription ? (
            <p className="mt-4 max-w-md text-sm leading-7 text-[var(--muted)]">
              {project.shortDescription}
            </p>
          ) : null}
        </div>
        <div className="mt-8 flex items-end justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {techs.map((tech) => (
              <span key={tech.id} className="tech-chip">
                {tech.name}
              </span>
            ))}
          </div>
          <span className="mono hidden items-center gap-1 text-[11px] tracking-[0.16em] text-white uppercase sm:inline-flex">
            View <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
