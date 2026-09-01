import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/queries";
import { getSiteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  const projects = await getPublishedProjects();
  const staticRoutes = ["", "/work", "/about", "/stack", "/contact"].map(
    (path) => ({
      url: `${site}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  return [
    ...staticRoutes,
    ...projects.map((project) => ({
      url: `${site}/projects/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.9 : 0.7,
    })),
  ];
}
