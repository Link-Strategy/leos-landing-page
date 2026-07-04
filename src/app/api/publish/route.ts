import { NextRequest, NextResponse } from "next/server";
import { getPostingPublisher, loadPlatformAuthFromEnv, type Platform, type PublishResult } from "@/lib/publishing";

export async function POST(request: NextRequest) {
  try {
    const { platform, asset } = await request.json();
    if (!platform || !asset) {
      return NextResponse.json({ ok: false, error: "Missing platform or asset" }, { status: 400 });
    }

    const auth = loadPlatformAuthFromEnv(platform as Platform);
    if (!auth) {
      return NextResponse.json({ ok: false, error: `${platform.toUpperCase()}_ACCESS_TOKEN not configured` });
    }

    const publisher = getPostingPublisher();
    const result: PublishResult = await publisher.publish(platform as Platform, auth, {
      title: asset.title, body: asset.body, hashtags: asset.hashtags,
    });

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
