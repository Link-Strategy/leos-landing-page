import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo-alternates";
import { V2Cta, V2Proof } from "@/components/v2/blocks";
import { V2CardGrid, V2Notice, V2PageHero, V2Section, SectionHead, type V2CardItem } from "@/components/v2/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "v2.pages.solutions" });
  return { title: t("metaTitle"), description: t("body"), alternates: localeAlternates(locale, "/giai-phap") };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("v2");
  const hero = await getTranslations("v2.pages.solutions");
  const sectors = t.raw("sectors") as V2CardItem[];
  return (
    <>
      <V2PageHero eyebrow={hero("eyebrow")} title={hero("title")} body={hero("body")} />
      <V2Section tone="mid">
        <SectionHead eyebrow={t("solutionsPage.sectorsEyebrow")} title={t("solutionsPage.sectorsTitle")} />
        <V2CardGrid items={sectors} linkLabel={t("common.viewSolution")} />
      </V2Section>
      <V2Proof />
      <V2Section>
        <V2Notice title={t("solutionsPage.noticeTitle")} body={t("solutionsPage.noticeBody")} />
      </V2Section>
      <V2Cta />
    </>
  );
}
