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
    title: "Liên hệ - LeTRON",
    alternates: localeAlternates(locale, "/lien-he"),
  };
}

export default function LienHePage() {
  return (
    <StaticLandingPage
      className="site-main post-36 page type-page status-publish hentry"
      segments={["lien-he"]}
      leadForm={{ widgetDataId: "0287d46", source: "lien-he", messageRows: 10 }}
    />
  );
}
