import Image from "next/image";
import Link from "next/link";
import type * as React from "react";
import { Play } from "lucide-react";

import LandingElementorHooks from "@/components/landing/LandingElementorHooks";
import Partners from "@/components/landing/Partners";
import Career from "@/components/landing/Career";
import { AboutHeartValues } from "./AboutHeartValues";
import { LeadershipReveal } from "./LeadershipReveal";

function SubtitleBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`inline-block rounded-full border border-[#538DC3] p-px shadow-[0px_2px_16px_0px_rgba(0,149,255,0.26)] ${className ?? ""}`}
    >
      <div className="inline-flex items-center rounded-full px-6! py-1 lg:h-10 lg:px-[13px] lg:py-0 backdrop-blur-sm font-display text-sm font-normal leading-[2] text-[#4AB3FF] 2xl:text-base">
        {children}
      </div>
    </div>
  );
}

function InfoCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-px shadow-[inset_0px_2px_8px_0px_rgba(255,255,255,0.08),0px_4px_26px_0px_rgba(0,161,219,0.08)] ${className ?? ""}`}
      style={{ backgroundImage: "linear-gradient(180deg, #2A9FFF 0%, #76C6FF 100%)" }}
    >
      <div
        className="h-full rounded-2xl bg-[#132563] px-6 py-6 sm:px-[37px] sm:py-[30px]"
        style={{ backgroundImage: "linear-gradient(180deg, rgba(42,159,255,0.55) 0%, rgba(23,71,156,0.55) 100%)" }}
      >
        {children}
      </div>
    </div>
  );
}

const MISSION_POINTS = [
  "Biến chất thải công nghiệp thành vật liệu có giá trị cao",
  "Tối ưu vận hành bằng dữ liệu thời gian thực",
  "Giảm thiểu tác động môi trường một cách có thể đo lường",
];

export default function AboutPage() {
  return (
    <div className="site-main post-723 page type-page status-publish hentry">
      <div
        className="elementor elementor-723"
        data-elementor-id={723}
        data-elementor-post-type="page"
        data-elementor-type="wp-page"
      >
        {/* Hero */}
        <section className="relative isolate flex h-[350px] items-end overflow-hidden px-6 pb-8 sm:h-[620px] sm:px-8 sm:pb-14">
          <Image
            alt=""
            src="/about/Banner.png"
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(13,27,75,0.1)_0%,rgba(13,27,75,0.3)_50%,#0D1B4B_100%)]" />
          <div className="mx-auto w-full max-w-[1320px]">
            <nav aria-label="breadcrumbs" className="rank-math-breadcrumb text-sm text-zinc-400">
              <p>
                <Link href="/">Home</Link>
                <span className="separator"> / </span>
                <span className="last">Giới thiệu</span>
              </p>
            </nav>
            <h1 className="elementor-heading-title elementor-size-default mt-4 font-archivo text-3xl font-extrabold leading-[1.3]! text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-4xl">
              Giới thiệu <span className="text-[#2A9FFF]">LeTRON</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-zinc-400">
              Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing
              industries for previewing layouts and visual mockups.
            </p>
          </div>
        </section>

        {/* Giới thiệu chung */}
        <div className="mx-auto max-w-[1320px] space-y-16 px-6 py-16 sm:px-8">
          <div className="space-y-10">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-16">
              <div>
                <SubtitleBadge>Giới thiệu chung</SubtitleBadge>
                <h2 className="elementor-heading-title elementor-size-default font-archivo text-2xl font-extrabold leading-[1.3]! text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-3xl my-7!">
                  Hệ sinh thái công nghiệp
                  <br />
                  Vận hành bằng <span className="text-[#2A9FFF]">dữ liệu</span>
                </h2>
              </div>

              <div className="space-y-4 text-base font-light leading-relaxed text-white">
                <p>
                  LETRON là tập đoàn công nghiệp thế hệ mới, tiên phong ứng dụng công nghệ số để tái
                  cấu trúc toàn bộ chuỗi giá trị từ tài nguyên, sản xuất đến hạ tầng và năng lượng.
                </p>
                <p>
                  Khác với mô hình doanh nghiệp truyền thống, LETRON được xây dựng như một nền tảng
                  vận hành hợp nhất, nơi dữ liệu, trí tuệ nhân tạo và tài sản vật lý kết nối chặt
                  chẽ thông qua hệ điều hành LeOS. Tại đây, những gì từng được xem là “chất thải”
                  được tái định nghĩa thành tài nguyên có giá trị, tạo ra một vòng lặp kinh tế tuần
                  hoàn bền vững và có khả năng mở rộng toàn cầu.
                </p>
              </div>
            </div>

            <div className="relative">
              <div
                className="elementor-element elementor-widget elementor-widget-video"
                data-widget_type="video.default"
                data-settings='{"youtube_url":"https://www.youtube.com/watch?v=XHOmBV4js_E","video_type":"youtube"}'
              >
                <div
                  className="elementor-wrapper elementor-open-inline relative w-full overflow-hidden rounded-2xl border border-white/10"
                  style={{ "--video-aspect-ratio": "16 / 9" } as React.CSSProperties}
                >
                  <div className="elementor-video" />
                  <div
                    className="elementor-custom-embed-image-overlay absolute inset-0 flex items-center justify-center bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url(/wp-content/uploads/2026/05/af37ff9a27363e04b244b5aa57821bce76b409c5-1.jpg)",
                    }}
                  >
                    <div
                      aria-label="Phát video"
                      className="elementor-custom-embed-play flex size-16 cursor-pointer items-center justify-center rounded-full bg-[#2A9FFF] text-white shadow-[0_2px_20px_rgba(12,178,255,0.4)] transition hover:bg-[#4AB3FF]"
                      role="button"
                      tabIndex={0}
                    >
                      <Play aria-hidden className="size-6 translate-x-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tầm nhìn / Sứ mệnh */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
            <InfoCard>
              <Image alt="" src="/about/Eye.png" width={82} height={82} />
              <SubtitleBadge className="mt-4">Tầm nhìn</SubtitleBadge>
              <h3 className="my-7! font-archivo text-xl font-bold leading-[1.3] text-white sm:text-2xl">
                Hệ sinh thái công nghiệp
                <br />
                Vận hành bằng <span className="text-[#2A9FFF]">dữ liệu</span>
              </h3>
              <p className="mt-4 text-base font-light leading-[1.5]! text-white">
                LETRON hướng tới việc đưa trí tuệ và công nghệ Việt Nam vươn ra toàn cầu, định hình
                một chuẩn mực mới cho ngành công nghiệp — nơi tăng trưởng kinh tế song hành với tái
                tạo môi trường.
              </p>
            </InfoCard>

            <InfoCard>
              <Image alt="" src="/about/Target.png" width={82} height={82} />
              <SubtitleBadge className="mt-4">Sứ mệnh</SubtitleBadge>
              <h3 className="my-7! font-archivo text-xl font-bold leading-[1.3] text-white sm:text-2xl">
                Người chữa lành Trái đất
                <br />
                <span className="text-[#2A9FFF]">bằng công nghệ</span>
              </h3>
              <p className="mt-4 text-base font-light leading-[150%] text-white">
                Chúng tôi ứng dụng nền tảng LeOS và LeLe AI để:
              </p>
              <ul className="mt-4 space-y-2.5">
                {MISSION_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2.5 text-sm font-light leading-[150%] text-white"
                  >
                    <Image
                      src="/landing/LeOsAi/Tick.svg"
                      alt=""
                      width={30}
                      height={28}
                      className="flex-shrink-0"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>
          </div>

          {/* Sơ đồ tổ chức */}
          <div className="text-center">
            <h2 className="elementor-heading-title elementor-size-default font-archivo text-2xl font-extrabold leading-[1.3]! text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-3xl">
              Sơ đồ tổ chức
            </h2>
            <div className="mt-8">
              <Image
                alt="Sơ đồ tổ chức LeTRON"
                src="/wp-content/uploads/2026/05/so-do.svg"
                width={1681}
                height={574}
                className="mx-auto h-auto w-full max-w-full"
              />
            </div>
          </div>
        </div>

        {/* Giá trị cốt lõi H.E.A.R.T */}
        <div className="mx-auto max-w-[1320px] px-6 py-16 sm:px-8">
          <AboutHeartValues />
        </div>

        {/* Ban lãnh đạo */}
        <div className="mx-auto max-w-[1320px] px-6 py-16 sm:px-8">
          <h2 className="elementor-heading-title elementor-size-default mb-10! text-center font-archivo text-2xl font-extrabold leading-[1.3]! text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-3xl">
            Ban lãnh đạo
          </h2>
          <LeadershipReveal />
        </div>

        <Partners />
        <Career />
      </div>
      <LandingElementorHooks />
    </div>
  );
}
