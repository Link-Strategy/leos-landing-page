const { connectDb } = require("./utils.cjs");

async function main() {
  const { client, db } = await connectDb();
  try {
    const list = await db.collection("articles").find({}).toArray();
    const res = list.map(art => {
      const images = [];
      if (art.coverImage) images.push({ type: "cover", url: art.coverImage });
      const md = art.contentMarkdown || "";
      const regex = /!\[.*?\]\((.*?)\)/g;
      let match;
      while ((match = regex.exec(md)) !== null) {
        images.push({ type: "content", url: match[1] });
      }
      return images.length ? { slug: art.slug, title: art.title, images } : null;
    }).filter(Boolean);
    console.log(JSON.stringify(res, null, 2));
  } finally {
    await client.close();
  }
}
main().catch(console.error);
