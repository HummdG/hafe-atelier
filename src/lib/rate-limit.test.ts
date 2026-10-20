import { describe, it, expect } from "vitest";
import { clientKey, createRateLimiter } from "./rate-limit";

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
  it("prunes keys whose newest hit is older than the window", () => {
    const limit = createRateLimiter({ limit: 5, windowMs: 1000 });
    limit("a", 0);
    limit("b", 0);
    expect(limit.size()).toBe(2);
    limit("c", 5000);
    expect(limit.size()).toBe(1);
  });
  it("caps the number of tracked keys at 10,000, evicting the oldest", () => {
    const limit = createRateLimiter({ limit: 5, windowMs: 600_000 });
    for (let i = 0; i < 10_050; i++) limit(`k${i}`, 1000);
    expect(limit.size()).toBe(10_000);
    // oldest key was evicted, so it gets a fresh allowance
    for (let i = 0; i < 5; i++) limit("k0", 1000);
    expect(limit("k0", 1000)).toBe(false);
  });
});

describe("clientKey", () => {
  const h = (o: Record<string, string>) => new Headers(o);
  it("prefers x-vercel-forwarded-for, then x-real-ip, then last XFF hop, then local", () => {
    expect(clientKey(h({ "x-vercel-forwarded-for": "1.1.1.1", "x-real-ip": "2.2.2.2", "x-forwarded-for": "3.3.3.3" }))).toBe("1.1.1.1");
    expect(clientKey(h({ "x-real-ip": "2.2.2.2", "x-forwarded-for": "3.3.3.3" }))).toBe("2.2.2.2");
    expect(clientKey(h({ "x-forwarded-for": "9.9.9.9, 3.3.3.3 " }))).toBe("3.3.3.3");
    expect(clientKey(h({}))).toBe("local");
  });
  it("is not changed by a spoofed first XFF hop", () => {
    expect(clientKey(h({ "x-forwarded-for": "6.6.6.6, 3.3.3.3" }))).toBe(clientKey(h({ "x-forwarded-for": "7.7.7.7, 3.3.3.3" })));
  });
});
