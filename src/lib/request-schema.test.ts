import { describe, it, expect } from "vitest";
import { customisationSchema, requestSchema } from "./request-schema";

const base = {
  changes: "",
  colours: "",
  fabric: "",
  occasion: "",
  unit: "cm" as const,
  notes: "",
};
const full = { shirtLength: 40, chest: 90, waist: 70, hip: 95 };

describe("customisationSchema", () => {
  it("standard size requires standardSize", () => {
    expect(customisationSchema.safeParse({ ...base, sizeMode: "standard" }).success).toBe(false);
    expect(
      customisationSchema.safeParse({ ...base, sizeMode: "standard", standardSize: "M" }).success,
    ).toBe(true);
  });

  it("custom mode rejects zero/negative/missing required measurements", () => {
    const c = (m: object) =>
      customisationSchema.safeParse({ ...base, sizeMode: "custom", measurements: m });
    expect(c({ ...full, chest: 0 }).success).toBe(false);
    expect(c({ ...full, waist: -5 }).success).toBe(false);
    const noHip: Record<string, number> = { ...full };
    delete noHip.hip;
    expect(c(noHip).success).toBe(false);
    const ok = customisationSchema.safeParse({
      ...base,
      unit: "in",
      sizeMode: "custom",
      measurements: full,
    });
    expect(ok.success).toBe(true);
    expect(ok.success && ok.data.unit).toBe("in");
  });
});

describe("requestSchema", () => {
  const client = {
    name: "Aisha Khan",
    email: "a@example.com",
    whatsapp: "",
    country: "UK",
    preferredContact: "email" as const,
  };
  const item = {
    id: "1",
    pieceSlug: null,
    pieceName: "Bespoke from scratch",
    customisation: { ...base, sizeMode: "standard", standardSize: "S" },
  };
  it("request needs at least one item", () => {
    expect(requestSchema.safeParse({ items: [], client }).success).toBe(false);
  });
  it("scratch item with null pieceSlug is valid", () => {
    expect(requestSchema.safeParse({ items: [item], client }).success).toBe(true);
  });
});

describe("length limits", () => {
  it("rejects over-length notes with a friendly message", () => {
    const r = customisationSchema.safeParse({ ...base, sizeMode: "standard", standardSize: "M", notes: "x".repeat(2001) });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].message).toBe("Please keep this under 2000 characters");
  });
  it("accepts notes at the limit", () => {
    expect(customisationSchema.safeParse({ ...base, sizeMode: "standard", standardSize: "M", notes: "x".repeat(2000) }).success).toBe(true);
  });
});
