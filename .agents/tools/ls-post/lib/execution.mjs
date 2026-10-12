import { ObjectId } from "mongodb";
import { assetToBlogPayload, BLOG_SLUG_PATTERN } from "../../../../src/lib/blog/asset-to-article.mjs";

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

async function postJson(path, body) {
  const res = await fetch(`${getSiteUrl()}${path}`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(body),
  });
  let data = null;
  try { data = await res.json(); } catch { /* non-JSON error page */ }
  return { status: res.status, data };
}

/** Blog assets are written into `articles` (the collection the site reads) via /api/blog/articles. */
async function publishBlogArticle(asset) {
  const payload = assetToBlogPayload(asset);
  if (!payload.slug || !BLOG_SLUG_PATTERN.test(payload.slug)) {
    return { ok: false, platform: "blog", error: "platform_metadata.slug is missing or invalid (use lowercase-hyphen-slug)" };
  }
  try {
    const { status, data } = await postJson("/api/blog/articles", payload);
    if (status === 200 && data?.success) {
      return { ok: true, platform: "blog", status: "published", url: data.url, warnings: data.warnings };
    }
    return { ok: false, platform: "blog", status: "failed", error: (data?.errors || [`HTTP ${status}`]).join("; ") };
  } catch (err) {
    return { ok: false, platform: "blog", status: "failed", error: err.message };
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
  const isBlog = asset.platform === "blog";
  const platforms = asset.platform === "multi"
    ? PLATFORMS
    : [asset.platform].filter(p => p !== "blog" && p !== "multi");

  const results = [];
  if (isBlog) {
    results.push(await publishBlogArticle(asset));
  }
  for (const platform of platforms) {
    results.push(await publishToPlatform(platform, asset));
  }

  // Nothing went out → keep current status so it can be retried
  if (results.length > 0 && !results.some(r => r.ok)) {
    await collection.updateOne({ _id: queryId }, { $set: { publish_results: results, updated_at: now } });
    return {
      ok: false,
      message: `Publish failed on all ${results.length} target(s); asset status left as "${asset.status}"`,
      data: { asset_id: assetId, platform: asset.platform, platforms: results },
    };
  }

  const url = results.find(r => r.ok && r.url)?.url || results.find(r => r.ok && r.permalink)?.permalink || null;
  await collection.updateOne(
    { _id: queryId },
    { $set: { status: "published", published_at: now, url, updated_at: now, publish_results: results } },
  );

  // Blog: submit sitemap to Google Search Console (cache was already revalidated by /api/blog/articles)
  const reindex = isBlog ? await triggerReindex(asset.platform_metadata.slug) : undefined;

  return {
    ok: true,
    message: `Asset published to ${results.filter(r => r.ok).length}/${results.length} target(s)`,
    data: { asset_id: assetId, platform: asset.platform, url, status: "published", platforms: results, reindex },
  };
}

export async function fetchMetrics(runtime, { db }, assetId) {
  if (!assetId) throw new Error("Missing required argument --asset-id");
  let queryId;
  try { queryId = new ObjectId(assetId); } catch { queryId = assetId; }
  const asset = await db.collection("assets").findOne({ _id: queryId });
  if (!asset) return { ok: false, message: `Asset not found with id: ${assetId}` };
  if (asset.status !== "published") return { ok: false, message: `Asset is not published yet (status: ${asset.status})` };

  // Real numbers from each platform via the app (it holds the platform tokens).
  const { status, data } = await postJson("/api/metrics", { assetId: String(assetId) });
  if (status !== 200 || !data?.ok) {
    return { ok: false, message: `Fetching metrics failed: ${data?.error || `HTTP ${status}`}` };
  }
  return { ok: true, data: { asset_id: assetId, platform: asset.platform, metrics: data.metrics, fetched_at: data.fetched_at } };
}
