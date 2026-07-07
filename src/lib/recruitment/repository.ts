import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import type { JobListing, JobListingDocument, JobListingPayload, JobStatus } from "./types";

const COLLECTION = "job_listings";

// ─── Singleton client (same pattern as blog) ─────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var __recruitmentMongoClientPromise__: Promise<MongoClient> | undefined;
}

function getMongoUri() {
  return process.env.MONGODB_URI?.trim() || "";
}

function getMongoDbName() {
  return process.env.MONGODB_DB_NAME?.trim() || "";
}

export function isRecruitmentStorageConfigured() {
  return Boolean(getMongoUri() && getMongoDbName());
}

async function getMongoClient() {
  const uri = getMongoUri();
  if (!uri) throw new Error("Missing MONGODB_URI");

  if (!global.__recruitmentMongoClientPromise__) {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    global.__recruitmentMongoClientPromise__ = client.connect();
  }
  return global.__recruitmentMongoClientPromise__;
}

async function getDb() {
  const dbName = getMongoDbName();
  if (!dbName) throw new Error("Missing MONGODB_DB_NAME");
  const client = await getMongoClient();
  return client.db(dbName);
}

async function getCollection() {
  const db = await getDb();
  const col = db.collection<JobListingDocument>(COLLECTION);
  // Ensure indexes
  await col.createIndex({ slug: 1 }, { unique: true }).catch(() => {});
  await col.createIndex({ status: 1, order: 1 }).catch(() => {});
  return col;
}

// ─── Mapping ─────────────────────────────────────────────────────────────────

function toJobListing(doc: JobListingDocument & { _id: ObjectId }): JobListing {
  return {
    id: doc._id.toHexString(),
    slug: doc.slug,
    title: doc.title,
    department: doc.department,
    location: doc.location,
    jobType: doc.jobType,
    salary: doc.salary,
    requirements: doc.requirements,
    description: doc.description,
    benefits: doc.benefits,
    status: doc.status,
    order: doc.order,
    externalApplyUrl: doc.externalApplyUrl,
    publishedAt: doc.publishedAt?.toISOString() ?? null,
    closedAt: doc.closedAt?.toISOString() ?? null,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

// ─── Public reads ─────────────────────────────────────────────────────────────

/** Returns all published jobs, sorted by `order` asc. */
export async function getPublishedJobListings(): Promise<JobListing[]> {
  const col = await getCollection();
  const docs = await col
    .find({ status: "published" })
    .sort({ order: 1, publishedAt: -1 })
    .toArray();
  return docs.map((d) => toJobListing(d as JobListingDocument & { _id: ObjectId }));
}

/** Returns a single published job by slug. */
export async function getJobListingBySlug(slug: string): Promise<JobListing | null> {
  const col = await getCollection();
  const doc = await col.findOne({ slug });
  if (!doc) return null;
  return toJobListing(doc as JobListingDocument & { _id: ObjectId });
}

// ─── Admin / CLI writes ────────────────────────────────────────────────────────

/** Upserts a job listing by slug. Returns the resulting document. */
export async function upsertJobListing(payload: JobListingPayload): Promise<JobListing> {
  const col = await getCollection();
  const now = new Date();

  const update: Partial<JobListingDocument> = {
    title: payload.title,
    department: payload.department,
    location: payload.location,
    jobType: payload.jobType,
    requirements: payload.requirements,
    description: payload.description,
    status: payload.status ?? "draft",
    order: payload.order ?? 99,
    updatedAt: now,
  };

  if (payload.salary !== undefined) update.salary = payload.salary;
  if (payload.benefits !== undefined) update.benefits = payload.benefits;
  if (payload.externalApplyUrl !== undefined) update.externalApplyUrl = payload.externalApplyUrl;

  const result = await col.findOneAndUpdate(
    { slug: payload.slug },
    {
      $set: update,
      $setOnInsert: {
        slug: payload.slug,
        createdAt: now,
        publishedAt: null,
        closedAt: null,
      } as Partial<JobListingDocument>,
    },
    { upsert: true, returnDocument: "after" }
  );

  if (!result) throw new Error("Upsert failed");
  return toJobListing(result as JobListingDocument & { _id: ObjectId });
}

/** Publish a job (status → published, sets publishedAt). */
export async function publishJobListing(slug: string): Promise<JobListing> {
  const col = await getCollection();
  const result = await col.findOneAndUpdate(
    { slug },
    { $set: { status: "published" as JobStatus, publishedAt: new Date(), updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  if (!result) throw new Error(`Job not found: ${slug}`);
  return toJobListing(result as JobListingDocument & { _id: ObjectId });
}

/** Close a job (status → closed, sets closedAt). */
export async function closeJobListing(slug: string): Promise<JobListing> {
  const col = await getCollection();
  const result = await col.findOneAndUpdate(
    { slug },
    { $set: { status: "closed" as JobStatus, closedAt: new Date(), updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  if (!result) throw new Error(`Job not found: ${slug}`);
  return toJobListing(result as JobListingDocument & { _id: ObjectId });
}

/** Hard delete by slug. */
export async function deleteJobListing(slug: string): Promise<{ deleted: boolean }> {
  const col = await getCollection();
  const res = await col.deleteOne({ slug });
  return { deleted: res.deletedCount > 0 };
}

/** List ALL jobs (including draft/closed) — for CLI/admin use. */
export async function getAllJobListings(): Promise<JobListing[]> {
  const col = await getCollection();
  const docs = await col.find({}).sort({ order: 1, createdAt: -1 }).toArray();
  return docs.map((d) => toJobListing(d as JobListingDocument & { _id: ObjectId }));
}
