import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Blog images come from S3: always allow the dev bucket, plus the configured (production) bucket.
const s3Hosts = new Set(["letron-blog-content-dev.s3.ap-southeast-1.amazonaws.com"]);
if (process.env.S3_BUCKET_NAME) {
  s3Hosts.add(`${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION || "ap-southeast-1"}.amazonaws.com`);
}

// Baseline browser hardening. CSP is intentionally not set: the Elementor/WordPress scripts and inline
// bootstrap code would need a long allowlist — add one deliberately (Report-Only first) rather than break pages.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    externalDir: true,
    // app/global-not-found.tsx: branded 404 for URLs matching no route (/a/b/c); [locale]/not-found.tsx covers the rest.
    globalNotFound: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
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
    const greenPost = "/letron-chuyen-hoa-1-trieu-tan-xi-thai-thanh-vat-lieu-xay-dung-xanh";
    return [
      // Duplicate WordPress pages.
      // LeDB's canonical slug is ledb-bo-nao-so-4 (src/lib/products.ts); plain ledb-bo-nao-so stays (header/footer link it, canonical tag points to -4).
      { source: "/san-pham/ledb-bo-nao-so-2", destination: "/san-pham/ledb-bo-nao-so-4", permanent: true },
      { source: "/san-pham/lesm-di-chuyen-thong-minh-2", destination: "/san-pham/lese-nang-luong-thong-minh", permanent: true },
      ...[2, 3, 4, 5, 6, 7, 8].map((n) => ({ source: `${greenPost}-${n}`, destination: greenPost, permanent: true })),
      // Raw static exports must not be indexed or browsed directly.
      { source: "/landing/:path*/index.html", destination: "/:path*", permanent: true },
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
