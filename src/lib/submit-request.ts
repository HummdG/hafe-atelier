import type { RequestPayload } from "./request-schema";
import { PHOTOS_TOO_LARGE } from "./images";

const FALLBACK = "Something went wrong — please try again or WhatsApp us";
const MESSAGES: Record<number, string> = {
  411: FALLBACK,
  413: PHOTOS_TOO_LARGE,
  429: "Too many requests — please try again in a few minutes",
};

export async function submitRequest(
  payload: RequestPayload,
  files: File[],
  via: "email" | "whatsapp",
): Promise<void> {
  void via; // the WhatsApp hand-off lives in RequestView (popup-blocker ruling); the server only emails
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
