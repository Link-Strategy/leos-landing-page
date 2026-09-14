import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getCachedLatestPublishedBlogArticles } from "@/lib/blog/queries";
import SectionEdgeFade from "@/components/ui/section-edge-fade";
import MobileCardCarousel from "@/components/landing/MobileCardCarousel";

type NewsArticle = Awaited<ReturnType<typeof getCachedLatestPublishedBlogArticles>>[number];

function NewsCard({
  article,
  defaultTag,
  ctaLabel,
  monthPrefix,
}: {
  article: NewsArticle;
  defaultTag: string;
  ctaLabel: string;
  monthPrefix: string;
}) {
  const publishDate = article.publishedAt ? new Date(article.publishedAt) : new Date();
  const day = String(publishDate.getDate()).padStart(2, "0");
  const month = `${monthPrefix} ${publishDate.getMonth() + 1}`;

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[22px] border"
      style={{
        borderColor: "rgba(42,159,255,0.34)",
        background: "linear-gradient(180deg, #0D224E 0%, #071332 100%)",
        boxShadow: "0px 10px 24px 0px rgba(0,89,242,0.16)",
      }}
    >
      <div className="relative h-[208px] w-full shrink-0 overflow-hidden bg-[#071332]">
        {article.coverImage && (
          <img
            src={article.coverImage}
            alt={article.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span
          className="absolute top-[14px] left-[14px] inline-flex h-[30px] items-center rounded-full px-[13px] font-inter text-[12px] leading-[16px]! font-bold tracking-[0.96px] text-white uppercase"
          style={{ background: "rgba(5,12,31,0.82)" }}
        >
          {article.category || defaultTag}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-[14px] px-6 pt-6 pb-[26px]">
        <p className="font-inter text-[12px] leading-[16px]! font-semibold tracking-[0.48px] text-white uppercase">
          {day} {month}
        </p>
        <p className="font-inter line-clamp-2 text-[18px] leading-[24px]! font-bold tracking-[-0.2px] text-white">
          {article.title}
        </p>
        <p className="font-inter mt-auto flex items-center gap-1 text-[14px] leading-[20px]! font-bold text-white">
          {ctaLabel} <span aria-hidden>→</span>
        </p>
      </div>
    </Link>
  );
}

export default async function News() {
  const t = await getTranslations("news");

  let articles: Awaited<ReturnType<typeof getCachedLatestPublishedBlogArticles>> = [];
  try {
    articles = await getCachedLatestPublishedBlogArticles(6);
  } catch {
    articles = [];
  }

  if (articles.length === 0) return null;

  const featured = articles.slice(0, 3);
  const defaultTag = t("defaultTag");
  const ctaLabel = t("cardCta");
  const monthPrefix = t("dateMonthPrefix");

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 70% 45% at 43% 44%, rgba(42,159,255,0.1) 0%, rgba(42,159,255,0.03) 56%, rgba(0,0,0,0) 100%), linear-gradient(90deg, #020E30 0%, #031B4C 34%, #0D1B4B 68%, #020E30 100%)",
      }}
    >
      <SectionEdgeFade position="top" />
      <SectionEdgeFade position="bottom" />

      <div className="container-le relative z-10 flex flex-col gap-9 py-16 lg:py-20">
        <div className="h-px w-full" style={{ background: "#2A9FFF" }} />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-3">
            <p
              className="font-inter text-[13px] leading-[18px]! font-bold tracking-[2.2px] text-[#63D9FF] uppercase lg:text-[14px] lg:leading-[16px]!"
              style={{ textShadow: "0px 0px 6px rgba(99,217,255,0.18)" }}
            >
              {t("eyebrow")}
            </p>
            <h2 className="font-inter text-[28px] leading-[34px]! font-bold tracking-[-0.5px] text-white lg:text-[40px] lg:leading-[48px]! lg:tracking-[-1px]">
              <span>{t("headingBefore")} </span>
              <span style={{ color: "#2A9FFF" }}>{t("headingAccent")}</span>
              <br />
              <span>{t("headingLine2")}</span>
            </h2>
          </div>

          <Link
            href="/blog"
            className="inline-flex h-[46px] w-fit shrink-0 cursor-pointer items-center gap-[10px] rounded-full border px-[22px] font-inter text-[14px] font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:opacity-80"
            style={{ borderColor: "#2A9FFF" }}
          >
            <span>{t("ctaAll")}</span>
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-5">
          {featured.map((article) => (
            <NewsCard
              key={article.externalId}
              article={article}
              defaultTag={defaultTag}
              ctaLabel={ctaLabel}
              monthPrefix={monthPrefix}
            />
          ))}
        </div>

        <MobileCardCarousel
          items={featured.map((article) => (
            <NewsCard
              key={article.externalId}
              article={article}
              defaultTag={defaultTag}
              ctaLabel={ctaLabel}
              monthPrefix={monthPrefix}
            />
          ))}
        />
      </div>
    </section>
  );
}
