import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

// Design reference box matching the native size of Pillars_items.png (the 6-hexagon
// cluster + connecting orbit lines, 613x633px), so every % below preserves true
// circularity and lines up with that image regardless of rendered breakpoint size.
const VISUAL_W = 613;
const VISUAL_H = 633;

// Size of the ring+core group (Property-1Variant3-1.png + Group-11.png), tuned so its
// visible outer edge lines up with the solid orbit line baked into Pillars_items.png.
const RING_WRAPPER_SIZE = 530;
const CORE_SIZE = (RING_WRAPPER_SIZE * 120) / 315;

// The solid orbit circle drawn inside Pillars_items.png is not centered on its own
// canvas (measured via a radius scan: ~182px at the top vs ~168px at the bottom) — it
// sits about 7px above true canvas center. Shift the ring+core group by the same
// amount so it lines up with that orbit line instead of the plain geometric center.
const CIRCLE_CENTER_OFFSET_X = -0.75;
const CIRCLE_CENTER_OFFSET_Y = -7.25;

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

export default async function Hero() {
  const t = await getTranslations("hero");
  const features = t.raw("features") as string[];

  return (
    <section
      className="relative flex min-h-[600px] items-center overflow-hidden bg-cover bg-center bg-no-repeat pt-[calc(var(--header-height-mobile)+20px)] lg:h-[800px] lg:pt-0"
      style={{ backgroundImage: "url('/landing/Hero/Hero_bg.png')" }}
    >
      <div className="container-le relative z-10 flex w-full flex-col items-center gap-16 py-16 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10 lg:py-0">
        {/* Left content */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="flex flex-col items-center gap-[14px] lg:items-start">
            <span className="font-inter text-[14px] font-bold uppercase leading-[16px] tracking-[2.2px] text-[#63D9FF] [text-shadow:0px_0px_6px_rgba(99,217,255,0.18)]">
              {t("badge")}
            </span>

            <h1 className="font-inter whitespace-nowrap text-[40px] font-extrabold leading-[1.2] tracking-[-1.5px] text-white sm:text-[60px] sm:leading-[76px] sm:tracking-[-2.2px]">
              {t("title")}
            </h1>

            <p className="font-inter text-[20px] font-bold leading-[28px] tracking-[-0.3px] text-[#63D9FF] sm:text-[24px] sm:leading-[32px]">
              {t("subtitle")}
            </p>

            <ul className="flex w-full flex-col items-start gap-2 lg:w-auto lg:flex-row lg:flex-wrap lg:items-center lg:justify-start lg:gap-x-6 lg:gap-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-[6px]">
                  <Image src="/landing/LeOsAi/Tick.svg" alt="" width={20} height={20} className="shrink-0" />
                  <span className="font-open-sans text-[18px] font-normal leading-[30px] tracking-[0px] text-white">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <p className="font-open-sans text-[18px] font-light leading-[30px] tracking-[0px] text-[#F4F4F4]">
              {t("description")}
            </p>
          </div>

          <div className="mt-10 flex w-full flex-col items-center gap-4 lg:w-auto lg:flex-row lg:justify-start">
            <Link
              href="#"
              className="flex h-[50px] w-full items-center justify-center gap-4 whitespace-nowrap rounded-[10px] bg-[#2A9FFF] pb-[15px] pl-6 pr-5 pt-[15px] font-inter text-[14px] font-bold leading-[20px] text-white shadow-[0px_12px_34px_0px_rgba(90,160,255,0.4)] transition-all duration-300 hover:-translate-y-1 hover:text-white! hover:opacity-80 lg:w-[214px]"
            >
              {t("ctaPrimary")}
              <ArrowIcon />
            </Link>
            <Link
              href="#"
              className="flex h-[50px] w-full items-center justify-center gap-4 whitespace-nowrap rounded-[10px] border border-[#2A9FFF] bg-transparent pb-[15px] pl-6 pr-5 pt-[15px] font-inter text-[14px] font-bold leading-[20px] text-white shadow-[0px_12px_34px_0px_rgba(90,160,255,0.4)] transition-all duration-300 hover:-translate-y-1 hover:text-white! hover:opacity-80 lg:w-[268px]"
            >
              {t("ctaSecondary")}
              <ArrowIcon />
            </Link>
          </div>
        </div>

        {/* Right visual: 6-hexagon cluster image + rotating ring/core in the center hole */}
        <div
          className="relative w-[300px] shrink-0 sm:w-[380px] lg:w-full lg:max-w-[500px] lg:justify-self-end"
          style={{ aspectRatio: `${VISUAL_W} / ${VISUAL_H}` }}
        >
          <img
            src="/landing/Hero/Pillars_items.png"
            alt=""
            className="absolute inset-0 h-full! w-full object-contain"
          />

          {/* Center core + outer ring, sized to sit inside the image's empty hole */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              left: `${50 + (CIRCLE_CENTER_OFFSET_X / VISUAL_W) * 100}%`,
              top: `${50 + (CIRCLE_CENTER_OFFSET_Y / VISUAL_H) * 100}%`,
              width: `${(RING_WRAPPER_SIZE / VISUAL_W) * 100}%`,
              height: `${(RING_WRAPPER_SIZE / VISUAL_H) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <img
              src="/wp-content/uploads/2026/05/Property-1Variant3-1.png"
              alt=""
              className="absolute inset-0 h-full! w-full animate-[spin_60s_linear_infinite_reverse] object-contain opacity-60 drop-shadow-[0_0_20px_rgba(42,159,255,0.15)]"
            />
            <img
              src="/wp-content/uploads/2026/05/Group-11.png"
              alt={t("subtitle")}
              className="relative animate-[spin_60s_linear_infinite] object-contain drop-shadow-[0_0_15px_rgba(42,159,255,0.2)]"
              style={{
                width: `${(CORE_SIZE / RING_WRAPPER_SIZE) * 100}%`,
                height: `${(CORE_SIZE / RING_WRAPPER_SIZE) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
