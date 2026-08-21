"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HeartCard } from "./HeartCard";
import { WayCard } from "./WayCard";

type HeartSlide = {
  slideIndex: number;
  iconPath: string;
  title: string;
  titleColor: string;
  hoverBackgroundColor: string;
  hoverBorderColor: string;
  hoverAngle?: "0deg" | "180deg" | "360deg";
  description: React.ReactNode;
};

// Renders a translated string that uses "\n" to mark explicit line breaks.
function renderMultiline(text: string): React.ReactNode {
  const lines = text.split("\n");
  return lines.map((line, idx) => (
    <React.Fragment key={idx}>
      {idx > 0 && <br />}
      {line}
    </React.Fragment>
  ));
}

// Structural metadata for Tab 1: H.E.A.R.T Slides — text comes from the "heartTab.slides" messages.
// Slide 3 intentionally reuses the "humanity" key (title "H – Humanity") to match the legacy HTML (05-heart.html),
// even though its description content is about respect — this quirk predates the i18n migration and is preserved as-is.
const HEART_SLIDE_META: {
  slideIndex: number;
  key: string;
  messageKey: string;
  iconPath: string;
  titleColor: string;
  hoverBackgroundColor: string;
  hoverBorderColor: string;
  hoverAngle?: "0deg" | "180deg" | "360deg";
}[] = [
  {
    slideIndex: 1,
    key: "humanity-1",
    messageKey: "humanity",
    iconPath: "/assets/icons/heart/humanity.svg",
    titleColor: "#1CBBB4",
    hoverBackgroundColor: "#1CBBB466",
    hoverBorderColor: "#1CBBB4",
    hoverAngle: "0deg",
  },
  {
    slideIndex: 2,
    key: "excellence",
    messageKey: "excellence",
    iconPath: "/assets/icons/heart/excellence.svg",
    titleColor: "#C8960C",
    hoverBackgroundColor: "#C8960C66",
    hoverBorderColor: "#C8960C",
  },
  {
    slideIndex: 3,
    key: "humanity-2",
    messageKey: "respect",
    iconPath: "/assets/icons/heart/respect.svg",
    titleColor: "#228B22",
    hoverBackgroundColor: "#228B2266",
    hoverBorderColor: "#228B22",
  },
  {
    slideIndex: 4,
    key: "action",
    messageKey: "action",
    iconPath: "/assets/icons/heart/action.svg",
    titleColor: "#FF7E00",
    hoverBackgroundColor: "#FF800066",
    hoverBorderColor: "#FF7E00",
  },
  {
    slideIndex: 5,
    key: "technology",
    messageKey: "technology",
    iconPath: "/assets/icons/heart/technology.svg",
    titleColor: "#1CBBB4",
    hoverBackgroundColor: "#1CBBB466",
    hoverBorderColor: "#1CBBB4",
  },
];

// Structural metadata for Tab 2: LETRON WAY Rules — text comes from the "heartTab.wayRules" messages.
const WAY_RULE_META: { id: string; messageKey: string; iconPath: string }[] = [
  { id: "e37a62d", messageKey: "rule1", iconPath: "/assets/icons/heart/way-1.svg" },
  { id: "f8b09ea", messageKey: "rule2", iconPath: "/assets/icons/heart/way-2.svg" },
  { id: "17572bf", messageKey: "rule3", iconPath: "/assets/icons/heart/way-3.svg" },
  { id: "2b490e1", messageKey: "rule4", iconPath: "/assets/icons/heart/way-4.svg" },
  { id: "393bda3", messageKey: "rule5", iconPath: "/assets/icons/heart/way-5.svg" },
  { id: "917b98f", messageKey: "rule6", iconPath: "/assets/icons/heart/way-6.svg" },
  { id: "101c489", messageKey: "rule7", iconPath: "/assets/icons/heart/way-7.svg" },
  { id: "c13b4d7", messageKey: "rule8", iconPath: "/assets/icons/heart/way-8.svg" },
  { id: "789d116", messageKey: "rule9", iconPath: "/assets/icons/heart/way-9.svg" },
];

