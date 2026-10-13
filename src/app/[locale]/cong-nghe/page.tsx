import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo-alternates";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/blog/seo";
import { buildBreadcrumbJsonLd } from "@/lib/jsonld";
import { V2Cta, V2Portfolio, V2Readiness } from "@/components/v2/blocks";
import TechArchitecture from "@/components/landing/TechArchitecture";
import { V2CardGrid, V2Notice, V2PageHero, V2Section, SectionHead, type V2CardItem } from "@/components/v2/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "v2.pages.technology" });
  return { title: t("metaTitle"), description: t("body"), alternates: localeAlternates(locale, "/cong-nghe") };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("v2");
  const hero = await getTranslations("v2.pages.technology");
  const base = getSiteUrl() + (locale === "en" ? "/en" : "");
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "LeTRON", url: base || getSiteUrl() },
    { name: hero("metaTitle"), url: base + "/cong-nghe" },
  ]);
  const capabilities = t.raw("technologyPage.capabilities") as V2CardItem[];
  return (
    <>
      <JsonLd data={breadcrumb} />
      <V2PageHero eyebrow={hero("eyebrow")} title={hero("title")} body={hero("body")} />
      <V2Portfolio />
      <TechArchitecture />
      <V2Section>
        <SectionHead eyebrow={t("technologyPage.capEyebrow")} title={t("technologyPage.capTitle")} />
        <V2CardGrid items={capabilities} linkLabel={t("common.viewSolution")} />
      </V2Section>
      <V2Section tone="mid">
        <SectionHead
          eyebrow={t("technologyPage.honestEyebrow")}
          title={t("technologyPage.honestTitle")}
          lead={t("technologyPage.honestBody")}
        />
        <V2Readiness />
        <div className="mt-8">
          <V2Notice title={t("technologyPage.docsTitle")} body={t("technologyPage.docsBody")} />
        </div>
      </V2Section>
      <V2Cta />
    </>
  );
}
