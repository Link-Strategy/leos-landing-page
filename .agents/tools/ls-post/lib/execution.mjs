import { ObjectId } from "mongodb";

export async function publishAsset(runtime, { db }, assetId) {
  if (!assetId) {
    throw new Error("Missing required argument --asset-id");
  }

  let queryId;
  try {
    queryId = new ObjectId(assetId);
  } catch {
    queryId = assetId;
  }

  const collection = db.collection("assets");
  const asset = await collection.findOne({ _id: queryId });

  if (!asset) {
    return {
      ok: false,
      message: `Asset not found with id: ${assetId}`
    };
  }

  if (asset.status === "published") {
    return {
      ok: true,
      message: "Asset is already published",
      data: {
        asset_id: assetId,
        url: asset.url || `https://linkstrategy.io.vn/posts/${assetId}`
      }
    };
  }

  // Mark as published with mock URL
  const platformSlug = asset.platform || "general";
  const now = new Date();
  const articleUrl = `https://linkstrategy.io.vn/posts/${platformSlug}/${assetId}`;

  await collection.updateOne({ _id: queryId }, {
    $set: {
      status: "published",
      published_at: now,
      url: articleUrl,
      updated_at: now,
    }
  });

  return {
    ok: true,
    message: "Asset published successfully (mock)",
    data: {
      asset_id: assetId,
      platform: asset.platform,
      url: articleUrl,
      status: "published"
    }
  };
}

export async function fetchMetrics(runtime, { db }, assetId) {
  if (!assetId) {
    throw new Error("Missing required argument --asset-id");
  }

  let queryId;
  try {
    queryId = new ObjectId(assetId);
  } catch {
    queryId = assetId;
  }

  const asset = await db.collection("assets").findOne({ _id: queryId });
  if (!asset) {
    return {
      ok: false,
      message: `Asset not found with id: ${assetId}`
    };
  }

  if (asset.status !== "published") {
    return {
      ok: false,
      message: `Asset is not published yet (status: ${asset.status})`
    };
  }

  return {
    ok: true,
    data: {
      asset_id: assetId,
      platform: asset.platform,
      metrics: {
        impressions: Math.floor(Math.random() * 1000) + 100,
        clicks: Math.floor(Math.random() * 50) + 1,
      }
    }
  };
}