const tabTriggerClass =
  "relative z-[1] flex h-auto items-center justify-center rounded-full border-0 bg-transparent px-[21px] py-2.5 font-sans text-xl font-semibold uppercase leading-[1.5] text-white transition-colors duration-300 hover:text-[#2A9FFF] data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#E2F3FF] data-[state=active]:to-white data-[state=active]:text-[#2A9FFF] max-[1550px]:px-[18px] max-[1550px]:py-2 max-[1550px]:text-lg max-[1024px]:px-3.5 max-[1024px]:py-1.5 max-[1024px]:text-sm max-[767px]:shrink-0";

const heartHeadingCss = `
.letron-heart-heading-widget {
  margin: 0px 0px calc(var(--kit-widget-spacing, 0px) + 0px) 0px;
  padding: 0px 0px 0px 0px;
  text-align: center;
}

.letron-heart-heading-title {
  margin: 0;
  font-family: var(--font-sans), Sans-serif;
  font-size: 40px !important;
  font-weight: 700;
  line-height: 1.3em;
  color: var(--e-global-color-primary);
  background: linear-gradient(180deg, #FFF 26.92%, #2A9FFF 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@media (max-width: 1550px) {
  .letron-heart-heading-title {
    font-size: 28px;
  }
}

@media (max-width: 1024px) {
  .letron-heart-heading-title {
    font-size: 24px;
    line-height: var(--e-global-typography-primary-line-height);
  }
}

@media (max-width: 767px) {
  .letron-heart-heading-widget {
    margin: 0px 0px calc(var(--kit-widget-spacing, 0px) + 0px) 0px;
    padding: 0px 0px 0px 0px;
  }

  .letron-heart-heading-title {
    font-size: 22px;
  }
}
`;

const waySectionCss = `
.letron-way-section {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 64px 0px;
  row-gap: 64px;
  column-gap: 0px;
  margin: 0px 0px 0px 0px;
  padding: 0px 0px 104px 0px;
}

.letron-way-inner {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 60px 0px;
  row-gap: 60px;
  column-gap: 0px;
}

.letron-way-heading-widget {
  margin: 0px 0px calc(var(--kit-widget-spacing, 0px) + 0px) 0px;
  padding: 0px 0px 0px 0px;
  text-align: center;
}

.letron-way-heading-title {
  margin: 0;
  font-family: var(--font-sans), Sans-serif;
  font-size: 40px !important;
  font-weight: 700;
  line-height: 1.3em;
  color: var(--e-global-color-primary);
  background: linear-gradient(180deg, #FFF 26.92%, #2A9FFF 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.letron-way-content {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 0px 43px;
  row-gap: 0px;
  column-gap: 43px;
  overflow: visible;
}

.letron-way-content::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 12%;
  z-index: 0;
  width: min(760px, 64vw);
  height: min(360px, 30vw);
  transform: translateX(-12%);
  border-radius: 999px;
  background: radial-gradient(ellipse at center, rgba(42, 159, 255, 0.26) 0%, rgba(42, 159, 255, 0.14) 34%, rgba(28, 187, 180, 0.08) 58%, rgba(13, 27, 75, 0) 72%);
  filter: blur(18px);
  pointer-events: none;
}

.letron-way-image-column {
  position: relative;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  overflow: visible;
}

.letron-way-image-widget {
  width: 100%;
  min-width: 0;
  overflow: visible;
  text-align: center;
}

.letron-way-image-widget img {
  display: block;
  width: 100%;
  height: auto;
}

.letron-way-grid {
  position: relative;
  z-index: 1;
  display: grid;
  min-width: 0;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 24px 40px;
  row-gap: 24px;
  column-gap: 40px;
  grid-auto-flow: row;
}

@media (min-width: 768px) {
  .letron-way-image-column {
    width: calc((100% - 43px) * 0.4);
    flex: 0 0 calc((100% - 43px) * 0.4);
  }

  .letron-way-grid {
    width: calc((100% - 43px) * 0.6);
    flex: 0 0 calc((100% - 43px) * 0.6);
  }
}

@media (max-width: 1550px) {
  .letron-way-section {
    gap: 40px 0px;
    row-gap: 40px;
    column-gap: 0px;
  }

  .letron-way-inner {
    gap: 40px 0px;
    row-gap: 40px;
    column-gap: 0px;
  }

  .letron-way-heading-title {
    font-size: 28px;
    line-height: var(--e-global-typography-primary-line-height);
  }
}

@media (max-width: 1024px) {
  .letron-way-section {
    gap: 40px 0px;
    row-gap: 40px;
    column-gap: 0px;
  }

  .letron-way-inner {
    gap: 40px 0px;
    row-gap: 40px;
    column-gap: 0px;
  }

  .letron-way-heading-title {
    font-size: 24px;
    line-height: var(--e-global-typography-primary-line-height);
  }

  .letron-way-content {
    flex-direction: column-reverse;
    align-items: initial;
    flex-wrap: wrap;
    gap: 40px 0px;
    row-gap: 40px;
    column-gap: 0px;
  }

  .letron-way-content::after {
    left: 50%;
    bottom: 26%;
    width: min(680px, 82vw);
    height: min(300px, 42vw);
    transform: translateX(-50%);
  }

  .letron-way-image-column,
  .letron-way-grid {
    width: 100%;
  }

  .letron-way-grid {
    gap: 24px 28px;
    row-gap: 24px;
    column-gap: 28px;
    grid-auto-flow: row;
  }
}

@media (max-width: 767px) {
  .letron-way-section {
    gap: 40px 0px;
    row-gap: 40px;
    column-gap: 0px;
  }

  .letron-way-inner {
    gap: 20px 0px;
    row-gap: 20px;
    column-gap: 0px;
  }

  .letron-way-heading-widget {
    margin: 0px 0px calc(var(--kit-widget-spacing, 0px) + 0px) 0px;
    padding: 0px 0px 0px 0px;
  }

  .letron-way-heading-title {
    font-size: 22px;
    line-height: var(--e-global-typography-primary-line-height);
  }

  .letron-way-content {
    gap: 40px 0px;
    row-gap: 40px;
    column-gap: 0px;
  }

  .letron-way-content::after {
    bottom: 34%;
    width: 92vw;
    height: 220px;
  }

  .letron-way-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px 10px;
    row-gap: 10px;
    column-gap: 10px;
    grid-auto-flow: row;
  }
}
`;

