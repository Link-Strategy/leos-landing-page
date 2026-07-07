const { connectDb } = require("./utils.cjs");

async function main() {
  const { client, db } = await connectDb();
  try {
    const collections = await db.listCollections().toArray();
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments({});
      console.log(`- ${col.name}: ${count}`);
    }
  } finally {
    await client.close();
  }
}
main().catch(console.error);
