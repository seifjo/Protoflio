import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "./prisma";

export const projectInclude = {
  images: { orderBy: { sortOrder: "asc" as const } },
  features: { orderBy: { sortOrder: "asc" as const } },
  technologies: { orderBy: { sortOrder: "asc" as const } },
  links: { orderBy: { sortOrder: "asc" as const } },
  videos: { orderBy: { sortOrder: "asc" as const } },
  files: true,
};

export const getSettings = cache(async () => {
  return prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });
});

export const getPublishedProjects = cache(async () => {
  noStore();
  return prisma.project.findMany({
    where: { published: true },
    include: projectInclude,
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });
});

export const getFeaturedProject = cache(async () => {
  noStore();
  return prisma.project.findFirst({
    where: { published: true, featured: true },
    include: projectInclude,
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });
});

export async function getProjectBySlug(slug: string, includeDrafts = false) {
  noStore();
  return prisma.project.findFirst({
    where: includeDrafts ? { slug } : { slug, published: true },
    include: projectInclude,
  });
}

export const getSkills = cache(async () => {
  return prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
});

export const getSocialLinks = cache(async () => {
  return prisma.socialLink.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
  });
});

export async function getDashboardStats() {
  const [total, published, drafts, featured, screenshots, unread] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.project.count({ where: { published: false } }),
      prisma.project.count({ where: { featured: true } }),
      prisma.projectImage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
    ]);

  return { total, published, drafts, featured, screenshots, unread };
}

export function coverImage(
  project: { images: { url: string; isCover: boolean; altText: string }[] },
) {
  return project.images.find((image) => image.isCover) ?? project.images[0] ?? null;
}

export function projectLink(
  project: { links: { kind: string; url: string; label: string }[] },
  kind: string,
) {
  return project.links.find((link) => link.kind === kind && link.url.trim()) ?? null;
}

export function projectFile(
  project: {
    files: {
      kind: string;
      fileUrl: string;
      externalUrl: string;
      version: string;
      fileSize: string;
      fileName: string;
      releaseDate: Date | null;
    }[];
  },
  kind: string,
) {
  return (
    project.files.find(
      (file) =>
        file.kind === kind && (file.fileUrl.trim() || file.externalUrl.trim()),
    ) ?? null
  );
}

export function fileHref(file: { fileUrl: string; externalUrl: string } | null) {
  if (!file) return "";
  return file.fileUrl.trim() || file.externalUrl.trim();
}
