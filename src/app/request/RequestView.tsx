"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBag } from "@/components/RequestBagProvider";
import { CustomiseForm, buttonClass, secondaryButtonClass } from "@/components/CustomiseForm";
import { ClientDetailsForm } from "@/components/ClientDetailsForm";
import { ImagePicker } from "@/components/ImagePicker";
import { Photo } from "@/components/Photo";
import { getPiece } from "@/data/pieces";
import { clientSchema, type BagItem, type ClientDetails, type RequestPayload } from "@/lib/request-schema";
import { site } from "@/lib/site";
import { submitRequest } from "@/lib/submit-request";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

type Via = "email" | "whatsapp";
type Props = {
  onSubmit?: (payload: RequestPayload, files: File[], via: Via) => Promise<void>;
};

const BESPOKE_IMAGE = "/images/placeholders/bespoke.svg";

function summarise(item: BagItem): string {
  const c = item.customisation;
  const size = c.sizeMode === "standard" ? `Size ${c.standardSize}` : `Custom measurements (${c.unit})`;
  return [c.changes, size, c.colours, c.fabric, c.occasion].filter(Boolean).join(" · ");
}

export function RequestView({ onSubmit = submitRequest }: Props) {
  const { items, hydrated, update, remove, clear } = useBag();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientDetails>({
    resolver: zodResolver(clientSchema),
    defaultValues: { name: "", email: "", whatsapp: "", country: "", preferredContact: "email" },
  });

  const send = (via: Via) => (event?: React.BaseSyntheticEvent) => {
    // Popup blockers only allow window.open inside the click, so open it before any await.
    const popup = via === "whatsapp" && site.whatsappNumber ? window.open("", "_blank") : null;
    if (popup) popup.opener = null;
    return handleSubmit(
      async (client) => {
        setSending(true);
        setSendError(null);
        try {
          await onSubmit({ items, client, website }, files, via);
        } catch (err) {
          popup?.close();
          setSendError(err instanceof Error ? err.message : "Something went wrong — please try again or WhatsApp us");
          setSending(false);
          return;
        }
        if (popup) popup.location.href = buildWhatsAppUrl(site.whatsappNumber, buildWhatsAppMessage(items, client));
        clear();
        router.push("/request/sent");
      },
      () => popup?.close(),
    )(event);
  };

  if (!hydrated) return <p className="mt-8 text-ink/60" aria-busy="true">Loading your request…</p>;

  if (items.length === 0) {
    return (
      <div className="mt-8">
        <p className="font-serif text-2xl italic">Your request bag is empty</p>
        <p className="mt-2 text-ink/70">Browse the lookbook or design something of your own.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/collections" className={buttonClass}>Browse collections</Link>
          <Link href="/bespoke" className={secondaryButtonClass}>Start from scratch (bespoke)</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-10">
      <ul className="divide-y divide-ink/15 border-y border-ink/15">
        {items.map((item) => {
          const image = (item.pieceSlug && getPiece(item.pieceSlug)?.images[0]) || BESPOKE_IMAGE;
          return (
            <li key={item.id} className="py-5">
              <div className="flex gap-4">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-ink/5">
                  <Photo src={image} alt="" sizes="80px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-xl">{item.pieceName}</p>
                  <p className="mt-1 text-sm text-ink/70">{summarise(item)}</p>
                  <div className="mt-3 flex gap-5 text-xs uppercase tracking-[0.2em]">
                    <button
                      type="button"
                      className="underline decoration-gold underline-offset-4"
                      aria-expanded={editingId === item.id}
                      onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="underline decoration-gold underline-offset-4"
                      aria-label={`Remove ${item.pieceName}`}
                      onClick={() => remove(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              {editingId === item.id && (
                <div className="mt-6">
                  <CustomiseForm
                    defaultValues={item.customisation}
                    submitLabel="Save changes"
                    onSubmit={(c) => {
                      update(item.id, c);
                      setEditingId(null);
                    }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <form noValidate className="relative space-y-10" onSubmit={send("email")}>
      <ImagePicker files={files} onChange={setFiles} />
      <ClientDetailsForm register={register} errors={errors} />

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this field empty
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <div>
        <div role="status" aria-live="polite">
          {sendError && <p className="mb-4 text-sm text-red-800">{sendError}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="submit" className={buttonClass} disabled={sending}>Send request</button>
          <button type="button" className={secondaryButtonClass} disabled={sending} onClick={send("whatsapp")}>
            Send &amp; continue on WhatsApp
          </button>
        </div>
        <p className="mt-4 text-sm text-ink/70">
          We&apos;ll reply within 48 hours with a consultation and quote. No payment is taken online.
        </p>
      </div>
      </form>
    </div>
  );
}
