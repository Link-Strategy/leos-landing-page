"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SectionEdgeFade from "@/components/ui/section-edge-fade";

// Same pill-shaped tab bar as HeartTab.tsx — reused verbatim so the two tab
// systems on the page look identical.
const tabTriggerClass =
  "relative z-[1] flex h-auto items-center justify-center rounded-full border-0 bg-transparent px-[21px] py-2.5 font-sans text-xl font-semibold uppercase leading-[1.5] text-white transition-colors duration-300 hover:text-[#2A9FFF] data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#E2F3FF] data-[state=active]:to-white data-[state=active]:text-[#2A9FFF] max-[1550px]:px-[18px] max-[1550px]:py-2 max-[1550px]:text-lg max-[1024px]:px-3.5 max-[1024px]:py-1.5 max-[1024px]:text-sm max-[767px]:shrink-0 max-[767px]:px-2.5 max-[767px]:py-1 max-[767px]:text-xs";

type TabKey = "coreTech" | "zeroTrust" | "standards";

// Gradient ring border for the two small pill circles, painted with the same mask/xor
// technique as HeartCard's ring (border-image ignores border-radius on its corners).
const CIRCLE_BORDER_GRADIENT =
  "linear-gradient(90deg, rgba(82,209,255,0.7216) 0%, rgba(23,97,219,0.4224) 52%, rgba(41,153,255,0.5808) 100%)";

