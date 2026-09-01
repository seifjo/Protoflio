"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/stack", label: "Stack" },
  { href: "/contact", label: "Contact" },
];

type Props = {
  name: string;
  availability: string;
  available: boolean;
};

export function SiteHeader({ name, availability, available }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(7,8,12,0.86)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-[72px] sm:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center border border-[var(--line)] text-[11px] font-medium tracking-[0.18em] text-[var(--accent)]">
            {initials || "SK"}
          </span>
          <span className="mono hidden text-[11px] tracking-[0.22em] text-[var(--muted)] uppercase sm:block">
            {name}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "mono text-[11px] tracking-[0.18em] uppercase transition-colors",
                  active ? "text-white" : "text-[var(--muted)] hover:text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {availability ? (
            <span className="hidden items-center gap-2 border border-[var(--line)] px-3 py-1.5 sm:flex">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  available ? "bg-[var(--ok)] animate-pulse" : "bg-[var(--dim)]",
                )}
              />
              <span className="mono text-[10px] tracking-[0.16em] text-[var(--muted)] uppercase">
                {availability}
              </span>
            </span>
          ) : null}
          <button
            type="button"
            className="grid h-10 w-10 place-items-center border border-[var(--line)] md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 top-16 z-40 bg-[#07080c] md:hidden">
          <nav className="flex flex-col gap-2 px-6 py-10">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="display border-b border-[var(--line)] py-4 text-4xl"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
