"use client";

import { useTranslations } from "next-intl";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Principle = { eyebrow: string; title: string; body: string };

// The three principles (trust, control, accountability) as chips inside the hero. Hover or focus shows the one-line
// explanation; they used to be a section of their own right under the hero, which read as a repeat.
export default function HeroPrinciples() {
  const t = useTranslations("v2");
  const items = t.raw("principles") as Principle[];

  return (
    <TooltipProvider delayDuration={150}>
      <ul className="m-0 flex list-none flex-wrap justify-center gap-2 p-0 lg:justify-start">
        {items.map((p) => {
          const label = p.eyebrow.replace(/^\d+\s*\/\s*/, "");
          return (
            <li key={p.eyebrow}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="cursor-help rounded-full border border-[#2A9FFF]/60 bg-[#2A9FFF]/10 px-3.5 py-1.5 font-inter text-[12px] font-bold uppercase tracking-[1.6px] text-[#63D9FF] transition-colors hover:bg-[#2A9FFF]/25 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63D9FF]/70"
                  >
                    {label}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[280px] rounded-[12px] border border-[#2A9FFF]/55 bg-[#061a40] px-3.5 py-3 text-left text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
                  <p className="m-0 font-inter text-[13px] font-bold leading-[18px]">{p.title}</p>
                  <p className="mb-0 mt-1 font-inter text-[12px] leading-[17px] text-white/80">{p.body}</p>
                </TooltipContent>
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </TooltipProvider>
  );
}
