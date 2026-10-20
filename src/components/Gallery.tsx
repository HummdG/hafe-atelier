"use client";

import { useState } from "react";
import { Photo } from "./Photo";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col gap-3 md:flex-row-reverse">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-umber/10">
        <Photo
          src={images[active]}
          alt={`${name}, view ${active + 1}`}
          sizes="(min-width: 768px) 50vw, 100vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <ul className="flex gap-3 md:flex-col" aria-label={`${name} views`}>
          {images.map((src, i) => (
            <li key={src} className="w-20 md:w-24">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show view ${i + 1}`}
                aria-current={i === active}
                className={`relative block aspect-[3/4] w-full overflow-hidden border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                  i === active ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Photo src={src} alt="" sizes="96px" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
