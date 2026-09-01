import Link from "next/link";
import { getDashboardStats } from "@/lib/queries";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Total projects", value: stats.total },
    { label: "Published", value: stats.published },
    { label: "Drafts", value: stats.drafts },
    { label: "Featured", value: stats.featured },
    { label: "Screenshots", value: stats.screenshots },
    { label: "Unread messages", value: stats.unread },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Portfolio overview and quick actions.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="bg-[var(--accent)] px-5 py-2.5 text-xs tracking-wider text-white uppercase"
        >
          + Add project
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="border border-[var(--line)] bg-[#0a0d14] p-5"
          >
            <p className="display text-4xl">{card.value}</p>
            <p className="mono mt-2 text-[10px] tracking-wider text-[var(--dim)] uppercase">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/projects"
          className="border border-[var(--line)] p-5 transition hover:border-[var(--accent)]"
        >
          <p className="font-medium">Manage projects</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Create, edit, publish, and reorder case studies.
          </p>
        </Link>
        <Link
          href="/admin/settings"
          className="border border-[var(--line)] p-5 transition hover:border-[var(--accent)]"
        >
          <p className="font-medium">Site settings</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Update hero, about, contact, and SEO defaults.
          </p>
        </Link>
      </div>
    </div>
  );
}
