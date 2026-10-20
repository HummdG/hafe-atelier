import { Cormorant_Garamond, Jost } from "next/font/google";

export const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const sans = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});
