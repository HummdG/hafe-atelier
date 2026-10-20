import { describe, it, expect, vi, afterEach } from "vitest";
import { renderRequestEmail, sendRequestEmail } from "./email";
import type { RequestPayload } from "./request-schema";

const base = {
  changes: "As shown", colours: "", fabric: "", occasion: "",
  sizeMode: "standard" as const, standardSize: "M" as const, unit: "cm" as const, notes: "",
};
const client = { name: "Amina Khan", email: "amina@example.com", whatsapp: "", country: "UK", preferredContact: "email" as const };
const req = (items: RequestPayload["items"]): RequestPayload => ({ items, client });

describe("renderRequestEmail", () => {
  it("renders measurements with unit and scratch items", () => {
    const { subject, text } = renderRequestEmail(
      req([
        {
          id: "1", pieceSlug: "noor", pieceName: "Noor",
          customisation: { ...base, sizeMode: "custom", unit: "in", measurements: { chest: 36, waist: 30, hip: 38, shirtLength: 40 } },
        },
        { id: "2", pieceSlug: null, pieceName: "Bespoke from scratch", customisation: base },
      ]),
    );
    expect(subject).toBe("New request — Amina Khan (2 pieces)");
    expect(text).toContain("chest: 36 in");
    expect(text).toContain("Bespoke from scratch");
  });
  it("uses singular piece", () => {
    const { subject } = renderRequestEmail(req([{ id: "1", pieceSlug: null, pieceName: "x", customisation: base }]));
    expect(subject).toBe("New request — Amina Khan (1 piece)");
  });
  it("escapes html in user text", () => {
    const { html } = renderRequestEmail(
      req([{ id: "1", pieceSlug: null, pieceName: "x", customisation: { ...base, notes: "<script>alert(1)</script>" } }]),
    );
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});

describe("sendRequestEmail", () => {
  afterEach(() => vi.unstubAllEnvs());
  it("logs and returns sent:false without an API key", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const r = await sendRequestEmail(req([{ id: "1", pieceSlug: null, pieceName: "x", customisation: base }]), []);
    expect(r).toEqual({ sent: false });
    expect(log).toHaveBeenCalled();
    log.mockRestore();
  });
});
