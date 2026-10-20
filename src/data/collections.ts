import type { Collection } from "./types";

export const collections: Collection[] = [
  {
    slug: "bridal",
    name: "Shaadi Ke Rang",
    tagline: "Colour, craft and the long walk down the aisle.",
    description:
      "Bridal pieces cut to the bride and embroidered by hand over many weeks. Each begins with a conversation about your day, your family and the colours you carry with you.",
    cover: "/images/placeholders/bridal.svg",
  },
  {
    slug: "formal",
    name: "Raat ki Rani",
    tagline: "Evening silhouettes that hold the room.",
    description:
      "Formal wear for dinners, receptions and long evenings. Fluid fabrics, precise tailoring and embellishment placed with restraint.",
    cover: "/images/placeholders/formal.svg",
  },
  {
    slug: "festive",
    name: "Eid Edit",
    tagline: "Light, luminous pieces for days of celebration.",
    description:
      "Lighter fabrics and softer palettes for Eid and family gatherings. Made to be worn all day and remembered for years.",
    cover: "/images/placeholders/festive.svg",
  },
];

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
