// Rate limiting. `createRateLimiter` is in-memory (per server instance) and only used as a fallback;
// `consumeFixedWindow` is the shared, database-backed counter (see rate-limit-db.ts).

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

/** The one collection method the shared counter needs (keeps this module free of the mongodb driver). */
export type CounterCollection = {
  findOneAndUpdate(
    filter: { _id: string },
    update: { $inc: { count: number }; $setOnInsert: { expireAt: Date } },
    options: { upsert: true; returnDocument: "after" },
  ): Promise<{ count?: number } | null>;
};

/**
 * Fixed-window counter shared across serverless instances. One atomic upsert per request:
 * `_id = key:windowStart`, with `expireAt` so a TTL index cleans old windows up.
 */
export async function consumeFixedWindow(
  collection: CounterCollection,
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
  now = Date.now(),
) {
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const doc = await collection.findOneAndUpdate(
    { _id: `${key}:${windowStart}` },
    { $inc: { count: 1 }, $setOnInsert: { expireAt: new Date(windowStart + windowMs * 2) } },
    { upsert: true, returnDocument: "after" },
  );

  const allowed = (doc?.count ?? 1) <= limit;
  return { allowed, retryAfterSec: allowed ? 0 : Math.ceil((windowStart + windowMs - now) / 1000) };
}
