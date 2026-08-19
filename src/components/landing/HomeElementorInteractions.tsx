"use client";

import { useEffect } from "react";

type SwiperConstructor = new (element: Element | string, options: Record<string, unknown>) => unknown;

declare global {
  interface Window {
    Swiper?: SwiperConstructor;
  }
}

function readSettings(element: Element | null) {
  if (!element) {
    return {};
  }

  const rawSettings = element.getAttribute("data-settings");
  if (!rawSettings) {
    return {};
  }

  try {
    return JSON.parse(rawSettings) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function numberSetting(settings: Record<string, unknown>, key: string, fallback: number) {
  const value = settings[key];
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function sizeSetting(settings: Record<string, unknown>, key: string, fallback: number) {
  const value = settings[key];
  if (typeof value === "object" && value !== null && "size" in value) {
    const size = (value as { size?: unknown }).size;
    if (typeof size === "number") {
      return size;
    }

    if (typeof size === "string" && size.trim() !== "") {
      const parsed = Number(size);
      return Number.isFinite(parsed) ? parsed : fallback;
    }
  }

  return fallback;
}

function setupNestedTabs(root: ParentNode) {
  const cleanups: Array<() => void> = [];

  root.querySelectorAll<HTMLElement>(".e-n-tabs").forEach((tabs) => {
    const titles = Array.from(tabs.querySelectorAll<HTMLButtonElement>(".e-n-tab-title"));
    const panels = Array.from(tabs.querySelectorAll<HTMLElement>('[role="tabpanel"]'));

    if (titles.length === 0 || panels.length === 0) {
      return;
    }

    const activate = (index: string) => {
      titles.forEach((title) => {
        const isActive = title.dataset.tabIndex === index;
        title.setAttribute("aria-selected", isActive ? "true" : "false");
        title.setAttribute("tabindex", isActive ? "0" : "-1");
        title.classList.toggle("e-active", isActive);
      });

      panels.forEach((panel) => {
        const isActive = panel.dataset.tabIndex === index;
        panel.classList.toggle("e-active", isActive);
        panel.toggleAttribute("hidden", !isActive);
        panel.style.display = isActive ? "" : "none";
      });
    };

    const current =
      titles.find((title) => title.getAttribute("aria-selected") === "true")?.dataset.tabIndex ??
      titles[0]?.dataset.tabIndex;

    if (current) {
      activate(current);
    }

    titles.forEach((title) => {
      const onClick = () => {
        if (title.dataset.tabIndex) {
          activate(title.dataset.tabIndex);
        }
      };

      title.addEventListener("click", onClick);
      cleanups.push(() => title.removeEventListener("click", onClick));
    });
  });

  return cleanups;
}

function initSwiperWhenReady(swiperElement: Element, options: Record<string, unknown>) {
  let cancelled = false;
  let attempts = 0;

  const init = () => {
    if (cancelled || swiperElement.classList.contains("swiper-initialized")) {
      return;
    }

    if (!window.Swiper) {
      attempts += 1;
      if (attempts < 80) {
        window.setTimeout(init, 50);
      }
      return;
    }

    new window.Swiper(swiperElement, options);
  };

  init();

  return () => {
    cancelled = true;
  };
}

function setupElementorCarousels(root: ParentNode) {
  const cleanups: Array<() => void> = [];

  root
    .querySelectorAll<HTMLElement>(".elementor-widget-n-carousel, .elementor-widget-loop-carousel")
    .forEach((widget) => {
      const swiperElement = widget.querySelector<HTMLElement>(".swiper");
      if (!swiperElement || swiperElement.classList.contains("swiper-initialized")) {
        return;
      }

      const settings = readSettings(widget);
      const slidesToShow = numberSetting(settings, "slides_to_show", 1);
      const tabletSlides = numberSetting(settings, "slides_to_show_tablet", Math.min(slidesToShow, 2));
      const mobileSlides = numberSetting(settings, "slides_to_show_mobile", 1);
      const spacing = sizeSetting(settings, "image_spacing_custom", 24);
      const tabletSpacing = sizeSetting(settings, "image_spacing_custom_tablet", spacing);
      const mobileSpacing = sizeSetting(settings, "image_spacing_custom_mobile", tabletSpacing);
      const slideCount = swiperElement.querySelectorAll(".swiper-slide").length;

      const options: Record<string, unknown> = {
        loop: settings.infinite === "yes" && slideCount > slidesToShow,
        slidesPerView: mobileSlides,
        slidesPerGroup: numberSetting(settings, "slides_to_scroll", 1),
        spaceBetween: mobileSpacing,
        speed: numberSetting(settings, "speed", 500),
        watchOverflow: true,
        pagination: {
          el: widget.querySelector(".swiper-pagination"),
          clickable: true,
        },
        navigation: {
          nextEl: widget.querySelector(".elementor-swiper-button-next, .swiper-button-next"),
          prevEl: widget.querySelector(".elementor-swiper-button-prev, .swiper-button-prev"),
        },
        breakpoints: {
          768: {
            slidesPerView: tabletSlides,
            spaceBetween: tabletSpacing,
          },
          1025: {
            slidesPerView: slidesToShow,
            spaceBetween: spacing,
          },
        },
      };

      if (settings.autoplay === "yes") {
        options.autoplay = {
          delay: numberSetting(settings, "autoplay_speed", 5000),
          disableOnInteraction: settings.pause_on_interaction === "yes",
          pauseOnMouseEnter: settings.pause_on_hover === "yes",
        };
      }

      cleanups.push(initSwiperWhenReady(swiperElement, options));
    });

  return cleanups;
}

export default function HomeElementorInteractions() {
  useEffect(() => {
    const root = document.querySelector(".site-main.post-2588");
    if (!root) {
      return;
    }

    // Note: pillar hover (group-cop-info/box-sub-home) and counter animation
    // (elementor-counter-number) are now handled natively inside the
    // Pillars.tsx and Counters.tsx React components — removed here to avoid
    // two competing mechanisms fighting over the same DOM nodes.
    const cleanups = [
      ...setupNestedTabs(root),
      ...setupElementorCarousels(root),
    ];

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
