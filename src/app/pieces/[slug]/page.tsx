import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection } from "@/data/collections";
import { getPiece, pieces } from "@/data/pieces";
import { Gallery } from "@/components/Gallery";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return pieces.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const piece = getPiece(slug);
  if (!piece) return {};
  return { title: piece.name, description: piece.description };
}

export default async function PiecePage({ params }: Props) {
  const { slug } = await params;
  const piece = getPiece(slug);
  if (!piece) notFound();
  const collection = getCollection(piece.collection);

  return (
    <main className="mx-auto grid max-w-[1400px] gap-10 px-4 py-8 md:grid-cols-2 md:gap-16 md:px-8 md:py-14">
      <Gallery images={piece.images} name={piece.name} />
      <div className="md:sticky md:top-28 md:self-start">
        {collection && (
          <Link
            href={`/collections/${collection.slug}`}
            className="text-xs font-light uppercase tracking-[0.25em] text-ink/60 underline-offset-4 hover:underline"
          >
            {collection.name}
          </Link>
        )}
        <h1 className="mt-3 font-serif text-4xl font-light leading-tight md:text-5xl">{piece.name}</h1>
        <p className="mt-3 text-xs font-light uppercase tracking-[0.25em] text-ink/60">Price on request</p>
        <p className="mt-8 max-w-prose font-serif text-lg leading-relaxed">{piece.description}</p>
        <dl className="mt-8 grid max-w-prose grid-cols-[6rem_1fr] gap-y-3 border-t border-ink/15 pt-6 text-sm">
          <dt className="font-light uppercase tracking-[0.2em] text-ink/60">Fabric</dt>
          <dd>{piece.fabric}</dd>
          <dt className="font-light uppercase tracking-[0.2em] text-ink/60">Craft</dt>
          <dd>{piece.craft}</dd>
        </dl>
        <p className="mt-6 font-serif italic text-ink/80">Made to order · {site.leadTime}</p>
        <div id="piece-actions" className="mt-8" />
      </div>
    </main>
  );
}
