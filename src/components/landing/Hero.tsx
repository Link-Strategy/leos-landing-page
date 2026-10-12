"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import MasterButton from "@/components/ui/master-button";
import SectionEdgeFade from "@/components/ui/section-edge-fade";
import HeroOrbit from "@/components/landing/HeroOrbit";

export default function Hero() {
  const t = useTranslations("hero");
  const features = t.raw("features") as string[];
  const footerTags = t.raw("footerTags") as string[];

  return (
    <section
      className="relative flex min-h-[600px] items-center overflow-hidden bg-cover bg-center bg-no-repeat pt-[calc(var(--header-height-mobile)+20px)] lg:min-h-[800px] lg:items-start lg:pt-[calc(var(--header-height)+40px)]"
      style={{ backgroundImage: "url('/landing/Hero/Hero_bg.webp')" }}
    >
      <SectionEdgeFade position="top" />
      <SectionEdgeFade position="bottom" />

      <div className="container-le relative z-10 flex w-full flex-col items-center gap-16 py-16 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10 lg:py-0">
        {/* Left content */}
        <div className="flex flex-col items-center text-center lg:items-start lg:self-start lg:text-left">
          <div className="flex flex-col items-center gap-[14px] lg:items-start">
            <span className="font-inter text-[14px] font-bold uppercase leading-[16px] tracking-[2.2px] text-[#63D9FF] [text-shadow:0px_0px_6px_rgba(99,217,255,0.18)]">
              {t("badge")}
            </span>

            <h1 className="font-inter text-[40px] font-extrabold leading-[1.2] tracking-[-1.5px] text-white sm:text-[60px] sm:leading-[76px] sm:tracking-[-2.2px] whitespace-pre-line">
              {t("title")}
            </h1>

            <p className="font-inter text-[20px] font-bold leading-[28px] tracking-[-0.3px] text-[#63D9FF] sm:text-[24px] sm:leading-[32px]">
              {t("subtitle")}
            </p>

            <ul className="flex w-full flex-col items-start gap-2 lg:w-auto lg:flex-row lg:flex-wrap lg:items-center lg:justify-start lg:gap-x-6 lg:gap-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-[6px]">
                  <Image src="/landing/LeOsAi/Tick.svg" alt="" width={20} height={20} className="shrink-0" />
                  <span className="font-open-sans text-[18px] font-normal leading-[30px] tracking-[0px] text-white">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <p className="font-open-sans text-[18px] font-light leading-[30px] tracking-[0px] text-[#F4F4F4]">
              {t("description")}
            </p>
          </div>

          <div className="mt-10 flex w-full flex-col items-center gap-4 lg:w-auto lg:flex-row lg:justify-start">
            <MasterButton type="full-fill" isShowIcon content={t("ctaPrimary")} onClick={() => {}} />
            <MasterButton type="out-line" isShowIcon content={t("ctaSecondary")} onClick={() => {}} />
          </div>
        </div>

        {/* Right visual: V2 sun + two-orbit diagram */}
        <HeroOrbit sunAlt={t("subtitle")} />
      </div>

      {/* Bottom tagline row — desktop only, 40px above the section's bottom edge */}
      <div className="absolute inset-x-0 bottom-10 z-10 hidden items-center justify-center gap-[46px] lg:flex">
        {footerTags.map((tag) => (
          <span
            key={tag}
            className="font-inter text-[14px] font-bold leading-[16px] tracking-[2.2px] text-white"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
