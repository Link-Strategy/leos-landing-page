"use client";

import React, { useState, useEffect } from "react";
import Hover from "./Hover";


interface PillarItem {
  id: string;
  title: string;
  icon: string;
  tags: string[];
}

export default function Pillars() {
  const [activePillar, setActivePillar] = useState<string | null>(null);

  const pillars: PillarItem[] = [
    {
      id: "ledb",
      title: "Le DB - Bộ não Số",
      icon: "🧠",
      tags: ["LeOS (Hệ điều hành ALL IN ONE)", "LeLe AGI (Trợ lý ảo)", "Le-CarbonRegistry (Tín chỉ Carbon)", "Le-BatteryPassport (Hộ chiếu Pin)"],
    },
    {
      id: "lesm",
      title: "Le SM - Di chuyển Thông minh",
      icon: "⚡",
      tags: [
        "Le-GreenMobility (Vận tải)",
        "Le-GreenLogistics (Logistics)",
        "Le-SmartFleet"
      ],
    },
    {
      id: "lese",
      title: "Le SE - Năng lượng Thông minh",
      icon: "☀️",
      tags: [
        "Le-SwapStation (Hạ tầng Trạm sạc)",
        "Le-ChargeHub (Trạm thay Pin tự động)",
        "Le-SolarFarm (Hạ tầng điện mặt trời Solar)",
        "Le-BESS (Hệ thống lưu trữ BESS)",
        "Le-WindFarm (Điện gió)",
      ],
    },
    {
      id: "legm",
      title: "Le GM - Vật liệu Xanh",
      icon: "🌱",
      tags: [
        "Le-GreenBrick",
        "Le-GreenMix",
        "Le-GreenPrecast",
        "Le-GreenSteel",
        "Le-GreenCement",
        "Le-GreenAsphalt",
        "Le-UHPC"
      ],
    },
    {
      id: "lesb",
      title: "Le SB - Xây dựng Thông Minh",
      icon: "🏗️",
      tags: [
        "Le-SmartRoads",
        "Le-SmartMarine",
        "Le-SmartIndustrial",
        "Le-SmartModular"
      ],
    },
    {
      id: "lesc",
      title: "Le SC - Đô thị Thông minh",
      icon: "🏙️",
      tags: [
        "Le-ESCity (Đô thị Sinh thái)",
        "Le-EIParks (KCN Net Zero)"
      ],
    },
  ];

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
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="text-emerald-400 text-xs tracking-widest uppercase font-semibold">
            Mô hình vận hành
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-archivo">
            Vòng Lặp Kép 6 Trụ Cột
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            LeTRON xây dựng mô hình kinh tế tuần hoàn khép kín, nơi mỗi mắt xích đều được kết nối số và tạo ra giá trị bền vững.
          </p>
        </div>

        {/* Grid & Loop Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* 6 Pillars Cards (Left/Center) */}
          <div
            id="pillars-grid-container"
            className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative"
          >
            {pillars.map((pillar) => (
              <div
                key={pillar.id}
                className="elementor-element group-cop-info relative p-6 rounded-2xl border border-white/10 bg-[#0d1b4b]/40 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30 group cursor-pointer"
                onMouseEnter={() => handleMouseEnter(pillar.id)}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => handleCardClick(pillar.id, e)}
              >
                {/* Accent line */}
                <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex items-center gap-3">
                  <span className="text-2xl">{pillar.icon}</span>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors font-archivo">
                    {pillar.title}
                  </h3>
                </div>

                {/* Legacy Sub-Menu Popup (box-sub-home) */}
                <Hover
                  title={pillar.title}
                  tags={pillar.tags}
                  active={activePillar === pillar.id}
                  dataId={pillar.id}
                />
              </div>
            ))}
          </div>

          {/* Double Loop Circle Visual (Right) */}
          <div className="lg:col-span-4 flex justify-center items-center relative">
            <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] flex justify-center items-center">
              {/* Outer Loop Image rotating slowly */}
              <div className="absolute inset-0 animate-[spin_60s_linear_infinite]">
                <img
                  src="/wp-content/uploads/2026/05/Property-1Variant3-1.png"
                  alt="Vòng lặp kép LeTRON"
                  className="w-full h-full object-contain opacity-60 filter drop-shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                />
              </div>

              {/* Inner Circle Logo / Device */}
              <div className="relative w-[180px] h-[180px] rounded-full overflow-hidden flex justify-center items-center">
                <img
                  src="/wp-content/uploads/2026/05/Group-11.png"
                  alt="LeTRON Hub"
                  className="w-full h-full object-contain p-4 filter drop-shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                />
              </div>

              {/* Decorative Pulse Rings */}
              <div className="absolute inset-4 rounded-full border border-emerald-500/20 animate-pulse pointer-events-none" />
              <div className="absolute inset-12 rounded-full border border-cyan-500/10 animate-ping [animation-duration:4s] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
