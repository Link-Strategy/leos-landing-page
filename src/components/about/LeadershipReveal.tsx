"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { LeadershipGrid } from "./LeadershipGrid";
import { LeadershipDiamond } from "./LeadershipDiamond";

const HOVER_CLOSE_DELAY_MS = 200;

export function LeadershipReveal() {
  const t = useTranslations("leadership");
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openNow = useCallback(() => {
    clearCloseTimer();
    setOpen(true);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  const closeNow = useCallback(() => {
    clearCloseTimer();
    setOpen(false);
  }, [clearCloseTimer]);

  return (
    <div className="relative mx-auto w-full max-w-[1396px]">
      <Image
        alt={t("diagramAlt")}
        src="/about/LeaderShipCircle.png"
        width={1676}
        height={865}
        className="h-auto w-full"
      />

      {/* Hotspot over the center "CHỦ TỊCH" circle: hover reveal on desktop mice, tap toggle on mobile.
          Position measured from the circle's actual pixel bounds in LeaderShipCircle.png (center ~864,403 of 1676x865). */}
      <button
        type="button"
        onClick={openNow}
        onMouseEnter={openNow}
        onMouseLeave={scheduleClose}
        aria-label={t("openLabel")}
        className="absolute left-[51.55%] top-[46.6%] aspect-square w-[15%] -translate-x-1/2 -translate-y-1/2 rounded-full"
      />

      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-300",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div
          onMouseEnter={openNow}
          onMouseLeave={scheduleClose}
          className="w-full max-w-[380px] lg:max-w-[820px]"
        >
          {/* Mobile keeps the existing row-of-5 grid; desktop shows the new Figma diamond layout. */}
          <div className="lg:hidden">
            <LeadershipGrid onClose={closeNow} />
          </div>
          <div className="hidden lg:block">
            <LeadershipDiamond />
          </div>
        </div>
      </div>
    </div>
  );
}
