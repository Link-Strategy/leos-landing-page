import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { Receiver } from "@upstash/qstash";
import { getBlogDb } from "@/lib/mongodb";
import { getAssetPlatforms, publishAssetToPlatform, type PostingAsset } from "@/lib/publishing/publish-asset";

/**
 * QStash webhook scheduled by `ls-post schedule-asset` (.agents/tools/ls-post/lib/qstash.mjs).
 * Verifies the `upstash-signature` header, then publishes the asset to its social platform(s).
 */
async function isValidQStashRequest(request: NextRequest, rawBody: string) {
  const currentSigningKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const nextSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY;

  // Dev without signing keys: allow local testing. Production fails closed.
  if (!currentSigningKey || !nextSigningKey) {
    return process.env.NODE_ENV !== "production";
  }

  const signature = request.headers.get("upstash-signature");
  if (!signature) return false;

  try {
    const receiver = new Receiver({ currentSigningKey, nextSigningKey });
    return await receiver.verify({ signature, body: rawBody, clockTolerance: 5 });
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  if (!(await isValidQStashRequest(request, rawBody))) {
    return NextResponse.json({ ok: false, error: "Invalid QStash signature" }, { status: 401 });
  }

  try {
    const assetId = JSON.parse(rawBody)?.payload?.assetId;
    if (!assetId) {
      return NextResponse.json({ ok: false, error: "Missing assetId" }, { status: 400 });
    }

    const db = await getBlogDb();
    const collection = db.collection("assets");

    let queryId: ObjectId | string;
    try { queryId = new ObjectId(assetId); } catch { queryId = assetId; }

    const asset = await collection.findOne({ _id: queryId as ObjectId });
    if (!asset) {
      return NextResponse.json({ ok: false, error: "Asset not found" }, { status: 404 });
    }

    if (asset.status === "published") {
      return NextResponse.json({ ok: true, message: "Already published" });
    }

    const platforms = getAssetPlatforms(asset as PostingAsset);
    const results = [];
    for (const platform of platforms) {
      results.push(await publishAssetToPlatform(platform, asset as PostingAsset));
    }

    const now = new Date();
    const published = results.filter((r) => r.status === "published");

    // Social publish attempted but nothing went out → keep status, record results, let QStash retry (5xx).
    if (platforms.length > 0 && published.length === 0) {
      await collection.updateOne({ _id: queryId as ObjectId }, { $set: { publish_results: results, updated_at: now } });
      return NextResponse.json(
        { ok: false, error: "Publish failed on all platforms", data: { asset_id: assetId, platforms: results } },
        { status: 502 },
      );
    }

    const url = published[0]?.permalink ?? null;
    await collection.updateOne({ _id: queryId as ObjectId }, {
      $set: { status: "published", published_at: now, url, updated_at: now, publish_results: results },
    });

    // Clean up scheduled_post_jobs record
    try { await db.collection("scheduled_post_jobs").deleteOne({ asset_id: queryId }); } catch {}

    return NextResponse.json({
      ok: true,
      message: "Scheduled post published",
      data: { asset_id: assetId, url, status: "published", platforms: results },
    });
  } catch (error) {
    console.error("[scheduled-posts] Failed:", error);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "QStash webhook endpoint ready" });
}
