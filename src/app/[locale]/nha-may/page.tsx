import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo-alternates";
import { V2Cta, V2Proof, V2Scene } from "@/components/v2/blocks";
import V2Loop from "@/components/v2/Loop";
import { V2CardGrid, V2PageHero, V2Section, SectionHead, type V2CardItem } from "@/components/v2/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "v2.pages.factory" });
  return { title: t("metaTitle"), description: t("body"), alternates: localeAlternates(locale, "/nha-may") };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("v2");
  const hero = await getTranslations("v2.pages.factory");
  const products = t.raw("products") as V2CardItem[];
  const three = [products[0], products[1], products[4]];
  return (
    <>
      <V2PageHero eyebrow={hero("eyebrow")} title={hero("title")} body={hero("body")} />
      <V2Section tone="mid">
        <V2Scene src="/v2/factory-concept.webp" alt={t("factory.imageAlt")} caption={t("factory.caption")} />
      </V2Section>
      <V2Section>
        <SectionHead eyebrow={t("factoryPage.threeEyebrow")} title={t("factoryPage.threeTitle")} />
        <V2CardGrid items={three} linkLabel={t("common.explore")} />
      </V2Section>
      <V2Loop tone="mid" />
      <V2Section>
        <SectionHead
          eyebrow={t("factoryPage.robotEyebrow")}
          title={t("factoryPage.robotTitle")}
          lead={t("factoryPage.robotBody")}
        />
        <V2Scene src="/v2/le-orion-reference.webp" alt={t("factoryPage.robotAlt")} caption={t("factoryPage.robotCaption")} />
      </V2Section>
      <V2Proof />
      <V2Cta />
    </>
  );
}
