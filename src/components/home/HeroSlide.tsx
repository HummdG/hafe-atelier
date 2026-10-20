import Image from "next/image";
import { site } from "@/lib/site";

export function HeroSlide() {
  return (
    <div className="relative h-full overflow-hidden bg-ink text-ivory">
      <Image src={site.heroImage} alt="" fill priority unoptimized className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/55 to-ink/30 md:bg-gradient-to-r md:from-ink/80 md:via-ink/35 md:to-transparent" />
      <div className="relative flex h-full flex-col justify-end px-6 pb-24 md:px-16 md:pb-28">
        <p className="mb-6 text-xs font-light uppercase tracking-[0.35em] text-ivory/80">Discover Hafe</p>
        <h1 className="max-w-[12ch] font-serif text-5xl font-light leading-[1.02] md:text-8xl">
          Bespoke Pakistani <em className="font-light italic">occasionwear</em>
        </h1>
        <p className="mt-6 text-xs font-light uppercase tracking-[0.3em] md:text-sm">for women around the world</p>
      </div>
    </div>
  );
}
