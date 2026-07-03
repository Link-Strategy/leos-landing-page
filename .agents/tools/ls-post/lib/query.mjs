import { ObjectId } from "mongodb";

export async function searchContent(runtime, { db }, params = {}) {
  const queryText = params.query || "";
  const types = params.types || ["ideas", "briefs", "assets", "signals"];
  const status = params.status || null;
  const limit = parseInt(params.limit || 20, 10);

  const results = [];

  const searchPromises = [];

  if (types.includes("ideas")) {
    searchPromises.push((async () => {
      const q = {};
      if (queryText) {
        q.$or = [
          { title_working: { $regex: queryText, $options: "i" } },
          { observation: { $regex: queryText, $options: "i" } }
        ];
      }
      if (status) q.status = status;
      const list = await db.collection("ideas").find(q).limit(limit).toArray();
      return list.map(item => ({
        type: "idea",
        id: item._id.toString(),
        title: item.title_working,
        status: item.status,
        created_at: item.created_at
      }));
    })());
  }

  if (types.includes("briefs")) {
    searchPromises.push((async () => {
      const q = {};
      if (queryText) {
        q.$or = [
          { title_working: { $regex: queryText, $options: "i" } },
          { core_insight: { $regex: queryText, $options: "i" } }
        ];
      }
      if (status) q.status = status;
      const list = await db.collection("briefs").find(q).limit(limit).toArray();
      return list.map(item => ({
        type: "brief",
        id: item._id.toString(),
        title: item.title_working,
        status: item.status,
        created_at: item.created_at
      }));
    })());
  }

  if (types.includes("assets")) {
    searchPromises.push((async () => {
      const q = {};
      if (queryText) {
        q.$or = [
          { title: { $regex: queryText, $options: "i" } },
          { body: { $regex: queryText, $options: "i" } },
          { cta: { $regex: queryText, $options: "i" } }
        ];
      }
      if (status) q.status = status;
      const list = await db.collection("assets").find(q).limit(limit).toArray();
      return list.map(item => ({
        type: "asset",
        id: item._id.toString(),
        title: item.title || `[${item.platform.toUpperCase()}] ${item.body.substring(0, 30)}...`,
        status: item.status,
        platform: item.platform,
        created_at: item.created_at
      }));
    })());
  }

  if (types.includes("signals")) {
    searchPromises.push((async () => {
      const q = {};
      if (queryText) {
        q.$or = [
          { insight_summary: { $regex: queryText, $options: "i" } },
          { painpoints: { $regex: queryText, $options: "i" } },
          { objections: { $regex: queryText, $options: "i" } }
        ];
      }
      // Signals don't have standard status field, skip status filter
      const list = await db.collection("signals").find(q).limit(limit).toArray();
      return list.map(item => ({
        type: "signal",
        id: item._id.toString(),
        title: item.insight_summary,
        created_at: item.created_at
      }));
    })());
  }

  const allLists = await Promise.all(searchPromises);
  allLists.forEach(list => results.push(...list));

  // Sort descending by created_at
  results.sort((a, b) => {
    const da = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dbVal = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dbVal - da;
  });

  return results.slice(0, limit);
}

export async function getContent(runtime, { db }, collectionName, id) {
  if (!collectionName || !id) {
    throw new Error("Missing required arguments --collection or --id");
  }

  let queryId;
  try {
    queryId = new ObjectId(id);
  } catch {
    queryId = id;
  }

  const doc = await db.collection(collectionName).findOne({ _id: queryId });
  if (!doc) {
    return {
      ok: false,
      message: `Document not found in collection: ${collectionName} with id: ${id}`
    };
  }

  return {
    ok: true,
    data: doc
  };
}

export async function searchTaxonomy(runtime, { db }, params = {}) {
  const queryText = params.query || "";
  const type = params.type || null;

  const q = { status: "active" };

  if (type) {
    q.type = type;
  }

  if (queryText) {
    q.$or = [
      { code: { $regex: queryText, $options: "i" } },
      { name: { $regex: queryText, $options: "i" } },
      { title: { $regex: queryText, $options: "i" } },
      { description: { $regex: queryText, $options: "i" } }
    ];
  }

  const list = await db.collection("taxonomy_registry").find(q).toArray();
  return list.map(item => ({
    code: item.code,
    type: item.type,
    name: item.name || item.title || "",
    description: item.description || ""
  }));
}
