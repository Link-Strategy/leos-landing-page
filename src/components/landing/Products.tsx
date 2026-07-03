"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/ui/button";

interface ProductItem {
  id: string;
  title: string;
  description: string;
  logo: string;
  bgImage: string;
  link: string;
}

/*
 * Chỉ giữ lại những gì Tailwind không handle được:
 *  1. sp-btn: box-shadow đa tầng (inset phức tạp)
 *  2. sp-nav: :hover svg filter + calc() vị trí responsive
 *  3. sp-btn span/svg responsive font-size via @media (child selector)
 */
const productsCss = `
  /* ── "Chi tiết" button ── */
  .sp-btn {
    box-shadow:
      0 1px 10px 0 rgba(0, 0, 0, 0.15),
      0 -3px 0 0 rgba(30, 154, 255, 0.18) inset,
      0 -2px 6px 0 rgba(255, 255, 255, 0.75) inset,
      0 -4px 16px 0 rgba(0, 106, 255, 0.30) inset;
  }

  /* ── Swiper nav arrows ── */
  .sp-nav svg {
    transition: filter 0.35s ease, transform 0.45s cubic-bezier(.22, 1, .36, 1);
  }
  .sp-nav:hover svg {
    filter: brightness(0) invert(1);
    -webkit-filter: brightness(0) invert(1);
  }

  /* Nav position: calc() không support trong Tailwind arbitrary */
  .sp-prev { left: calc((100% - 1200px) / 3); }
  .sp-next { right: calc((100% - 1200px) / 3); }

  @media screen and (max-width: 1550px) {
    .sp-prev { left: 70px; }
    .sp-next { right: 70px; }
    .sp-btn span { font-size: 16px; }
  }
  @media screen and (max-width: 1110px) {
    .sp-prev { left: 25px; }
    .sp-next { right: 25px; }
  }
  @media screen and (max-width: 767px) {
    .sp-prev { left: 10px; }
    .sp-next { right: 10px; }
    .sp-btn span { font-size: 14px; }
  }
`;

