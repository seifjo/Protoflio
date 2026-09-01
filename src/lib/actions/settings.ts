"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function saveSettingsAction(data: Record<string, string | boolean>) {
  await requireAdmin();

  await prisma.siteSettings.update({
    where: { id: "default" },
    data: {
      name: String(data.name || ""),
      jobTitle: String(data.jobTitle || ""),
      bio: String(data.bio || ""),
      availability: String(data.availability || ""),
      available: Boolean(data.available),
      email: String(data.email || ""),
      heroLabel: String(data.heroLabel || ""),
      heroName: String(data.heroName || ""),
      heroRole: String(data.heroRole || ""),
      heroSubtitle: String(data.heroSubtitle || ""),
      heroMeta: String(data.heroMeta || ""),
      aboutText: String(data.aboutText || ""),
      footerText: String(data.footerText || ""),
      profileImage: String(data.profileImage || ""),
      favicon: String(data.favicon || ""),
      seoTitle: String(data.seoTitle || ""),
      seoDescription: String(data.seoDescription || ""),
      ogImage: String(data.ogImage || ""),
    },
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  return { ok: true };
}

export async function saveSkillAction(data: {
  id?: string;
  name: string;
  category: string;
  icon: string;
  sortOrder: number;
}) {
  await requireAdmin();
  const name = data.name.trim();
  if (!name) return { error: "Skill name required." };

  if (data.id) {
    await prisma.skill.update({
      where: { id: data.id },
      data: {
        name,
        category: data.category,
        icon: data.icon,
        sortOrder: data.sortOrder,
      },
    });
  } else {
    const max = await prisma.skill.aggregate({ _max: { sortOrder: true } });
    await prisma.skill.create({
      data: {
        name,
        category: data.category,
        icon: data.icon,
        sortOrder: data.sortOrder ?? (max._max.sortOrder ?? 0) + 1,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/stack");
  revalidatePath("/admin/skills");
  return { ok: true };
}

export async function deleteSkillAction(id: string) {
  await requireAdmin();
  await prisma.skill.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/stack");
  revalidatePath("/admin/skills");
  return { ok: true };
}

export async function saveSocialLinkAction(data: {
  id?: string;
  platform: string;
  url: string;
  label: string;
  visible: boolean;
  sortOrder: number;
}) {
  await requireAdmin();
  const url = data.url.trim();
  if (!url) return { error: "URL required." };

  if (data.id) {
    await prisma.socialLink.update({
      where: { id: data.id },
      data: {
        platform: data.platform,
        url,
        label: data.label,
        visible: data.visible,
        sortOrder: data.sortOrder,
      },
    });
  } else {
    const max = await prisma.socialLink.aggregate({ _max: { sortOrder: true } });
    await prisma.socialLink.create({
      data: {
        platform: data.platform,
        url,
        label: data.label,
        visible: data.visible,
        sortOrder: data.sortOrder ?? (max._max.sortOrder ?? 0) + 1,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
  return { ok: true };
}

export async function deleteSocialLinkAction(id: string) {
  await requireAdmin();
  await prisma.socialLink.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { ok: true };
}

export async function markMessageReadAction(id: string, read: boolean) {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath("/admin/messages");
  return { ok: true };
}

export async function deleteMessageAction(id: string) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
  return { ok: true };
}
