import { getBlogDb } from "@/lib/mongodb";
import { blogAssetToPost, type BlogAsset } from "@/lib/blog-utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://linkstrategy.io.vn";

export async function GET() {
  const staticPages = [
    { url: "", priority: "1.0", changefreq: "weekly" },
    { url: "gioi-thieu", priority: "0.8", changefreq: "monthly" },
    { url: "san-pham", priority: "0.9", changefreq: "weekly" },
    { url: "lien-he", priority: "0.7", changefreq: "monthly" },
    { url: "tuyen-dung", priority: "0.6", changefreq: "weekly" },
    { url: "blog", priority: "0.9", changefreq: "daily" },
    { url: "category/tin-tuc-su-kien", priority: "0.5", changefreq: "weekly" },
    { url: "cong-ty-thanh-vien", priority: "0.4", changefreq: "monthly" },
  ];

  let blogUrls: Array<{ url: string; priority: string; changefreq: string }> = [];
  try {
    const db = await getBlogDb();
    const assets = await db.collection<BlogAsset>("assets")
      .find({ platform: "blog", status: "published" })
      .toArray();
    blogUrls = assets.map((asset) => {
      const post = blogAssetToPost(asset);
      return { url: "blog/" + post.slug, priority: "0.7", changefreq: "monthly" };
    });
  } catch {
    // DB not available, skip blog URLs
  }

  const allUrls = [...staticPages, ...blogUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      (p) => `<url>
    <loc>${SITE_URL}/${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join("\n  ")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
