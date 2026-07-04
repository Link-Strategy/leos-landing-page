import { Collection, MongoClient, MongoServerError, ServerApiVersion } from "mongodb";

import { resolvePrimaryTopicSlug } from "./topics";
import { normalizeCategorySlug } from "./validation";
import type {
  BlogArticle,
  BlogArticleDocument,
  BlogCategorySummary,
  BlogClickEventDocument,
  BlogSearchConsoleSubmissionDocument,
} from "./types";

const ARTICLES_COLLECTION = "articles";
const BLOG_CLICK_EVENTS_COLLECTION = "blog_click_events";

declare global {
  var __brandopsMongoClientPromise__: Promise<MongoClient> | undefined;
}

let articleIndexesReady: Promise<void> | null = null;
let clickEventIndexesReady: Promise<void> | null = null;

function getMongoUri() {
  return process.env.MONGODB_URI?.trim() || "";
}

function getMongoDbName() {
  return process.env.MONGODB_DB_NAME?.trim() || "";
}

export function isBlogStorageConfigured() {
  return Boolean(getMongoUri() && getMongoDbName());
}

async function getMongoClient() {
  const uri = getMongoUri();
  if (!uri) {
    throw new Error("Missing MONGODB_URI");
  }

  if (!global.__brandopsMongoClientPromise__) {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    global.__brandopsMongoClientPromise__ = client.connect();
  }

  return global.__brandopsMongoClientPromise__;
}

async function getDb() {
  const dbName = getMongoDbName();
  if (!dbName) {
    throw new Error("Missing MONGODB_DB_NAME");
  }

  const client = await getMongoClient();
  return client.db(dbName);
}

function toBlogArticle(doc: BlogArticleDocument): BlogArticle {
  const primaryTopicSlug = resolvePrimaryTopicSlug(doc.categorySlug);

  return {
    externalId: doc.externalId,
    slug: doc.slug,
    previousSlug: doc.previousSlug ?? null,
    title: doc.title,
    excerpt: doc.excerpt,
    contentMarkdown: doc.contentMarkdown,
    status: doc.status,
    authorName: doc.authorName,
    category: doc.category,
    categorySlug: doc.categorySlug,
    tags: doc.tags,
    publishedAt: doc.publishedAt?.toISOString() ?? null,
    updatedAt: doc.updatedAt.toISOString(),
    seoTitle: doc.seoTitle,
    seoDescription: doc.seoDescription,
    coverImage: doc.coverImage,
    canonicalUrl: doc.canonicalUrl,
    noindex: doc.noindex,
    readingTimeMinutes: doc.readingTimeMinutes,
    createdAt: doc.createdAt.toISOString(),
    searchConsoleSubmission: doc.searchConsoleSubmission
      ? {
          status: doc.searchConsoleSubmission.status,
          attemptedAt: doc.searchConsoleSubmission.attemptedAt?.toISOString() ?? null,
          message: doc.searchConsoleSubmission.message,
          sitemapUrl: doc.searchConsoleSubmission.sitemapUrl,
        }
      : undefined,
    lastRefreshRequestedAt: doc.lastRefreshRequestedAt?.toISOString() ?? null,
    lastRefreshReason: doc.lastRefreshReason,
    primaryTopicSlug,
  };
}

async function ensureIndexes(collection: Collection<BlogArticleDocument>) {
  if (!articleIndexesReady) {
    articleIndexesReady = Promise.all([
      collection.createIndex({ slug: 1 }, { unique: true, name: "slug_unique" }),
      collection.createIndex(
        { externalId: 1 },
        { unique: true, name: "externalId_unique" },
      ),
      collection.createIndex(
        { previousSlug: 1 },
        {
          unique: true,
          name: "previousSlug_unique",
          partialFilterExpression: {
            previousSlug: {
              $type: "string",
            },
          },
        },
      ),
      collection.createIndex(
        { status: 1, noindex: 1, publishedAt: -1 },
        { name: "public_listing" },
      ),
      collection.createIndex(
        { status: 1, noindex: 1, categorySlug: 1, publishedAt: -1 },
        { name: "public_listing_by_category" },
      ),
    ]).then(() => undefined);
  }

  await articleIndexesReady;
}

async function ensureClickEventIndexes(collection: Collection<BlogClickEventDocument>) {
  if (!clickEventIndexesReady) {
    clickEventIndexesReady = Promise.all([
      collection.createIndex({ createdAt: -1 }, { name: "createdAt_desc" }),
      collection.createIndex(
        { articleExternalId: 1, createdAt: -1 },
        { name: "articleExternalId_createdAt_desc" },
      ),
      collection.createIndex({ ctaId: 1, createdAt: -1 }, { name: "ctaId_createdAt_desc" }),
      collection.createIndex(
        { destinationKind: 1, createdAt: -1 },
        { name: "destinationKind_createdAt_desc" },
      ),
    ]).then(() => undefined);
  }

  await clickEventIndexesReady;
}

