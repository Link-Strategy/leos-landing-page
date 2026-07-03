import { MongoClient } from "mongodb";

export async function connectToDatabase(runtime) {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI or MONGO_URI in environment variables.");
  }
  
  const dbName = process.env.MONGODB_DB_NAME || process.env.DB_NAME || "linkstrategy";
  
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  
  return {
    client,
    db,
    close: async () => {
      await client.close();
    }
  };
}
