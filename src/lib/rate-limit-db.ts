import { createHash } from "node:crypto";
import { getBlogDb } from "./mongodb";
import { consumeFixedWindow, createRateLimiter, type CounterCollection } from "./rate-limit";

const fallbackLimiters = new Map<string, ReturnType<typeof createRateLimiter>>();
let ttlIndexReady: Promise<unknown> | null = null;

/** Only a short hash of the IP is stored, and only until its window expires (TTL index). */
function hashIp(ip: string) {
  return createHash("sha256").update(ip).digest("hex").slice(0, 24);
}

/**
 * Shared rate limit (MongoDB `rate_limits`). If the database is unavailable it falls back to a
 * per-instance in-memory limiter so form spam protection never disappears and submissions never break.
 */
export async function checkRateLimit(scope: string, ip: string, options: { limit: number; windowMs: number }) {
  try {
    const collection = (await getBlogDb()).collection("rate_limits");
    ttlIndexReady ??= collection.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 }).catch(() => undefined);
    await ttlIndexReady;
    return await consumeFixedWindow(collection as unknown as CounterCollection, `${scope}:${hashIp(ip)}`, options);
  } catch (error) {
    console.warn("[rate-limit] database unavailable, using in-memory fallback:", (error as Error).message);
    let limiter = fallbackLimiters.get(scope);
    if (!limiter) {
      limiter = createRateLimiter(options);
      fallbackLimiters.set(scope, limiter);
    }
    return limiter.check(ip);
  }
}
