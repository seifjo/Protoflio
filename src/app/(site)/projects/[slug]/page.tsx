import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/public/CaseStudy";
import {
  coverImage,
  getProjectBySlug,
  getPublishedProjects,
  getSettings,
} from "@/lib/queries";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [project, settings] = await Promise.all([
    getProjectBySlug(slug),
    getSettings(),
  ]);
  if (!project) return { title: "Project" };

  const title =
    project.seoTitle || project.ogTitle || `${project.title} — ${settings.name}`;
  const description =
    project.seoDescription ||
    project.ogDescription ||
    project.shortDescription ||
    settings.seoDescription;
  const image =
    project.ogImage || coverImage(project)?.url || settings.ogImage;
  const canonical = project.canonicalUrl || `/projects/${project.slug}`;

  return {
    title: project.seoTitle || project.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: project.ogTitle || title,
      description:
        project.ogDescription || description || `${project.title} case study`,
      url: absoluteUrl(`/projects/${project.slug}`),
      images: image ? [{ url: image }] : undefined,
      type: "article",
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const more = (await getPublishedProjects())
    .filter((item) => item.id !== project.id)
    .slice(0, 2);

  return <CaseStudy project={project} more={more} />;
}
