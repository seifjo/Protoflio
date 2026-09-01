import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { getSettings, getSocialLinks } from "@/lib/queries";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, socials] = await Promise.all([
    getSettings(),
    getSocialLinks(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        name={settings.name}
        availability={settings.availability}
        available={settings.available}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter
        name={settings.name}
        footerText={settings.footerText}
        email={settings.email}
        socials={socials}
      />
    </div>
  );
}
