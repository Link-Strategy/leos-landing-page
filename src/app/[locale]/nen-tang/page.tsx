import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo-alternates";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/blog/seo";
import { buildBreadcrumbJsonLd } from "@/lib/jsonld";
import { V2Cta, V2Readiness } from "@/components/v2/blocks";
import V2Loop from "@/components/v2/Loop";
import AppDownload from "@/components/landing/AppDownload";
import { V2CardGrid, V2PageHero, V2Section, SectionHead, type V2CardItem } from "@/components/v2/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "v2.pages.platform" });
  return { title: t("metaTitle"), description: t("body"), alternates: localeAlternates(locale, "/nen-tang") };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("v2");
  const hero = await getTranslations("v2.pages.platform");
  const base = getSiteUrl() + (locale === "en" ? "/en" : "");
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "LeTRON", url: base || getSiteUrl() },
    { name: hero("metaTitle"), url: base + "/nen-tang" },
  ]);
  const products = t.raw("products") as V2CardItem[];
  return (
    <>
      <JsonLd data={breadcrumb} />
      <V2PageHero eyebrow={hero("eyebrow")} title={hero("title")} body={hero("body")} />
      <V2Section tone="mid">
        <SectionHead eyebrow={t("platformPage.componentsEyebrow")} title={t("platformPage.componentsTitle")} />
        <V2CardGrid items={products} linkLabel={t("common.explore")} />
      </V2Section>
      <V2Section>
        <SectionHead
          eyebrow={t("platformPage.softwareEyebrow")}
          title={t("platformPage.softwareTitle")}
          lead={t("platformPage.softwareBody")}
        />
        <V2Readiness />
      </V2Section>
      <V2Loop tone="mid" />
      <AppDownload />
      <V2Cta />
    </>
  );
}
