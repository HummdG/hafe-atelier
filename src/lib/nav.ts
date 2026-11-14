export const navLinks = [
  { label: "Discover Hafé", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "Bespoke", href: "/bespoke" },
  { label: "How it works", href: "/how-it-works" },
  { label: "The Atelier", href: "/atelier" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerLinks = [...navLinks, { label: "Privacy", href: "/privacy" }] as const;
