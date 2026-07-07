const { connectDb } = require("./utils.cjs");
const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const imageMap = {
  "iot-trong-quan-ly-chat-thai-giam-sat-thoi-gian-thuc": "public/wp-content/uploads/2026/05/1-10.jpg",
  "kinh-te-tuan-hoan-nganh-vat-lieu-xay-dung": "public/wp-content/uploads/2026/05/5.jpg",
  "esg-doanh-nghiep-tai-nguyen-bat-dau": "public/wp-content/uploads/2026/05/ESG-2-1.jpg",
  "chuyen-doi-so-nganh-moi-tuong-du-lieu-den-quyet-dinh": "public/wp-content/uploads/2026/05/1-9.jpg",
  "toi-uu-van-hanh-nha-may-xu-ly-chat-thai-ai": "public/wp-content/uploads/2026/05/2-4.jpg"
};

async function main() {
  const { client, db } = await connectDb();
  try {
    for (const [slug, localPath] of Object.entries(imageMap)) {
      const resolved = path.resolve(localPath);
      if (!fs.existsSync(resolved)) continue;
      
      console.log(`Uploading ${localPath} for ${slug}...`);
      const uploadResult = spawnSync("node", [
        path.join(__dirname, "upload.cjs"),
        resolved,
        "media/blog"
      ], { encoding: "utf8" });
      
      if (uploadResult.status !== 0) continue;
      const s3Url = JSON.parse(uploadResult.stdout.trim()).url;
      if (!s3Url) continue;
      
      await db.collection("articles").updateOne({ slug }, { $set: { coverImage: s3Url, updatedAt: new Date() } });
      await db.collection("assets").updateOne({ "platform_metadata.slug": slug }, { $set: { "platform_metadata.coverImage": s3Url, updated_at: new Date() } });
      console.log(`Updated S3 URL: ${s3Url}`);
    }
  } finally {
    await client.close();
  }
}
main().catch(console.error);
