import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo-alternates";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/blog/seo";
import { buildBreadcrumbJsonLd } from "@/lib/jsonld";
import { V2Cta } from "@/components/v2/blocks";
import { V2PageHero } from "@/components/v2/ui";
import RoadMap from "@/components/landing/RoadMap";
import PartnerAccess from "@/components/landing/PartnerAccess";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "v2.pages.investors" });
  return { title: t("metaTitle"), description: t("body"), alternates: localeAlternates(locale, "/nha-dau-tu") };
}

// Roadmap and investor access used to sit on the home page; they are for investors and partners, not customers.
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const hero = await getTranslations("v2.pages.investors");
  const base = getSiteUrl() + (locale === "en" ? "/en" : "");
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "LeTRON", url: base || getSiteUrl() },
    { name: hero("metaTitle"), url: base + "/nha-dau-tu" },
  ]);
  return (
    <>
      <JsonLd data={breadcrumb} />
      <V2PageHero eyebrow={hero("eyebrow")} title={hero("title")} body={hero("body")} />
      <RoadMap />
      <PartnerAccess />
      <V2Cta />
    </>
  );
}
