import { MongoClient } from "mongodb";
import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../../../.env.local") });
config({ path: resolve(__dirname, "../../../../.env") });

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("Missing MONGODB_URI or MONGO_URI in environment");

  const dbName = process.env.MONGODB_DB_NAME || process.env.DB_NAME || "linkstrategy";
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  return { client, db, close: () => client.close() };
}
