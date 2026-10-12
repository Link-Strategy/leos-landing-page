// In-memory sliding-window rate limiter. Per server instance only — good enough to blunt form spam;
// switch to a shared store (e.g. Upstash Redis) if the site runs on many instances.

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();

  return {
    check(key: string, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

      if (recent.length >= limit) {
        hits.set(key, recent);
        const retryAfterSec = Math.ceil((recent[0] + windowMs - now) / 1000);
        return { allowed: false, retryAfterSec };
      }

      recent.push(now);
      hits.set(key, recent);

      // Keep memory bounded: drop idle keys once the map grows.
      if (hits.size > 5000) {
        for (const [k, times] of hits) {
          if (times.every((t) => now - t >= windowMs)) hits.delete(k);
        }
      }

      return { allowed: true, retryAfterSec: 0 };
    },
  };
}

export function getClientIp(headers: Headers) {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}
