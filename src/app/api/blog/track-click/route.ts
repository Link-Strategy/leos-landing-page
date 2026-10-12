import { NextRequest, NextResponse } from "next/server";
import { recordBlogClickEvent } from "@/lib/blog/repository";
import { validateTrackedDestination } from "@/lib/blog/tracking";
import type { BlogTrackClickPayload } from "@/lib/blog/types";

/**
 * POST /api/blog/track-click — record an article CTA click into `blog_click_events`
 * (the collection the blog repository reads). Only allowlisted CTA destinations are accepted.
 */
export async function POST(request: NextRequest) {
  let payload: Partial<BlogTrackClickPayload>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { articleExternalId, articleSlug } = payload;
  if (
    typeof articleExternalId !== "string" || !articleExternalId ||
    typeof articleSlug !== "string" || !articleSlug ||
    !validateTrackedDestination(payload as BlogTrackClickPayload)
  ) {
    return NextResponse.json({ ok: false, error: "Invalid click payload" }, { status: 400 });
  }

  try {
    const event = payload as BlogTrackClickPayload;
    await recordBlogClickEvent({
      articleExternalId: event.articleExternalId.slice(0, 100),
      articleSlug: event.articleSlug.slice(0, 200),
      ctaId: event.ctaId,
      surface: event.surface,
      destinationKind: event.destinationKind,
      destinationUrl: event.destinationUrl,
      sourcePath: (request.headers.get("referer") || "").slice(0, 500),
      createdAt: new Date(),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[track-click] insert failed:", error);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
