import { describe, it, expect } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  it("allows 5 calls then denies the 6th, per key", () => {
    const limit = createRateLimiter({ limit: 5, windowMs: 600_000 });
    for (let i = 0; i < 5; i++) expect(limit("a", 1000)).toBe(true);
    expect(limit("a", 1000)).toBe(false);
    expect(limit("b", 1000)).toBe(true);
  });
  it("allows again after the window passes", () => {
    const limit = createRateLimiter({ limit: 5, windowMs: 600_000 });
    for (let i = 0; i < 6; i++) limit("a", 1000);
    expect(limit("a", 1000 + 600_001)).toBe(true);
  });
});
