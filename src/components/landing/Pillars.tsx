"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Hover from "./Hover";

interface PillarItem {
  id: string;
  title: string;
  icon: string;
  tags: string[];
  color: string;
}

const PILLAR_META: { id: string; icon: string; color: string }[] = [
  { id: "ledb", icon: "/landing/Pillars/LeDB.png", color: "#6FCBDC" },
  { id: "lesm", icon: "/landing/Pillars/LeSM.png", color: "#7DC35A" },
  { id: "lese", icon: "/landing/Pillars/LeSE.png", color: "#F78E20" },
  { id: "legm", icon: "/landing/Pillars/LeGM.png", color: "#298C43" },
  { id: "lesb", icon: "/landing/Pillars/LeSB.png", color: "#6E6F6F" },
  { id: "lesc", icon: "/landing/Pillars/LeSC.png", color: "#038181" },
];

export default function Pillars() {
  const t = useTranslations("pillars");
  const [activePillar, setActivePillar] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const pillars: PillarItem[] = PILLAR_META.map((meta) => ({
    id: meta.id,
    icon: meta.icon,
    color: meta.color,
    title: t(`items.${meta.id}.title`),
    tags: t.raw(`items.${meta.id}.tags`) as string[],
  }));

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleCardClick = (id: string) => {
    if (isMobile) {
      setActivePillar((prev) => (prev === id ? null : id));
    }
  };

  const handleMouseEnter = (id: string) => {
    if (!isMobile) {
      setActivePillar(id);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setActivePillar(null);
    }
  };

  return (
    <section className="relative py-24 bg-[var(--letron-background)]/40 border-y border-white/10 overflow-visible">
      {/* Glow overlays */}
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-[#4AB3FF]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#2A9FFF]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full px-2">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-8 space-y-4">
          <h2 className="text-3xl sm:text-[40px]! font-bold tracking-tight text-white font-archivo [text-shadow:4px_0px_20px_rgba(0,140,255,0.2)]">
            {t("titlePrefix")}<span className="text-[#4AB3FF]">{t("titleHighlight")}</span>
          </h2>
          <p className="text-white text-base sm:text-lg">
            {t("description")}
          </p>
        </div>

        {/* Grid & Loop Visual */}
        <div
          id="pillars-grid-container"
          className="flex items-center justify-center flex-col sm:flex-row max-w-[1680px] min-h-[420px] py-10 sm:py-0 sm:h-[420px] md:h-[890px] mx-auto bg-[url('/landing/Pillars/pillars_bg.png')] bg-cover bg-center bg-no-repeat"
        >
          {/* 3 Pillars beginning */}
          <div className="flex flex-row gap-6 sm:flex-col sm:gap-14 md:gap-20">
            {pillars.slice(0, 3).map((pillar, index) => (
              <div
                key={pillar.id}
                className={`relative flex items-center justify-center cursor-pointer ${
                  index === 0 || index === 2
                    ? "translate-y-6 sm:translate-y-0 sm:translate-x-6 md:translate-x-10 lg:translate-x-16"
                    : ""
                }`}
                onMouseEnter={() => handleMouseEnter(pillar.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleCardClick(pillar.id)}
              >
                <img
                  src={pillar.icon}
                  alt={pillar.title}
                  className={`w-[100px] h-[100px] sm:w-[155px] sm:h-[155px] object-contain mb-2 transition-transform duration-300 ${
                    activePillar === pillar.id ? "rotate-6" : ""
                  }`}
                />
                <Hover
                  title={pillar.title}
                  tags={pillar.tags}
                  active={activePillar === pillar.id}
                  dataId={pillar.id}
                  color={pillar.color}
                  side="left"
                  mobile={isMobile}
                  onClose={() => setActivePillar(null)}
                />
              </div>
            ))}
          </div>
          {/* Double Loop Circle Visual (Center) */}
          <div className="flex justify-center items-center relative">
            <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] flex justify-center items-center">
              {/* Outer mechanical ring — rotates counter-clockwise */}
              <div className="absolute inset-0 animate-[spin_60s_linear_infinite_reverse]">
                <img
                  src="/wp-content/uploads/2026/05/Property-1Variant3-1.png"
                  alt={t("loopAlt")}
                  className="w-full h-full! object-contain opacity-60 filter drop-shadow-[0_0_20px_rgba(42,159,255,0.15)]"
                />
              </div>

              {/* Inner Circle Logo / Device — rotates clockwise */}
              <div className="relative w-[180px] h-[180px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] rounded-full overflow-hidden flex justify-center items-center animate-[spin_60s_linear_infinite]">
                <img
                  src="/wp-content/uploads/2026/05/Group-11.png"
                  alt={t("hubAlt")}
                  className="w-full h-full! object-contain p-4 filter drop-shadow-[0_0_15px_rgba(42,159,255,0.2)]"
                />
              </div>

              {/* Decorative Pulse Rings */}
              <div className="absolute inset-4 rounded-full border border-[#2A9FFF]/20 animate-pulse pointer-events-none" />
              <div className="absolute inset-12 rounded-full border border-[#4AB3FF]/10 animate-ping [animation-duration:4s] pointer-events-none" />
            </div>
          </div>
          {/* 3 Pillars ending */}
          <div className="flex flex-row gap-6 sm:flex-col sm:gap-14 md:gap-20">
            {pillars.slice(3, 6).map((pillar, index) => (
              <div
                key={pillar.id}
                className={`relative flex items-center justify-center cursor-pointer ${
                  index === 0 || index === 2
                    ? "-translate-y-6 sm:translate-y-0 sm:-translate-x-6 md:-translate-x-10 lg:-translate-x-16"
                    : ""
                }`}
                onMouseEnter={() => handleMouseEnter(pillar.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleCardClick(pillar.id)}
              >
                <img
                  src={pillar.icon}
                  alt={pillar.title}
                  className={`w-[100px] h-[100px] sm:w-[155px] sm:h-[155px] object-contain mb-2 transition-transform duration-300 ${
                    activePillar === pillar.id ? "rotate-6" : ""
                  }`}
                />
                <Hover
                  title={pillar.title}
                  tags={pillar.tags}
                  active={activePillar === pillar.id}
                  dataId={pillar.id}
                  color={pillar.color}
                  side="right"
                  mobile={isMobile}
                  onClose={() => setActivePillar(null)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
