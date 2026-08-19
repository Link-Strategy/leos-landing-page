"use client";

import React, { useState, useEffect } from "react";
import Hover from "./Hover";

interface PillarItem {
  id: string;
  title: string;
  icon: string;
  tags: string[];
  color: string;
}

export default function Pillars() {
  const [activePillar, setActivePillar] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const pillars: PillarItem[] = [
    {
      id: "ledb",
      title: "Le DB - Bộ não Số",
      icon: "/landing/Pillars/LeDB.png",
      tags: [
        "LeTRON (Hệ điều hành ALL IN ONE)",
        "LeLe AGI (Trợ lý ảo)",
        "Le-CarbonRegistry (Tín chỉ Carbon)",
        "Le-BatteryPassport (Hộ chiếu Pin)",
      ],
      color: "#6FCBDC",
    },
    {
      id: "lesm",
      title: "Le SM - Di chuyển Thông minh",
      icon: "/landing/Pillars/LeSM.png",
      tags: ["Le-GreenMobility (Vận tải)", "Le-GreenLogistics (Logistics)", "Le-SmartFleet"],
      color: "#7DC35A",
    },
    {
      id: "lese",
      title: "Le SE - Năng lượng Thông minh",
      icon: "/landing/Pillars/LeSE.png",
      tags: [
        "Le-SwapStation (Hạ tầng Trạm sạc)",
        "Le-ChargeHub (Trạm thay Pin tự động)",
        "Le-SolarFarm (Hạ tầng điện mặt trời Solar)",
        "Le-BESS (Hệ thống lưu trữ BESS)",
        "Le-WindFarm (Điện gió)",
      ],
      color: "#F78E20",
    },
    {
      id: "legm",
      title: "Le GM - Vật liệu Xanh",
      icon: "/landing/Pillars/LeGM.png",
      tags: [
        "Le-GreenBrick",
        "Le-GreenMix",
        "Le-GreenPrecast",
        "Le-GreenSteel",
        "Le-GreenCement",
        "Le-GreenAsphalt",
        "Le-UHPC",
      ],
      color: "#298C43",
    },
    {
      id: "lesb",
      title: "Le SB - Xây dựng Thông Minh",
      icon: "/landing/Pillars/LeSB.png",
      tags: ["Le-SmartRoads", "Le-SmartMarine", "Le-SmartIndustrial", "Le-SmartModular"],
      color: "#6E6F6F",
    },
    {
      id: "lesc",
      title: "Le SC - Đô thị Thông minh",
      icon: "/landing/Pillars/LeSC.png",
      tags: ["Le-ESCity (Đô thị Sinh thái)", "Le-EIParks (KCN Net Zero)"],
      color: "#038181",
    },
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 640);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (typeof window !== "undefined" && window.innerWidth <= 768) {
        const container = document.getElementById("pillars-grid-container");
        if (container && !container.contains(e.target as Node)) {
          setActivePillar(null);
        }
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleCardClick = (id: string, e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      e.stopPropagation();
      setActivePillar((prev) => (prev === id ? null : id));
    }
  };

  const handleMouseEnter = (id: string) => {
    if (typeof window !== "undefined" && window.innerWidth > 768) {
      setActivePillar(id);
    }
  };

  const handleMouseLeave = () => {
    if (typeof window !== "undefined" && window.innerWidth > 768) {
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
          <div className="text-[#4AB3FF] text-xs tracking-widest uppercase font-semibold">
            Mô hình vận hành
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-archivo [text-shadow:4px_0px_20px_rgba(0,140,255,0.2)]">
            Vòng Lặp Kép <span className="text-[#4AB3FF]">6 Trụ Cột</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            LeTRON xây dựng mô hình kinh tế tuần hoàn khép kín, nơi mỗi mắt xích đều được kết nối số
            và tạo ra giá trị bền vững.
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
                onClick={(e) => handleCardClick(pillar.id, e)}
              >
                <img
                  src={pillar.icon}
                  alt={pillar.title}
                  className="w-[100px] h-[100px] sm:w-[155px] sm:h-[155px] object-contain mb-2 transition-transform duration-300 hover:rotate-6"
                />
                <Hover
                  title={pillar.title}
                  tags={pillar.tags}
                  active={activePillar === pillar.id}
                  dataId={pillar.id}
                  color={pillar.color}
                  side={isMobile ? "bottom" : "left"}
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
                  alt="Vòng lặp kép LeTRON"
                  className="w-full h-full! object-contain opacity-60 filter drop-shadow-[0_0_20px_rgba(42,159,255,0.15)]"
                />
              </div>

              {/* Inner Circle Logo / Device — rotates clockwise */}
              <div className="relative w-[180px] h-[180px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] rounded-full overflow-hidden flex justify-center items-center animate-[spin_60s_linear_infinite]">
                <img
                  src="/wp-content/uploads/2026/05/Group-11.png"
                  alt="LeTRON Hub"
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
                onClick={(e) => handleCardClick(pillar.id, e)}
              >
                <img
                  src={pillar.icon}
                  alt={pillar.title}
                  className="w-[100px] h-[100px] sm:w-[155px] sm:h-[155px] object-contain mb-2 transition-transform duration-300 hover:rotate-6"
                />
                <Hover
                  title={pillar.title}
                  tags={pillar.tags}
                  active={activePillar === pillar.id}
                  dataId={pillar.id}
                  color={pillar.color}
                  side={isMobile ? "top" : "right"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
