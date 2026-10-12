import { ObjectId } from "mongodb";

const PLATFORMS = ["linkedin", "facebook", "threads", "instagram", "tiktok", "youtube", "zalo"];

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || "http://localhost:3000";
}

// /api/publish requires `Bearer BLOG_API_BEARER_TOKEN` in production (open in dev).
function jsonHeaders() {
  const token = process.env.BLOG_API_BEARER_TOKEN?.trim();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function publishToPlatform(platform, asset) {
  try {
    const res = await fetch(`${getSiteUrl()}/api/publish`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ platform, asset }),
    });
    return await res.json();
  } catch (err) {
    return { ok: false, platform, status: "failed", error: err.message };
  }
}

async function triggerReindex(slug) {
  // Revalidate Next.js cache + submit sitemap to Google Search Console
  try {
    const res = await fetch(`${getSiteUrl()}/api/blog/refresh`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ slug, reason: "publish-asset" }),
    });
    return await res.json();
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function publishAsset(runtime, { db }, assetId) {
  if (!assetId) throw new Error("Missing required argument --asset-id");

  let queryId;
  try { queryId = new ObjectId(assetId); } catch { queryId = assetId; }

  const collection = db.collection("assets");
  const asset = await collection.findOne({ _id: queryId });

  if (!asset) return { ok: false, message: `Asset not found with id: ${assetId}` };
  if (asset.status === "published") {
    return { ok: true, message: "Asset is already published", data: { asset_id: assetId, url: asset.url } };
  }

  const now = new Date();
  const slug = asset.platform_metadata?.slug
    || asset.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    || assetId;
  const blogUrl = `${getSiteUrl()}/blog/${slug}`;

  // Publish to social platforms
  const results = [];
  const platforms = asset.platform === "multi"
    ? PLATFORMS
    : [asset.platform].filter(p => p !== "blog" && p !== "multi");

  for (const platform of platforms) {
    const result = await publishToPlatform(platform, asset);
    results.push(result);
  }

  // Social publish attempted but every platform failed → keep current status so it can be retried
  if (platforms.length > 0 && !results.some(r => r.ok)) {
    await collection.updateOne({ _id: queryId }, { $set: { publish_results: results, updated_at: now } });
    return {
      ok: false,
      message: `Publish failed on all ${platforms.length} platform(s); asset status left as "${asset.status}"`,
      data: { asset_id: assetId, platform: asset.platform, platforms: results },
    };
  }

  // Update MongoDB
  const updateDoc = { status: "published", published_at: now, url: blogUrl, updated_at: now, publish_results: results };
  await collection.updateOne({ _id: queryId }, { $set: updateDoc });

  // Re-index: revalidate cache + submit sitemap to Google
  const reindex = await triggerReindex(slug);

  return {
    ok: true,
    message: results.some(r => r.ok)
      ? `Asset published to ${results.filter(r => r.ok).length} platform(s)`
      : "Asset published to blog only (no social tokens configured)",
    data: {
      asset_id: assetId,
      platform: asset.platform,
      url: blogUrl,
      status: "published",
      platforms: results,
      reindex,
    },
  };
}

export async function fetchMetrics(runtime, { db }, assetId) {
  if (!assetId) throw new Error("Missing required argument --asset-id");
  let queryId;
  try { queryId = new ObjectId(assetId); } catch { queryId = assetId; }
  const asset = await db.collection("assets").findOne({ _id: queryId });
  if (!asset) return { ok: false, message: `Asset not found with id: ${assetId}` };
  if (asset.status !== "published") return { ok: false, message: `Asset is not published yet (status: ${asset.status})` };
  return {
    ok: true,
    data: {
      asset_id: assetId,
      platform: asset.platform,
      // MOCK: random numbers, not real platform data — do not use for signal mining decisions.
      mock: true,
      metrics: {
        impressions: Math.floor(Math.random() * 1000) + 100,
        clicks: Math.floor(Math.random() * 50) + 1,
      },
    },
  };
}
