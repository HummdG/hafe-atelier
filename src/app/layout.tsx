import type { Metadata } from "next";
import { serif, sans } from "./fonts";
import { site } from "@/lib/site";
import { RequestBagProvider } from "@/components/RequestBagProvider";
import { Marquee } from "@/components/Marquee";
import { RouteHeader } from "@/components/Header";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: site.name,
  description: site.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} antialiased`}>
      <body className="min-h-svh bg-ivory text-ink font-sans">
        <RequestBagProvider>
          <Marquee />
          <RouteHeader />
          {children}
          <ConditionalFooter>
            <Footer />
          </ConditionalFooter>
        </RequestBagProvider>
      </body>
    </html>
  );
}
