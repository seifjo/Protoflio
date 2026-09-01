"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectInclude } from "@/lib/queries";
import { uniqueSlug } from "@/lib/slug";
import { deleteStoredFile } from "@/lib/storage";

export type ProjectInput = {
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  status: string;
  date: string;
  role: string;
  featured: boolean;
  published: boolean;
  overview: string;
  problem: string;
  solution: string;
  challenges: string;
  technicalImplementation: string;
  results: string;
  futureImprovements: string;
  isPrivate: boolean;
  showQrCode: boolean;
  qrMode: string;
  qrCustomUrl: string;
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  technologies: string[];
  features: { title: string; description: string }[];
  liveDemoUrl: string;
  githubUrl: string;
  videoUrl: string;
  apkFileUrl: string;
  apkExternalUrl: string;
  apkVersion: string;
  apkFileSize: string;
  apkReleaseDate: string;
  pdfFileUrl: string;
  pdfExternalUrl: string;
};

function parseDate(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function upsertLink(
  projectId: string,
  kind: string,
  url: string,
  label = "",
) {
  const trimmed = url.trim();
  const existing = await prisma.projectLink.findFirst({
    where: { projectId, kind },
  });
  if (!trimmed) {
    if (existing) await prisma.projectLink.delete({ where: { id: existing.id } });
    return;
  }
  if (existing) {
    await prisma.projectLink.update({
      where: { id: existing.id },
      data: { url: trimmed, label },
    });
  } else {
    await prisma.projectLink.create({
      data: { projectId, kind, url: trimmed, label },
    });
  }
}

async function upsertFile(
  projectId: string,
  kind: string,
  data: {
    fileUrl: string;
    externalUrl: string;
    fileName: string;
    version: string;
    fileSize: string;
    releaseDate: string;
  },
) {
  const hasFile = data.fileUrl.trim() || data.externalUrl.trim();
  const existing = await prisma.projectFile.findFirst({
    where: { projectId, kind },
  });
  if (!hasFile) {
    if (existing) {
      if (existing.fileUrl) await deleteStoredFile(existing.fileUrl);
      await prisma.projectFile.delete({ where: { id: existing.id } });
    }
    return;
  }
  const payload = {
    fileUrl: data.fileUrl.trim(),
    externalUrl: data.externalUrl.trim(),
    fileName: data.fileName.trim(),
    version: data.version.trim(),
    fileSize: data.fileSize.trim(),
    releaseDate: parseDate(data.releaseDate),
  };
  if (existing) {
    if (existing.fileUrl && existing.fileUrl !== payload.fileUrl) {
      await deleteStoredFile(existing.fileUrl);
    }
    await prisma.projectFile.update({ where: { id: existing.id }, data: payload });
  } else {
    await prisma.projectFile.create({ data: { projectId, kind, ...payload } });
  }
}

async function upsertVideo(projectId: string, url: string) {
  const trimmed = url.trim();
  const existing = await prisma.projectVideo.findFirst({
    where: { projectId },
    orderBy: { sortOrder: "asc" },
  });
  if (!trimmed) {
    if (existing) await prisma.projectVideo.delete({ where: { id: existing.id } });
    return;
  }
  if (existing) {
    await prisma.projectVideo.update({
      where: { id: existing.id },
      data: { url: trimmed },
    });
  } else {
    await prisma.projectVideo.create({ data: { projectId, url: trimmed } });
  }
}

export async function saveProjectAction(input: ProjectInput) {
  await requireAdmin();

  const title = input.title.trim();
  if (!title) return { error: "Project title is required." };

  const allSlugs = await prisma.project.findMany({ select: { id: true, slug: true } });
  const slug =
    input.slug.trim() ||
    uniqueSlug(
      title,
      allSlugs.filter((p) => p.id !== input.id).map((p) => p.slug),
    );

  const base = {
    title,
    slug,
    shortDescription: input.shortDescription,
    fullDescription: input.fullDescription,
    category: input.category,
    status: input.status,
    date: parseDate(input.date),
    role: input.role,
    featured: input.featured,
    published: input.published,
    overview: input.overview,
    problem: input.problem,
    solution: input.solution,
    challenges: input.challenges,
    technicalImplementation: input.technicalImplementation,
    results: input.results,
    futureImprovements: input.futureImprovements,
    isPrivate: input.isPrivate,
    showQrCode: input.showQrCode,
    qrMode: input.qrMode,
    qrCustomUrl: input.qrCustomUrl,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    ogTitle: input.ogTitle,
    ogDescription: input.ogDescription,
    ogImage: input.ogImage,
    canonicalUrl: input.canonicalUrl,
  };

  let projectId = input.id;

  if (projectId) {
    await prisma.project.update({ where: { id: projectId }, data: base });
  } else {
    const maxOrder = await prisma.project.aggregate({ _max: { sortOrder: true } });
    const created = await prisma.project.create({
      data: { ...base, sortOrder: (maxOrder._max.sortOrder ?? -1) + 1 },
    });
    projectId = created.id;
  }

  await prisma.projectTechnology.deleteMany({ where: { projectId } });
  const techs = input.technologies.map((t) => t.trim()).filter(Boolean);
  if (techs.length) {
    await prisma.projectTechnology.createMany({
      data: techs.map((name, sortOrder) => ({ projectId, name, sortOrder })),
    });
  }

  await prisma.projectFeature.deleteMany({ where: { projectId } });
  const features = input.features.filter((f) => f.title.trim());
  if (features.length) {
    await prisma.projectFeature.createMany({
      data: features.map((f, sortOrder) => ({
        projectId,
        title: f.title.trim(),
        description: f.description,
        sortOrder,
      })),
    });
  }

  await upsertLink(projectId, "live_demo", input.liveDemoUrl, "Live Demo");
  await upsertLink(projectId, "github", input.githubUrl, "GitHub");
  await upsertVideo(projectId, input.videoUrl);
  await upsertFile(projectId, "apk", {
    fileUrl: input.apkFileUrl,
    externalUrl: input.apkExternalUrl,
    fileName: "",
    version: input.apkVersion,
    fileSize: input.apkFileSize,
    releaseDate: input.apkReleaseDate,
  });
  await upsertFile(projectId, "pdf", {
    fileUrl: input.pdfFileUrl,
    externalUrl: input.pdfExternalUrl,
    fileName: "",
    version: "",
    fileSize: "",
    releaseDate: "",
  });

  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/admin/projects");
  revalidatePath("/sitemap.xml");

  return { ok: true, id: projectId, slug };
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: true, files: true },
  });
  if (!project) return { error: "Project not found." };

  for (const image of project.images) await deleteStoredFile(image.url);
  for (const file of project.files) {
    if (file.fileUrl) await deleteStoredFile(file.fileUrl);
  }
  await prisma.project.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin/projects");
  return { ok: true };
}

