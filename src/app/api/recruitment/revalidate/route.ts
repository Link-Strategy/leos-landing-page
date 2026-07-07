import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { CACHE_TAG } from "@/lib/recruitment/queries";

/**
 * POST /api/recruitment/revalidate
 *
 * Revalidates the Next.js cache for job listings.
 * Call this after publishing/closing/updating jobs via the CLI.
 *
 * Optional header: Authorization: Bearer <REVALIDATE_SECRET>
 */
export async function POST(request: Request) {
  // Optional secret check — set REVALIDATE_SECRET in .env to enable
  const secret = process.env.REVALIDATE_SECRET;
  if (secret) {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (token !== secret) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  revalidateTag(CACHE_TAG, "max");

  return NextResponse.json({
    ok: true,
    revalidated: true,
    tag: CACHE_TAG,
    timestamp: new Date().toISOString(),
  });
}
