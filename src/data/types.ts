export type CollectionSlug = "bridal" | "formal" | "festive";

export interface Collection {
  slug: CollectionSlug;
  name: string;
  tagline: string;
  description: string;
  cover: string;
}

export interface Piece {
  slug: string;
  name: string;
  collection: CollectionSlug;
  description: string;
  fabric: string;
  craft: string;
  images: [string, ...string[]];
}
