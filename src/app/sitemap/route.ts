import { getCachedPublicBlogArticles } from "@/lib/blog/queries";
import { getSiteUrl } from "@/lib/blog/seo";

const SITE_URL = getSiteUrl();

export async function GET() {
  const staticPages = [
    { url: "", priority: "1.0", changefreq: "weekly" as const },
    { url: "gioi-thieu", priority: "0.8", changefreq: "monthly" as const },
    { url: "san-pham", priority: "0.9", changefreq: "weekly" as const },
    { url: "lien-he", priority: "0.7", changefreq: "monthly" as const },
    { url: "tuyen-dung", priority: "0.6", changefreq: "weekly" as const },
    { url: "blog", priority: "0.9", changefreq: "daily" as const },
    { url: "category/tin-tuc-su-kien", priority: "0.5", changefreq: "weekly" as const },
    { url: "cong-ty-thanh-vien", priority: "0.4", changefreq: "monthly" as const },
  ];

  let blogUrls: Array<{ url: string; priority: string; changefreq: string }> = [];
  try {
    const articles = await getCachedPublicBlogArticles();
    blogUrls = articles.map((article) => ({
      url: "blog/" + article.slug,
      priority: "0.7",
      changefreq: "monthly",
    }));
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
