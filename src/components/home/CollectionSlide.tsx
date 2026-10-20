import Image from "next/image";
import Link from "next/link";

export function CollectionSlide({
  slug,
  name,
  tagline,
  image,
}: {
  slug: string;
  name: string;
  tagline: string;
  image: string;
}) {
  return (
    <div className="relative h-full overflow-hidden bg-ink text-ivory">
      <Image src={image} alt="" fill unoptimized className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-ink/20" />
      <div className="relative flex h-full flex-col items-center justify-end px-6 pb-24 text-center md:pb-28">
        <h2 className="font-serif text-5xl font-light leading-none md:text-8xl">{name}</h2>
        <p className="mt-5 max-w-md font-serif text-lg italic text-ivory/90 md:text-xl">{tagline}</p>
        <Link
          href={`/collections/${slug}`}
          className="mt-8 border border-ivory px-8 py-3 text-xs font-light uppercase tracking-[0.3em] transition-colors hover:bg-ivory hover:text-ink focus-visible:bg-ivory focus-visible:text-ink focus-visible:outline-none"
        >
          Explore
        </Link>
      </div>
    </div>
  );
}
