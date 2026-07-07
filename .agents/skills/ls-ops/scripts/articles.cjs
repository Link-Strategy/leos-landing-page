const { connectDb } = require("./utils.cjs");

async function main() {
  const { client, db } = await connectDb();
  try {
    const list = await db.collection("articles").find({}).toArray();
    console.log(JSON.stringify(list.map(a => ({
      id: a._id,
      slug: a.slug,
      title: a.title,
      coverImage: a.coverImage,
    })), null, 2));
  } finally {
    await client.close();
  }
}
main().catch(console.error);
