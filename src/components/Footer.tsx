import Link from "next/link";
import { site } from "@/lib/site";
import { footerLinks } from "@/lib/nav";

export async function Footer() {
  "use cache";
  const wa = site.whatsappNumber ? `https://wa.me/${site.whatsappNumber}` : null;
  return (
    <footer className="bg-ink px-6 py-16 text-ivory md:px-12">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl tracking-wide">Stay in touch</h2>
          <p className="mt-3 text-sm text-ivory/70">{site.tagline}</p>
          <ul className="mt-6 flex gap-6 text-sm uppercase tracking-[0.2em]">
            <li><a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gold">Instagram</a></li>
            {wa && <li><a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-gold">WhatsApp</a></li>}
            <li><a href={`mailto:${site.email}`} className="hover:text-gold">Email</a></li>
          </ul>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-3 text-sm uppercase tracking-[0.15em]">
            {footerLinks.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-gold">{l.label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="mt-12 text-center text-xs text-ivory/60">© {new Date().getFullYear()} Hafé Atelier</p>
    </footer>
  );
}
