import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://linkstrategy.io.vn";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/images/", "/favicon.ico"],
        disallow: ["/api/", "/admin/", "/*.json$"],
        crawlDelay: 1,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
