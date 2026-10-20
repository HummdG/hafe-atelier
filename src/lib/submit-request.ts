import type { RequestPayload } from "./request-schema";

const MESSAGES: Record<number, string> = {
  413: "Photos too large — please attach fewer or smaller images (max 4 MB total)",
  429: "Too many requests — please try again in a few minutes",
};
const FALLBACK = "Something went wrong — please try again or WhatsApp us";

export async function submitRequest(
  payload: RequestPayload,
  files: File[],
  via: "email" | "whatsapp",
): Promise<void> {
  void via;
  const body = new FormData();
  body.set("payload", JSON.stringify(payload));
  for (const f of files) body.append("files", f);
  let res: Response;
  try {
    res = await fetch("/api/request", { method: "POST", body });
  } catch {
    throw new Error(FALLBACK);
  }
  if (!res.ok) throw new Error(MESSAGES[res.status] ?? FALLBACK);
}
