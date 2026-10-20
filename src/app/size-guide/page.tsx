import type { Metadata } from "next";
import { MEASUREMENT_LABELS } from "@/components/MeasurementsFields";

export const metadata: Metadata = {
  title: "Size guide",
  description: "How to take your measurements, and our standard size chart.",
};

type Key = keyof typeof MEASUREMENT_LABELS;

const instructions: Record<Key, string> = {
  shirtLength: "From the highest point of the shoulder, down to where you want the shirt to end.",
  chest: "Around the fullest part of the bust, keeping the tape level and snug.",
  waist: "Around the narrowest part of your natural waist.",
  hip: "Around the fullest part of the hips, about 20 cm below the waist.",
  shoulder: "From one shoulder point to the other, straight across the back.",
  sleeveLength: "From the shoulder point to the wrist, with your arm slightly bent.",
  armhole: "Around the top of the arm where the sleeve will join, at the underarm.",
  trouserLength: "From the waist down to the ankle, or wherever you want the trouser to end.",
  bottom: "Around the opening you want at the hem of the trouser, at the ankle.",
};

const inches = [
  { size: "XS", chest: 32, waist: 26, hip: 35 },
  { size: "S", chest: 34, waist: 28, hip: 37 },
  { size: "M", chest: 36, waist: 30, hip: 39 },
  { size: "L", chest: 39, waist: 33, hip: 42 },
  { size: "XL", chest: 42, waist: 36, hip: 45 },
];
const cm = (n: number) => Math.round(n * 2.54);

export default function SizeGuidePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 pb-28 pt-32 md:px-12 md:pt-48">
      <h1 className="font-serif text-5xl font-light leading-[1.05] md:text-7xl">Size guide</h1>
      <p className="mt-6 max-w-prose font-serif text-lg leading-relaxed text-ink/80">
        Every piece is made to order. Choose a standard size, or give us your own measurements for a closer fit.
      </p>

      <section className="mt-20" aria-labelledby="measure">
        <h2 id="measure" className="font-serif text-3xl font-light md:text-4xl">How to measure</h2>
        <p className="mt-3 text-sm font-light text-ink/70">
          Use a soft tape, wear light clothing and stand naturally. Ask someone to help if you can.
        </p>
        <ul className="mt-8 border-t border-ink/15">
          {(Object.keys(MEASUREMENT_LABELS) as Key[]).map((k) => (
            <li key={k} className="grid gap-1 border-b border-ink/15 py-5 md:grid-cols-[14rem_1fr] md:gap-8">
              <span className="font-serif text-xl">{MEASUREMENT_LABELS[k]}</span>
              <span className="text-sm font-light leading-relaxed text-ink/75">{instructions[k]}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-24" aria-labelledby="chart">
        <h2 id="chart" className="font-serif text-3xl font-light md:text-4xl">Standard sizes</h2>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[30rem] text-left text-sm">
            <caption className="sr-only">Standard sizes, body measurements in centimetres and inches</caption>
            <thead>
              <tr className="border-b border-ink/30 text-xs font-light uppercase tracking-[0.2em] text-ink/60">
                <th scope="col" className="py-3 pr-4 font-light">Size</th>
                <th scope="col" className="py-3 pr-4 font-light">Chest (cm / in)</th>
                <th scope="col" className="py-3 pr-4 font-light">Waist (cm / in)</th>
                <th scope="col" className="py-3 font-light">Hip (cm / in)</th>
              </tr>
            </thead>
            <tbody>
              {inches.map((r) => (
                <tr key={r.size} className="border-b border-ink/15">
                  <th scope="row" className="py-4 pr-4 font-serif text-xl font-normal">{r.size}</th>
                  <td className="py-4 pr-4">{cm(r.chest)} / {r.chest}</td>
                  <td className="py-4 pr-4">{cm(r.waist)} / {r.waist}</td>
                  <td className="py-4">{cm(r.hip)} / {r.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
