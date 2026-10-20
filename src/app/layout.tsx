import type { Metadata } from "next";
import { serif, sans } from "./fonts";
import { site } from "@/lib/site";
import { RequestBagProvider } from "@/components/RequestBagProvider";
import { RouteHeader } from "@/components/Header";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.tagline,
  openGraph: { siteName: site.name, title: site.name, description: site.tagline, type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} antialiased`}>
      <body className="min-h-svh bg-ivory text-ink font-sans">
        <RequestBagProvider>
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
