import type { Metadata } from "next";
import { RequestView } from "./RequestView";

export const metadata: Metadata = { title: "Your request" };

export default function RequestPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-4xl">Your request</h1>
      <RequestView />
    </main>
  );
}
