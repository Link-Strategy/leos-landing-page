const { MongoClient, ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");

const envPath = path.resolve(__dirname, "../.env");
const env = {};
fs.readFileSync(envPath, "utf8").split("\n").forEach(line => {
  const t = line.trim();
  if (!t || t.startsWith("#")) return;
  const i = t.indexOf("=");
  if (i > 0) {
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
});

const MONGODB_URI = env.MONGODB_URI;
const DB_NAME = env.MONGODB_DB_NAME || "blogs";
const [,, action, ...args] = process.argv;

async function main() {
  if (!MONGODB_URI) { console.error("Missing MONGODB_URI"); process.exit(1); }
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  switch (action) {
    case "delete": {
      const [collection, id] = args;
      if (!collection || !id || !/^[0-9a-fA-F]{24}$/.test(id)) {
        console.error("Usage: node scripts/leos-ops.cjs delete <collection> <24-char-id>");
        process.exit(1);
      }
      const r = await db.collection(collection).deleteOne({ _id: new ObjectId(id) });
      console.log(JSON.stringify({ ok: true, deletedCount: r.deletedCount, collection, id }));
      break;
    }
    case "count": {
      const [collection] = args;
      const c = await db.collection(collection).countDocuments();
      console.log(JSON.stringify({ ok: true, collection, count: c }));
      break;
    }
    default:
      console.log("LeOS Ops: node scripts/leos-ops.cjs delete|count ...");
      process.exit(1);
  }
  await client.close();
}
main().catch(e => { console.error(JSON.stringify({ ok: false, error: e.message })); process.exit(1); });
