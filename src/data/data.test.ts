import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { collections, getCollection } from "./collections";
import { pieces, getPiece, getPiecesByCollection } from "./pieces";

const publicFile = (p: string) => path.join(process.cwd(), "public", p);

describe("lookbook data", () => {
  it("every piece belongs to an existing collection", () => {
    for (const p of pieces) expect(getCollection(p.collection)).toBeDefined();
  });
  it("piece slugs are unique", () => {
    expect(new Set(pieces.map((p) => p.slug)).size).toBe(pieces.length);
  });
  it("each collection has 4-6 pieces", () => {
    for (const c of collections) {
      const n = getPiecesByCollection(c.slug).length;
      expect(n).toBeGreaterThanOrEqual(4);
      expect(n).toBeLessThanOrEqual(6);
    }
  });
  it("every image and cover exists under public/", () => {
    for (const c of collections) expect(fs.existsSync(publicFile(c.cover))).toBe(true);
    for (const p of pieces) for (const img of p.images) expect(fs.existsSync(publicFile(img))).toBe(true);
  });
  it("returns undefined for unknown slugs", () => {
    expect(getPiece("nope")).toBeUndefined();
    expect(getCollection("nope")).toBeUndefined();
  });
});
