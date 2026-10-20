import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[70svh] place-items-center px-6 text-center">
      <div>
        <h1 className="font-serif text-4xl md:text-5xl">This piece is still being stitched</h1>
        <p className="mt-4 text-ink/70">The page you are looking for is not here.</p>
        <Link href="/" className="mt-8 inline-block border-b border-gold pb-1 text-sm uppercase tracking-[0.2em]">
          Return home
        </Link>
      </div>
    </main>
  );
}
