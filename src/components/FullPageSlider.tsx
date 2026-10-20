"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type Section = {
  id: string;
  label: string;
  content: ReactNode;
  fit?: "screen" | "auto";
};

export function FullPageSlider({ sections }: { sections: Section[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = sections.findIndex((s) => s.id === entry.target.id);
          if (index < 0) continue;
          setActive(index);
          history.replaceState(null, "", `#${sections[index].id}`);
        }
      },
      { root, threshold: 0.6 },
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  const goTo = useCallback(
    (index: number) => {
      const target = Math.min(Math.max(index, 0), sections.length - 1);
      document.getElementById(sections[target].id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [sections],
  );

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget) return;
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      goTo(active + 1);
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      goTo(active - 1);
    }
  }

  return (
    <>
      <div
        ref={containerRef}
        data-testid="slider"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="h-svh snap-y snap-mandatory overflow-y-auto overscroll-contain scroll-smooth outline-none motion-reduce:snap-none motion-reduce:scroll-auto"
      >
        {sections.map((s) => (
          <section
            key={s.id}
            id={s.id}
            aria-label={s.label}
            className={s.fit === "auto" ? "snap-end" : "h-svh snap-start"}
          >
            {s.content}
          </section>
        ))}
      </div>
      <nav
        aria-label="Slides"
        className="fixed right-3 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-1 mix-blend-difference md:right-5"
      >
        {sections.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Go to ${s.label}`}
            aria-current={i === active ? "true" : undefined}
            onClick={() => goTo(i)}
            className="group grid h-6 w-6 place-items-center focus-visible:outline-none"
          >
            <span className="h-2 w-2 rounded-full border border-white transition-colors group-aria-[current=true]:bg-white group-focus-visible:ring-2 group-focus-visible:ring-white group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-black" />
          </button>
        ))}
      </nav>
    </>
  );
}
