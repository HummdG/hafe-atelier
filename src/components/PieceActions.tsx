"use client";

import { useState } from "react";
import Link from "next/link";
import { useBag } from "./RequestBagProvider";
import { CustomiseForm, DEFAULT_CUSTOMISATION, buttonClass, fieldClass, labelClass, secondaryButtonClass } from "./CustomiseForm";
import { STANDARD_SIZES, type Customisation, type StandardSize } from "@/lib/request-schema";

export function PieceActions({ piece }: { piece: { slug: string; name: string } }) {
  const { add } = useBag();
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [size, setSize] = useState<StandardSize | "">("");

  const addToBag = (customisation: Customisation) => {
    add({ pieceSlug: piece.slug, pieceName: piece.name, customisation });
    setAdded(true);
    setOpen(false);
  };

  return (
    <div>
      <div className="mb-5 max-w-xs">
        <label htmlFor="pa-size" className={labelClass}>Size</label>
        <select
          id="pa-size"
          className={fieldClass}
          value={size}
          onChange={(e) => setSize(e.target.value as StandardSize | "")}
        >
          <option value="" disabled>Choose size</option>
          {STANDARD_SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <Link href="/size-guide" className="mt-2 inline-block text-xs underline decoration-gold underline-offset-4">
          Not sure? See the size guide
        </Link>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className={`${buttonClass} disabled:cursor-not-allowed disabled:opacity-50`}
          disabled={!size}
          onClick={() => size && addToBag({ ...DEFAULT_CUSTOMISATION, standardSize: size })}
        >
          Add to request bag
        </button>
        <button type="button" className={secondaryButtonClass} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
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