function CoreTechCircle({ icon, title, size = "lg" }: { icon: string; title: string; size?: "lg" | "sm" }) {
  const isSmall = size === "sm";
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full backdrop-blur-[12px] ${isSmall ? "h-16 w-16" : "h-[104px] w-[104px]"}`}
      style={{
        background: "linear-gradient(90deg, rgba(10,56,133,0.34) 0%, rgba(3,18,56,0.5) 50%, rgba(5,41,97,0.3) 100%)",
        boxShadow: "0px 1px 7px 0px #33C2FF1F inset, 0px 0px 10px 0px #0857EB3D",
      }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          padding: 1,
          background: CIRCLE_BORDER_GRADIENT,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div className={`relative z-10 flex flex-col items-center ${isSmall ? "gap-1" : "gap-2"}`}>
        <Image
          src={icon}
          alt={title}
          width={isSmall ? 28 : 42}
          height={isSmall ? 28 : 42}
          className={isSmall ? "h-7! w-7! object-contain" : "h-[42px]! w-[42px]! object-contain"}
        />
        <span className={`font-inter font-bold text-white ${isSmall ? "text-[11px] leading-[14px]!" : "text-[16px] leading-[21px]!"}`}>
          {title}
        </span>
      </div>
    </div>
  );
}

const ZERO_TRUST_ICONS = [
  "/landing/TechArchitecture/Secure_Hardware.png",
  "/landing/TechArchitecture/Token_Validation.png",
  "/landing/TechArchitecture/Identity_Verification.png",
  "/landing/TechArchitecture/Trust_Granted.png",
];

type ZeroTrustStep = { title: string; content: string };

function ZeroTrustCard({ index, title, icon, content }: { index: number; title: string; icon: string; content: string }) {
  return (
    <div
      className="relative flex h-[330px] w-[250px] shrink-0 flex-col items-center px-6 pt-9 rounded-[14px] border"
      style={{
        background: "linear-gradient(90deg, rgba(6,26,64,0.98) 0%, rgba(9,33,82,0.98) 100%)",
        borderColor: "#1FA1FFC7",
        boxShadow: "0px 10px 28px 0px #0D73FF29",
      }}
    >
      <div
        className="absolute -top-[27px] left-1/2 flex h-[54px] w-[54px] -translate-x-1/2 items-center justify-center rounded-full border"
        style={{ background: "#051A40", borderColor: "#1FA1FFE5" }}
      >
        <span className="font-inter text-[20px] leading-[28px]! font-semibold text-white">{String(index).padStart(2, "0")}</span>
      </div>

      <Image src={icon} alt="" width={54} height={54} className="h-[54px]! w-[54px]! object-contain" />
      <p className="font-inter mt-3! text-center text-[24px] leading-[30px]! font-bold text-white">
        {title.split(" ").map((word, index) => (
          <React.Fragment key={word}>
            {index > 0 && <br />}
            {word}
          </React.Fragment>
        ))}
      </p>

      <div className="my-5! h-px w-full" style={{ background: "#33A8FF4D" }} />

      <p className="font-open-sans text-center text-[14px] leading-[21px]! font-normal text-white">{content}</p>
    </div>
  );
}

// Mobile timeline card: header row (title left, icon right, spaced apart) instead of the
// desktop's stacked/centered layout — the number badge lives outside, on the vertical line.
function ZeroTrustCardMobile({ title, icon, content }: { title: string; icon: string; content: string }) {
  return (
    <div
      className="flex w-full flex-col rounded-xl border px-5 py-4"
      style={{
        background: "linear-gradient(90deg, rgba(6,26,64,0.98) 0%, rgba(9,33,82,0.98) 100%)",
        borderColor: "#1FA1FFC7",
        boxShadow: "0px 10px 28px 0px #0D73FF29",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-inter text-[20px] leading-[26px]! font-bold text-white">{title}</p>
        <Image src={icon} alt="" width={36} height={36} className="h-9! w-9! shrink-0 object-contain" />
      </div>

      <div className="my-3! h-px w-full" style={{ background: "#33A8FF4D" }} />

      <p className="font-open-sans text-[13px] leading-[20px]! font-normal text-white">{content}</p>
    </div>
  );
}

const STANDARDS_ICONS = [
  "/landing/TechArchitecture/hardware.png",
  "/landing/TechArchitecture/target.png",
  "/landing/TechArchitecture/internet.png",
];

type StandardsCardStep = { title: string; subTitle: string; content: string[] };

// Same layout at every breakpoint per spec — only the outer width changes (fixed on desktop,
// full-width on mobile), so this single component covers both.
function StandardsCard({ index, title, subTitle, icon, content }: { index: number } & StandardsCardStep & { icon: string }) {
  return (
    <div
      className="flex h-auto w-full shrink-0 flex-col rounded-[14px] border px-7 py-[26px] lg:h-[310px] lg:w-[350px]"
      style={{
        background: "linear-gradient(90deg, rgba(5,23,59,0.96) 0%, rgba(8,31,77,0.98) 100%)",
        borderColor: "#1FA1FFAD",
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-inter text-[36px] leading-[44px]! font-semibold text-white">{String(index).padStart(2, "0")}</span>
        <span className="font-inter text-right text-[12px] leading-[18px]! font-semibold text-white">{title}</span>
      </div>

      <div className="my-5! h-px w-full" style={{ background: "#2EA6FF47" }} />

      <div className="mb-[30px]! flex items-center gap-[18px]">
        <Image src={icon} alt="" width={44} height={44} className="h-11! w-11! shrink-0 object-contain" />
        <span className="font-inter text-[22px] leading-[30px]! font-bold text-white">{subTitle}</span>
      </div>

      <div className="flex flex-col gap-[14px]">
        {content.map((line) => (
          <div key={line} className="flex items-center gap-[10px]">
            <Image src="/landing/TechArchitecture/Check.png" alt="" width={18} height={18} className="h-[18px]! w-[18px]! shrink-0 object-contain" />
            <p className="font-open-sans text-[14px] leading-[22px]! font-normal text-white">{line}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

type CoreTechCardData = {
  title: string;
  logo: string;
  logoText: string;
  content: string[];
  footer: string;
};

function CoreTechCard({ title, logo, logoText, content, footer }: CoreTechCardData) {
  return (
    <div
      className="flex h-auto w-full shrink-0 flex-col gap-4 rounded-[28px] border p-7 lg:h-[520px] lg:w-[340px]"
      style={{
        borderColor: "#2B8CFF9E",
        background:
          "linear-gradient(90deg, rgba(3,13,38,0.94) 0%, rgba(2,6,22,0.9) 100%), radial-gradient(90.91% 62.5% at 76.36% 50%, rgba(26,133,255,0.16) 0%, rgba(0,38,115,0) 100%)",
        boxShadow: "0px 0px 24px 0px #0073FF2E",
      }}
    >
      <p className="font-inter text-[14px] leading-[21px]! font-bold tracking-[0.48px] text-[#63D9FF]">{title}</p>

      <div className="flex items-center gap-[14px]">
        <Image src={logo} alt={logoText} width={44} height={44} className="h-11! w-11! object-contain" />
        <span className="font-inter text-[28px] leading-[34px]! font-bold text-white">{logoText}</span>
      </div>

      <div
        className="h-px w-full"
        style={{ background: "linear-gradient(90deg, rgba(51,184,255,0.78) 0%, rgba(51,184,255,0.06) 100%)" }}
      />

      {content.map((line) => (
        <div key={line} className="flex items-start gap-2">
          <Image src="/landing/LeOsAi/Tick.svg" alt="" width={24} height={24} className="h-6! w-6! shrink-0 object-contain" />
          <p className="font-inter text-[15px] leading-[24px]! font-normal text-[#E8F5FF]">{line}</p>
        </div>
      ))}

      <p className="font-inter text-[14px] leading-[21px]! font-bold text-[#4DD1FF]">{footer}</p>
    </div>
  );
}

export default function TechArchitecture() {
  const t = useTranslations("techArchitecture");
  const [activeTab, setActiveTab] = React.useState<TabKey>("coreTech");

  const badgeItems = t.raw("coreTech.badge") as string[];
  const leosCardContent = t.raw("coreTech.cards.leos.content") as string[];
  const leleCardContent = t.raw("coreTech.cards.lele.content") as string[];
  const zeroTrustSteps = t.raw("zeroTrust.steps") as ZeroTrustStep[];
  const standardsCards = t.raw("standards.cards") as StandardsCardStep[];

  // Shared between the desktop (absolute) and mobile (in-flow) coreTech layouts below.
  const topLabel = (
    <p className="font-inter text-center text-[14px] leading-[21px]! font-bold tracking-[0.96px] uppercase text-[#63D9FF]">
      {t("coreTech.topLabel")}
    </p>
  );

  const badgePill = (
    <div
      className="flex h-[46px] w-[500px] max-w-full items-center justify-center gap-2 rounded-[18px] border px-4"
      style={{ background: "#030D26C2", borderColor: "#3394FF94" }}
    >
      {badgeItems.map((item, index) => (
        <React.Fragment key={item}>
          {index > 0 && <span className="text-white">•</span>}
          <span className="font-inter text-[13px] leading-[21px]! font-bold text-white">{item}</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <section
      className="relative w-full overflow-hidden bg-cover bg-center bg-no-repeat lg:h-[860px]"
      style={{ backgroundImage: "url('/landing/TechArchitecture/TechArchitecture_bg.png')" }}
    >
      <SectionEdgeFade position="top" />
      <SectionEdgeFade position="bottom" />

      <div className="container-le relative z-10 flex flex-col pt-[26px] pb-[30px] lg:h-full">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabKey)}
          className="flex min-h-0 flex-none flex-col lg:flex-1"
        >
          <TabsList
            variant="elementor"
            className="relative mx-auto flex w-fit max-w-full shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full bg-linear-to-b from-white/16 to-white/14 px-1.5 py-1 shadow-[inset_0_2px_16px_rgba(0,149,255,0.26)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-[#76c6ff66] md:p-4! max-[767px]:gap-1 max-[767px]:overflow-x-auto max-[767px]:scrollbar-none max-[767px]:[&::-webkit-scrollbar]:hidden"
          >
            <TabsTrigger variant="elementor" value="coreTech" className={tabTriggerClass}>
              <span className="hidden items-center text-center md:flex">{t("tabs.coreTech")}</span>
              <span className="flex items-center text-center md:hidden">{t("tabsMobile.coreTech")}</span>
            </TabsTrigger>
            <TabsTrigger variant="elementor" value="zeroTrust" className={tabTriggerClass}>
              <span className="hidden items-center text-center md:flex">{t("tabs.zeroTrust")}</span>
              <span className="flex items-center text-center md:hidden">{t("tabsMobile.zeroTrust")}</span>
            </TabsTrigger>
            <TabsTrigger variant="elementor" value="standards" className={tabTriggerClass}>
              <span className="hidden items-center text-center md:flex">{t("tabs.standards")}</span>
              <span className="flex items-center text-center md:hidden">{t("tabsMobile.standards")}</span>
            </TabsTrigger>
          </TabsList>

          {/* Header text changes per active tab; content is identical across tabs for now
              until copy is finalized for each tab. */}
          <div className="my-6 h-[50px] shrink-0">
            <p className="font-inter mb-1! text-[11px] leading-[14px]! font-bold uppercase tracking-[1.7px] text-[#F5FAFFDB]">
              {t(`header.${activeTab}.eyebrow`)}
            </p>
            <p className="font-inter text-[26px] leading-[32px]! font-bold text-[#F5FAFF]">
              {t(`header.${activeTab}.title`)}
            </p>
          </div>

          <div className="flex-none lg:min-h-0 lg:flex-1">
            <TabsContent value="coreTech" className="relative mt-0 h-auto w-full overflow-hidden rounded-2xl lg:h-full">
              {/* Desktop layout (>=1024px): bg_line background spanning the full tab, ball centered
                  over it, and 2 cards pinned to the left/right edges. */}
              <div className="hidden h-full w-full lg:block">
                {/* bg_line.png's line pattern doesn't cross dead-center in its own canvas (measured
                    offset: +39px x, -25px y out of 1540x624) — nudge it so the crossing point lands
                    on the ball, which sits at the container's true geometric center. */}
                <Image
                  src="/landing/TechArchitecture/bg_line.png"
                  alt=""
                  fill
                  className="object-contain"
                  style={{ transform: "translate(-2.532%, 4.006%)" }}
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative aspect-square w-[324px]">
                    <Image src="/landing/TechArchitecture/energy_ball.svg" alt="LeOS x LeLe ERE" fill className="object-contain" />
                    <div
                      className="font-inter absolute inset-0 flex flex-col items-center justify-center gap-0 text-center text-[24px] leading-[25px]! font-bold text-white"
                      style={{ textShadow: "0px 1px 4px #000000A6" }}
                    >
                      <span>LeOS</span>
                      <span>×</span>
                      <span>LeLe ERE</span>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-x-0 top-0">{topLabel}</div>
                <div className="absolute inset-x-0 bottom-0 flex justify-center">{badgePill}</div>

                <div className="absolute inset-y-0 left-0 flex items-center gap-4">
                  <CoreTechCard
                    title={t("coreTech.cards.leos.title")}
                    logo="/landing/TechArchitecture/LeOS_logo.png"
                    logoText={t("coreTech.cards.leos.logoText")}
                    content={leosCardContent}
                    footer={t("coreTech.cards.leos.footer")}
                  />
                  <CoreTechCircle icon="/landing/TechArchitecture/LeOS_icon.png" title={t("coreTech.circles.leos")} />
                </div>

                <div className="absolute inset-y-0 right-0 flex items-center gap-4">
                  <CoreTechCircle icon="/landing/TechArchitecture/LeLe_icon.png" title={t("coreTech.circles.lele")} />
                  <CoreTechCard
                    title={t("coreTech.cards.lele.title")}
                    logo="/landing/TechArchitecture/LeLe_Logo.png"
                    logoText={t("coreTech.cards.lele.logoText")}
                    content={leleCardContent}
                    footer={t("coreTech.cards.lele.footer")}
                  />
                </div>
              </div>

              {/* Mobile layout (<1024px): the graphic block stays in place (ball + circles + labels),
                  then the 2 cards stack full-width below it — section height grows with content. */}
              <div className="flex flex-col gap-6 py-6 lg:hidden">
                <div className="flex flex-col items-center gap-4">
                  {topLabel}

                  <div className="relative flex w-full items-center justify-between">
                    <Image
                      src="/landing/TechArchitecture/bg_line.png"
                      alt=""
                      fill
                      className="object-contain"
                    />
                    <CoreTechCircle icon="/landing/TechArchitecture/LeOS_icon.png" title={t("coreTech.circles.leos")} size="sm" />
                    <div className="relative aspect-square w-[180px] shrink-0">
                      <Image src="/landing/TechArchitecture/energy_ball.svg" alt="LeOS x LeLe ERE" fill className="object-contain" />
                      <div
                        className="font-inter absolute inset-0 flex flex-col items-center justify-center gap-0 text-center text-[16px] leading-[17px]! font-bold text-white"
                        style={{ textShadow: "0px 1px 4px #000000A6" }}
                      >
                        <span>LeOS</span>
                        <span>×</span>
                        <span>LeLe ERE</span>
                      </div>
                    </div>
                    <CoreTechCircle icon="/landing/TechArchitecture/LeLe_icon.png" title={t("coreTech.circles.lele")} size="sm" />
                  </div>

                  {badgePill}
                </div>

                <CoreTechCard
                  title={t("coreTech.cards.leos.title")}
                  logo="/landing/TechArchitecture/LeOS_logo.png"
                  logoText={t("coreTech.cards.leos.logoText")}
                  content={leosCardContent}
                  footer={t("coreTech.cards.leos.footer")}
                />
                <CoreTechCard
                  title={t("coreTech.cards.lele.title")}
                  logo="/landing/TechArchitecture/LeLe_Logo.png"
                  logoText={t("coreTech.cards.lele.logoText")}
                  content={leleCardContent}
                  footer={t("coreTech.cards.lele.footer")}
                />
              </div>
            </TabsContent>
            <TabsContent value="zeroTrust" className="mt-0 flex h-auto w-full flex-col items-center justify-center rounded-2xl lg:h-full">
              {/* Desktop-only for now (PC scope) — mobile keeps the placeholder skeleton below. */}
              <div className="hidden w-full flex-col items-center gap-[80px] lg:flex">
                <div className="flex w-full flex-col items-center">
                  <div className="mx-auto flex w-full max-w-[1120px] items-start justify-between gap-x-10">
                    {zeroTrustSteps.map((step, index) => (
                      <div key={step.title} className="flex w-[250px] shrink-0 flex-col items-center">
                        {/* Joint dot on the connecting line + the segment reaching the next card's dot. */}
                        <div className="relative h-2 w-2">
                          <div className="absolute inset-0 rounded-full bg-[#55B9FF]" />
                          {index < zeroTrustSteps.length - 1 && (
                            <div className="absolute top-1/2 left-1/2 h-[2px] w-[290px] -translate-y-1/2 bg-[#55B9FF]" />
                          )}
                        </div>
                        {/* Vertical connector down to the card's number badge. */}
                        <div className="h-[34px] w-[2px] bg-[#55B9FF]" />
                        <ZeroTrustCard index={index + 1} title={step.title} icon={ZERO_TRUST_ICONS[index]} content={step.content} />
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="flex h-[74px] w-full max-w-[1120px] items-center gap-[22px] rounded-xl border px-6"
                  style={{ background: "#061A40B8", borderColor: "#1FA1FF94" }}
                >
                  <Image src="/landing/TechArchitecture/shield_check.png" alt="" width={34} height={34} className="h-[34px]! w-[34px]! shrink-0 object-contain" />
                  <p className="font-open-sans text-[14px] leading-[22px]! font-normal text-white">
                    {t("zeroTrust.footer")}
                  </p>
                </div>
              </div>

              {/* Mobile (<1024px): same line + numbered badges, but stacked vertically with
                  full-width cards; the badge lives outside the card, on the connecting line. */}
              <div className="flex w-full flex-col gap-6 py-2 lg:hidden">
                <div className="grid grid-cols-[36px_1fr] gap-x-4">
                  {zeroTrustSteps.map((step, index) => {
                    const isLast = index === zeroTrustSteps.length - 1;
                    return (
                      <React.Fragment key={step.title}>
                        <div className="flex flex-col items-center">
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
                            style={{ background: "#051A40", borderColor: "#1FA1FFE5" }}
                          >
                            <span className="font-inter text-[14px] leading-[18px]! font-semibold text-white">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>
                          {/* Fills the row's full stretched height so it reaches the next badge — the
                              card cell's bottom padding below is what gives the row its extra height. */}
                          {!isLast && <div className="w-[2px] flex-1 bg-[#55B9FF]" />}
                        </div>
                        <div className={isLast ? "" : "pb-6"}>
                          <ZeroTrustCardMobile title={step.title} icon={ZERO_TRUST_ICONS[index]} content={step.content} />
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>

                <div
                  className="flex w-full items-center gap-3 rounded-xl border px-4 py-3"
                  style={{ background: "#061A40B8", borderColor: "#1FA1FF94" }}
                >
                  <Image src="/landing/TechArchitecture/shield_check.png" alt="" width={28} height={28} className="h-7! w-7! shrink-0 object-contain" />
                  <p className="font-open-sans text-[13px] leading-[20px]! font-normal text-white">
                    {t("zeroTrust.footer")}
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="standards" className="mt-0 flex h-auto w-full flex-col items-center justify-center rounded-2xl lg:h-full">
              {/* Desktop (>=1024px): 3 cards in a row, connected by a bracket line with a dot at
                  every joint, and separated by right-arrow icons. */}
              <div className="hidden w-full flex-col items-center gap-[80px] lg:flex">
                <div className="mx-auto flex w-full max-w-[1170px]">
                  {standardsCards.map((card, index) => (
                    <React.Fragment key={card.title}>
                      <div className="flex w-[350px] shrink-0 flex-col items-center">
                        {/* Joint dot + the segment reaching the next card's joint. */}
                        <div className="relative h-2 w-2">
                          <div className="absolute inset-0 rounded-full bg-[#55B9FF]" />
                          {index < standardsCards.length - 1 && (
                            <div className="absolute top-1/2 left-1/2 h-[2px] w-[410px] -translate-y-1/2 bg-[#55B9FF]" />
                          )}
                        </div>
                        <div className="h-[34px] w-[2px] bg-[#55B9FF]" />
                        <StandardsCard
                          index={index + 1}
                          title={card.title}
                          subTitle={card.subTitle}
                          icon={STANDARDS_ICONS[index]}
                          content={card.content}
                        />
                      </div>

                      {/* Stretched to the row's full height (matching the card column) so the
                          arrow can be centered against the card itself, not the top line. */}
                      {index < standardsCards.length - 1 && (
                        <div className="flex w-[60px] shrink-0 flex-col">
                          <div className="h-[42px] shrink-0" />
                          <div className="flex flex-1 items-center justify-center">
                            <ArrowRight className="h-6 w-6" style={{ color: "#2A9FFF" }} />
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div
                  className="flex h-[74px] w-full max-w-[1170px] items-center gap-[22px] rounded-xl border px-6"
                  style={{ background: "#061A40B8", borderColor: "#1FA1FF94" }}
                >
                  <Image src="/landing/TechArchitecture/Infomation.png" alt="" width={34} height={34} className="h-[34px]! w-[34px]! shrink-0 object-contain" />
                  <p className="font-open-sans text-[14px] leading-[22px]! font-normal text-white">
                    {t("standards.footer")}
                  </p>
                </div>
              </div>

              {/* Mobile (<1024px): cards stacked full-width, no connecting line. */}
              <div className="flex w-full flex-col gap-6 py-2 lg:hidden">
                <div className="flex flex-col gap-6">
                  {standardsCards.map((card, index) => (
                    <StandardsCard
                      key={card.title}
                      index={index + 1}
                      title={card.title}
                      subTitle={card.subTitle}
                      icon={STANDARDS_ICONS[index]}
                      content={card.content}
                    />
                  ))}
                </div>

                <div
                  className="flex w-full items-center gap-3 rounded-xl border px-4 py-3"
                  style={{ background: "#061A40B8", borderColor: "#1FA1FF94" }}
                >
                  <Image src="/landing/TechArchitecture/Infomation.png" alt="" width={28} height={28} className="h-7! w-7! shrink-0 object-contain" />
                  <p className="font-open-sans text-[13px] leading-[20px]! font-normal text-white">
                    {t("standards.footer")}
                  </p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
