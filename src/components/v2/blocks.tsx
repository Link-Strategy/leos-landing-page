import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  Caption,
  Eyebrow,
  Lead,
  SectionHead,
  SectionTitle,
  StatusTag,
  V2Card,
  V2CardGrid,
  V2Section,
  type V2CardItem,
} from "@/components/v2/ui";
import { ContactCta } from "@/components/contact/ContactDialog";

export async function V2Principles() {
  const t = await getTranslations("v2");
  const items = t.raw("principles") as { eyebrow: string; title: string; body: string }[];
  return (
    <V2Section tone="mid">
      <V2CardGrid items={items} />
    </V2Section>
  );
}

export async function V2Feature({ which }: { which: "factory" | "city" }) {
  const t = await getTranslations("v2");
  const factory = which === "factory";
  const key = factory ? "factory" : "city";
  const image = factory ? "/v2/factory-concept.webp" : "/v2/digital-city-concept.webp";

  const figure = (
    <figure className="m-0 flex flex-col gap-3">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px] border border-white/25">
        <Image
          src={image}
          alt={t(`${key}.imageAlt`)}
          fill
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover"
        />
      </div>
      <figcaption>
        <Caption>{t(`${key}.caption`)}</Caption>
      </figcaption>
    </figure>
  );

  const copy = (
    <div className="flex flex-col items-start gap-4">
      <Eyebrow>{t(`${key}.eyebrow`)}</Eyebrow>
      <SectionTitle>{t(`${key}.title`)}</SectionTitle>
      <Lead>{t(`${key}.body`)}</Lead>
      <StatusTag>{t(`${key}.tag`)}</StatusTag>
      <ContactCta variant="link" topic={t(`${key}.topic`)} interest={t(`${key}.interest`)}>
        {t(`${key}.cta`)}
      </ContactCta>
    </div>
  );

  return (
    <V2Section tone={factory ? "dark" : "mid"}>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {factory ? (
          <>
            {copy}
            {figure}
          </>
        ) : (
          <>
            <div className="order-2 lg:order-1">{figure}</div>
            <div className="order-1 lg:order-2">{copy}</div>
          </>
        )}
      </div>
    </V2Section>
  );
}

export async function V2Portfolio() {
  const t = await getTranslations("v2.portfolio");
  return (
    <V2Section tone="mid">
      <div className="grid items-center gap-10 lg:grid-cols-[340px_1fr] lg:gap-14">
        <div className="flex flex-col gap-3 rounded-[20px] border border-white/25 bg-[#FFFFFF14] p-7">
          <span className="font-inter text-[88px] font-extrabold leading-none text-[#FAB81F] lg:text-[112px]">{t("number")}</span>
          <h3 className="font-inter m-0 text-[20px] font-bold leading-[26px] text-white">{t("metricTitle")}</h3>
          <Caption>{t("metricCaption")}</Caption>
        </div>
        <div className="flex flex-col items-start gap-4">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <SectionTitle>{t("title")}</SectionTitle>
          <Lead>{t("lead")}</Lead>
          <Caption>{t("caption")}</Caption>
          <ContactCta tone="outline" topic={t("topic")} interest={t("interest")}>
            {t("cta")}
          </ContactCta>
        </div>
      </div>
    </V2Section>
  );
}

export async function V2Proof() {
  const t = await getTranslations("v2.proof");
  const items = t.raw("items") as V2CardItem[];
  return (
    <V2Section>
      <SectionHead eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <V2CardGrid items={items} />
    </V2Section>
  );
}

export async function V2Philosophy() {
  const t = await getTranslations("v2.philosophy");
  return (
    <V2Section tone="mid">
      <div className="mx-auto flex max-w-[900px] flex-col items-center gap-4 text-center">
        <p className="font-inter m-0 text-[26px] font-extrabold leading-[34px] tracking-[1px] text-white lg:text-[38px] lg:leading-[48px]">
          {t("quote")}
        </p>
        <Eyebrow>{t("attribution")}</Eyebrow>
        <Lead>{t("lead")}</Lead>
      </div>
    </V2Section>
  );
}

export async function V2Cta() {
  const t = await getTranslations("v2.cta");
  return (
    <V2Section>
      <div className="flex flex-col items-start gap-4 rounded-[24px] border border-[#2A9FFF]/55 bg-[linear-gradient(135deg,#0a2a63_0%,#061a40_100%)] p-8 lg:p-12">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="font-inter m-0 text-[28px] font-bold leading-[36px] text-white lg:text-[40px] lg:leading-[48px]">{t("title")}</h2>
        <Lead>{t("body")}</Lead>
        <div className="pt-2">
          <ContactCta>{t("button")}</ContactCta>
        </div>
      </div>
    </V2Section>
  );
}

/** Table of design status per component (platform and technology pages). */
export async function V2Readiness() {
  const t = await getTranslations("v2");
  const products = t.raw("products") as V2CardItem[];
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-[20px] border border-white/25">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr className="bg-[#FFFFFF14]">
              <th className="px-5 py-3 font-inter text-[12px] font-bold uppercase tracking-[1.6px] text-[#63D9FF]">{t("platformPage.tableHeadComponent")}</th>
              <th className="px-5 py-3 font-inter text-[12px] font-bold uppercase tracking-[1.6px] text-[#63D9FF]">{t("platformPage.tableHeadStatus")}</th>
              <th className="px-5 py-3 font-inter text-[12px] font-bold uppercase tracking-[1.6px] text-[#63D9FF]">{t("platformPage.tableHeadUpdated")}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.title} className="border-t border-white/15">
                <td className="px-5 py-3 font-inter text-[15px] font-semibold text-white">{p.title}</td>
                <td className="px-5 py-3 font-open-sans text-[14px] text-[#E5F0FA]">{p.status}</td>
                <td className="px-5 py-3 font-open-sans text-[14px] text-white/70">{t("platformPage.updatedDate")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Caption>{t("platformPage.readinessNote")}</Caption>
    </div>
  );
}

/** About page additions from V2: mission, the Chairman's philosophy and the capability ecosystem. */
export async function V2AboutBlocks() {
  const t = await getTranslations("v2.aboutV2");
  const eco = t.raw("eco") as V2CardItem[];
  return (
    <>
      <V2Section tone="mid">
        <div className="mx-auto max-w-[900px]">
          <V2Card item={{ eyebrow: t("missionEyebrow"), title: t("missionTitle"), body: t("missionBody") }} />
        </div>
      </V2Section>
      <V2Philosophy />
      <V2Section>
        <SectionHead eyebrow={t("ecoEyebrow")} title={t("ecoTitle")} />
        <V2CardGrid items={eco} />
      </V2Section>
    </>
  );
}

/** Wide illustration with its caption, used on the factory and city pages. */
export function V2Scene({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px] border border-white/25">
        <Image src={src} alt={alt} fill sizes="(min-width: 1280px) 1180px, 100vw" className="object-cover" />
      </div>
      <figcaption>
        <Caption>{caption}</Caption>
      </figcaption>
    </figure>
  );
}

export { V2Card, V2CardGrid };
