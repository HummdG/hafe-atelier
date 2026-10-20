import Link from "next/link";
import type { Piece } from "@/data/types";
import { Photo } from "./Photo";

const SIZES = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw";

export function PieceCard({ piece }: { piece: Piece }) {
  const [first, second] = piece.images;
  return (
    <Link
      href={`/pieces/${piece.slug}`}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-umber/10">
        <Photo src={first} alt={piece.name} sizes={SIZES} />
        {second && (
          <Photo
            src={second}
            alt=""
            sizes={SIZES}
            className="opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
      </div>
      <h3 className="mt-4 font-serif text-xl font-light leading-tight text-ink">{piece.name}</h3>
      <p className="mt-1 text-xs font-light uppercase tracking-[0.25em] text-ink/60">Price on request</p>
    </Link>
  );
}
