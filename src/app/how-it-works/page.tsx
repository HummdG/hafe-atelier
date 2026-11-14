import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Board,
  ConsultationBoard,
  DeliveryBoard,
  FinishingTouchesBoard,
  InspirationBoard,
  ProgressBoard,
} from "./boards";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "From your first inspiration to delivery at your door: how a bespoke Hafé Atelier outfit is designed, made and sent to you.",
};

const steps: { title: string; body: string; board: ReactNode }[] = [
  {
    title: "Share your inspiration",
    body: "Send us your inspiration through our enquiry form and tell us what you love about each reference.",
    board: (
      <Board title="My outfit ideas">
        <InspirationBoard />
      </Board>
    ),
  },
  {
    title: "Video consultation & size guide",
    body: "We’ll talk through your ideas, agree the details of your outfit and show you how to take your measurements at home.",
    board: (
      <Board title="The design consultation">
        <ConsultationBoard />
      </Board>
    ),
  },
  {
    title: "Progress updates & design check‑ins", // non-breaking hyphen keeps "check-ins" on one line
    body: "We’ll send you photos, messages and voice notes on WhatsApp as your outfit takes shape, and talk through design choices with you along the way.",
    board: (
      <Board title="On the embroidery frame">
        <ProgressBoard />
      </Board>
    ),
  },
  {
    title: "Complete your look",
    body: "Our designer will suggest Pakistani jewellery and accessories to suit your outfit. You can add any pieces you love to your order.",
    board: (
      <Board title="The finishing touches">
        <FinishingTouchesBoard />
      </Board>
    ),
  },
  {
    title: "Delivered to your door",
    body: "We’ll carefully pack your finished outfit and send it to your door.",
    board: (
      <Board title="Ready to send">
        <DeliveryBoard />
      </Board>
    ),
  },
];

export default function HowItWorksPage() {
  return (
    <main className="mx-auto max-w-[1400px] px-6 pb-24 pt-32 md:px-12 md:pb-32 md:pt-40">
      <header className="text-center">
        <p className="text-xs font-light uppercase tracking-[0.35em] text-umber/70">How it works</p>
        <h1 className="mt-4 font-serif text-5xl font-light leading-tight text-burgundy md:text-7xl">
          Your vision brought to life
        </h1>
      </header>

      <ol className="mt-16 md:mt-20">
        {steps.map((s, i) => {
          const boardFirst = i % 2 === 0;
          const num = String(i + 1).padStart(2, "0");
          return (
            <li
              key={s.title}
              className="grid items-center gap-10 border-b border-umber/15 py-12 first:pt-0 md:grid-cols-[1.25fr_1fr] md:gap-16 md:py-16 md:[&:nth-child(even)]:grid-cols-[1fr_1.25fr]"
            >
              <div className={boardFirst ? "md:order-2" : ""}>
                <p className="text-sm tracking-[0.3em] text-umber/70" aria-hidden>
                  {num}
                </p>
                <h2 className="mt-2 max-w-[14ch] font-serif text-4xl font-light leading-[1.05] text-burgundy md:text-6xl">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.title}
                </h2>
                <p className="mt-6 max-w-md font-serif text-lg leading-relaxed text-umber md:text-2xl">{s.body}</p>
              </div>
              <div className={boardFirst ? "md:order-1" : ""}>{s.board}</div>
            </li>
          );
        })}
      </ol>

      <div className="mt-12 flex justify-center">
        <Link
          href="/bespoke#brief"
          className="bg-burgundy px-10 py-4 font-serif text-lg text-ivory transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
        >
          Share your inspiration
        </Link>
      </div>
    </main>
  );
}
