import Image from "next/image";
import type * as React from "react";
import { Play } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import LandingElementorHooks from "@/components/landing/LandingElementorHooks";
import Partners from "@/components/landing/Partners";
import Career from "@/components/landing/Career";
import { AboutHeartValues } from "./AboutHeartValues";
import { LeadershipReveal } from "./LeadershipReveal";

function SubtitleBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`inline-block rounded-full border border-[#538DC3] p-px shadow-[0px_2px_16px_0px_rgba(0,149,255,0.26)] ${className ?? ""}`}
    >
      <div className="inline-flex items-center rounded-full px-6! py-1 lg:h-10 lg:px-[13px] lg:py-0 backdrop-blur-sm font-display text-sm font-normal leading-[2] text-[#4AB3FF] 2xl:text-base">
        {children}
      </div>
    </div>
  );
}

function InfoCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-px shadow-[inset_0px_2px_8px_0px_rgba(255,255,255,0.08),0px_4px_26px_0px_rgba(0,161,219,0.08)] ${className ?? ""}`}
      style={{ backgroundImage: "linear-gradient(180deg, #2A9FFF 0%, #76C6FF 100%)" }}
    >
      <div
        className="h-full rounded-2xl bg-[#132563] px-6 py-6 sm:px-[37px] sm:py-[30px]"
        style={{ backgroundImage: "linear-gradient(180deg, rgba(42,159,255,0.55) 0%, rgba(23,71,156,0.55) 100%)" }}
      >
        {children}
      </div>
    </div>
  );
}

export default function AboutPage() {
  const t = useTranslations("about");
  const locale = useLocale();
  const MISSION_POINTS = t.raw("missionPoints") as string[];
  const orgChartSrc = locale === "en" ? "/wp-content/uploads/2026/05/so-do-en.svg" : "/wp-content/uploads/2026/05/so-do.svg";

  return (
    <div className="site-main post-723 page type-page status-publish hentry">
      <div
        className="elementor elementor-723"
        data-elementor-id={723}
        data-elementor-post-type="page"
        data-elementor-type="wp-page"
      >
        {/* Hero */}
        <section className="relative isolate flex h-[350px] items-end overflow-hidden px-6 pb-8 sm:h-[620px] sm:px-8 sm:pb-14">
          <Image
            alt=""
            src="/about/Banner.png"
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(13,27,75,0.1)_0%,rgba(13,27,75,0.3)_50%,#0D1B4B_100%)]" />
          <div className="mx-auto w-full max-w-[1320px]">
            <nav aria-label="breadcrumbs" className="rank-math-breadcrumb text-sm text-zinc-400">
              <p>
                <Link href="/">{t("breadcrumbHome")}</Link>
                <span className="separator"> / </span>
                <span className="last">{t("breadcrumbCurrent")}</span>
              </p>
            </nav>
            <h1 className="elementor-heading-title elementor-size-default mt-4 font-archivo text-3xl font-extrabold leading-[1.3]! text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-4xl">
              {t("heroTitlePrefix")}<span className="text-[#2A9FFF]">{t("heroTitleHighlight")}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-zinc-400">
              {t("heroDescription")}
            </p>
          </div>
        </section>

        {/* Giới thiệu chung */}
        <div className="mx-auto max-w-[1320px] space-y-16 px-6 py-16 sm:px-8">
          <div className="space-y-10">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-16">
              <div>
                <SubtitleBadge>{t("introBadge")}</SubtitleBadge>
                <h2 className="elementor-heading-title elementor-size-default font-archivo text-2xl font-extrabold leading-[1.3]! text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-[40px]! my-7!">
                  {t("introHeadingLine1")}
                  <br />
                  {t("introHeadingLine2Prefix")}<span className="text-[#2A9FFF]">{t("introHeadingLine2Highlight")}</span>
                </h2>
              </div>

              <div className="space-y-4 text-base font-light leading-relaxed text-white">
                <p>
                  {t("introParagraph1")}
                </p>
                <p>
                  {t("introParagraph2")}
                </p>
              </div>
            </div>

            {/* <div className="relative">
              <div
                className="elementor-element elementor-widget elementor-widget-video"
                data-widget_type="video.default"
                data-settings='{"youtube_url":"https://www.youtube.com/watch?v=XHOmBV4js_E","video_type":"youtube"}'
              >
                <div
                  className="elementor-wrapper elementor-open-inline relative w-full overflow-hidden rounded-2xl border border-white/10"
                  style={{ "--video-aspect-ratio": "16 / 9" } as React.CSSProperties}
                >
                  <div className="elementor-video" />
                  <div
                    className="elementor-custom-embed-image-overlay absolute inset-0 flex items-center justify-center bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url(/wp-content/uploads/2026/05/af37ff9a27363e04b244b5aa57821bce76b409c5-1.jpg)",
                    }}
                  >
                    <div
                      aria-label={t("playVideoLabel")}
                      className="elementor-custom-embed-play flex size-16 cursor-pointer items-center justify-center rounded-full bg-[#2A9FFF] text-white shadow-[0_2px_20px_rgba(12,178,255,0.4)] transition hover:bg-[#4AB3FF]"
                      role="button"
                      tabIndex={0}
                    >
                      <Play aria-hidden className="size-6 translate-x-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          {/* Tầm nhìn / Sứ mệnh */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
            <InfoCard>
              <Image alt="" src="/about/Eye.png" width={82} height={82} />
              <SubtitleBadge className="mt-4">{t("visionBadge")}</SubtitleBadge>
              <h3 className="my-7! font-archivo text-xl font-bold leading-[1.3] text-white sm:text-2xl">
                {t("visionHeadingLine1")}
                <br />
                {t("visionHeadingLine2Prefix")}<span className="text-[#2A9FFF]">{t("visionHeadingLine2Highlight")}</span>
              </h3>
              <p className="mt-4 text-base font-light leading-[1.5]! text-white">
                {t("visionParagraph")}
              </p>
            </InfoCard>

            <InfoCard>
              <Image alt="" src="/about/Target.png" width={82} height={82} />
              <SubtitleBadge className="mt-4">{t("missionBadge")}</SubtitleBadge>
              <h3 className="my-7! font-archivo text-xl font-bold leading-[1.3] text-white sm:text-2xl">
                {t("missionHeadingLine1")}
                <br />
                <span className="text-[#2A9FFF]">{t("missionHeadingHighlight")}</span>
              </h3>
              <p className="mt-4 text-base font-light leading-[150%] text-white">
                {t("missionIntro")}
              </p>
              <ul className="mt-4 space-y-2.5">
                {MISSION_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2.5 text-sm font-light leading-[150%] text-white"
                  >
                    <Image
                      src="/landing/LeOsAi/Tick.svg"
                      alt=""
                      width={30}
                      height={28}
                      className="flex-shrink-0"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>
          </div>

          {/* Sơ đồ tổ chức */}
          <div className="text-center">
            <h2 className="elementor-heading-title elementor-size-default font-archivo text-2xl font-extrabold leading-[1.3]! text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-[40px]!">
              {t("orgChartHeading")}
            </h2>
            <div className="mt-8">
              <Image
                alt={t("orgChartAlt")}
                src={orgChartSrc}
                width={1681}
                height={574}
                className="mx-auto h-auto w-full max-w-full"
              />
            </div>
          </div>
        </div>

        {/* Giá trị cốt lõi H.E.A.R.T */}
        <div className="mx-auto max-w-[1320px] px-6 py-16 sm:px-8">
          <AboutHeartValues />
        </div>

        {/* Ban lãnh đạo */}
        <div className="mx-auto max-w-[1320px] px-6 py-16 sm:px-8">
          <h2 className="elementor-heading-title elementor-size-default mb-10! text-center font-archivo text-2xl font-extrabold leading-[1.3]! text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-[40px]!">
            {t("leadershipHeading")}
          </h2>
          <LeadershipReveal />
        </div>

        <Partners />
        <Career />
      </div>
      <LandingElementorHooks />
    </div>
  );
}
