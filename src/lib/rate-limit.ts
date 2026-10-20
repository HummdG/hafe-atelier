const MAX_KEYS = 10_000;

export function createRateLimiter(opts: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();

  const allow = (key: string, now: number = Date.now()): boolean => {
    // Keys are re-inserted on every hit, so the Map is ordered by newest timestamp: stale keys sit at the front.
    for (const [k, times] of hits) {
      if (now - times[times.length - 1] <= opts.windowMs) break;
      hits.delete(k);
    }
    const recent = (hits.get(key) ?? []).filter((t) => now - t <= opts.windowMs);
    if (recent.length >= opts.limit) {
      hits.set(key, recent); // denied: keep position so the Map stays ordered by newest hit
      return false;
    }
    recent.push(now);
    hits.delete(key);
    hits.set(key, recent);
    while (hits.size > MAX_KEYS) {
      const oldest = hits.keys().next().value as string;
      hits.delete(oldest);
    }
    return true;
  };
  allow.size = () => hits.size;
  return allow;
}

/** Ruling R14: trust platform headers first, then the LAST x-forwarded-for hop (the one our proxy appended). */
export function clientKey(headers: Headers): string {
  const vercel = headers.get("x-vercel-forwarded-for")?.trim();
  if (vercel) return vercel;
  const real = headers.get("x-real-ip")?.trim();
  if (real) return real;
  const hops = headers.get("x-forwarded-for")?.split(",");
  const last = hops?.[hops.length - 1]?.trim();
  return last || "local";
}
