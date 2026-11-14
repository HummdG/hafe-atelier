import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/Photo";
import { site } from "@/lib/site";
import { BespokeBrief } from "./BespokeBrief";

export const metadata: Metadata = {
  title: "Bespoke",
  description: "Start from scratch. Describe the piece you imagine and our atelier will bring it to life.",
};

export default function BespokePage() {
  return (
    <main>
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-umber text-ivory">
        <Photo src="/images/placeholders/bespoke.svg" alt="" sizes="100vw" priority className="opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-16 md:px-12 md:pb-24">
          <p className="text-xs font-light uppercase tracking-[0.3em] text-ivory/80">Bespoke</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl font-light leading-[1.05] md:text-8xl">{site.vision}</h1>
          <a
            href="#brief"
            className="mt-10 inline-block border border-ivory/70 px-8 py-3 text-xs font-light uppercase tracking-[0.25em] transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Start your piece
          </a>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-24 md:px-12 md:py-32">
        <p className="max-w-xl font-serif text-2xl font-light leading-snug md:text-3xl">
          From your first reference to delivery at your door, in five steps.
        </p>
        <Link
          href="/how-it-works"
          className="mt-6 inline-block border-b border-ink/40 pb-1 text-xs font-light uppercase tracking-[0.25em] transition-colors hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          See how it works &rarr;
        </Link>
      </section>

      <section id="brief" className="scroll-mt-24 bg-ivory px-6 pb-28 md:px-12 md:pb-40">
        <div className="mx-auto max-w-3xl border-t border-ink/20 pt-16">
          <h2 className="font-serif text-4xl font-light leading-tight md:text-5xl">Tell us about your piece</h2>
          <p className="mt-4 max-w-prose font-serif text-lg leading-relaxed text-ink/80">
            Describe it in your own words. Nothing is final until we have spoken with you.
          </p>
          <div className="mt-12">
            <BespokeBrief />
          </div>
        </div>
      </section>
    </main>
  );
}
