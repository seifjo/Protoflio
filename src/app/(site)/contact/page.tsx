import type { Metadata } from "next";
import { Container, SectionLabel } from "@/components/public/Container";
import { ContactForm } from "@/components/public/ContactForm";
import { getSettings, getSocialLinks } from "@/lib/queries";
import { isBlank } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const [settings, socials] = await Promise.all([
    getSettings(),
    getSocialLinks(),
  ]);
  const visible = socials.filter((item) => !isBlank(item.url));

  return (
    <section className="py-16 sm:py-24">
      <Container className="grid gap-12 lg:grid-cols-2">
        <div>
          <SectionLabel index="01" label="Contact" />
          <h1 className="display mt-4 text-5xl sm:text-6xl">Start a project</h1>
          <p className="mt-5 max-w-md text-lg text-[var(--muted)]">
            {settings.availability
              ? settings.availability
              : "Send a message and I’ll get back to you from the dashboard inbox."}
          </p>
          <div className="mt-10 space-y-3">
            {!isBlank(settings.email) ? (
              <a
                href={`mailto:${settings.email}`}
                className="block text-[var(--accent)]"
              >
                {settings.email}
              </a>
            ) : null}
            {visible.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="block text-[var(--muted)] hover:text-white"
              >
                {item.label || item.platform}
              </a>
            ))}
          </div>
        </div>
        <ContactForm />
      </Container>
    </section>
  );
}
