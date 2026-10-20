import { describe, it, expect } from "vitest";
import { fitsBudget, isImage } from "./images";

describe("images", () => {
  it("fitsBudget allows exactly 4,000,000 bytes", () => {
    expect(fitsBudget([3_000_000, 1_000_000])).toBe(true);
    expect(fitsBudget([3_000_000, 1_000_001])).toBe(false);
  });
  it("isImage rejects pdf", () => {
    expect(isImage(new File(["x"], "a.pdf", { type: "application/pdf" }))).toBe(false);
    expect(isImage(new File(["x"], "a.jpg", { type: "image/jpeg" }))).toBe(true);
  });
});
