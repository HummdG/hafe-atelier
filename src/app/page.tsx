import type { Metadata } from "next";
import { FullPageSlider } from "@/components/FullPageSlider";
import { HeroSlide } from "@/components/home/HeroSlide";
import { CollectionSlide } from "@/components/home/CollectionSlide";
import { VisionSlide } from "@/components/home/VisionSlide";
import { collections } from "@/data/collections";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = { title: "Discover Hafe | Hafe Atelier" };

export default function Home() {
  return (
    // -mt-8 pulls the slider up under the 2rem marquee so slides fill the viewport from the top.
    <main className="-mt-8">
      <FullPageSlider
        sections={[
          { id: "discover", label: "Discover Hafe", content: <HeroSlide /> },
          ...collections.map((c) => ({
            id: c.slug,
            label: c.name,
            content: <CollectionSlide slug={c.slug} name={c.name} tagline={c.tagline} image={c.cover} />,
          })),
          { id: "vision", label: "Your Vision", content: <VisionSlide /> },
          { id: "contact", label: "Contact", fit: "auto" as const, content: <Footer /> },
        ]}
      />
    </main>
  );
}
