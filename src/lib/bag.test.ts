import { describe, it, expect } from "vitest";
import { bagReducer, loadBag, saveBag, BAG_KEY } from "./bag";
import type { BagItem } from "./request-schema";

const mk = (id: string): BagItem => ({
  id,
  pieceSlug: null,
  pieceName: "Bespoke from scratch",
  customisation: {
    changes: "", colours: "", fabric: "", occasion: "",
    sizeMode: "standard", standardSize: "M", unit: "cm", notes: "",
  },
});
const store = (v: string | null) => ({ getItem: () => v });

describe("bagReducer", () => {
  it("add/update/remove/clear are immutable", () => {
    const s0: BagItem[] = [mk("a")];
    const s1 = bagReducer(s0, { type: "add", item: mk("b") });
    expect(s0).toHaveLength(1);
    expect(s1.map((i) => i.id)).toEqual(["a", "b"]);
    const c = { ...mk("a").customisation, notes: "hi" };
    const s2 = bagReducer(s1, { type: "update", id: "a", customisation: c });
    expect(s1[0].customisation.notes).toBe("");
    expect(s2[0].customisation.notes).toBe("hi");
    const s3 = bagReducer(s2, { type: "remove", id: "a" });
    expect(s2).toHaveLength(2);
    expect(s3.map((i) => i.id)).toEqual(["b"]);
    expect(bagReducer(s3, { type: "clear" })).toEqual([]);
    expect(s3).toHaveLength(1);
  });
});

describe("loadBag", () => {
  it("returns [] for missing, corrupt or wrong-shape data", () => {
    expect(loadBag(store(null))).toEqual([]);
    expect(loadBag(store("{not json"))).toEqual([]);
    expect(loadBag(store('{"a":1}'))).toEqual([]);
    expect(loadBag(store(JSON.stringify([{ id: 1 }])))).toEqual([]);
    expect(loadBag({ getItem: () => { throw new Error("blocked"); } })).toEqual([]);
  });
  it("drops invalid items and keeps valid ones", () => {
    const raw = JSON.stringify([mk("a"), { id: "x" }, mk("b")]);
    expect(loadBag(store(raw)).map((i) => i.id)).toEqual(["a", "b"]);
  });
  it("round trips", () => {
    let saved = "";
    saveBag({ setItem: (k, v) => { expect(k).toBe(BAG_KEY); saved = v; } }, [mk("a")]);
    expect(loadBag(store(saved))).toEqual([mk("a")]);
  });
});
