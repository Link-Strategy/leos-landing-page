"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import SectionEdgeFade from "@/components/ui/section-edge-fade";
import MasterButton from "@/components/ui/master-button";

const BG_IMAGE = "/landing/PartnerAccess/PartnerAccess_bg.png";

export default function PartnerAccess() {
  const t = useTranslations("partnerAccess");

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 70% 45% at 47% 44%, rgba(42,159,255,0.12) 0%, rgba(42,159,255,0.035) 56%, rgba(0,0,0,0) 100%), linear-gradient(90deg, #020E30 0%, #031B4C 34%, #0D1B4B 68%, #020E30 100%)",
      }}
    >
      <Image src={BG_IMAGE} alt="" fill className="object-cover opacity-84" />
      <SectionEdgeFade position="top" />
      <SectionEdgeFade position="bottom" />

      {/* The theme's global `p { margin: 0 !important }` reset blocks any margin utility on
          a <p>, so spacing between the eyebrow/panel/disclaimer is done via flex gap instead. */}
      <div className="container-le relative z-10 flex flex-col gap-[48px] py-16 lg:py-20">
        <p
          className="font-inter text-[13px] leading-[18px]! font-bold tracking-[2.2px] text-[#63D9FF] uppercase lg:text-[14px] lg:leading-[20px]!"
          style={{ textShadow: "0px 0px 6px rgba(99,217,255,0.18)" }}
        >
          {t("eyebrow")}
        </p>

        <div className="flex flex-col gap-6">
          <div
            className="relative mx-auto w-full max-w-[1200px] overflow-hidden rounded-[22px] border-[1.4px] px-6 py-7 lg:rounded-[28px] lg:border-[1.6px] lg:px-[62px] lg:py-16"
            style={{ borderColor: "rgba(63,204,255,0.9)", boxShadow: "0px 16px 24px 0px rgba(20,115,255,0.36)" }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 backdrop-blur-[9px]"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse 61% 61% at 51% 54%, rgba(63,209,255,0.13) 0%, rgba(42,159,255,0.045) 58%, rgba(0,0,0,0) 100%), linear-gradient(90deg, rgba(5,18,48,0.94) 0%, rgba(7,27,66,0.92) 52%, rgba(4,14,42,0.94) 100%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[inherit]"
              style={{ boxShadow: "inset 0px 0px 26px 0px rgba(71,214,255,0.18)" }}
            />

            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <div className="flex flex-col gap-4 text-white lg:max-w-[560px]">
                <p className="font-inter text-[14px] leading-[16px]! font-bold tracking-[2.2px]">{t("badge")}</p>
                <h2 className="font-inter text-[22px] leading-[28px]! font-bold tracking-[-0.3px] lg:text-[34px] lg:leading-[42px]!">
                  <span>{t("headingBefore")} </span>
                  <span style={{ color: "#2A9FFF" }}>{t("headingAccent")}</span>
                  <span> {t("headingAfter")}</span>
                </h2>
                <p className="font-open-sans text-[15px] leading-[24px]! font-normal lg:hidden lg:text-[16px] lg:leading-[26px]!">
                  {t("descriptionMobile")}
                </p>
                <div className="font-open-sans hidden text-[16px] leading-[26px]! font-normal lg:block">
                  <p>{t("description")}</p>
                  <p>{t("descriptionDetail")}</p>
                </div>
              </div>

              <div
                className="hidden h-[210px] w-px shrink-0 lg:block"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(56,191,255,0) 0%, rgba(56,191,255,0.7) 50%, rgba(56,191,255,0) 100%)",
                }}
              />

              <div className="flex w-full flex-col gap-4 lg:w-auto lg:shrink-0">
                <MasterButton type="out-line" isShowIcon content={t("ctaPrimary")} onClick={() => {}} />
                <MasterButton type="full-fill" isShowIcon content={t("ctaSecondary")} onClick={() => {}} />
              </div>
            </div>
          </div>

          <p className="font-open-sans text-[13px] leading-[20px]! font-normal text-white lg:hidden">
            {t("mobileDisclaimer")}
          </p>
        </div>
      </div>
    </section>
  );
}
