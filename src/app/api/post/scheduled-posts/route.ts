import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "";
const DB_NAME = process.env.MONGODB_DB_NAME || "blogs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const assetId = body?.payload?.assetId;

    if (!assetId) {
      return NextResponse.json({ ok: false, error: "Missing assetId" }, { status: 400 });
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection("assets");

    let queryId;
    try { queryId = new ObjectId(assetId); } catch { queryId = assetId; }

    const asset = await collection.findOne({ _id: queryId });
    if (!asset) {
      await client.close();
      return NextResponse.json({ ok: false, error: "Asset not found" }, { status: 404 });
    }

    if (asset.status === "published") {
      await client.close();
      return NextResponse.json({ ok: true, message: "Already published" });
    }

    const now = new Date();
    const articleUrl = `https://linkstrategy.io.vn/posts/${asset.platform || "general"}/${assetId}`;

    await collection.updateOne({ _id: queryId }, {
      $set: { status: "published", published_at: now, url: articleUrl, updated_at: now }
    });

    // Clean up scheduled_jobs record
    try { await db.collection("scheduled_post_jobs").deleteOne({ asset_id: queryId }); } catch {}

    await client.close();

    return NextResponse.json({
      ok: true,
      message: "Scheduled post published",
      data: { asset_id: assetId, url: articleUrl, status: "published" }
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "QStash webhook endpoint ready" });
}
