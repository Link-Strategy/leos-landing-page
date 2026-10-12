"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ELEMENTOR_SCRIPTS } from "@/lib/elementor-scripts";


/**
 * Elementor's scripts depend on each other (frontend.min.js needs frontend-modules.min.js' `elementorModules`,
 * Pro needs the free frontend, ...). next/script injects scripts dynamically, which makes them async and
 * unordered, so they raced and intermittently threw "elementorModules is not defined".
 * Dynamically inserted scripts with `async = false` download in parallel but execute in insertion order.
 */
function loadElementorScripts() {
  const w = window as Window & { __elementorScriptsLoaded?: boolean };
  if (w.__elementorScriptsLoaded) return;
  w.__elementorScriptsLoaded = true;

  for (const item of ELEMENTOR_SCRIPTS) {
    const el = document.createElement("script");
    if ("src" in item) {
      el.src = item.src;
      el.async = false;
    } else {
      el.text = item.code;
    }
    document.body.appendChild(el);
  }
}

export default function ClientScripts() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isBlog = pathname?.startsWith("/blog") ?? false;
  const isCategory = pathname?.startsWith("/category") ?? false;
  const skipElementor = isBlog || isCategory;
  const showElementor = mounted && !skipElementor && typeof pathname === "string";

  useEffect(() => {
    if (showElementor) loadElementorScripts();
  }, [showElementor]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
        navigator.serviceWorker.register("/sw.js");
      } else {
        // Dev chunks change constantly; a cached shell breaks hydration. Drop any SW left from prod builds.
        navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
      }
    }

    if (!showElementor) return;

    const lazyloadRunObserver = () => {
      const lazyloadBackgrounds = document.querySelectorAll(
        ".e-con.e-parent:not(.e-lazyloaded)"
      );
      const lazyloadBackgroundObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const lazyloadBackground = entry.target as HTMLElement;
              if (lazyloadBackground) {
                lazyloadBackground.classList.add("e-lazyloaded");
              }
              lazyloadBackgroundObserver.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "200px 0px 200px 0px" }
      );
      lazyloadBackgrounds.forEach((lazyloadBackground) => {
        lazyloadBackgroundObserver.observe(lazyloadBackground);
      });
    };

    lazyloadRunObserver();

    const events = ["DOMContentLoaded", "elementor/lazyload/observe"];
    events.forEach((event) => {
      document.addEventListener(event, lazyloadRunObserver);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, lazyloadRunObserver);
      });
    };
  }, [showElementor]);

  return (
    <>
      {/* ====== GLOBAL SCRIPTS (load on ALL pages) ====== */}
      {/* beforeInteractive scripts (jQuery, wp hooks/i18n) live in the root layout — they must be rendered by a Server Component */}

    </>
  );
}
