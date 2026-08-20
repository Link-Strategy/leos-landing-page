"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { LeadershipGrid } from "./LeadershipGrid";

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
        src="/about/leader-ship-circle.png"
        width={1396}
        height={758}
        className="h-auto w-full"
      />

      {/* Hotspot over the center "CHỦ TỊCH" circle: hover reveal on desktop mice, tap toggle on mobile */}
      <button
        type="button"
        onClick={openNow}
        onMouseEnter={openNow}
        onMouseLeave={scheduleClose}
        aria-label={t("openLabel")}
        className="absolute left-1/2 top-1/2 aspect-square w-[17%] -translate-x-1/2 -translate-y-1/2 rounded-full"
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
          className="w-full max-w-[380px] lg:max-w-[1320px]"
        >
          <LeadershipGrid onClose={closeNow} />
        </div>
      </div>
    </div>
  );
}
