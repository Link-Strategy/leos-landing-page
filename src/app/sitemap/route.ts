import { getCachedPublicBlogArticles } from "@/lib/blog/queries";
import { getCachedPublishedJobListings } from "@/lib/recruitment/queries";
import { getSiteUrl } from "@/lib/blog/seo";

const SITE_URL = getSiteUrl();

// Leadership photos exposed via the Google image sitemap extension so Google can
// discover and index them directly, independent of crawling/rendering the page.
const LEADERSHIP_IMAGES = [
  { file: "nguyen-van-cong-cfo-letron.png", caption: "Ông Nguyễn Văn Công - CFO LeTRON Group" },
  { file: "nguyen-thi-mai-lien-hr-ga-letron.png", caption: "Bà Nguyễn Thị Mai Liên - HR & GA LeTRON Group" },
  { file: "le-minh-tien-chu-tich-hdqt-letron.png", caption: "Ông Lê Minh Tiến - Chủ tịch HĐQT LeTRON Group" },
  { file: "hoang-le-thuy-ceo-letron.png", caption: "Bà Hoàng Lệ Thủy - CEO LeTRON Group" },
  { file: "le-duc-anh-lear-letron.png", caption: "Ông Lê Đức Anh - LeAR LeTRON Group" },
];

export async function GET() {
  const staticPages = [
    { url: "", priority: "1.0", changefreq: "weekly" as const, lastmod: undefined },
    {
      url: "gioi-thieu",
      priority: "0.8",
      changefreq: "monthly" as const,
      lastmod: undefined,
      images: LEADERSHIP_IMAGES.map((img) => ({
        loc: `${SITE_URL}/about/${img.file}`,
        caption: img.caption,
      })),
    },
    { url: "san-pham", priority: "0.9", changefreq: "weekly" as const, lastmod: undefined },
    { url: "lien-he", priority: "0.7", changefreq: "monthly" as const, lastmod: undefined },
    { url: "tuyen-dung", priority: "0.8", changefreq: "weekly" as const, lastmod: undefined },
    { url: "blog", priority: "0.9", changefreq: "daily" as const, lastmod: undefined },
    { url: "category/tin-tuc-su-kien", priority: "0.5", changefreq: "weekly" as const, lastmod: undefined },
    { url: "cong-ty-thanh-vien", priority: "0.4", changefreq: "monthly" as const, lastmod: undefined },
  ];

  let blogUrls: Array<{ url: string; priority: string; changefreq: string; lastmod?: string }> = [];
  try {
    const articles = await getCachedPublicBlogArticles();
    blogUrls = articles.map((article) => ({
      url: "blog/" + article.slug,
      priority: "0.7",
      changefreq: "monthly",
      lastmod: article.updatedAt ? new Date(article.updatedAt).toISOString().split("T")[0] : undefined,
    }));
  } catch {
    // DB not available, skip blog URLs
  }

  let jobUrls: Array<{ url: string; priority: string; changefreq: string; lastmod?: string }> = [];
  try {
    const jobs = await getCachedPublishedJobListings();
    jobUrls = jobs.map((job) => ({
      url: "tuyen-dung/" + job.slug,
      priority: "0.8",
      changefreq: "weekly",
      lastmod: job.updatedAt ? new Date(job.updatedAt).toISOString().split("T")[0] : undefined,
    }));
  } catch {
    // DB not available, skip job URLs
  }

  const allUrls: Array<{
    url: string;
    priority: string;
    changefreq: string;
    lastmod?: string;
    images?: Array<{ loc: string; caption: string }>;
  }> = [...staticPages, ...blogUrls, ...jobUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${allUrls
    .map(
      (p) => `<url>
    <loc>${SITE_URL}/${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>${p.lastmod ? `\n    <lastmod>${p.lastmod}</lastmod>` : ""}${
        p.images
          ? "\n    " +
            p.images
              .map(
                (img) =>
                  `<image:image><image:loc>${img.loc}</image:loc><image:caption>${img.caption}</image:caption></image:image>`
              )
              .join("\n    ")
          : ""
      }
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
