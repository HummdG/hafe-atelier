import { describe, it, expect } from "vitest";
import { buildWhatsAppMessage, buildWhatsAppUrl, whatsappDigits, WHATSAPP_MAX } from "./whatsapp";
import type { BagItem } from "./request-schema";

const base = {
  changes: "As shown", colours: "", fabric: "", occasion: "",
  sizeMode: "standard" as const, standardSize: "M" as const, unit: "cm" as const, notes: "",
};
const scratch = (changes: string): BagItem => ({
  id: "1", pieceSlug: null, pieceName: "Bespoke from scratch", customisation: { ...base, changes },
});
const client = { name: "Amina", country: "UK" };

describe("whatsapp", () => {
  it("names scratch items", () => {
    const msg = buildWhatsAppMessage([scratch("Red lehnga")], client);
    expect(msg).toContain("Bespoke from scratch");
    expect(msg).toContain("I'm Amina from UK");
    expect(msg).toContain("Full details have been emailed.");
  });
  it("omits the parentheses when changes is empty", () => {
    const msg = buildWhatsAppMessage([scratch("")], client);
    expect(msg).toContain("• Bespoke from scratch");
    expect(msg).not.toContain("()");
  });
  it("strips non-digits from a number", () => {
    expect(whatsappDigits("+44 (7700) 900-123")).toBe("447700900123");
  });
  it("truncates long Urdu+emoji notes without splitting surrogates", () => {
    const long = "یہ ایک لمبا نوٹ ہے 😀".repeat(500);
    const msg = buildWhatsAppMessage([scratch(long)], client);
    expect(Array.from(msg).length).toBeLessThanOrEqual(WHATSAPP_MAX);
    expect(msg.endsWith("…")).toBe(true);
    expect(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/.test(msg)).toBe(false);
    expect(/(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(msg)).toBe(false);
  });
  it("builds a wa.me url that round-trips", () => {
    const msg = "Salaam ☺ سلام\nline";
    const url = buildWhatsAppUrl("+44 7700-900123", msg);
    expect(url.startsWith("https://wa.me/447700900123?text=")).toBe(true);
    expect(decodeURIComponent(new URL(url).searchParams.get("text")!)).toBe(msg);
    expect(new URL(url).searchParams.get("text")).toBe(msg);
  });
});

describe("whatsapp url sanitising", () => {
  it("does not throw on a lone surrogate", () => {
    expect(() => buildWhatsAppUrl("123", "bad \uD83D end")).not.toThrow();
    expect(buildWhatsAppUrl("123", "bad \uD83D end")).toContain("%EF%BF%BD");
  });
});
