"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Eyebrow, SectionHead, V2Section } from "@/components/v2/ui";

type Stage = { name: string; body: string };

/** The 5-step operating loop (assign, execute, QC, evidence, maintain) as an accessible tab list. */
export default function V2Loop({ tone = "dark" }: { tone?: "dark" | "mid" }) {
  const t = useTranslations("v2");
  const stages = t.raw("loop.stages") as Stage[];
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stage = stages[active];

  const choose = (i: number) => {
    setActive(i);
    tabRefs.current[i]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = stages.length - 1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") choose(i === last ? 0 : i + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") choose(i === 0 ? last : i - 1);
    else if (e.key === "Home") choose(0);
    else if (e.key === "End") choose(last);
    else return;
    e.preventDefault();
  };

  return (
    <V2Section tone={tone}>
      <SectionHead eyebrow={t("loop.eyebrow")} title={t("loop.title")} lead={t("loop.lead")} />
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div role="tablist" aria-label={t("loop.ariaLabel")} className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {stages.map((s, i) => (
            <button
              key={s.name}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`loop-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={active === i}
              aria-controls="loop-panel"
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`flex shrink-0 cursor-pointer items-center gap-3 rounded-[14px] border px-4 py-3 text-left font-inter text-[15px] font-semibold transition-colors duration-300 ${
                active === i
                  ? "border-[#2A9FFF] bg-[#2A9FFF]/20 text-white"
                  : "border-white/25 bg-[#FFFFFF0F] text-white/80 hover:border-[#63D9FF]"
              }`}
            >
              <span className="text-[13px] font-bold text-[#63D9FF]">0{i + 1}</span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>

        <div
          id="loop-panel"
          role="tabpanel"
          aria-labelledby={`loop-tab-${active}`}
          className="flex flex-col gap-3 rounded-[20px] border border-white/25 bg-[#FFFFFF14] p-6 lg:p-8"
        >
          <Eyebrow>
            {t("common.stepLabel")} 0{active + 1}
          </Eyebrow>
          <h3 className="font-inter m-0 text-[26px] font-bold leading-[32px] text-white">{stage.name}</h3>
          <p className="font-open-sans m-0 text-[16px] leading-[26px] text-[#E5F0FA]">{stage.body}</p>
          <div className="mt-3 rounded-[14px] border border-dashed border-[#2A9FFF]/50 px-4 py-3">
            <p className="font-inter m-0 text-[13px] font-semibold text-[#63D9FF]">{t("loop.stamp")}</p>
            <p className="font-open-sans mb-0 mt-1 text-[12px] leading-[18px] text-white/65">{t("loop.stampNote")}</p>
          </div>
        </div>
      </div>
    </V2Section>
  );
}
