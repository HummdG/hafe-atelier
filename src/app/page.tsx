import type { Metadata } from "next";
import { FullPageSlider } from "@/components/FullPageSlider";
import { HeroSlide } from "@/components/home/HeroSlide";
import { CollectionSlide } from "@/components/home/CollectionSlide";
import { VisionSlide } from "@/components/home/VisionSlide";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = { title: "Discover Hafe | Hafe Atelier" };

// Inline until Task 5 provides collection data.
const collections = [
  { slug: "bridal", name: "Shaadi Ke Rang", tagline: "Colour, craft and the long walk down the aisle.", image: "/images/placeholders/bridal.svg" },
  { slug: "formal", name: "Raat ki Rani", tagline: "Evening silhouettes that hold the room.", image: "/images/placeholders/formal.svg" },
  { slug: "festive", name: "Eid Edit", tagline: "Light, luminous pieces for days of celebration.", image: "/images/placeholders/festive.svg" },
];

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
            content: <CollectionSlide {...c} />,
          })),
          { id: "vision", label: "Your Vision", content: <VisionSlide /> },
          { id: "contact", label: "Contact", fit: "auto" as const, content: <Footer /> },
        ]}
      />
    </main>
  );
}
