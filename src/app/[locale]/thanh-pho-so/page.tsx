import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo-alternates";
import { V2Cta, V2Scene } from "@/components/v2/blocks";
import { V2CardGrid, V2PageHero, V2Section, SectionHead, type V2CardItem } from "@/components/v2/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "v2.pages.city" });
  return { title: t("metaTitle"), description: t("body"), alternates: localeAlternates(locale, "/thanh-pho-so") };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("v2");
  const hero = await getTranslations("v2.pages.city");
  const products = t.raw("products") as V2CardItem[];
  const domain = [products[0], products[2], products[3]];
  const steps = t.raw("cityPage.steps") as V2CardItem[];
  return (
    <>
      <V2PageHero eyebrow={hero("eyebrow")} title={hero("title")} body={hero("body")} />
      <V2Section tone="mid">
        <V2Scene src="/v2/digital-city-concept.webp" alt={t("city.imageAlt")} caption={t("city.caption")} />
      </V2Section>
      <V2Section>
        <SectionHead
          eyebrow={t("cityPage.domainEyebrow")}
          title={t("cityPage.domainTitle")}
          lead={t("cityPage.domainBody")}
        />
        <V2CardGrid items={domain} linkLabel={t("common.explore")} />
      </V2Section>
      <V2Section tone="mid">
        <SectionHead eyebrow={t("cityPage.scopeEyebrow")} title={t("cityPage.scopeTitle")} />
        <V2CardGrid items={steps} />
      </V2Section>
      <V2Cta />
    </>
  );
}
