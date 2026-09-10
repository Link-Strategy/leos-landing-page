"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SectionEdgeFade from "@/components/ui/section-edge-fade";

// Same pill-shaped tab bar as HeartTab.tsx — reused verbatim so the two tab
// systems on the page look identical.
const tabTriggerClass =
  "relative z-[1] flex h-auto items-center justify-center rounded-full border-0 bg-transparent px-[21px] py-2.5 font-sans text-xl font-semibold uppercase leading-[1.5] text-white transition-colors duration-300 hover:text-[#2A9FFF] data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#E2F3FF] data-[state=active]:to-white data-[state=active]:text-[#2A9FFF] max-[1550px]:px-[18px] max-[1550px]:py-2 max-[1550px]:text-lg max-[1024px]:px-3.5 max-[1024px]:py-1.5 max-[1024px]:text-sm max-[767px]:shrink-0";

type TabKey = "coreTech" | "zeroTrust" | "standards";

export default function TechArchitecture() {
  const t = useTranslations("techArchitecture");
  const [activeTab, setActiveTab] = React.useState<TabKey>("coreTech");

  return (
    <section
      className="relative h-[860px] w-full overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/landing/TechArchitecture/TechArchitecture_bg.png')" }}
    >
      <SectionEdgeFade position="top" />
      <SectionEdgeFade position="bottom" />

      <div className="container-le relative z-10 flex h-full flex-col pt-[26px] pb-[30px]">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabKey)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <TabsList
            variant="elementor"
            className="relative mx-auto flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full bg-linear-to-b from-white/16 to-white/14 px-1.5 py-1 shadow-[inset_0_2px_16px_rgba(0,149,255,0.26)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-[#76c6ff66] md:p-4! max-[767px]:mx-0 max-[767px]:w-full max-[767px]:justify-start max-[767px]:overflow-x-auto max-[767px]:border max-[767px]:border-[#76c6ff66] max-[767px]:scrollbar-none max-[767px]:[&::-webkit-scrollbar]:hidden"
          >
            <TabsTrigger variant="elementor" value="coreTech" className={tabTriggerClass}>
              <span className="flex items-center text-center">{t("tabs.coreTech")}</span>
            </TabsTrigger>
            <TabsTrigger variant="elementor" value="zeroTrust" className={tabTriggerClass}>
              <span className="flex items-center text-center">{t("tabs.zeroTrust")}</span>
            </TabsTrigger>
            <TabsTrigger variant="elementor" value="standards" className={tabTriggerClass}>
              <span className="flex items-center text-center">{t("tabs.standards")}</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 min-h-0 flex-1">
            <TabsContent value="coreTech" className="mt-0 h-full w-full rounded-2xl border border-gray-300/30 bg-gray-500/25" />
            <TabsContent value="zeroTrust" className="mt-0 h-full w-full rounded-2xl border border-gray-300/30 bg-gray-500/25" />
            <TabsContent value="standards" className="mt-0 h-full w-full rounded-2xl border border-gray-300/30 bg-gray-500/25" />
          </div>
        </Tabs>
      </div>
    </section>
  );
}
