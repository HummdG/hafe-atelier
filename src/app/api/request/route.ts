import { NextResponse } from "next/server";
import { sendRequestEmail } from "@/lib/email";
import { MAX_TOTAL_BYTES } from "@/lib/images";
import { createRateLimiter } from "@/lib/rate-limit";
import { requestSchema } from "@/lib/request-schema";

// Node.js runtime is the default (the `runtime` segment config is incompatible with cacheComponents).

const allow = createRateLimiter({ limit: 5, windowMs: 600_000 });
const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (!allow(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid", issues: [] }, { status: 400 });
  }

  let raw: unknown;
  try {
    raw = JSON.parse(String(form.get("payload") ?? ""));
  } catch {
    return NextResponse.json({ error: "invalid", issues: [] }, { status: 400 });
  }
  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid", issues: parsed.error.issues }, { status: 400 });
  }
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const files = form.getAll("files").filter((f): f is File => typeof f !== "string");
  const total = files.reduce((sum, f) => sum + f.size, 0);
  if (total > MAX_TOTAL_BYTES || files.some((f) => !(f.type in EXT))) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }

  try {
    const attachments = await Promise.all(
      files.map(async (f, i) => ({
        filename: `photo-${i + 1}.${EXT[f.type]}`,
        content: Buffer.from(await f.arrayBuffer()),
      })),
    );
    await sendRequestEmail(parsed.data, attachments);
  } catch (err) {
    console.error("Failed to send request email", err);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
