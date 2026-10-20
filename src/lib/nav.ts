export const navLinks = [
  { label: "Discover Hafe", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "Bespoke", href: "/bespoke" },
  { label: "The Atelier", href: "/atelier" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerLinks = [...navLinks, { label: "Privacy", href: "/privacy" }] as const;
