const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

function getEnv() {
  const envPath = path.resolve(__dirname, "../../../../.env");
  const env = {};
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, "utf8").split("\n").forEach(line => {
      const t = line.trim();
      if (!t || t.startsWith("#")) return;
      const i = t.indexOf("=");
      if (i > 0) {
        const key = t.slice(0, i).trim();
        let val = t.slice(i + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
          val = val.slice(1, -1);
        env[key] = val;
      }
    });
  }
  return env;
}

async function connectDb() {
  const env = getEnv();
  const uri = env.MONGODB_URI;
  const dbName = env.MONGODB_DB_NAME || "blogs";
  if (!uri) {
    throw new Error("Missing MONGODB_URI");
  }
  const client = new MongoClient(uri);
  await client.connect();
  return { client, db: client.db(dbName) };
}

module.exports = { getEnv, connectDb };
