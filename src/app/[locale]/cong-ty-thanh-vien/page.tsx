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
    title: "Công ty thành viên - LeTRON",
    alternates: localeAlternates(locale, "/cong-ty-thanh-vien"),
  };
}

export default function CongTyThanhVienPage() {
  return (
    <StaticLandingPage
      className="site-main post-258 page type-page status-publish hentry"
      segments={["cong-ty-thanh-vien"]}
    />
  );
}
