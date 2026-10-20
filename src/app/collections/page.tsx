import type { Metadata } from "next";
import Link from "next/link";
import { collections } from "@/data/collections";
import { Photo } from "@/components/Photo";

export const metadata: Metadata = {
  title: "Collections",
  description: "Bridal, formal and festive Pakistani occasionwear, made to order.",
};

export default function CollectionsPage() {
  return (
    <main>
      <h1 className="sr-only">Collections</h1>
      <ul className="grid md:grid-cols-3">
        {collections.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/collections/${c.slug}`}
              className="group relative block h-[70svh] overflow-hidden bg-ink text-ivory focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-gold md:h-[calc(100svh-6rem)]"
            >
              <Photo
                src={c.cover}
                alt=""
                sizes="(min-width: 768px) 33vw, 100vw"
                className="transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/10" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-center">
                <h2 className="font-serif text-4xl font-light leading-none">{c.name}</h2>
                <p className="mx-auto mt-3 max-w-xs font-serif italic text-ivory/90">{c.tagline}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
