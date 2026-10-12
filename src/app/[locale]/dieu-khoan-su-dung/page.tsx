import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo-alternates";
import { V2PageHero, V2Section } from "@/components/v2/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "v2.pages.terms" });
  return { title: t("metaTitle"), description: t("body"), alternates: localeAlternates(locale, "/dieu-khoan-su-dung") };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("v2");
  const hero = await getTranslations("v2.pages.terms");
  const sections = t.raw("terms") as { title: string; body: string }[];
  return (
    <>
      <V2PageHero eyebrow={hero("eyebrow")} title={hero("title")} body={hero("body")} />
      <V2Section tone="mid">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <nav aria-label={t("termsUi.toc")} className="flex flex-col gap-2 lg:sticky lg:top-28 lg:self-start">
            <strong className="font-inter text-[13px] font-bold uppercase tracking-[1.6px] text-[#63D9FF]">{t("termsUi.toc")}</strong>
            {sections.map((s, i) => (
              <a key={s.title} href={`#t${i}`} className="font-open-sans text-[14px] leading-[22px] text-white/80 no-underline hover:text-white">
                {i + 1}. {s.title}
              </a>
            ))}
          </nav>
          <article className="flex max-w-[780px] flex-col gap-8">
            <p className="font-open-sans m-0 text-[13px] text-white/60">
              {t("termsUi.updatedLabel")}: {t("termsUi.updated")}
            </p>
            {sections.map((s, i) => (
              <section key={s.title} id={`t${i}`} className="scroll-mt-28">
                <h2 className="font-inter m-0 mb-3 text-[22px] font-bold text-[#63D9FF]">
                  {i + 1}. {s.title}
                </h2>
                <p className="font-open-sans m-0 text-[16px] leading-[27px] text-[#E5F0FA]">{s.body}</p>
              </section>
            ))}
          </article>
        </div>
      </V2Section>
    </>
  );
}