export async function duplicateProjectAction(id: string) {
  await requireAdmin();
  const source = await prisma.project.findUnique({
    where: { id },
    include: projectInclude,
  });
  if (!source) return { error: "Project not found." };

  const slugs = (await prisma.project.findMany({ select: { slug: true } })).map(
    (p) => p.slug,
  );
  const slug = uniqueSlug(`${source.slug}-copy`, slugs);
  const maxOrder = await prisma.project.aggregate({ _max: { sortOrder: true } });

  const copy = await prisma.project.create({
    data: {
      title: `${source.title} (Copy)`,
      slug,
      shortDescription: source.shortDescription,
      fullDescription: source.fullDescription,
      category: source.category,
      status: "draft",
      date: source.date,
      role: source.role,
      featured: false,
      published: false,
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      overview: source.overview,
      problem: source.problem,
      solution: source.solution,
      challenges: source.challenges,
      technicalImplementation: source.technicalImplementation,
      results: source.results,
      futureImprovements: source.futureImprovements,
      isPrivate: source.isPrivate,
      showQrCode: source.showQrCode,
      qrMode: source.qrMode,
      qrCustomUrl: source.qrCustomUrl,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      ogTitle: source.ogTitle,
      ogDescription: source.ogDescription,
      ogImage: source.ogImage,
      canonicalUrl: "",
      technologies: {
        create: source.technologies.map((t) => ({
          name: t.name,
          sortOrder: t.sortOrder,
        })),
      },
      features: {
        create: source.features.map((f) => ({
          title: f.title,
          description: f.description,
          sortOrder: f.sortOrder,
        })),
      },
      links: {
        create: source.links.map((l) => ({
          kind: l.kind,
          label: l.label,
          url: l.url,
          sortOrder: l.sortOrder,
        })),
      },
      videos: {
        create: source.videos.map((v) => ({
          url: v.url,
          title: v.title,
          sortOrder: v.sortOrder,
        })),
      },
    },
  });

  revalidatePath("/admin/projects");
  redirect(`/admin/projects/${copy.id}`);
}

