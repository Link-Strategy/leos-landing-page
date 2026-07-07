const { connectDb } = require("./utils.cjs");

async function main() {
  const { client, db } = await connectDb();
  try {
    const assets = await db.collection("assets").find({}).toArray();
    console.log(JSON.stringify(assets, null, 2));
  } finally {
    await client.close();
  }
}
main().catch(console.error);
