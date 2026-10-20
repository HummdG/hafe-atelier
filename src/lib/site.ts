const leadTime = "6–8 weeks" as const;

export const site = {
  name: "Hafé Atelier",
  tagline: "Bespoke Pakistani occasionwear for women around the world",
  vision: "Your Vision, brought to life",
  leadTime,
  email: "hello@hafeatelier.com",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  instagram: "https://instagram.com/hafeatelier",
  heroImage: "/images/placeholders/hero.svg",
};
