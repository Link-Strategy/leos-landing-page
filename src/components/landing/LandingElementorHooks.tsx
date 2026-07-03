"use client";

import { useEffect } from "react";

export default function LandingElementorHooks() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    const revealElement = (element: HTMLElement) => {
      if (!element.classList.contains("elementor-invisible")) return;

      let animation = element.dataset.settings ? "fadeIn" : "";

      if (element.dataset.settings) {
        try {
          const settings = JSON.parse(element.dataset.settings) as {
            animation?: string;
            _animation?: string;
          };
          animation = settings.animation ?? settings._animation ?? animation;
        } catch {
          animation = "fadeIn";
        }
      }

      element.classList.remove("elementor-invisible");
      element.classList.add("animated");

      if (animation) {
        element.classList.add(animation);
      }
    };

    const invisibleElements = Array.from(document.querySelectorAll<HTMLElement>(".elementor-invisible"));

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            revealElement(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
      );

      invisibleElements.forEach((element) => observer.observe(element));
      cleanups.push(() => observer.disconnect());
    } else {
      invisibleElements.forEach(revealElement);
    }

    document.querySelectorAll<HTMLElement>(".e-n-tabs").forEach((tabs) => {
      const buttons = Array.from(tabs.querySelectorAll<HTMLButtonElement>(".e-n-tab-title"));
      const panels = Array.from(tabs.querySelectorAll<HTMLElement>('[role="tabpanel"][data-tab-index]'));

      if (!buttons.length || !panels.length) return;

      const activateTab = (tabIndex: string) => {
        buttons.forEach((button) => {
          const isActive = button.dataset.tabIndex === tabIndex;
          button.setAttribute("aria-selected", String(isActive));
          button.tabIndex = isActive ? 0 : -1;
        });

        panels.forEach((panel) => {
          const isActive = panel.dataset.tabIndex === tabIndex;
          panel.classList.toggle("e-active", isActive);
          panel.hidden = !isActive;
          panel.style.display = isActive ? "" : "none";
        });
      };

      const initialTab =
        buttons.find((button) => button.getAttribute("aria-selected") === "true")?.dataset.tabIndex ??
        buttons[0]?.dataset.tabIndex ??
        "1";
      activateTab(initialTab);

      buttons.forEach((button, index) => {
        const onClick = () => activateTab(button.dataset.tabIndex ?? String(index + 1));
        const onKeyDown = (event: KeyboardEvent) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick();
          }

          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            const direction = event.key === "ArrowRight" ? 1 : -1;
            const nextIndex = (index + direction + buttons.length) % buttons.length;
            buttons[nextIndex]?.focus();
            buttons[nextIndex]?.click();
          }
        };

        button.addEventListener("click", onClick);
        button.addEventListener("keydown", onKeyDown);
        cleanups.push(() => {
          button.removeEventListener("click", onClick);
          button.removeEventListener("keydown", onKeyDown);
        });
      });
    });

    document.querySelectorAll<HTMLElement>(".e-n-accordion").forEach((accordion) => {
      const items = Array.from(accordion.querySelectorAll<HTMLDetailsElement>("details.e-n-accordion-item"));

      items.forEach((item) => {
        const summary = item.querySelector<HTMLElement>("summary.e-n-accordion-item-title");
        const onToggle = () => {
          summary?.setAttribute("aria-expanded", String(item.open));
        };

        item.addEventListener("toggle", onToggle);
        cleanups.push(() => item.removeEventListener("toggle", onToggle));
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
