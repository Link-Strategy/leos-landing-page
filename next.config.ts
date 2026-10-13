import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Blog images come from S3: always allow the dev bucket, plus the configured (production) bucket.
const s3Hosts = new Set(["letron-blog-content-dev.s3.ap-southeast-1.amazonaws.com"]);
if (process.env.S3_BUCKET_NAME) {
  s3Hosts.add(`${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION || "ap-southeast-1"}.amazonaws.com`);
}

// CSP runs in Report-Only mode: nothing is blocked, violations are POSTed to /api/csp-report (Vercel logs).
// Tighten it from real reports — drop 'unsafe-inline'/'unsafe-eval' once the Elementor/WordPress scripts and
// Next's inline bootstrap are covered by nonces — then switch the header to Content-Security-Policy.
const cspReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://cdn.jsdelivr.net",
  "frame-src 'self' https://www.youtube.com https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "report-uri /api/csp-report",
].join("; ");

// Baseline browser hardening.
const securityHeaders = [
  { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const staticAssetCache = "public, max-age=2592000, stale-while-revalidate=604800";
const staticAssetPaths = [
  "/wp-content/:path*",
  "/wp-includes/:path*",
  "/landing/:path*",
  "/assets/:path*",
  "/icons/:path*",
  "/images/:path*",
  "/about/:path*",
  "/contact/:path*",
  "/v2/:path*",
  "/figmaAssets/:path*",
  "/media/:path*",
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    externalDir: true,
    // Tree-shake barrel imports of the icon/UI libraries so only the used icons/components reach the client bundle.
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
    // app/global-not-found.tsx: branded 404 for URLs matching no route (/a/b/c); [locale]/not-found.tsx covers the rest.
    globalNotFound: true,
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Static files in /public are not fingerprinted, so the default is max-age=0 (a revalidation request per file on
      // every visit). Cache them for 30 days with a 7-day stale window; _next/static is already immutable.
      ...staticAssetPaths.map((source) => ({ source, headers: [{ key: "Cache-Control", value: staticAssetCache }] })),
    ];
  },
  images: {
    // AVIF first, WebP fallback; optimized images are kept for 30 days.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
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
      // Member-companies page is hidden to keep the focus on the product strategy. Temporary (307) so it can be
      // restored: delete these two redirects, re-add the Footer link and the sitemap entry. See docs/backlog.md.
      { source: "/cong-ty-thanh-vien", destination: "/san-pham", permanent: false },
      { source: "/en/cong-ty-thanh-vien", destination: "/en/san-pham", permanent: false },
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
