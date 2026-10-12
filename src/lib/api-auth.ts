import type { NextRequest } from "next/server";

/**
 * Bearer-token check for internal write endpoints (publish, sync, refresh, revalidate).
 *
 * Production requires `Authorization: Bearer <secret>` and fails closed when the secret is unset.
 * Dev stays open so local CLIs (ls-post / ls-jobs in .agents/) work without extra setup.
 */
export function isAuthorizedRequest(
  request: NextRequest | Request,
  secret: string | undefined = process.env.BLOG_API_BEARER_TOKEN,
) {
  if (process.env.NODE_ENV !== "production") return true;

  const expected = secret?.trim();
  if (!expected) return false;

  return request.headers.get("authorization") === `Bearer ${expected}`;
}