const spiritSectionCss = `
.letron-spirit-section {
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
  gap: 64px 0px;
  row-gap: 64px;
  column-gap: 0px;
  margin: 0px 0px 0px 0px;
  padding: 0px 0px 60px 0px;
}

.letron-spirit-panel {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 0px 0px;
  row-gap: 0px;
  column-gap: 0px;
  margin: 0px 0px 0px 0px;
  padding: 0px 0px 309px 0px;
  background-image: url("/wp-content/uploads/2026/05/572-Converted-01-1-1-1.png");
  background-position: bottom center;
  background-repeat: no-repeat;
}

.letron-spirit-heading-widget {
  margin: 0px 0px calc(var(--kit-widget-spacing, 0px) + 0px) 0px;
  padding: 0px 0px 0px 0px;
  text-align: center;
}

.letron-spirit-heading-title {
  margin: 0;
  font-family: var(--font-sans), Sans-serif;
  font-size: 40px !important;
  font-weight: 700;
  line-height: 1.3em;
  color: var(--e-global-color-primary);
  background: linear-gradient(180deg, #FFF 26.92%, #2A9FFF 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.letron-spirit-main-heading-widget {
  margin: 120px 0px calc(var(--kit-widget-spacing, 0px) + 15px) 0px;
  padding: 0px 0px 0px 0px;
  text-align: center;
}

.letron-spirit-main-heading {
  margin: 0;
  color: #FFFFFF;
  font-family: var(--font-sans), Sans-serif;
  font-size: 64px;
  font-weight: 800;
  line-height: 1.4em;
  text-shadow: 4px 0px 20px rgba(0, 140, 255, 0.2);
}

.letron-spirit-main-heading span {
  color: #2A9FFF;
}

.letron-spirit-text {
  margin: 0px 0px calc(var(--kit-widget-spacing, 0px) + 0px) 0px;
  padding: 0px 0px 0px 0px;
  color: var(--e-global-color-text);
  text-align: center;
  font-family: var(--font-sans), Sans-serif;
  font-size: 18px;
  font-weight: 300;
  line-height: 1.3em;
}

.letron-spirit-text p {
  margin: 0;
}

@media (min-width: 768px) {
  .letron-spirit-panel {
    width: 1100px;
  }
}

@media (max-width: 1550px) {
  .letron-spirit-section {
    gap: 40px 0px;
    row-gap: 40px;
    column-gap: 0px;
  }

  .letron-spirit-panel {
    width: 719px;
  }

  .letron-spirit-heading-title {
    font-size: 28px;
    line-height: var(--e-global-typography-primary-line-height);
  }

  .letron-spirit-main-heading {
    font-size: 32px;
  }

  .letron-spirit-text {
    font-size: 16px;
    line-height: var(--e-global-typography-text-line-height);
  }
}

@media (max-width: 1024px) {
  .letron-spirit-section {
    gap: 40px 0px;
    row-gap: 40px;
    column-gap: 0px;
  }

  .letron-spirit-panel {
    padding: 100px 20px 250px 20px;
  }

  .letron-spirit-heading-title {
    font-size: 24px;
    line-height: var(--e-global-typography-primary-line-height);
  }

  .letron-spirit-main-heading-widget {
    margin: 18px 0px calc(var(--kit-widget-spacing, 0px) + 10px) 0px;
  }

  .letron-spirit-main-heading {
    font-size: 28px;
  }

  .letron-spirit-text {
    margin: 0px 0px calc(var(--kit-widget-spacing, 0px) + 0px) 0px;
    font-size: 14px;
    line-height: var(--e-global-typography-text-line-height);
  }
}

@media (max-width: 767px) {
  .letron-spirit-section {
    gap: 40px 0px;
    row-gap: 40px;
    column-gap: 0px;
  }

  .letron-spirit-panel {
    padding: 60px 16px 200px 16px;
    background-size: cover;
  }

  .letron-spirit-heading-widget {
    margin: 0px 0px calc(var(--kit-widget-spacing, 0px) + 0px) 0px;
    padding: 0px 0px 0px 0px;
  }

  .letron-spirit-heading-title {
    font-size: 22px;
    line-height: var(--e-global-typography-primary-line-height);
  }

  .letron-spirit-main-heading {
    font-size: 22px;
  }

  .letron-spirit-text {
    margin: 0px 0px calc(var(--kit-widget-spacing, 0px) + 0px) 0px;
    padding: 0px 16px 0px 16px;
    line-height: var(--e-global-typography-text-line-height);
  }
}
`;


