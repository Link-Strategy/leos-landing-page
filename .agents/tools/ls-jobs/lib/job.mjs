const COLLECTION = "job_listings";

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getCol(db) {
  return db.collection(COLLECTION);
}

/** Upsert a job listing by slug. */
export async function upsertJob(db, payload) {
  const col = getCol(db);
  const now = new Date();

  const slug = payload.slug || slugify(payload.title || "untitled");

  const update = {
    title: payload.title,
    department: payload.department || "General",
    location: payload.location || "Hà Nội",
    jobType: payload.jobType || "full-time",
    requirements: payload.requirements || "",
    description: payload.description || "",
    status: payload.status || "draft",
    order: typeof payload.order === "number" ? payload.order : 99,
    updatedAt: now,
  };

  if (payload.salary !== undefined) update.salary = payload.salary;
  if (payload.benefits !== undefined) update.benefits = payload.benefits;
  if (payload.externalApplyUrl !== undefined) update.externalApplyUrl = payload.externalApplyUrl;

  await col.createIndex({ slug: 1 }, { unique: true }).catch(() => {});

  const result = await col.findOneAndUpdate(
    { slug },
    {
      $set: update,
      $setOnInsert: { slug, createdAt: now, publishedAt: null, closedAt: null },
    },
    { upsert: true, returnDocument: "after" }
  );

  return result;
}

/** Publish a job by slug → status: published, sets publishedAt. */
export async function publishJob(db, slug) {
  const col = getCol(db);
  const result = await col.findOneAndUpdate(
    { slug },
    { $set: { status: "published", publishedAt: new Date(), updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  if (!result) throw new Error(`Job not found: ${slug}`);
  return result;
}

/** Close a job by slug → status: closed, sets closedAt. */
export async function closeJob(db, slug) {
  const col = getCol(db);
  const result = await col.findOneAndUpdate(
    { slug },
    { $set: { status: "closed", closedAt: new Date(), updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  if (!result) throw new Error(`Job not found: ${slug}`);
  return result;
}

/** Revert closed/draft by slug → status: draft. */
export async function unpublishJob(db, slug) {
  const col = getCol(db);
  const result = await col.findOneAndUpdate(
    { slug },
    { $set: { status: "draft", updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  if (!result) throw new Error(`Job not found: ${slug}`);
  return result;
}

/** Delete by slug. */
export async function deleteJob(db, slug) {
  const col = getCol(db);
  const res = await col.deleteOne({ slug });
  return { deleted: res.deletedCount > 0 };
}

/** Get a single job by slug. */
export async function getJob(db, slug) {
  return getCol(db).findOne({ slug });
}

/** List all jobs (admin view). */
export async function listJobs(db) {
  return getCol(db)
    .find({})
    .sort({ order: 1, createdAt: -1 })
    .toArray();
}
