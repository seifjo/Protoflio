import type { Metadata } from "next";
import { Syne, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/queries";
import { getSiteUrl, isBlank } from "@/lib/utils";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const plex = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSettings();
    const title = settings.seoTitle || `${settings.name} — ${settings.jobTitle}`;
    const description =
      settings.seoDescription ||
      settings.bio ||
      `${settings.name}, ${settings.jobTitle}.`;
    const siteUrl = getSiteUrl();
    const og =
      settings.ogImage || settings.profileImage || "/profile/seif-kamel.webp";

    return {
      metadataBase: new URL(siteUrl),
      title: {
        default: title,
        template: `%s — ${settings.name}`,
      },
      description,
      icons: {
        icon: isBlank(settings.favicon) ? "/favicon.svg" : settings.favicon,
      },
      openGraph: {
        title,
        description,
        url: siteUrl,
        siteName: settings.name,
        type: "website",
        images: [{ url: og }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [og],
      },
    };
  } catch {
    return {
      title: "Seif Kamel — Flutter Developer",
      description:
        "Portfolio of Seif Kamel, a Flutter developer building mobile and cross-platform applications.",
    };
  }
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} ${plex.variable} h-full antialiased`}
    >
      <body className="grid-bg min-h-full">{children}</body>
    </html>
  );
}
