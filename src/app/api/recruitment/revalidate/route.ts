import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { isAuthorizedRequest } from "@/lib/api-auth";
import { CACHE_TAG } from "@/lib/recruitment/queries";

/**
 * POST /api/recruitment/revalidate
 *
 * Revalidates the Next.js cache for job listings.
 * Call this after publishing/closing/updating jobs via the CLI.
 *
 * Header: Authorization: Bearer <REVALIDATE_SECRET> (required in production, open in dev)
 */
export async function POST(request: Request) {
  if (!isAuthorizedRequest(request, process.env.REVALIDATE_SECRET)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag(CACHE_TAG, "max");

  return NextResponse.json({
    ok: true,
    revalidated: true,
    tag: CACHE_TAG,
    timestamp: new Date().toISOString(),
  });
}
