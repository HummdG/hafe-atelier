import type { BagItem, ClientDetails } from "./request-schema";

export const WHATSAPP_MAX = 1500;

export const whatsappDigits = (number: string): string => number.replace(/\D/g, "");

export function buildWhatsAppMessage(
  items: BagItem[],
  client: Pick<ClientDetails, "name" | "country">,
): string {
  const lines = items.map((i) => (i.customisation.changes ? `• ${i.pieceName} (${i.customisation.changes})` : `• ${i.pieceName}`));
  const full = [
    `Salaam Hafé Atelier, I'm ${client.name} from ${client.country}. I'd like to request:`,
    ...lines,
    "Full details have been emailed.",
  ].join("\n");
  const chars = Array.from(full);
  if (chars.length <= WHATSAPP_MAX) return full;
  return chars.slice(0, WHATSAPP_MAX - 1).join("") + "…";
}

export function buildWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${whatsappDigits(number)}?text=${encodeURIComponent(message.toWellFormed())}`;
}
