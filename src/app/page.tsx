import type { Metadata } from "next";
import { FullPageSlider } from "@/components/FullPageSlider";
import { HeroSlide } from "@/components/home/HeroSlide";
import { CollectionSlide } from "@/components/home/CollectionSlide";
import { VisionSlide } from "@/components/home/VisionSlide";
import { collections } from "@/data/collections";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = { title: { absolute: "Discover Hafé | Hafé Atelier" } };

export default function Home() {
  return (
    <main>
      <FullPageSlider
        sections={[
          { id: "discover", label: "Discover Hafé", content: <HeroSlide /> },
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
