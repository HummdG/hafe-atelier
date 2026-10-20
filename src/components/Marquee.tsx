import { site } from "@/lib/site";

export function Marquee() {
  const text = site.announcements.join(" · ");
  return (
    <div className="relative z-40 h-8 overflow-hidden bg-ink text-ivory">
      <div className="flex w-max animate-[marquee_30s_linear_infinite] whitespace-nowrap py-2 text-[11px] uppercase leading-4 tracking-[0.2em] hover:[animation-play-state:paused] motion-reduce:animate-none">
        {[0, 1].map((i) => (
          <span key={i} aria-hidden={i === 1 ? true : undefined} className="px-8">
            {text} · {text} · {text} ·
          </span>
        ))}
      </div>
    </div>
  );
}
