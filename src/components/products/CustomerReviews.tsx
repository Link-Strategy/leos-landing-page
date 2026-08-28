"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

const REVIEW_COUNT = 5;

export default function CustomerReviews() {
  const t = useTranslations("productsPage.detail");

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    let swiperInstance: any = null;

    const init = () => {
      if (cancelled) return;
      const swiperEl = document.querySelector(".customer-review-slider");
      if (!swiperEl) {
        if (++attempts < 100) setTimeout(init, 50);
        return;
      }
      if (swiperEl.classList.contains("swiper-initialized")) return;
      if (typeof window !== "undefined" && (window as any).Swiper) {
        swiperInstance = new (window as any).Swiper(".customer-review-slider", {
          loop: true,
          slidesPerView: "auto",
          spaceBetween: 20,
          speed: 800,
          grabCursor: true,
          navigation: { nextEl: ".review-next", prevEl: ".review-prev" },
          breakpoints: {
            767: { spaceBetween: 80 },
            967: { spaceBetween: 100 },
            1550: { spaceBetween: 129 },
          },
        });
      } else {
        if (++attempts < 100) setTimeout(init, 50);
      }
    };

    init();
    return () => {
      cancelled = true;
      swiperInstance?.destroy?.();
    };
  }, []);

  return (
    <section className="customer-review-section px-6 py-16 sm:px-8">
      {/*
        - Only the active (fully opaque) slide shows the reviewer avatar/name/role.
        - Swiper equalizes every slide to the tallest slide's height; without an explicit
          top-anchored flex layout on .review-card, the shorter (avatar-less) preview slides
          would center their quote text in that leftover height instead of keeping it flush top.
        - .review-top ships with width:50% + justify-content:space-between, which — inside our
          wider 1500px container — pushes the nav arrows far from the title; pin a fixed 60px
          gap right after the title instead.
      */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .customer-review-slider .swiper-slide:not(.swiper-slide-active) .review-user { display: none; }
            .customer-review-slider .swiper-slide:not(.swiper-slide-active) .review-content { margin-top: 40px; }
            .customer-review-slider .swiper-slide { display: flex; }
            .customer-review-slider .review-card { display: flex; width: 100%; flex-direction: column; justify-content: flex-start; }
            .review-top { width: auto; justify-content: flex-start; gap: 60px; }
          `,
        }}
      />
      <div className="mx-auto max-w-[1500px]">
        <div className="review-top">
          <h2 className="review-title">
            {t("reviewHeadingPrefix")} <span>{t("reviewHeadingHighlight")}</span>
          </h2>
          <div className="review-nav">
            <div className="review-prev">
              <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M9 6L3 12L9 18" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            <div className="review-next">
              <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M15 6L21 12L15 18" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
        <div className="swiper customer-review-slider">
          <div className="swiper-wrapper">
            {Array.from({ length: REVIEW_COUNT }).map((_, index) => (
              <div className="swiper-slide" key={index}>
                <div className="review-card">
                  <div className="review-content">{t("reviewQuote")}</div>
                  <div className="review-user">
                    <div className="review-avatar">
                      <img alt={t("reviewName")} src="/wp-content/uploads/2026/05/Ellipse-3.jpg" />
                    </div>
                    <div className="review-meta">
                      <div className="review-name">{t("reviewName")}</div>
                      <div className="review-info">{t("reviewRole")}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
