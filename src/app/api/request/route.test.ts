// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/email", () => ({ sendRequestEmail: vi.fn().mockResolvedValue({ sent: true }) }));

import { sendRequestEmail } from "@/lib/email";
import { POST } from "./route";

const cust = {
  changes: "As shown", colours: "", fabric: "", occasion: "",
  sizeMode: "standard", standardSize: "M", unit: "cm", notes: "",
};
const payload = {
  items: [{ id: "a", pieceSlug: null, pieceName: "Bespoke from scratch", customisation: cust }],
  client: { name: "Amina Khan", email: "amina@example.com", whatsapp: "", country: "UK", preferredContact: "email" },
};

let ip = 0;
function req(body: unknown, files: File[] = [], ipAddr = `10.0.0.${++ip}`) {
  const fd = new FormData();
  fd.set("payload", JSON.stringify(body));
  for (const f of files) fd.append("files", f);
  return new Request("http://localhost/api/request", {
    method: "POST", body: fd, headers: { "x-forwarded-for": ipAddr },
  });
}
const jpg = (size = 10, type = "image/jpeg") => new File([new Uint8Array(size)], "a.jpg", { type });

describe("POST /api/request", () => {
  beforeEach(() => {
    vi.mocked(sendRequestEmail).mockReset().mockResolvedValue({ sent: true });
  });

  it("accepts a valid payload with one attachment", async () => {
    const res = await POST(req(payload, [jpg()]));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sendRequestEmail).toHaveBeenCalledTimes(1);
    const [, attachments] = vi.mocked(sendRequestEmail).mock.calls[0];
    expect(attachments).toHaveLength(1);
    expect(attachments[0].filename).toBe("photo-1.jpg");
  });
  it("400 on empty items", async () => {
    const res = await POST(req({ ...payload, items: [] }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("invalid");
  });
  it("400 on malformed payload json", async () => {
    const fd = new FormData();
    fd.set("payload", "{not json");
    const res = await POST(new Request("http://localhost/api/request", { method: "POST", body: fd, headers: { "x-forwarded-for": "9.9.9.9" } }));
    expect(res.status).toBe(400);
  });
  it("413 when files exceed the budget", async () => {
    const res = await POST(req(payload, [jpg(4_000_001)]));
    expect(res.status).toBe(413);
    expect(await res.json()).toEqual({ error: "too_large" });
  });
  it("413 on an oversized content-length before reading the body", async () => {
    const r = req(payload);
    const big = new Request(r, { headers: { "x-forwarded-for": "8.8.8.8", "content-length": "5000000" } });
    const res = await POST(big);
    expect(res.status).toBe(413);
    expect(sendRequestEmail).not.toHaveBeenCalled();
  });
  it("413 for a non-image file", async () => {
    const res = await POST(req(payload, [jpg(10, "text/plain")]));
    expect(res.status).toBe(413);
    expect(sendRequestEmail).not.toHaveBeenCalled();
  });
  it("silently succeeds on honeypot", async () => {
    const res = await POST(req({ ...payload, website: "x" }));
    expect(res.status).toBe(200);
    expect(sendRequestEmail).not.toHaveBeenCalled();
  });
  it("429 on the 6th request from one IP", async () => {
    for (let i = 0; i < 5; i++) expect((await POST(req(payload, [], "7.7.7.7"))).status).toBe(200);
    const res = await POST(req(payload, [], "7.7.7.7"));
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ error: "rate_limited" });
  });
  it("500 when sending throws", async () => {
    vi.mocked(sendRequestEmail).mockRejectedValue(new Error("boom"));
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await POST(req(payload));
    err.mockRestore();
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "send_failed" });
  });
});
