"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/actions/auth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#07080c] text-[var(--text)]">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--line)] bg-[#0a0d14] lg:flex">
          <div className="border-b border-[var(--line)] p-5">
            <p className="mono text-[10px] tracking-[0.2em] text-[var(--accent)] uppercase">
              Portfolio CMS
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">{userName}</p>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-[var(--accent-soft)] text-white"
                      : "text-[var(--muted)] hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="space-y-1 border-t border-[var(--line)] p-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--muted)] hover:text-white"
            >
              <ExternalLink size={16} />
              View site
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-[var(--muted)] hover:text-white"
              >
                <LogOut size={16} />
                Log out
              </button>
            </form>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4 lg:hidden">
            <p className="mono text-[10px] tracking-[0.18em] text-[var(--accent)] uppercase">
              Admin
            </p>
            <form action={logoutAction}>
              <button type="submit" className="text-sm text-[var(--muted)]">
                Log out
              </button>
            </form>
          </header>
          <main className="flex-1 p-5 sm:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
