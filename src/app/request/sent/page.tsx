import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass, secondaryButtonClass } from "@/components/CustomiseForm";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Thank you" };

export default function RequestSentPage() {
  const digits = site.whatsappNumber.replace(/\D/g, "");
  return (
    <main className="mx-auto max-w-3xl bg-ivory px-6 py-24 text-center">
      <h1 className="font-serif text-4xl italic md:text-5xl">Thank you — your vision is with us</h1>
      <p className="mx-auto mt-6 max-w-xl text-ink/70">
        We&apos;ll reply within 48 hours with a consultation and quote. Once confirmed, each piece is made to
        order in {site.leadTime}.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/collections" className={buttonClass}>Continue browsing</Link>
        {digits && (
          <a href={`https://wa.me/${digits}`} className={secondaryButtonClass}>Continue on WhatsApp</a>
        )}
      </div>
    </main>
  );
}
