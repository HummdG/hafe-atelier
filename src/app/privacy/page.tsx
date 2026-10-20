import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-serif text-4xl">Privacy</h1>
      <p className="mt-2 text-sm text-ink/60">Placeholder policy, to be reviewed before launch.</p>
      <h2 className="mt-10 font-serif text-2xl">What we collect</h2>
      <p className="mt-2">When you send a request or contact form we collect your name, email, phone or WhatsApp number, country, the details of the piece you describe, your size or measurements, and any photos you attach.</p>
      <h2 className="mt-8 font-serif text-2xl">Why</h2>
      <p className="mt-2">Only to respond to your request, prepare a bespoke quote and make your piece. We do not sell or share your data, and there are no accounts or payments on this site.</p>
      <h2 className="mt-8 font-serif text-2xl">How it is handled</h2>
      <p className="mt-2">Your submission is emailed to the atelier. Your request bag is stored only in your own browser until you send or clear it.</p>
      <h2 className="mt-8 font-serif text-2xl">Deletion</h2>
      <p className="mt-2">To have your information deleted, email <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>.</p>
    </main>
  );
}
