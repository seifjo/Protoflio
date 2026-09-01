import Link from "next/link";
import { Container } from "./Container";
import { isBlank } from "@/lib/utils";

type Props = {
  name: string;
  footerText: string;
  email: string;
  socials: { platform: string; url: string; label: string }[];
};

export function SiteFooter({ name, footerText, email, socials }: Props) {
  const links = [
    ...socials
      .filter((item) => !isBlank(item.url))
      .map((item) => ({
        href: item.url,
        label: item.label || item.platform,
        external: true,
      })),
    ...(!isBlank(email)
      ? [{ href: `mailto:${email}`, label: "Email", external: false }]
      : []),
  ];

  return (
    <footer className="border-t border-[var(--line)]">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mono text-[11px] tracking-[0.18em] text-[var(--dim)] uppercase">
            {footerText || `${name} — Flutter Developer`}
          </p>
          <p className="mt-3 max-w-md text-sm text-[var(--muted)]">
            Built as a living portfolio — projects are managed from the admin
            dashboard, not hardcoded.
          </p>
        </div>
        <div className="flex flex-wrap gap-5">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="mono text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase transition-colors hover:text-[var(--accent)]"
              {...(link.external
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/work"
            className="mono text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase transition-colors hover:text-white"
          >
            Work
          </Link>
        </div>
      </Container>
    </footer>
  );
}
