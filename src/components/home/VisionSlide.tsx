import Link from "next/link";
import { site } from "@/lib/site";

export function VisionSlide() {
  return (
    <div className="flex h-full flex-col justify-center bg-ivory px-6 pt-24 text-ink md:px-16">
      <h2 className="max-w-[14ch] font-serif text-5xl font-light leading-[1.02] md:text-8xl">{site.vision}</h2>
      <p className="mt-8 max-w-md font-serif text-lg leading-relaxed text-umber md:text-xl">
        Tell us the occasion, the colours you imagine and the way you want to feel. We design and stitch the piece
        around you, with fittings and updates on WhatsApp along the way.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/bespoke"
          className="bg-ink px-8 py-3 text-xs font-light uppercase tracking-[0.3em] text-ivory transition-colors hover:bg-umber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Start your piece
        </Link>
        <Link
          href="/bespoke#how"
          className="border border-ink px-8 py-3 text-xs font-light uppercase tracking-[0.3em] transition-colors hover:bg-ink hover:text-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          How it works
        </Link>
      </div>
      <p className="mt-8 text-xs font-light uppercase tracking-[0.3em] text-umber">
        Made to order in {site.leadTime}
      </p>
    </div>
  );
}
