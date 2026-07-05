/**
 * Migration script: assets → articles collection
 *
 * Reads all "published" blog posts from the legacy `assets` collection
 * and writes them into the `articles` collection using the new schema.
 *
 * Run: node .agents/tools/ls-post/cli.mjs migrate-assets
 * Or standalone: node scripts/migrate-assets-to-articles.cjs
 */

import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI?.trim();
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME?.trim() || "blogs";

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI");
  process.exit(1);
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function normalizeCategorySlug(category) {
  if (!category) return undefined;
  return category
    .trim().toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || undefined;
}

function getReadingTime(contentMarkdown) {
  const words = (contentMarkdown || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

async function migrate() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB_NAME);

  const assetsCollection = db.collection("assets");
  const articlesCollection = db.collection("articles");

  // Read published blog assets
  const assets = await assetsCollection
    .find({ platform: "blog", status: "published" })
    .sort({ publish_at: -1 })
    .toArray();

  console.log(`Found ${assets.length} published blog assets`);

  let inserted = 0;
  let skipped = 0;

  for (const asset of assets) {
    const meta = asset.platform_metadata || {};
    const slug = meta.slug || generateSlug(asset.title || "");
    const category = meta.category || "General";
    const categorySlug = normalizeCategorySlug(category);
    const title = asset.title || "";
    const body = asset.body || "";

    // Check if already migrated by externalId
    const existing = await articlesCollection.findOne({ slug });
    if (existing) {
      console.log(`  Skipping (already exists): ${title}`);
      skipped++;
      continue;
    }

    const doc = {
      externalId: String(asset._id),
      slug,
      previousSlug: null,
      title,
      excerpt: meta.excerpt || (body ? body.replace(/[#*`_\[\]]/g, "").trim().split("\n")[0].slice(0, 180) : ""),
      contentMarkdown: body,
      status: "published",
      authorName: meta.authorName || "LeOS Team",
      category,
      categorySlug,
      tags: meta.tags || [],
      publishedAt: asset.publish_at || asset.created_at || new Date(),
      updatedAt: asset.updated_at || asset.created_at || new Date(),
      seoTitle: meta.seoTitle || title,
      seoDescription: meta.seoDescription || null,
      coverImage: meta.coverImage || (asset.media?.[0]?.url) || null,
      canonicalUrl: null,
      noindex: meta.noindex === true,
      readingTimeMinutes: getReadingTime(body),
      createdAt: asset.created_at || new Date(),
      searchConsoleSubmission: null,
      lastRefreshRequestedAt: null,
      lastRefreshReason: null,
    };

    await articlesCollection.insertOne(doc);
    console.log(`  Inserted: ${title} (${slug})`);
    inserted++;
  }

  console.log(`\nDone! ${inserted} inserted, ${skipped} skipped`);

  // Show index state
  const indexes = await articlesCollection.indexes();
  console.log(`\nArticles collection has ${indexes.length} indexes`);
  for (const idx of indexes) {
    console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
  }

  await client.close();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
