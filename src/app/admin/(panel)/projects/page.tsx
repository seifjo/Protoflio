import Link from "next/link";
import { ProjectList } from "@/components/admin/ProjectList";
import { prisma } from "@/lib/prisma";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    include: { images: true },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Drag rows to reorder. Published projects appear on the public site.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="bg-[var(--accent)] px-5 py-2.5 text-xs tracking-wider text-white uppercase"
        >
          + Add project
        </Link>
      </div>
      <ProjectList projects={projects} />
    </div>
  );
}