export default function Products() {
  const products: ProductItem[] = [
    {
      id: "ledb",
      title: "LeDB — BỘ NÃO SỐ",
      description: "Hệ quản trị dữ liệu tích hợp, kết nối toàn bộ hệ thống số hóa, thiết lập hộ chiếu sản phẩm tuần hoàn.",
      logo: "/wp-content/uploads/2026/05/logo-12.svg",
      bgImage: "/wp-content/uploads/2026/05/img-10-1.jpg",
      link: "/san-pham/ledb-bo-nao-so-4/",
    },
    {
      id: "lesb",
      title: "LeSB — XÂY DỰNG THÔNG MINH",
      description: "Số hóa hạ tầng kỹ thuật xây dựng công trình giao thông, cảng biển và kết cấu công nghiệp lắp ghép.",
      logo: "/wp-content/uploads/2026/05/logo-13.svg",
      bgImage: "/wp-content/uploads/2026/05/img-7-1.jpg",
      link: "/san-pham/lesb-xay-dung-thong-minh/",
    },
    {
      id: "lese",
      title: "LeSE — NĂNG LƯỢNG THÔNG MINH",
      description: "Tích hợp điện mặt trời, điện gió và trạm lưu trữ năng lượng BESS phục vụ vận hành Net Zero.",
      logo: "/wp-content/uploads/2026/05/logo-12.svg",
      bgImage: "/wp-content/uploads/2026/05/img-7-1.jpg",
      link: "/san-pham/lese-nang-luong-thong-minh/",
    },
    {
      id: "lesm",
      title: "LeSM — DI CHUYỂN THÔNG MINH",
      description: "Hạ tầng trạm sạc xe điện thông minh, trạm đổi pin tự động và tối ưu hóa hệ thống logistics xanh.",
      logo: "/wp-content/uploads/2026/05/logo.jpg",
      bgImage: "/wp-content/uploads/2026/05/img-8-1.jpg",
      link: "/san-pham/lesm-di-chuyen-thong-minh/",
    },
    {
      id: "legm",
      title: "LeGM — VẬT LIỆU XANH",
      description: "Ứng dụng bê tông tươi cấp phối tối ưu, gạch không nung, thép xanh và bê tông chống xâm thực nước biển.",
      logo: "/wp-content/uploads/2026/05/logo-11.svg",
      bgImage: "/wp-content/uploads/2026/05/img-9-1.jpg",
      link: "/san-pham/legm-vat-lieu-xanh/",
    },
    {
      id: "lesc",
      title: "LeSC — ĐÔ THỊ THÔNG MINH",
      description: "Mô hình quy hoạch đô thị sinh thái thông minh và phát triển khu công nghiệp sinh thái tuần hoàn.",
      logo: "/wp-content/uploads/2026/05/logo-8.svg",
      bgImage: "/wp-content/uploads/2026/05/img-6-1.jpg",
      link: "/san-pham/lesc-do-thi-thong-minh/",
    },
  ];

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    let swiperInstance: any = null;

    const init = () => {
      if (cancelled) return;
      const swiperEl = document.querySelector(".sp-slider");
      if (!swiperEl) {
        if (++attempts < 100) setTimeout(init, 50);
        return;
      }
      if (swiperEl.classList.contains("swiper-initialized")) return;
      if (typeof window !== "undefined" && (window as any).Swiper) {
        swiperInstance = new (window as any).Swiper(".sp-slider", {
          loop: true,
          centeredSlides: true,
          slidesPerView: 1.2,
          spaceBetween: 20,
          autoplay: { delay: 4000, disableOnInteraction: false },
          navigation: { nextEl: ".sp-next", prevEl: ".sp-prev" },
          breakpoints: {
            768: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.6, spaceBetween: 24 },
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
    /* Section container */
    <section className="
      flex flex-col w-full relative items-center box-border bg-transparent
      px-[80px] py-[90px]
      max-[1550px]:px-[60px] max-[1550px]:py-[60px]
      max-[767px]:px-4 max-[767px]:py-10
    ">
      <style dangerouslySetInnerHTML={{ __html: productsCss }} />

      {/* ── Heading ── */}
      <div className="w-full text-center mb-5">
        <h2 className="
          m-0 font-archivo font-extrabold leading-[1.3] text-white
          text-[40px]
          max-[1550px]:text-[32px]
          max-[1024px]:text-[28px]
          max-[767px]:text-[22px]
          [text-shadow:4px_0px_20px_rgba(0,140,255,0.2)]
        ">
          Sản phẩm LeTRON
          <br />
          Vận hành toàn bộ{" "}
          <span className="text-[#2A9FFF]">công nghiệp xanh</span>
        </h2>
      </div>

      {/* ── Sub-copy ── */}
      <div className="w-full text-center mb-[30px] flex align-center justify-center">
        <p className="
          m-auto font-archivo font-normal leading-[1.3] text-zinc-300 max-w-[800px]
          text-[18px]
          max-[1550px]:text-[16px]
          max-[1024px]:text-[14px]
        ">
          LeTRON xây dựng một hệ sinh thái tích hợp, nơi công nghệ, năng lượng, vật liệu và hạ tầng
          <br />
          được kết nối thành một vòng lặp giá trị khép kín.
        </p>
      </div>

      {/* ── CTA button ── */}

      <div className="
        flex justify-center self-center
        mb-[60px] max-[1550px]:mb-[40px]
      ">
        <Link
          href="/san-pham"
          className="
            inline-flex items-center gap-1 no-underline
            font-archivo font-semibold leading-[1.3] text-white
            text-[20px] max-[1550px]:text-[16px] max-[1024px]:text-[14px]
            rounded-full px-[21px] py-[10px] max-[1024px]:px-[18px] max-[1024px]:py-2
            bg-transparent border border-white/15
            transition-all duration-300
            hover:bg-[#132563] hover:border-white/30
          "
        >
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex items-center">
              <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M18.5303 12.5303C18.8232 12.2374 18.8232 11.7626 18.5303 11.4697L14.5303 7.46967C14.2374 7.17678 13.7626 7.17678 13.4697 7.46967C13.1768 7.76256 13.1768 8.23744 13.4697 8.53033L16.1893 11.25H6C5.58579 11.25 5.25 11.5858 5.25 12C5.25 12.4142 5.58579 12.75 6 12.75H16.1893L13.4697 15.4697C13.1768 15.7626 13.1768 16.2374 13.4697 16.5303C13.7626 16.8232 14.2374 16.8232 14.5303 16.5303L18.5303 12.5303Z" fill="white" fillRule="evenodd" />
              </svg>
            </span>
            <span>Xem tất cả sản phẩm</span>
          </span>
        </Link>
      </div>


      {/* ── Swiper slider ── */}
      <div className="w-full max-w-full box-border">
        <div className="w-full overflow-hidden relative">
          <div className="swiper sp-slider">
            <div className="swiper-wrapper">
              {products.map((product) => (
                <div className="swiper-slide" key={product.id}>
                  <Card
                    variant="glass"
                    className="rounded-[26px] p-0 gap-0 cursor-pointer h-[320px]"
                    style={{
                      "--card-glass-bg-start": "transparent",
                      "--card-glass-bg-end": "transparent",
                      "--card-glass-blur": "0px",
                      "--card-glass-shadow": "0 4px 26px 0 rgba(42,159,255,0.08), inset 0 2px 8px 0 rgba(255,255,255,0.08)",
                      "--card-glass-hover-shadow": "0 8px 40px 0 rgba(0,161,219,0.28), inset 0 2px 8px 0 rgba(255,255,255,0.12)",
                    } as React.CSSProperties}
                  >
                    {/* Background photo — zooms on hover */}
                    <div
                      className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[600ms] ease-in-out group-hover/card:scale-[1.08]"
                      style={{ backgroundImage: `url('${product.bgImage}')` }}
                    />

                    {/* Dark gradient overlay */}
                    <div
                      className="absolute inset-0 z-[1] rounded-[inherit] opacity-[0.88] transition-all duration-[450ms] ease-in-out"
                      style={{ background: "linear-gradient(180deg, rgba(13,27,75,0.10) 65%, #0D1B4B 100%)" }}
                    />

                    {/* Product logo — top-left */}
                    <div className="
                      absolute z-3 overflow-hidden rounded-xl
                      top-[21px] left-[23px] w-20 h-20
                      max-[1550px]:top-4 max-[1550px]:left-4 max-[1550px]:w-[70px] max-[1550px]:h-[70px]
                      max-[767px]:top-[10px] max-[767px]:left-[10px] max-[767px]:w-[60px] max-[767px]:h-[60px]
                    ">
                      <img
                        alt={product.title}
                        decoding="async"
                        src={product.logo}
                        className="w-full h-full object-cover block"
                      />
                    </div>

                    {/* Slide-up content panel */}
                    <div className="
                      absolute left-0 right-0 z-3
                      px-5 py-5
                      bottom-[-50px]
                      group-hover/card:bottom-0
                      transition-bottom duration-350 ease-in-out
                    ">
                      <CardTitle className="font-extrabold text-xl [text-shadow:0_4px_20px_rgba(0,140,255,0.20)]">
                        {product.title}
                      </CardTitle>

                      <div className="
                        flex items-center justify-between overflow-hidden
                        mt-4 max-[1110px]:mt-[10px]
                        flex-row gap-[60px] max-[1550px]:gap-5
                        max-[1110px]:flex-col max-[1110px]:gap-3
                        opacity-0 translate-y-3
                        group-hover/card:opacity-100 group-hover/card:translate-y-0
                        transition-[opacity,transform] duration-350 ease-in-out
                      ">
                        <CardDescription className="text-base max-[1110px]:text-sm">
                          {product.description}
                        </CardDescription>
                        <Button
                          asChild
                          variant="glass"
                          size={null}
                          className="px-3 py-1 text-xs"
                        >
                          <Link href={product.link}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="relative z-10 flex flex-row-reverse items-center gap-1">
                              <span className="[&_svg]:size-4">
                                <svg fill="none" height={24} viewBox="0 0 24 24" width={24} xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    clipRule="evenodd"
                                    d="M18.5303 12.5303C18.8232 12.2374 18.8232 11.7626 18.5303 11.4697L14.5303 7.46967C14.2374 7.17678 13.7626 7.17678 13.4697 7.46967C13.1768 7.76256 13.1768 8.23744 13.4697 8.53033L16.1893 11.25H6C5.58579 11.25 5.25 11.5858 5.25 12C5.25 12.4142 5.58579 12.75 6 12.75H16.1893L13.4697 15.4697C13.1768 15.7626 13.1768 16.2374 13.4697 16.5303C13.7626 16.8232 14.2374 16.8232 14.5303 16.5303L18.5303 12.5303Z"
                                    fill="white"
                                    fillRule="evenodd"
                                  />
                                </svg>
                              </span>
                              <span>Chi tiết</span>
                            </span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>

                </div>
              ))}
            </div>
          </div>

          {/* Prev arrow */}
          <div className="
            sp-nav sp-prev
            absolute top-1/2 -translate-y-1/2 z-10 cursor-pointer
            flex items-center justify-center
            w-14 h-14 max-[1550px]:w-[50px] max-[1550px]:h-[50px] max-[1110px]:w-[42px] max-[1110px]:h-[42px]
            rounded-full border border-white/35
            bg-gradient-to-b from-[rgba(238,242,255,0.96)] to-[rgba(255,255,255,0.96)]
            shadow-[0_4px_36px_0_rgba(42,159,255,0.4)]
            transition-all duration-[600ms] ease-in-out
            hover:bg-gradient-to-b hover:from-[rgba(42,159,255,0.80)] hover:to-[rgba(118,198,255,0.80)]
          ">
            <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21M9 6L3 12L9 18" stroke="#0D1B4B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>

          {/* Next arrow */}
          <div className="
            sp-nav sp-next
            absolute top-1/2 -translate-y-1/2 z-10 cursor-pointer
            flex items-center justify-center
            w-14 h-14 max-[1550px]:w-[50px] max-[1550px]:h-[50px] max-[1110px]:w-[42px] max-[1110px]:h-[42px]
            rounded-full border border-white/35
            bg-gradient-to-b from-[rgba(238,242,255,0.96)] to-[rgba(255,255,255,0.96)]
            shadow-[0_4px_36px_0_rgba(42,159,255,0.4)]
            transition-all duration-[600ms] ease-in-out
            hover:bg-gradient-to-b hover:from-[rgba(42,159,255,0.80)] hover:to-[rgba(118,198,255,0.80)]
          ">
            <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21M15 6L21 12L15 18" stroke="#0D1B4B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