export async function togglePublishAction(id: string) {
  await requireAdmin();
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return { error: "Not found." };
  await prisma.project.update({
    where: { id },
    data: { published: !project.published },
  });
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin/projects");
  revalidatePath("/sitemap.xml");
  if (project.slug) {
    revalidatePath(`/projects/${project.slug}`);
  }
  return { ok: true, published: !project.published };
}

export async function reorderProjectsAction(ids: string[]) {
  await requireAdmin();
  await Promise.all(
    ids.map((id, sortOrder) =>
      prisma.project.update({ where: { id }, data: { sortOrder } }),
    ),
  );
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin/projects");
  return { ok: true };
}

export async function addProjectImageAction(
  projectId: string,
  data: { url: string; width?: number | null; height?: number | null },
) {
  await requireAdmin();
  const count = await prisma.projectImage.count({ where: { projectId } });
  const image = await prisma.projectImage.create({
    data: {
      projectId,
      url: data.url,
      width: data.width ?? null,
      height: data.height ?? null,
      sortOrder: count,
      isCover: count === 0,
    },
  });
  revalidatePath("/admin/projects");
  return { ok: true, image };
}

export async function updateProjectImageAction(
  id: string,
  data: { caption?: string; altText?: string; isCover?: boolean },
) {
  await requireAdmin();
  const image = await prisma.projectImage.findUnique({ where: { id } });
  if (!image) return { error: "Image not found." };

  if (data.isCover) {
    await prisma.projectImage.updateMany({
      where: { projectId: image.projectId },
      data: { isCover: false },
    });
  }

  const updated = await prisma.projectImage.update({
    where: { id },
    data: {
      caption: data.caption ?? image.caption,
      altText: data.altText ?? image.altText,
      isCover: data.isCover ?? image.isCover,
    },
  });

  revalidatePath("/admin/projects");
  return { ok: true, image: updated };
}

export async function deleteProjectImageAction(id: string) {
  await requireAdmin();
  const image = await prisma.projectImage.findUnique({ where: { id } });
  if (!image) return { error: "Not found." };
  await deleteStoredFile(image.url);
  await prisma.projectImage.delete({ where: { id } });

  if (image.isCover) {
    const next = await prisma.projectImage.findFirst({
      where: { projectId: image.projectId },
      orderBy: { sortOrder: "asc" },
    });
    if (next) {
      await prisma.projectImage.update({
        where: { id: next.id },
        data: { isCover: true },
      });
    }
  }

  revalidatePath("/admin/projects");
  return { ok: true };
}

export async function reorderProjectImagesAction(
  projectId: string,
  ids: string[],
) {
  await requireAdmin();
  await Promise.all(
    ids.map((id, sortOrder) =>
      prisma.projectImage.update({ where: { id }, data: { sortOrder } }),
    ),
  );
  revalidatePath("/admin/projects");
  return { ok: true };
}
