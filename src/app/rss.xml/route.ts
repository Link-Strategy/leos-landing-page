import { renderMarkdownToHtml } from "@/lib/blog/markdown";
import { getCachedPublishedBlogArticlesForFeed } from "@/lib/blog/queries";
import { getSiteUrl } from "@/lib/blog/seo";

const SITE_URL = getSiteUrl();

export async function GET() {
  let articles: Awaited<ReturnType<typeof getCachedPublishedBlogArticlesForFeed>> = [];
  try {
    articles = await getCachedPublishedBlogArticlesForFeed();
  } catch {
    articles = [];
  }

  const itemsXml = (
    await Promise.all(
      articles.map(async (article) => {
        const bodyHtml = article.contentMarkdown ? await renderMarkdownToHtml(article.contentMarkdown) : "";
        return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${SITE_URL}/blog/${article.slug}</link>
      <guid>${SITE_URL}/blog/${article.slug}</guid>
      <description><![CDATA[${bodyHtml}]]></description>
      <pubDate>${new Date(article.publishedAt!).toUTCString()}</pubDate>
      <category>${article.category || "General"}</category>
    </item>`;
      }),
    )
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>LeOS Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Công nghệ xanh, Vận hành thông minh - Blog LeOS</description>
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
