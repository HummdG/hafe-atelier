"use client";

import { useState } from "react";
import Link from "next/link";
import { useBag } from "./RequestBagProvider";
import { CustomiseForm, DEFAULT_CUSTOMISATION } from "./CustomiseForm";
import type { Customisation } from "@/lib/request-schema";

const primary =
  "border border-ink bg-ink px-8 py-3 text-xs font-light uppercase tracking-[0.25em] text-ivory transition-colors hover:bg-umber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory";
const secondary =
  "border border-ink/40 px-8 py-3 text-xs font-light uppercase tracking-[0.25em] text-ink transition-colors hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory";

export function PieceActions({ piece }: { piece: { slug: string; name: string } }) {
  const { add } = useBag();
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const addToBag = (customisation: Customisation) => {
    add({ pieceSlug: piece.slug, pieceName: piece.name, customisation });
    setAdded(true);
    setOpen(false);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button type="button" className={primary} onClick={() => addToBag(DEFAULT_CUSTOMISATION)}>
          Add to request bag
        </button>
        <button type="button" className={secondary} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          Make this mine
        </button>
      </div>
      <div role="status" aria-live="polite">
        {added && (
          <p className="mt-5 font-serif text-lg italic">
            Added to your request bag{" "}
            <Link href="/request" className="text-sm not-italic uppercase tracking-[0.2em] underline decoration-gold underline-offset-4">
              View your request
            </Link>
          </p>
        )}
      </div>
      {open && (
        <div className="mt-8 border-t border-ink/15 pt-8">
          <CustomiseForm submitLabel="Add my version to the bag" onSubmit={addToBag} />
        </div>
      )}
    </div>
  );
}
