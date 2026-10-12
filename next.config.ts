import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Blog images come from S3: always allow the dev bucket, plus the configured (production) bucket.
const s3Hosts = new Set(["letron-blog-content-dev.s3.ap-southeast-1.amazonaws.com"]);
if (process.env.S3_BUCKET_NAME) {
  s3Hosts.add(`${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION || "ap-southeast-1"}.amazonaws.com`);
}

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true,
  },
  images: {
    remotePatterns: [
      ...[...s3Hosts].map((hostname) => ({ protocol: "https" as const, hostname })),
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    // robots.txt, Google Search Console and the ls-jobs CLI all reference /sitemap.xml;
    // the handler lives at app/sitemap/route.ts.
    return [{ source: "/sitemap.xml", destination: "/sitemap" }];
  },
  async redirects() {
    return [
      {
        source: "/category/tin-tuc-su-kien",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/category/tin-tuc-su-kien/:path*",
        destination: "/blog/:path*",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
