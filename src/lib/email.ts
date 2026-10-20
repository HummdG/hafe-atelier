import { Resend } from "resend";
import { MEASUREMENT_KEYS, SCRATCH_NAME, type BagItem, type RequestPayload } from "./request-schema";

const FROM = "Hafe Atelier <onboarding@resend.dev>";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

function itemFields(item: BagItem): [string, string][] {
  const c = item.customisation;
  const fields: [string, string][] = [
    ["Piece", item.pieceSlug === null ? SCRATCH_NAME : item.pieceName],
    ["Changes", c.changes],
    ["Colours", c.colours],
    ["Fabric", c.fabric],
    ["Occasion", c.occasion],
    ["Event date", c.eventDate ?? ""],
    ["Size", c.sizeMode === "standard" ? (c.standardSize ?? "") : "Custom measurements"],
  ];
  if (c.sizeMode === "custom") {
    for (const k of MEASUREMENT_KEYS) {
      const v = c.measurements?.[k];
      if (typeof v === "number") fields.push([k, `${v} ${c.unit}`]);
    }
  }
  fields.push(["Notes", c.notes]);
  return fields.filter(([, v]) => v !== "");
}

export function renderRequestEmail(req: RequestPayload): { subject: string; text: string; html: string } {
  const { client, items } = req;
  const n = items.length;
  const subject = `New request — ${client.name} (${n} piece${n === 1 ? "" : "s"})`;
  const clientFields: [string, string][] = [
    ["Name", client.name],
    ["Email", client.email],
    ["WhatsApp", client.whatsapp],
    ["Country", client.country],
    ["Preferred contact", client.preferredContact],
  ];
  const shownClient = clientFields.filter(([, v]) => v !== "");

  const text = [
    "CLIENT",
    ...shownClient.map(([k, v]) => `${k}: ${v}`),
    ...items.flatMap((item, i) => [
      "",
      `ITEM ${i + 1}`,
      ...itemFields(item).map(([k, v]) => `${k}: ${v}`),
    ]),
  ].join("\n");

  const list = (rows: [string, string][]) =>
    `<ul>${rows.map(([k, v]) => `<li><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</li>`).join("")}</ul>`;
  const html = [
    "<h2>Client</h2>",
    list(shownClient),
    ...items.map((item, i) => `<h2>Item ${i + 1}</h2>${list(itemFields(item))}`),
  ].join("");

  return { subject, text, html };
}

export async function sendRequestEmail(
  req: RequestPayload,
  attachments: { filename: string; content: Buffer }[],
): Promise<{ sent: boolean }> {
  const { subject, text, html } = renderRequestEmail(req);
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[request email — RESEND_API_KEY not set]\nSubject: ${subject}\n\n${text}\n\nAttachments: ${attachments.length}`);
    return { sent: false };
  }
  const to = process.env.ATELIER_EMAIL;
  if (!to) throw new Error("ATELIER_EMAIL is not set");
  const { error } = await new Resend(apiKey).emails.send({
    from: FROM,
    to,
    replyTo: req.client.email,
    subject,
    text,
    html,
    attachments,
  });
  if (error) throw new Error(error.message);
  return { sent: true };
}
