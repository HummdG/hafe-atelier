import type { Metadata } from "next";
import { Photo } from "@/components/Photo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Atelier",
  description: "The story, the craft and the women we dress around the world.",
};

const chapters = [
  {
    title: "Rooted in Pakistan",
    body: "Hafé began with a simple belief: occasionwear should be made for one woman, not for everyone. Every pattern is drawn, cut and finished in our workshop, by people who have spent their lives with needle and thread.",
    image: "/images/placeholders/bridal.svg",
  },
  {
    title: "The hand, slowly",
    body: `Zardozi, dabka, resham and gota are worked by hand on silk, organza and velvet. A single piece takes ${site.leadTime}, because the embroidery cannot be hurried and we would not want it to be.`,
    image: "/images/placeholders/gul-e-rana-lehenga-1.svg",
  },
  {
    title: "Dressing women everywhere",
    body: "Our clients celebrate in London, Toronto, Dubai and New York. We work with each of them by message and call, take measurements remotely, and send the finished piece to their door.",
    image: "/images/placeholders/festive.svg",
  },
];

export default function AtelierPage() {
  return (
    <main>
      <section className="mx-auto max-w-[1400px] px-6 pb-16 pt-32 md:px-12 md:pb-28 md:pt-48">
        <p className="text-xs font-light uppercase tracking-[0.3em] text-ink/60">The Atelier</p>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl font-light leading-[1.05] md:text-8xl">
          Made slowly, made for you
        </h1>
        <p className="mt-8 max-w-xl font-serif text-xl leading-relaxed text-ink/80">{site.tagline}.</p>
      </section>

      {chapters.map((c, i) => (
        <section
          key={c.title}
          className="mx-auto grid max-w-[1400px] items-center gap-10 px-6 py-12 md:grid-cols-2 md:gap-24 md:px-12 md:py-20"
        >
          <div className={`relative aspect-[4/5] overflow-hidden bg-umber/10 ${i % 2 ? "md:order-2" : ""}`}>
            <Photo src={c.image} alt="" sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
          <div className="max-w-md">
            <h2 className="font-serif text-4xl font-light leading-tight md:text-5xl">{c.title}</h2>
            <p className="mt-6 font-serif text-lg leading-relaxed text-ink/80">{c.body}</p>
          </div>
        </section>
      ))}
      <div className="h-16 md:h-28" />
    </main>
  );
}
