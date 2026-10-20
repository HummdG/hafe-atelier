"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBag } from "./RequestBagProvider";
import { MenuDrawer } from "./MenuDrawer";
import { TrolleyIcon } from "./TrolleyIcon";

export function Header({ variant }: { variant: "overlay" | "solid" }) {
  const [open, setOpen] = useState(false);
  const { count, hydrated } = useBag();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) menuButtonRef.current?.focus();
    wasOpen.current = open;
  }, [open]);
  const close = useCallback(() => setOpen(false), []);
  const cls =
    variant === "overlay"
      ? "absolute inset-x-0 top-0 z-30 text-ivory"
      : "sticky top-0 z-30 border-b border-ink/10 bg-ivory text-ink";

  return (
    <header className={cls}>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 py-3 md:px-8 md:py-4">
        <button
          ref={menuButtonRef}
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="-ml-2 justify-self-start p-2"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
            <path d="M3 7h18M3 12h18M3 17h18" />
          </svg>
        </button>
        <Link href="/" className="font-serif text-2xl tracking-[0.15em] md:text-4xl">
          HAFE ATELIER
        </Link>
        <Link href="/request" aria-label="Request bag" className="relative -mr-2 justify-self-end p-2">
          <TrolleyIcon />
          {hydrated && count > 0 && (
            <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] leading-none text-ink">
              {count}
            </span>
          )}
        </Link>
      </div>
      {open && <MenuDrawer onClose={close} />}
    </header>
  );
}

/** Picks the header variant from the route: overlay on the home slider, solid elsewhere. */
export function RouteHeader() {
  return <Header variant={usePathname() === "/" ? "overlay" : "solid"} />;
}
