import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections, getCollection } from "@/data/collections";
import { getPiecesByCollection } from "@/data/pieces";
import { PieceCard } from "@/components/PieceCard";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};
  return { title: collection.name, description: collection.description };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();
  const pieces = getPiecesByCollection(collection.slug);

  return (
    <main>
      <header className="bg-umber px-6 py-20 text-center text-ivory md:py-28">
        <h1 className="font-serif text-5xl font-light leading-none md:text-7xl">{collection.name}</h1>
        <p className="mx-auto mt-6 max-w-xl font-serif text-lg leading-relaxed text-ivory/85">
          {collection.description}
        </p>
      </header>
      <ul className="mx-auto grid max-w-[1600px] grid-cols-2 gap-x-3 gap-y-10 px-3 py-12 md:grid-cols-3 md:gap-x-5 md:px-6 xl:grid-cols-4">
        {pieces.map((p) => (
          <li key={p.slug}>
            <PieceCard piece={p} />
          </li>
        ))}
      </ul>
    </main>
  );
}
