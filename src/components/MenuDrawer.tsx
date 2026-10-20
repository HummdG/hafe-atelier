"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { navLinks } from "@/lib/nav";

export function MenuDrawer({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  // Portalled to <body> so the sticky header's stacking context cannot trap it beneath other page chrome.
  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} aria-hidden="true" />
      <nav
        aria-label="Main menu"
        className="absolute inset-y-0 left-0 flex h-svh w-[min(85vw,22rem)] flex-col bg-ivory p-8 text-ink"
      >
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close menu" className="mb-10 self-start text-sm uppercase tracking-[0.2em]">
          Close ✕
        </button>
        <ul className="flex flex-col gap-6">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={onClose} className="font-serif text-2xl tracking-wide hover:text-gold">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>,
    document.body,
  );
}
