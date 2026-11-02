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

const DEFAULT_ABOUT = `I build cross-platform applications with Flutter, focusing on clean architecture, backend integration and practical user experiences.

I work across mobile product development — from local-first databases and REST APIs to Firebase and Supabase backends — and I care about shipping software that is structured, maintainable, and useful.`;

export const FALLBACK_SETTINGS = {
  id: "default",
  name: "Seif Kamel",
  jobTitle: "Flutter Developer",
  bio: "Flutter developer building mobile and cross-platform applications.",
  availability: "Available for work",
  available: true,
  email: "Seifjo223@gmail.com",
  heroLabel: "flutter build • live",
  heroName: "SEIF KAMEL",
  heroRole: "FLUTTER DEVELOPER",
  heroSubtitle: "MOBILE & CROSS-PLATFORM DEVELOPER",
  heroMeta: "FREELANCE • REMOTE • HYBRID",
  aboutText: DEFAULT_ABOUT,
  footerText: "Seif Kamel — Flutter Developer",
  profileImage: "/profile/seif-kamel.webp",
  favicon: "",
  seoTitle: "Seif Kamel — Flutter Developer",
  seoDescription:
    "Portfolio of Seif Kamel, a Flutter developer building mobile and cross-platform applications.",
  ogImage: "/profile/seif-kamel.webp",
  updatedAt: new Date(),
};

const FALLBACK_SKILLS = [
  { id: "1", name: "Flutter", category: "Mobile", icon: "", proficiency: "label", displayType: "label", sortOrder: 0 },
  { id: "2", name: "Dart", category: "Mobile", icon: "", proficiency: "label", displayType: "label", sortOrder: 1 },
  { id: "3", name: "Firebase", category: "Backend", icon: "", proficiency: "label", displayType: "label", sortOrder: 0 },
  { id: "4", name: "Supabase", category: "Backend", icon: "", proficiency: "label", displayType: "label", sortOrder: 1 },
  { id: "5", name: "REST API", category: "Backend", icon: "", proficiency: "label", displayType: "label", sortOrder: 2 },
  { id: "6", name: "SQLite", category: "Database", icon: "", proficiency: "label", displayType: "label", sortOrder: 0 },
  { id: "7", name: "Drift", category: "Database", icon: "", proficiency: "label", displayType: "label", sortOrder: 1 },
  { id: "8", name: "JavaScript", category: "Frontend", icon: "", proficiency: "label", displayType: "label", sortOrder: 0 },
  { id: "9", name: "HTML", category: "Frontend", icon: "", proficiency: "label", displayType: "label", sortOrder: 1 },
  { id: "10", name: "CSS", category: "Frontend", icon: "", proficiency: "label", displayType: "label", sortOrder: 2 },
  { id: "11", name: "Git", category: "Tools", icon: "", proficiency: "label", displayType: "label", sortOrder: 0 },
  { id: "12", name: "GitHub", category: "Tools", icon: "", proficiency: "label", displayType: "label", sortOrder: 1 },
];

const FALLBACK_SOCIALS = [
  {
    id: "gh",
    platform: "GitHub",
    url: "https://github.com/seifjo",
    label: "GitHub",
    sortOrder: 0,
    visible: true,
  },
  {
    id: "li",
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/seif-kamel-240572298",
    label: "LinkedIn",
    sortOrder: 1,
    visible: true,
  },
];

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error("Database query failed:", error);
    return fallback;
  }
}

export const getSettings = cache(async () => {
  return safeQuery(async () => {
    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {},
      create: {
        id: "default",
        profileImage: "/profile/seif-kamel.webp",
        ogImage: "/profile/seif-kamel.webp",
        email: "Seifjo223@gmail.com",
        aboutText: DEFAULT_ABOUT,
      },
    });

    return {
      ...settings,
      profileImage: settings.profileImage || "/profile/seif-kamel.webp",
      ogImage: settings.ogImage || settings.profileImage || "/profile/seif-kamel.webp",
      email: settings.email || "Seifjo223@gmail.com",
    };
  }, FALLBACK_SETTINGS);
});

export const getPublishedProjects = cache(async () => {
  noStore();
  return safeQuery(
    () =>
      prisma.project.findMany({
        where: { published: true },
        include: projectInclude,
        orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      }),
    [],
  );
});

export const getFeaturedProject = cache(async () => {
  noStore();
  return safeQuery(
    () =>
      prisma.project.findFirst({
        where: { published: true, featured: true },
        include: projectInclude,
        orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      }),
    null,
  );
});

export async function getProjectBySlug(slug: string, includeDrafts = false) {
  noStore();
  return safeQuery(
    () =>
      prisma.project.findFirst({
        where: includeDrafts ? { slug } : { slug, published: true },
        include: projectInclude,
      }),
    null,
  );
}

export const getSkills = cache(async () => {
  return safeQuery(
    () =>
      prisma.skill.findMany({
        orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
      }),
    FALLBACK_SKILLS,
  );
});

export const getSocialLinks = cache(async () => {
  return safeQuery(async () => {
    const links = await prisma.socialLink.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    });
    return links.length ? links : FALLBACK_SOCIALS;
  }, FALLBACK_SOCIALS);
});

export async function getDashboardStats() {
  return safeQuery(async () => {
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
  }, {
    total: 0,
    published: 0,
    drafts: 0,
    featured: 0,
    screenshots: 0,
    unread: 0,
  });
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
