import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { FullPageSlider } from "@/components/FullPageSlider";
import { Footer } from "@/components/Footer";
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

type Step = { id: string; title: string; body: string; boardTitle: string; board: ReactNode };

const steps: Step[] = [
  {
    id: "inspiration",
    title: "Share your inspiration",
    body: "Send us your inspiration through our enquiry form and tell us what you love about each reference.",
    boardTitle: "My outfit ideas",
    board: <InspirationBoard />,
  },
  {
    id: "consultation",
    title: "Video consultation & size guide",
    body: "We’ll talk through your ideas, agree the details of your outfit and show you how to take your measurements at home.",
    boardTitle: "The design consultation",
    board: <ConsultationBoard />,
  },
  {
    id: "progress",
    title: "Progress updates & design check‑ins", // non-breaking hyphen keeps "check-ins" on one line
    body: "We’ll send you photos, messages and voice notes on WhatsApp as your outfit takes shape, and talk through design choices with you along the way.",
    boardTitle: "On the embroidery frame",
    board: <ProgressBoard />,
  },
  {
    id: "complete-your-look",
    title: "Complete your look",
    body: "Our designer will suggest Pakistani jewellery and accessories to suit your outfit. You can add any pieces you love to your order.",
    boardTitle: "The finishing touches",
    board: <FinishingTouchesBoard />,
  },
  {
    id: "delivery",
    title: "Delivered to your door",
    body: "We’ll carefully pack your finished outfit and send it to your door.",
    boardTitle: "Ready to send",
    board: <DeliveryBoard />,
  },
];

/**
 * One full-screen slide per step. The board's width is capped by the viewport height so the
 * whole slide fits on screen; the last slide reserves extra room for the call to action.
 */
function StepSlide({ step, index, last }: { step: Step; index: number; last: boolean }) {
  const boardFirst = index % 2 === 0;
  const Heading = index === 0 ? "h1" : "p";
  return (
    <div className="flex h-full flex-col bg-ivory px-6 pb-6 pt-20 md:px-12 md:pb-8 md:pt-24">
      <header className="text-center" aria-hidden={index === 0 ? undefined : true}>
        <p className="text-[10px] font-light uppercase tracking-[0.35em] text-umber/70 md:text-xs">How it works</p>
        <Heading className="mt-1 font-serif text-3xl font-light leading-tight text-burgundy md:mt-2 md:text-6xl">
          Your vision brought to life
        </Heading>
      </header>

      <div className="mx-auto mt-5 flex w-full max-w-[1400px] flex-1 flex-col justify-center gap-5 md:mt-8 md:flex-row md:items-center md:gap-14">
        <div className={`md:flex-1 ${boardFirst ? "md:order-2" : ""}`}>
          <p className="text-xs tracking-[0.3em] text-umber/70 md:text-sm" aria-hidden>
            {String(index + 1).padStart(2, "0")}
          </p>
          <h2 className="mt-1 max-w-[16ch] font-serif text-3xl font-light leading-[1.05] text-burgundy md:mt-2 md:text-5xl lg:text-6xl">
            <span className="sr-only">Step {index + 1}: </span>
            {step.title}
          </h2>
          <p className="mt-3 max-w-md font-serif text-base leading-relaxed text-umber md:mt-6 md:text-xl lg:text-2xl">
            {step.body}
          </p>
        </div>
        <div
          className={`mx-auto shrink-0 md:mx-0 ${boardFirst ? "md:order-1" : ""} ${
            last
              ? "w-[min(100%,calc((100svh-32rem)*1.3166))] md:w-[min(56vw,calc((100svh-22rem)*1.3166))]"
              : "w-[min(100%,calc((100svh-27rem)*1.3166))] md:w-[min(56vw,calc((100svh-17rem)*1.3166))]"
          }`}
        >
          <Board title={step.boardTitle}>{step.board}</Board>
        </div>
      </div>

      {last && (
        <div className="mt-5 flex justify-center border-t border-umber/15 pt-5 md:mt-6 md:pt-6">
          <Link
            href="/bespoke#brief"
            className="bg-burgundy px-8 py-3 font-serif text-base text-ivory transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy md:px-10 md:py-4 md:text-lg"
          >
            Share your inspiration
          </Link>
        </div>
      )}
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <main>
      <FullPageSlider
        sections={[
          ...steps.map((step, i) => ({
            id: step.id,
            label: step.title.replace("‑", "-"),
            content: <StepSlide step={step} index={i} last={i === steps.length - 1} />,
          })),
          { id: "contact", label: "Contact", fit: "auto" as const, content: <Footer /> },
        ]}
      />
    </main>
  );
}
