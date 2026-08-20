import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "letron-blog-content-dev.s3.ap-southeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
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
