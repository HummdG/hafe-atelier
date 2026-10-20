import { site } from "@/lib/site";

export default function Home() {
  return (
    <main className="grid min-h-svh place-items-center">
      <h1 className="font-serif text-4xl">{site.name}</h1>
    </main>
  );
}
