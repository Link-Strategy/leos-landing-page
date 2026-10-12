import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedRequest } from "@/lib/api-auth";
import type { Platform } from "@/lib/publishing";
import { publishAssetToPlatform } from "@/lib/publishing/publish-asset";

// Posting uses the company's social tokens: production requires `Bearer BLOG_API_BEARER_TOKEN`.
export async function POST(request: NextRequest) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { platform, asset } = await request.json();
    if (!platform || !asset) {
      return NextResponse.json({ ok: false, error: "Missing platform or asset" }, { status: 400 });
    }

    const result = await publishAssetToPlatform(platform as Platform, asset);

    return NextResponse.json({
      ok: result.status === "published",
      platform: result.platform,
      status: result.status,
      postId: result.platformPostId,
      permalink: result.permalink,
      error: result.error,
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
