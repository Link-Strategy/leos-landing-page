import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { isAuthorizedRequest } from "@/lib/api-auth";
import { getBlogDb } from "@/lib/mongodb";
import { getPostingPublisher, loadPlatformAuthFromEnv, type Platform } from "@/lib/publishing";
import { SOCIAL_PLATFORMS } from "@/lib/publishing/publish-asset";

type StoredPublishResult = {
  platform?: string;
  ok?: boolean;
  status?: string;
  postId?: string; // saved by ls-post publish-asset (from /api/publish)
  platformPostId?: string; // saved by the QStash scheduled-posts webhook
};

/**
 * POST /api/metrics { assetId } — real engagement metrics for every platform an asset was published to.
 * Used by `ls-post fetch-metrics`. Stores a snapshot on the asset as `metrics` + `metrics_fetched_at`.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let assetId: unknown;
  try {
    assetId = (await request.json())?.assetId;
  } catch {
    assetId = undefined;
  }
  if (typeof assetId !== "string" || !assetId) {
    return NextResponse.json({ ok: false, error: "Missing assetId" }, { status: 400 });
  }

  let queryId: ObjectId | string;
  try { queryId = new ObjectId(assetId); } catch { queryId = assetId; }

  const collection = (await getBlogDb()).collection("assets");
  const asset = await collection.findOne({ _id: queryId as ObjectId });
  if (!asset) {
    return NextResponse.json({ ok: false, error: "Asset not found" }, { status: 404 });
  }

  const published = ((asset.publish_results ?? []) as StoredPublishResult[]).filter(
    (r) => (r.ok || r.status === "published") && SOCIAL_PLATFORMS.includes(r.platform as Platform),
  );

  const publisher = getPostingPublisher();
  const metrics: Record<string, unknown> = {};
  for (const result of published) {
    const platform = result.platform as Platform;
    const postId = result.platformPostId ?? result.postId;
    const auth = loadPlatformAuthFromEnv(platform);
    if (!postId || !auth) {
      metrics[platform] = { metrics: null, error: !postId ? "No post id stored" : "Token not configured" };
      continue;
    }
    metrics[platform] = await publisher.getMetrics(platform, auth, postId);
  }

  const fetchedAt = new Date();
  await collection.updateOne(
    { _id: queryId as ObjectId },
    { $set: { metrics, metrics_fetched_at: fetchedAt } },
  );

  return NextResponse.json({ ok: true, metrics, fetched_at: fetchedAt.toISOString() });
}
