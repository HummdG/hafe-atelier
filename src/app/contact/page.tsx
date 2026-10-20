import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Speak with the Hafe Atelier team on WhatsApp, email or Instagram.",
};

const linkClass =
  "font-serif text-3xl font-light underline decoration-ink/20 underline-offset-8 transition-colors hover:decoration-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold md:text-4xl";

export default function ContactPage() {
  const digits = site.whatsappNumber.replace(/\D/g, "");
  const whatsapp = digits ? `https://wa.me/${digits}` : null;
  const handle = `@${site.instagram.split("/").filter(Boolean).pop() ?? ""}`;
  const channels = [
    ...(whatsapp ? [{ label: "WhatsApp", text: "Message us", href: whatsapp, external: true }] : []),
    { label: "Email", text: site.email, href: `mailto:${site.email}`, external: false },
    { label: "Instagram", text: handle, href: site.instagram, external: true },
  ];
  return (
    <main className="mx-auto max-w-4xl px-6 pb-28 pt-32 md:px-12 md:pt-48">
      <h1 className="font-serif text-5xl font-light leading-[1.05] md:text-7xl">Contact</h1>
      <p className="mt-6 max-w-prose font-serif text-lg leading-relaxed text-ink/80">
        We reply to every message within one to two working days, usually sooner on WhatsApp.
      </p>
      <dl className="mt-16 border-t border-ink/15">
        {channels.map((c) => (
          <div key={c.label} className="grid gap-2 border-b border-ink/15 py-8 md:grid-cols-[10rem_1fr] md:items-baseline">
            <dt className="text-xs font-light uppercase tracking-[0.25em] text-ink/60">{c.label}</dt>
            <dd>
              <a
                href={c.href}
                className={linkClass}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {c.text}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
