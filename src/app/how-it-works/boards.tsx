import type { CSSProperties, ReactNode } from "react";
import { Photo } from "@/components/Photo";

const IMG = "/images/how-it-works";

/*
 * Every board is a fixed-ratio canvas (890 × 676, the board size in the design mockups).
 * Children are placed with percentages of that canvas and sized in `cqw` (1cqw = 1% of the
 * board's width), so each board scales as a single picture and keeps the mockup's composition
 * at any width. Coordinates below are measured from the mockup PNGs in board pixels.
 */
const W = 890;
const H = 676;
const x = (px: number) => `${(px / W) * 100}%`;
const y = (px: number) => `${(px / H) * 100}%`;

/** Absolutely placed box using mockup pixel coordinates (relative to the board's top-left). */
function at(left: number, top: number, width?: number, extra: CSSProperties = {}): CSSProperties {
  return { position: "absolute", left: x(left), top: y(top), ...(width ? { width: x(width) } : {}), ...extra };
}

/** Sand frame + parchment panel + italic title, as a scalable canvas. */
export function Board({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="@container relative aspect-[890/676] w-full bg-sand">
      <div className="absolute border border-gold/30 bg-parchment" style={{ inset: `${y(24)} ${x(25)}` }} />
      <p
        className="absolute border-b border-burgundy/40 pb-[1.1cqw] pr-[1.5cqw] font-serif text-[4.4cqw] leading-none italic text-burgundy"
        style={{ left: x(52), top: y(70) }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

/** White-matted photo with optional tape strip, tilt and caption. */
function Polaroid({
  src,
  alt,
  ratio,
  sizes,
  caption,
  tape = true,
  style,
  imgClassName,
  bottomPad = 1.1,
}: {
  src: string;
  alt: string;
  ratio: number;
  sizes: string;
  caption?: string;
  tape?: boolean;
  style: CSSProperties;
  imgClassName?: string;
  bottomPad?: number;
}) {
  return (
    <figure
      className="bg-[#fffdf8] p-[1.1cqw] shadow-[0_0.9cqw_1.8cqw_-0.8cqw_rgba(59,42,32,0.4)]"
      style={{ ...style, paddingBottom: `${bottomPad}cqw` }}
    >
      {tape && (
        <span
          aria-hidden
          className="absolute -top-[1.4cqw] left-1/2 z-10 h-[2.4cqw] w-[9cqw] -translate-x-1/2 bg-[#d9ccb0]/80"
        />
      )}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: ratio }}>
        <Photo src={src} alt={alt} sizes={sizes} className={imgClassName} />
      </div>
      {caption && (
        <figcaption className="mt-[1cqw] whitespace-nowrap text-[1.55cqw] leading-tight text-umber/80">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ---------------------------------------------------------------- 01 */

/** Polaroid geometry in board px; must mirror the Polaroid component's padding and caption sizes. */
type Frame = { left: number; top: number; width: number; ratio: number; rotate: number };
const CQW = W / 100; // board px per cqw
const MAT = 1.1 * CQW; // p-[1.1cqw]
const CAPTION = 1 * CQW + 1.55 * CQW * 1.25; // mt-[1cqw] + one line of text-[1.55cqw] leading-tight

/**
 * Board coordinates of a point inside a polaroid's photo, given as fractions of the photo
 * (fx, fy), accounting for the white mat, the caption and the CSS rotation about the centre.
 */
function pointInPhoto(f: Frame, fx: number, fy: number) {
  const photoW = f.width - 2 * MAT;
  const photoH = photoW / f.ratio;
  const height = MAT + photoH + CAPTION + MAT;
  const cx = f.left + f.width / 2;
  const cy = f.top + height / 2;
  const px = f.left + MAT + fx * photoW - cx;
  const py = f.top + MAT + fy * photoH - cy;
  const a = (f.rotate * Math.PI) / 180;
  return { x: cx + px * Math.cos(a) - py * Math.sin(a), y: cy + px * Math.sin(a) + py * Math.cos(a) };
}

const silhouette: Frame = { left: 50, top: 150, width: 300, ratio: 288 / 437, rotate: -3 };
const neckline: Frame = { left: 566, top: 128, width: 250, ratio: 225 / 192, rotate: 3 };
const sharara: Frame = { left: 566, top: 398, width: 258, ratio: 236 / 167, rotate: 2 };

/**
 * Each note sits at an anchor point; the line starts at the anchor and ends on the feature.
 * `side` is the side of the label the anchor is on, so the label grows away from its line and
 * the line still meets the text if the label's font hits its minimum size on small screens.
 */
const notes: { text: string; anchor: { x: number; y: number }; side: "left" | "right"; target: { x: number; y: number } }[] = [
  { text: "Boat neckline", anchor: { x: 528, y: 170 }, side: "right", target: pointInPhoto(neckline, 0.41, 0.17) },
  { text: "Short sleeves", anchor: { x: 528, y: 228 }, side: "right", target: pointInPhoto(neckline, 0.6, 0.36) },
  { text: "Simple kameez", anchor: { x: 382, y: 300 }, side: "left", target: pointInPhoto(silhouette, 0.4, 0.5) },
  { text: "Subtle border", anchor: { x: 382, y: 372 }, side: "left", target: pointInPhoto(silhouette, 0.66, 0.52) },
  { text: "Sharara trousers", anchor: { x: 532, y: 508 }, side: "right", target: pointInPhoto(sharara, 0.2, 0.55) },
];

const frameStyle = (f: Frame) => at(f.left, f.top, f.width, { rotate: `${f.rotate}deg` });

export function InspirationBoard() {
  return (
    <>
      <Polaroid
        src={`${IMG}/inspiration-silhouette.jpg`}
        alt="Ivory sharara set with a sheer embroidered dupatta, worn on pink stone steps"
        ratio={silhouette.ratio}
        sizes="(min-width: 768px) 20vw, 35vw"
        caption="Silhouette reference · Faiza Saqlain"
        style={frameStyle(silhouette)}
      />
      <Polaroid
        src={`${IMG}/inspiration-neckline.jpg`}
        alt="Ivory short-sleeved kameez with a boat neckline and embroidered edging"
        ratio={neckline.ratio}
        sizes="(min-width: 768px) 16vw, 30vw"
        caption="Neckline and sleeve reference"
        style={frameStyle(neckline)}
      />
      <Polaroid
        src={`${IMG}/inspiration-sharara.jpg`}
        alt="Close-up of tiered ivory sharara trousers with an embroidered hem"
        ratio={sharara.ratio}
        sizes="(min-width: 768px) 16vw, 30vw"
        caption="Sharara detail · Faiza Saqlain"
        style={frameStyle(sharara)}
      />

      {/* Pointer lines: anchor → feature, ending in a ringed dot so they read over the photos. */}
      <svg aria-hidden viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 z-10 h-full w-full">
        {notes.map(({ text, anchor, target }) => {
          const midX = (anchor.x + target.x) / 2;
          const d = `M${anchor.x} ${anchor.y} C${midX} ${anchor.y} ${midX} ${target.y} ${target.x} ${target.y}`;
          return (
            <g key={text}>
              <path d={d} fill="none" stroke="#fffdf8" strokeWidth="3.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <path d={d} fill="none" stroke="#4f1f27" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <circle cx={target.x} cy={target.y} r="6" fill="#4f1f27" stroke="#fffdf8" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            </g>
          );
        })}
      </svg>
      <ul className="contents">
        {notes.map((n) => (
          <li
            key={n.text}
            className="z-10 whitespace-nowrap font-serif text-[max(2.85cqw,11px)] leading-none italic text-burgundy"
            style={at(n.anchor.x + (n.side === "right" ? -8 : 8), n.anchor.y, undefined, {
              translate: n.side === "right" ? "-100% -55%" : "0 -55%",
            })}
          >
            {n.text}
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------------------------------------------------------------- 02 */

export function ConsultationBoard() {
  return (
    <div className="overflow-hidden" style={at(70, 149, 750, { height: y(500) })}>
      <Photo
        src={`${IMG}/consultation.jpg`}
        alt="Laptop on a linen table showing a video consultation with a designer, beside a tape measure and a brass vase"
        sizes="(min-width: 768px) 50vw, 90vw"
      />
    </div>
  );
}

/* ---------------------------------------------------------------- 03 */

function VoiceBars() {
  const heights = [0.9, 1.6, 1.2, 2.2, 1.3, 2.5, 1.1, 1.9, 1.4, 2.3, 1, 1.7, 1.2, 2, 0.9, 1.3];
  return (
    <span aria-hidden className="flex items-center gap-[0.45cqw]">
      {heights.map((h, i) => (
        <span key={i} className="w-[0.25cqw] rounded-full bg-whatsapp/80" style={{ height: `${h}cqw` }} />
      ))}
    </span>
  );
}

export function ProgressBoard() {
  return (
    <>
      <figure className="bg-[#fffdf8] p-[1.1cqw]" style={at(54, 154, 453)}>
        <div className="relative aspect-[432/414] w-full overflow-hidden">
          <Photo
            src={`${IMG}/embroidery-frame.jpg`}
            alt="Gold zardozi embroidery in progress on ivory fabric stretched across a wooden frame"
            sizes="(min-width: 768px) 28vw, 45vw"
          />
        </div>
        <figcaption className="mt-[1cqw] text-[1.8cqw] leading-tight text-umber/80">Ivory embroidery in progress</figcaption>
      </figure>

      <div
        role="img"
        aria-label="WhatsApp conversation: the atelier shares a photo of the border and asks whether to keep it delicate; the client replies that she loves it, followed by a voice note"
        className="flex flex-col overflow-hidden rounded-[2.2cqw] bg-[#efebe6] shadow-[1cqw_1cqw_0_0_#e3d9ca]"
        style={at(520, 144, 311, { height: y(468) })}
      >
        <div className="bg-whatsapp px-[2.1cqw] py-[1.3cqw] text-ivory">
          <p className="text-[2.25cqw] leading-tight">Hafe Atelier</p>
          <p className="text-[1.35cqw] leading-tight opacity-85">WhatsApp</p>
        </div>
        <div className="flex flex-1 flex-col gap-[1.7cqw] p-[1.35cqw] text-ink/85">
          <div className="w-[29cqw] rounded-[1.2cqw] bg-[#fffdf8] p-[1cqw]">
            <div className="relative h-[13.8cqw] w-full overflow-hidden">
              <Photo src={`${IMG}/embroidery-frame.jpg`} alt="" sizes="200px" className="object-[50%_70%]" />
            </div>
            <p className="mt-[1cqw] px-[0.4cqw] text-[1.72cqw] leading-[1.3]">
              Here&rsquo;s how the border is coming along. Shall we keep it this delicate?
            </p>
          </div>
          <p className="ml-auto w-[26.4cqw] rounded-[1.2cqw] bg-[#dde8de] px-[1.6cqw] py-[1.5cqw] text-[1.95cqw] leading-tight">
            Yes, I love it like this!
          </p>
          <div className="flex h-[7.8cqw] w-[29.7cqw] items-center gap-[1.6cqw] rounded-[1.2cqw] bg-[#fffdf8] px-[1.6cqw]">
            <span
              aria-hidden
              className="h-0 w-0 border-y-[1.1cqw] border-l-[1.8cqw] border-y-transparent border-l-whatsapp"
            />
            <VoiceBars />
            <span className="text-[1.35cqw] text-umber/75">Voice note</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- 04 */

const accessories = [
  { src: "accessory-earrings.jpg", label: "Gold earrings", alt: "Gold kundan chandbali earrings with pearl drops", top: 155 },
  { src: "accessory-bangles.jpg", label: "Gold and ivory bangles", alt: "Stack of gold kundan and ivory bangles", top: 308 },
  { src: "accessory-potli.jpg", label: "Ivory potli bag", alt: "Ivory drawstring potli bag with gold sequin bands and pearl tassels", top: 461 },
];

export function FinishingTouchesBoard() {
  return (
    <>
      <Polaroid
        src={`${IMG}/finished-look.jpg`}
        alt="Client smiling over her shoulder at an evening wedding in an ivory embroidered outfit with a potli bag"
        ratio={364 / 434}
        sizes="(min-width: 768px) 25vw, 45vw"
        tape={false}
        bottomPad={3.6}
        imgClassName="object-[50%_35%]"
        style={at(69, 157, 385, { rotate: "-2deg" })}
      />
      <ul className="contents">
        {accessories.map((a) => (
          <li
            key={a.src}
            className="flex items-center gap-[1.2cqw] border border-gold/25 bg-[#fffdf8] p-[0.9cqw]"
            style={at(468, a.top, 359, { height: y(140) })}
          >
            <div className="relative h-full w-[21.6cqw] shrink-0 overflow-hidden">
              <Photo src={`${IMG}/${a.src}`} alt={a.alt} sizes="(min-width: 768px) 14vw, 25vw" />
            </div>
            <span className="font-serif text-[2.15cqw] leading-tight text-burgundy">{a.label}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------------------------------------------------------------- 05 */

export function DeliveryBoard() {
  return (
    <figure className="bg-white p-[1.1cqw]" style={at(98, 144, 696)}>
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        <Photo
          src={`${IMG}/delivery-box.jpg`}
          alt="Finished ivory outfit folded in tissue inside a cream presentation box"
          sizes="(min-width: 768px) 45vw, 90vw"
        />
      </div>
    </figure>
  );
}
