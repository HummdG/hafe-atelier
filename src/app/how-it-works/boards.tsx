import type { ReactNode } from "react";
import { Photo } from "@/components/Photo";

const IMG = "/images/how-it-works";

/** Sand frame + parchment panel with an italic board title, as in the design boards. */
export function Board({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-sand p-3 md:p-6">
      <div className="border border-gold/30 bg-parchment px-5 pb-8 pt-7 md:px-7 md:pb-10 md:pt-9">
        <p className="inline-block border-b border-burgundy/40 pb-2 pr-6 font-serif text-3xl italic text-burgundy md:text-4xl">
          {title}
        </p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

/** White-matted photo with optional tape strip, tilt and caption. */
function Polaroid({
  src,
  alt,
  aspect,
  sizes,
  caption,
  tape = true,
  className = "",
}: {
  src: string;
  alt: string;
  aspect: string;
  sizes: string;
  caption?: string;
  tape?: boolean;
  className?: string;
}) {
  return (
    <figure className={`relative bg-[#fffdf8] p-2 pb-3 shadow-[0_8px_18px_-8px_rgba(59,42,32,0.35)] ${className}`}>
      {tape && (
        <span
          aria-hidden
          className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-2 bg-gold/35"
        />
      )}
      <div className={`relative w-full overflow-hidden ${aspect}`}>
        <Photo src={src} alt={alt} sizes={sizes} />
      </div>
      {caption && <figcaption className="mt-2 px-1 text-[11px] text-umber/75 md:text-xs">{caption}</figcaption>}
    </figure>
  );
}

const annotation = "font-serif text-lg italic text-burgundy/90 md:text-xl";

export function InspirationBoard() {
  const notes = ["Boat neckline", "Short sleeves", "Simple kameez", "Subtle border", "Sharara trousers"];
  return (
    <div className="grid grid-cols-[1fr_1fr] gap-4 sm:grid-cols-[1.05fr_0.8fr_1.1fr] sm:gap-3">
      <Polaroid
        src={`${IMG}/inspiration-silhouette.jpg`}
        alt="Ivory sharara set with a sheer embroidered dupatta, worn on pink stone steps"
        aspect="aspect-[400/736]"
        sizes="(min-width: 768px) 16vw, 45vw"
        caption="Silhouette reference · Faiza Saqlain"
        className="row-span-2 -rotate-2 self-start"
      />
      <ul className="col-span-2 row-start-3 flex flex-wrap gap-x-5 gap-y-1 sm:col-span-1 sm:row-span-2 sm:row-start-auto sm:flex-col sm:justify-around sm:gap-0 sm:py-4">
        {notes.map((n) => (
          <li key={n} className={`${annotation} sm:flex sm:items-center sm:gap-2`}>
            {n}
            <span aria-hidden className="hidden h-px flex-1 bg-umber/40 sm:block" />
          </li>
        ))}
      </ul>
      <Polaroid
        src={`${IMG}/inspiration-neckline.jpg`}
        alt="Ivory short-sleeved kameez with a boat neckline and embroidered edging"
        aspect="aspect-[340/300]"
        sizes="(min-width: 768px) 16vw, 45vw"
        caption="Neckline and sleeve reference"
        className="rotate-2"
      />
      <Polaroid
        src={`${IMG}/inspiration-sharara.jpg`}
        alt="Close-up of tiered ivory sharara trousers with an embroidered hem"
        aspect="aspect-[330/220]"
        sizes="(min-width: 768px) 16vw, 45vw"
        caption="Sharara detail · Faiza Saqlain"
        className="rotate-1 self-end"
      />
    </div>
  );
}

export function ConsultationBoard() {
  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden">
      <Photo
        src={`${IMG}/consultation.jpg`}
        alt="Laptop on a linen table showing a video consultation with a designer, beside a tape measure and a brass vase"
        sizes="(min-width: 768px) 45vw, 90vw"
      />
    </div>
  );
}

function VoiceBars() {
  const heights = [6, 12, 9, 16, 10, 18, 8, 14, 11, 17, 7, 13, 9, 15, 6, 10];
  return (
    <span aria-hidden className="flex items-center gap-[3px]">
      {heights.map((h, i) => (
        <span key={i} className="w-[2px] rounded-full bg-whatsapp/70" style={{ height: h }} />
      ))}
    </span>
  );
}

export function ProgressBoard() {
  return (
    <div className="grid gap-5 sm:grid-cols-[1.35fr_1fr] sm:items-start">
      <figure className="bg-[#fffdf8] p-2.5">
        <div className="relative aspect-[1/0.95] w-full overflow-hidden">
          <Photo
            src={`${IMG}/embroidery-frame.jpg`}
            alt="Gold zardozi embroidery in progress on ivory fabric stretched across a wooden frame"
            sizes="(min-width: 768px) 25vw, 90vw"
          />
        </div>
        <figcaption className="mt-2 text-xs text-umber/75 md:text-sm">Ivory embroidery in progress</figcaption>
      </figure>

      <div
        role="img"
        aria-label="WhatsApp conversation: the atelier shares a photo of the border and asks whether to keep it delicate; the client replies that she loves it, followed by a voice note"
        className="overflow-hidden rounded-2xl bg-[#efebe6] shadow-[6px_8px_0_0_rgba(59,42,32,0.08)]"
      >
        <div className="bg-whatsapp px-4 py-3 text-ivory">
          <p className="text-base leading-tight">Hafe Atelier</p>
          <p className="text-[11px] opacity-80">WhatsApp</p>
        </div>
        <div className="space-y-3 p-3 text-[13px] leading-snug text-ink/85">
          <div className="max-w-[88%] rounded-lg bg-[#fffdf8] p-2">
            <div className="relative aspect-[2/1] w-full overflow-hidden">
              <Photo src={`${IMG}/embroidery-frame.jpg`} alt="" sizes="200px" className="object-[50%_70%]" />
            </div>
            <p className="mt-2 px-1">Here&rsquo;s how the border is coming along. Shall we keep it this delicate?</p>
          </div>
          <p className="ml-auto max-w-[80%] rounded-lg bg-[#dde8de] px-3 py-2">Yes, I love it like this!</p>
          <div className="flex max-w-[88%] items-center gap-3 rounded-lg bg-[#fffdf8] px-3 py-3">
            <span aria-hidden className="h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-whatsapp" />
            <VoiceBars />
            <span className="text-[11px] text-umber/70">Voice note</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FinishingTouchesBoard() {
  const items = [
    { src: "accessory-earrings.jpg", label: "Gold earrings", alt: "Gold kundan chandbali earrings with pearl drops" },
    { src: "accessory-bangles.jpg", label: "Gold and ivory bangles", alt: "Stack of gold kundan and ivory bangles" },
    { src: "accessory-potli.jpg", label: "Ivory potli bag", alt: "Ivory drawstring potli bag with gold sequin bands and pearl tassels" },
  ];
  return (
    <div className="grid gap-5 sm:grid-cols-[1fr_1fr] sm:items-center">
      <Polaroid
        src={`${IMG}/finished-look.jpg`}
        alt="Client smiling over her shoulder at an evening wedding in an ivory embroidered outfit with a potli bag"
        aspect="aspect-[4/5]"
        sizes="(min-width: 768px) 22vw, 90vw"
        tape={false}
        className="-rotate-2 pb-6"
      />
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.src} className="flex items-center gap-3 border border-gold/25 bg-[#fffdf8] p-1.5">
            <div className="relative aspect-[3/2] w-[55%] shrink-0 overflow-hidden">
              <Photo src={`${IMG}/${it.src}`} alt={it.alt} sizes="(min-width: 768px) 12vw, 50vw" />
            </div>
            <span className="font-serif text-base leading-tight text-burgundy md:text-lg">{it.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DeliveryBoard() {
  return (
    <figure className="mx-auto max-w-[95%] bg-white p-2 md:p-2.5">
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        <Photo
          src={`${IMG}/delivery-box.jpg`}
          alt="Finished ivory outfit folded in tissue inside a cream presentation box"
          sizes="(min-width: 768px) 40vw, 90vw"
        />
      </div>
    </figure>
  );
}
