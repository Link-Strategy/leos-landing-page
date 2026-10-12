import type { Metadata } from "next";

import { StaticLandingPage } from "@/lib/static-landing";
import { localeAlternates } from "@/lib/seo-alternates";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Sản phẩm - LeTRON",
    alternates: localeAlternates(locale, "/san-pham"),
  };
}

export default function SanPhamPage() {
  return <StaticLandingPage className="site-main post-423 page type-page status-publish hentry" segments={["san-pham"]} />;
}
