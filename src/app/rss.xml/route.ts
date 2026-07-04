import { getBlogDb } from "@/lib/mongodb";
import { blogAssetToPost, generateSlug, type BlogAsset, type BlogPost } from "@/lib/blog-utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://linkstrategy.io.vn";

export async function GET() {
  let posts: BlogPost[] = [];
  try {
    const db = await getBlogDb();
    const assets = await db.collection<BlogAsset>("assets")
      .find({ platform: "blog", status: "published" })
      .sort({ publish_at: -1, created_at: -1 })
      .toArray();
    posts = assets.map(blogAssetToPost);
  } catch {
    // DB not available — serve empty feed
  }

  const itemsXml = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid>${SITE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <category>${post.category || "General"}</category>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>LeOS Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Cong nghe xanh, van hanh thong minh - Blog LeOS</description>
    <language>vi</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