async function getArticlesCollection(): Promise<Collection<BlogArticleDocument>> {
  const db = await getDb();
  const collection = db.collection<BlogArticleDocument>(ARTICLES_COLLECTION);
  await ensureIndexes(collection);
  return collection;
}

async function getClickEventsCollection(): Promise<Collection<BlogClickEventDocument>> {
  const db = await getDb();
  const collection = db.collection<BlogClickEventDocument>(BLOG_CLICK_EVENTS_COLLECTION);
  await ensureClickEventIndexes(collection);
  return collection;
}

function normalizeBlogArticleDocument(doc: BlogArticleDocument): BlogArticleDocument {
  return {
    ...doc,
    previousSlug: doc.previousSlug ?? null,
    categorySlug: normalizeCategorySlug(doc.category),
  };
}

export async function upsertBlogArticle(doc: BlogArticleDocument) {
  const collection = await getArticlesCollection();
  const normalizedDoc = normalizeBlogArticleDocument(doc);
  const { createdAt, ...updateFields } = normalizedDoc;

  const existing = await collection.findOne({ externalId: normalizedDoc.externalId });
  const conflict = await collection.findOne({
    slug: normalizedDoc.slug,
    externalId: { $ne: normalizedDoc.externalId },
  });
  if (conflict && (!existing || existing.slug !== normalizedDoc.slug)) {
    throw new Error("SLUG_CONFLICT");
  }

  if (normalizedDoc.previousSlug) {
    const previousSlugConflict = await collection.findOne({
      previousSlug: normalizedDoc.previousSlug,
      externalId: { $ne: normalizedDoc.externalId },
    });
    if (previousSlugConflict) {
      throw new Error("PREVIOUS_SLUG_CONFLICT");
    }

    const currentSlugConflict = await collection.findOne({
      slug: normalizedDoc.previousSlug,
      externalId: { $ne: normalizedDoc.externalId },
    });
    if (currentSlugConflict) {
      throw new Error("PREVIOUS_SLUG_CONFLICT");
    }
  }

  try {
    await collection.updateOne(
      { externalId: normalizedDoc.externalId },
      {
        $set: updateFields,
        $setOnInsert: {
          createdAt,
        },
      },
      { upsert: true },
    );
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      if (error.message.includes("previousSlug_unique")) {
        throw new Error("PREVIOUS_SLUG_CONFLICT");
      }
      throw new Error("SLUG_CONFLICT");
    }
    throw error;
  }

  const saved = await collection.findOne({ externalId: normalizedDoc.externalId });
  if (!saved) {
    throw new Error("Failed to load saved article");
  }

  return toBlogArticle(saved);
}

type PublicBlogArticleFilter = {
  categorySlug?: string;
};

function buildPublicArticleFilter(filter?: PublicBlogArticleFilter) {
  const query: Record<string, unknown> = {
    status: "published",
    noindex: { $ne: true },
  };

  if (filter?.categorySlug) {
    query.categorySlug = filter.categorySlug;
  }

  return query;
}

export async function getPublicBlogArticles(filter?: PublicBlogArticleFilter) {
  const collection = await getArticlesCollection();
  const docs = await collection
    .find(buildPublicArticleFilter(filter))
    .sort({ publishedAt: -1, updatedAt: -1 })
    .toArray();

  return docs.map(toBlogArticle);
}

export async function getPublicBlogArticleBySlug(slug: string) {
  const collection = await getArticlesCollection();
  const doc = await collection.findOne({
    ...buildPublicArticleFilter(),
    slug,
  });

  return doc ? toBlogArticle(doc) : null;
}

export async function getPublicBlogArticleByExternalId(externalId: string) {
  const collection = await getArticlesCollection();
  const doc = await collection.findOne({
    ...buildPublicArticleFilter(),
    externalId,
  });

  return doc ? toBlogArticle(doc) : null;
}

export async function getBlogArticleByExternalId(externalId: string) {
  const collection = await getArticlesCollection();
  const doc = await collection.findOne({ externalId });

  return doc ? toBlogArticle(doc) : null;
}

export async function getBlogArticleBySlug(slug: string) {
  const collection = await getArticlesCollection();
  const doc = await collection.findOne({ slug });

  return doc ? toBlogArticle(doc) : null;
}

export async function getBlogArticleRedirectSlug(slug: string) {
  const collection = await getArticlesCollection();
  const doc = await collection.findOne({
    ...buildPublicArticleFilter(),
    previousSlug: slug,
  });

  return doc?.slug ?? null;
}

export async function getPublishedBlogArticlesForFeed(limit = 20) {
  const collection = await getArticlesCollection();
  const docs = await collection
    .find(buildPublicArticleFilter())
    .sort({ publishedAt: -1, updatedAt: -1 })
    .limit(limit)
    .toArray();

  return docs.map(toBlogArticle);
}

export async function getLatestPublishedBlogArticles(limit = 3) {
  const collection = await getArticlesCollection();
  const docs = await collection
    .find(buildPublicArticleFilter())
    .sort({ publishedAt: -1, updatedAt: -1 })
    .limit(limit)
    .toArray();

  return docs.map(toBlogArticle);
}

