import { SettingsEditor } from "@/components/admin/SettingsEditor";
import { getSettings } from "@/lib/queries";
import { prisma } from "@/lib/prisma";

export default async function AdminSettingsPage() {
  const [settings, socials] = await Promise.all([
    getSettings(),
    prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return <SettingsEditor settings={settings} socials={socials} />;
}