export default function HeartTab() {
  const t = useTranslations("heartTab");
  const [activeTab, setActiveTab] = React.useState("heart");

  const HEART_SLIDES: HeartSlide[] = HEART_SLIDE_META.map((meta) => ({
    slideIndex: meta.slideIndex,
    iconPath: meta.iconPath,
    titleColor: meta.titleColor,
    hoverBackgroundColor: meta.hoverBackgroundColor,
    hoverBorderColor: meta.hoverBorderColor,
    hoverAngle: meta.hoverAngle,
    title: t(`slides.${meta.messageKey}.title`),
    description: renderMultiline(t(`slides.${meta.messageKey}.description`)),
  }));

  const WAY_RULES = WAY_RULE_META.map((meta) => ({
    id: meta.id,
    iconPath: meta.iconPath,
    title: renderMultiline(t(`wayRules.${meta.messageKey}`)),
  }));

  return (
    <section className="w-full bg-[#0D1B4B]">
      <style>{heartHeadingCss}</style>
      <style>{waySectionCss}</style>
      <style>{spiritSectionCss}</style>
      <div className="elementor elementor-2407 flex w-full flex-col items-center">
        <div className="w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex w-full min-w-0 flex-col gap-[60px] px-20 pt-[60px] text-start max-[1550px]:gap-10 max-[1550px]:px-[60px] max-[1550px]:pt-[50px] max-[1024px]:px-[25px] max-[1024px]:pt-[50px] max-[767px]:gap-5 max-[767px]:px-4 max-[767px]:pt-10">
            <TabsList
              variant="elementor"
              className="relative md:p-4! mx-auto flex w-fit items-center justify-center gap-1.5 overflow-hidden rounded-full bg-linear-to-b from-white/16 to-white/14 px-1.5 py-1 shadow-[inset_0_2px_16px_rgba(0,149,255,0.26)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-[#76c6ff66] max-[767px]:mx-0 max-[767px]:w-full max-[767px]:justify-start max-[767px]:overflow-x-auto max-[767px]:border max-[767px]:border-[#76c6ff66] max-[767px]:scrollbar-none max-[767px]:[&::-webkit-scrollbar]:hidden"
            >
              <TabsTrigger
                variant="elementor"
                value="heart"
                className={tabTriggerClass}
              >
                <span className="flex items-center text-center">{t("tabs.heart")}</span>
              </TabsTrigger>
              <TabsTrigger
                variant="elementor"
                value="way"
                className={tabTriggerClass}
              >
                <span className="flex items-center text-center">{t("tabs.way")}</span>
              </TabsTrigger>
              <TabsTrigger
                variant="elementor"
                value="spirit"
                className={tabTriggerClass}
              >
                <span className="flex items-center text-center">{t("tabs.spirit")}</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex min-w-0 flex-1">
              {/* TAB 1: HEART */}
              <TabsContent
                value="heart"
                className="mt-0 flex w-full flex-col gap-16 bg-[url('/wp-content/uploads/2026/05/bg-1.png')] bg-bottom bg-no-repeat bg-auto pb-[383px] max-[1550px]:gap-10 max-[1550px]:pb-[300px] max-[1024px]:bg-cover max-[1024px]:px-[25px] max-[1024px]:pb-[160px] max-[767px]:px-4 max-[767px]:pb-20 max-[767px]:bg-contain"
              >
                <div className="flex w-full flex-col gap-[60px] max-[1024px]:gap-10 max-[767px]:gap-5">
                  <div className="letron-heart-heading-widget">
                    <h2 className="letron-heart-heading-title">
                      {t("heartHeading")}
                    </h2>
                  </div>
                  <div aria-label="H.E.A.R.T values" className="w-full overflow-hidden" role="region">
                    <div className="flex w-full gap-10 max-[1550px]:gap-5 max-[1024px]:flex-wrap max-[767px]:block" role="list">
                      {HEART_SLIDES.map((slide) => (
                        <div
                          key={slide.slideIndex}
                          aria-label={`${slide.slideIndex} of 5`}
                          className="min-w-0 flex-[0_0_calc((100%-160px)/5)] max-[1550px]:flex-[0_0_calc((100%-80px)/5)] max-[1024px]:flex-[0_0_calc((100%-20px)/2)] max-[767px]:mb-5 max-[767px]:w-full"
                          role="listitem"
                        >
                          <HeartCard {...slide} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 2: LETRON WAY */}
              <TabsContent
                value="way"
                className="letron-way-section mt-0"
              >
                <div className="letron-way-inner">
                  <div className="letron-way-heading-widget">
                    <h2 className="letron-way-heading-title">
                      {t("wayHeading")}
                    </h2>
                  </div>
                  <div className="letron-way-content">
                    <div className="letron-way-image-column">
                      <div className="letron-way-image-widget">
                        <img
                          alt=""
                          decoding="async"
                          height="613"
                          loading="lazy"
                          sizes="(max-width: 651px) 100vw, 651px"
                          src="/wp-content/uploads/2026/05/Group-1-1.png"
                          srcSet="/wp-content/uploads/2026/05/Group-1-1.png 651w, /wp-content/uploads/2026/05/Group-1-1-300x282.png 300w"
                          width="651"
                        />
                      </div>
                    </div>
                    <div className="letron-way-grid">
                      {WAY_RULES.map(({ id, iconPath, title }) => (
                        <WayCard
                          key={id}
                          iconPath={iconPath}
                          title={title}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 3: SPIRIT */}
              <TabsContent
                value="spirit"
                className="letron-spirit-section mt-0"
              >
                <div className="letron-spirit-panel">
                  <div className="letron-spirit-heading-widget">
                    <h2 className="letron-spirit-heading-title">
                      {t("spiritHeading")}
                    </h2>
                  </div>
                  <div className="letron-spirit-main-heading-widget">
                    <h2 className="letron-spirit-main-heading">
                      {t("spiritMainHeadingLine1")}
                      <br />
                      {t("spiritMainHeadingLine2Prefix")}
                      <span>{t("spiritMainHeadingLine2Highlight")}</span>
                    </h2>
                  </div>
                  <div className="letron-spirit-text">
                    <p>
                      {t("spiritText")}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