export async function getPublishedBlogArticlesByCategorySlugs(
  categorySlugs: string[],
  limit?: number,
) {
  if (categorySlugs.length === 0) {
    return [];
  }

  const collection = await getArticlesCollection();
  let query = collection
    .find({
      ...buildPublicArticleFilter(),
      categorySlug: {
        $in: categorySlugs,
      },
    })
    .sort({ publishedAt: -1, updatedAt: -1 });

  if (limit) {
    query = query.limit(limit);
  }

  const docs = await query.toArray();
  return docs.map(toBlogArticle);
}

export async function getAvailableBlogCategories(): Promise<BlogCategorySummary[]> {
  const collection = await getArticlesCollection();
  const categories = await collection
    .aggregate<BlogCategorySummary>([
      {
        $match: {
          ...buildPublicArticleFilter(),
          categorySlug: { $type: "string" },
          category: { $type: "string" },
        },
      },
      {
        $group: {
          _id: "$categorySlug",
          label: { $first: "$category" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          slug: "$_id",
          label: 1,
          count: 1,
        },
      },
      {
        $sort: {
          label: 1,
        },
      },
    ])
    .toArray();

  return categories;
}

type RelatedCandidateInput = {
  slug: string;
  limit?: number;
};

async function getBoundedRelatedCandidates(
  filter: Record<string, unknown>,
  input: RelatedCandidateInput,
) {
  const collection = await getArticlesCollection();
  const limit = Math.max(input.limit ?? 12, 1);

  const docs = await collection
    .find({
      status: "published",
      noindex: { $ne: true },
      slug: { $ne: input.slug },
      ...filter,
    })
    .sort({ publishedAt: -1, updatedAt: -1 })
    .limit(limit)
    .toArray();

  return docs.map(toBlogArticle);
}

export async function getRelatedCategoryCandidates(
  category: string | undefined,
  input: RelatedCandidateInput,
) {
  if (!category) {
    return [];
  }

  return getBoundedRelatedCandidates({ category }, input);
}

export async function getRelatedTagCandidates(
  tags: string[],
  input: RelatedCandidateInput,
) {
  if (tags.length === 0) {
    return [];
  }

  return getBoundedRelatedCandidates(
    {
      tags: {
        $in: tags,
      },
    },
    input,
  );
}

export async function recordBlogClickEvent(input: BlogClickEventDocument) {
  const collection = await getClickEventsCollection();
  await collection.insertOne(input);
}

type BlogArticleOperationalStateInput = {
  externalId: string;
  searchConsoleSubmission?: BlogSearchConsoleSubmissionDocument;
  lastRefreshRequestedAt?: Date | null;
  lastRefreshReason?: string;
};

export async function updateBlogArticleOperationalState(
  input: BlogArticleOperationalStateInput,
) {
  const collection = await getArticlesCollection();
  await collection.updateOne(
    { externalId: input.externalId },
    {
      $set: {
        ...(input.searchConsoleSubmission
          ? { searchConsoleSubmission: input.searchConsoleSubmission }
          : {}),
        ...(input.lastRefreshRequestedAt !== undefined
          ? { lastRefreshRequestedAt: input.lastRefreshRequestedAt }
          : {}),
        ...(input.lastRefreshReason !== undefined
          ? { lastRefreshReason: input.lastRefreshReason }
          : {}),
      },
    },
  );

  return getBlogArticleByExternalId(input.externalId);
}

export async function getBlogClickEventsForTests() {
  const collection = await getClickEventsCollection();
  return collection.find({}).sort({ createdAt: 1 }).toArray();
}

export async function backfillBlogCategorySlugs() {
  const collection = await getArticlesCollection();
  const filter: Record<string, unknown> = {
    category: { $type: "string" },
    $or: [
      { categorySlug: { $exists: false } },
      { categorySlug: null },
    ],
  };
  const docs = await collection
    .find(filter)
    .toArray();

  let updatedCount = 0;
  for (const doc of docs) {
    const categorySlug = normalizeCategorySlug(doc.category);
    await collection.updateOne(
      { externalId: doc.externalId },
      {
        $set: {
          categorySlug,
        },
      },
    );
    updatedCount += 1;
  }

  return { updatedCount };
}

export async function clearBlogRepositoryForTests() {
  if (!isBlogStorageConfigured()) {
    return;
  }

  const db = await getDb();
  await db.collection(ARTICLES_COLLECTION).deleteMany({});
  await db.collection(BLOG_CLICK_EVENTS_COLLECTION).deleteMany({});
}

export async function disconnectBlogRepositoryForTests() {
  if (global.__brandopsMongoClientPromise__) {
    const client = await global.__brandopsMongoClientPromise__;
    await client.close();
    global.__brandopsMongoClientPromise__ = undefined;
  }
  articleIndexesReady = null;
  clickEventIndexesReady = null;
}

export async function seedBlogArticleForTests(input: BlogArticleDocument) {
  return upsertBlogArticle(input);
}

export async function seedLegacyBlogArticleForTests(input: BlogArticleDocument) {
  const collection = await getArticlesCollection();
  await collection.insertOne(input);
}
