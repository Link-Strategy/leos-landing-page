import Image from "next/image";
import type * as React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import LandingElementorHooks from "@/components/landing/LandingElementorHooks";
import Products from "@/components/landing/Products";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const STAT_KEYS = ["statOptimizeCost", "statOperationEfficiency", "statEnvironmentImpact"] as const;

interface FaqItem {
  question: string;
  answer: string;
}

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

export default function SanPhamPage() {
  const t = useTranslations("productsPage");
  const faqItems = t.raw("faqItems") as FaqItem[];

  return (
    <div className="site-main post-423 page type-page status-publish hentry">
      <div
        className="elementor elementor-423"
        data-elementor-id={423}
        data-elementor-post-type="page"
        data-elementor-type="wp-page"
      >
        {/* Hero */}
        <section className="relative isolate flex min-h-[350px] flex-col justify-end overflow-hidden px-6 pb-8 sm:min-h-[620px] sm:px-8 sm:pb-14">
          <Image
            alt=""
            src="/wp-content/uploads/2026/05/image-23-1.jpg"
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

        {/* Sản phẩm được vận hành theo hệ thống */}
        <section className="bg-[#0D1B4B]">
          <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-10 px-6 py-16 sm:px-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="elementor-heading-title elementor-size-default font-archivo text-2xl font-extrabold leading-[1.3]! text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-[40px]!">
                {t("introHeadingLine1")}
                <br />
                <span className="text-[#2A9FFF]">{t("introHeadingLine2")}</span>
              </h2>
              <p className="mt-4 text-base font-light leading-relaxed text-white">
                {t("introParagraph")}
              </p>
              <ul className="mt-7 space-y-2">
                {STAT_KEYS.map((key) => (
                  <li className="flex items-center gap-2" key={key}>
                    <Image alt="" aria-hidden height={28} src="/san-pham/icon-list-item.png" width={30} />
                    <span className="font-archivo text-base leading-[1.3] text-white">{t(key)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <Image
                alt=""
                className="h-auto w-full rounded-2xl"
                height={457}
                sizes="(max-width: 1024px) 100vw, 800px"
                src="/wp-content/uploads/2026/05/ad408cb3168053cbbf00b6f78be954d0b71ffbba-1.jpg"
                width={800}
              />
              <Image
                alt=""
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full"
                height={606}
                src="/wp-content/uploads/2026/05/img-2-2-1.png"
                width={853}
              />
            </div>
          </div>
        </section>

        {/* Sản phẩm LeTRON — dùng lại carousel của trang chủ */}
        <div className="relative bg-[#0D1B4B]">
          <Products />
        </div>

        {/* FAQ */}
        <section className="bg-[#0D1B4B] px-6 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-[820px] text-center">
            <SubtitleBadge>{t("faqBadge")}</SubtitleBadge>
            <h2 className="elementor-heading-title elementor-size-default mt-5! font-archivo text-2xl font-extrabold leading-[1.3]! text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-[40px]!">
              {t("faqHeadingPrefix")}<span className="text-[#2A9FFF]">{t("faqHeadingHighlight")}</span>
            </h2>
          </div>

          <Accordion
            className="mx-auto mt-10 max-w-[1112px] space-y-3 lg:space-y-[22px]"
            collapsible
            defaultValue="item-0"
            type="single"
          >
            {faqItems.map((item, index) => (
              <AccordionItem
                className="relative isolate cursor-pointer overflow-hidden rounded-[20px] border-b-0 bg-[#0D1B4B14] shadow-[0px_2px_20px_0px_#0CB2FF1F] backdrop-blur-[36px] transition-colors duration-300 hover:bg-[#17479C42] data-[state=open]:bg-[#17479C42]"
                key={item.question}
                value={`item-${index}`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[inherit] p-px"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.2376) 0%, rgba(255,255,255,0) 37.02%, rgba(215,229,255,0.594) 68.51%, rgba(174,203,255,0.66) 100%)",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />
                <AccordionTrigger className="relative w-full cursor-pointer px-6 py-5 text-base sm:px-[41px] sm:py-[29px] sm:text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="relative px-6 pb-5 pt-0 text-sm text-white/70 sm:px-[41px] sm:pb-[29px] sm:text-base">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
      <LandingElementorHooks />
    </div>
  );
}
