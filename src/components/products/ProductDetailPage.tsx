import Image from "next/image";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import LandingElementorHooks from "@/components/landing/LandingElementorHooks";
import News from "@/components/landing/News";
import { LeadForm } from "@/components/subpage/LeadForm";
import { CANONICAL_PRODUCT_IDS, CANONICAL_PRODUCT_SLUGS, PRODUCT_SLUG_TO_ID, type ProductId } from "@/lib/products";
import CustomerReviews from "./CustomerReviews";

interface FeatureItem {
  name: string;
  subtitle: string;
  bullets: string[];
}

export function getProductIdForSlug(slug: string): ProductId | undefined {
  return PRODUCT_SLUG_TO_ID[slug];
}

export default function ProductDetailPage({ slug }: { slug: string }) {
  const productId = getProductIdForSlug(slug);
  if (!productId) notFound();

  const t = useTranslations("productsPage");
  const tDetail = useTranslations("productsPage.detail");
  const tProducts = useTranslations("products");
  const title = tProducts(`items.${productId}.title`);
  const features = tDetail.raw("features") as FeatureItem[];
  const processSteps = tDetail.raw("processSteps") as string[];

  return (
    <div className="site-main product type-product status-publish hentry">
      <div className="elementor elementor-1360">
        {/* Hero */}
        <section className="relative isolate flex min-h-[350px] flex-col items-center justify-end overflow-hidden px-6 pb-8 sm:min-h-[620px] sm:px-8 sm:pb-14">
          <Image
            alt=""
            src="/wp-content/uploads/2026/05/image-22-1.jpg"
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(13,27,75,0.1)_0%,rgba(13,27,75,0.3)_50%,#0D1B4B_100%)]" />
          <div className="mx-auto mb-[60px] w-full max-w-[1500px]">
            <nav aria-label="breadcrumbs" className="rank-math-breadcrumb text-sm text-white">
              <p>
                <Link href="/">{t("breadcrumbHome")}</Link>
                <span className="separator"> / </span>
                <span className="last">{title}</span>
              </p>
            </nav>
            <h1 className="elementor-heading-title elementor-size-default mt-4 font-archivo text-3xl font-extrabold leading-[1.3]! text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-white">
              {t("heroDescription")}
            </p>
          </div>

          {/* Sub-nav: jump between products */}
          <nav className="absolute inset-x-0 bottom-0 z-10 rounded-t-[20px] bg-[#2A9FFF]/[0.56] px-6 pt-2 pb-0 shadow-[0px_2px_20px_0px_rgba(12,178,255,0.26)] sm:px-8 lg:px-20">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 sm:gap-x-10">
              {CANONICAL_PRODUCT_IDS.map((id) => {
                const isActive = id === productId;
                return (
                  <li key={id}>
                    <Link
                      className={`relative inline-block py-3 text-center font-archivo text-base font-bold leading-normal sm:text-2xl ${
                        isActive ? "text-white!" : "text-[#83CBFF]! hover:text-white!"
                      }`}
                      href={`/san-pham/${CANONICAL_PRODUCT_SLUGS[id]}`}
                    >
                      {tProducts(`items.${id}.title`).split(" — ")[0]}
                      {isActive && (
                        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[2px] bg-white" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </section>

        {/* Nền tảng dữ liệu và trí tuệ nhân tạo */}
        <section
          className="bg-[#0D1B4B] bg-[url('/wp-content/uploads/2026/05/S1-1.jpg')] bg-[position:bottom_center] bg-cover bg-no-repeat px-6 py-16 sm:px-8"
        >
          <style
            dangerouslySetInnerHTML={{
              __html: `
                .pdp-features-grid.list-dac-diem-sp { display: flex; flex-wrap: wrap; gap: 34px; }
                .pdp-features-grid .item-box-dac-diem { flex: 1 1 0; min-width: 0; }
                .pdp-features-grid .box-title-dac-diem { width: 100%; height: auto; aspect-ratio: 390 / 204; background-position: center; background-size: contain; padding: 34px 51px; }
                @media (max-width: 1024px) {
                  .pdp-features-grid .item-box-dac-diem { flex: 1 1 calc(50% - 17px); }
                }
                @media (max-width: 480px) {
                  .pdp-features-grid .item-box-dac-diem { flex: 1 1 100%; }
                  .pdp-features-grid .box-title-dac-diem { padding: 24px 30px; }
                }
              `,
            }}
          />
          <div className="mx-auto max-w-[1500px]">
            <h2 className="elementor-heading-title elementor-size-default font-archivo text-2xl font-extrabold leading-[1.3]! text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-[40px]!">
              {t("detail.featuresHeadingPrefix")}{" "}
              <span className="text-[#2A9FFF]">{t("detail.featuresHeadingHighlight")}</span>
            </h2>
            <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-white">
              {t("detail.featuresIntro")}
            </p>
            <div className="pdp-features-grid list-dac-diem-sp">
              {features.map((feature) => (
                <div className="item-box-dac-diem" key={feature.name}>
                  <div className="box-title-dac-diem">
                    <h3 className="title-dac-diem">{feature.name}</h3>
                  </div>
                  <div className="box-content">
                    <h4 className="title-box">{feature.subtitle}</h4>
                    <div className="desc-dac-diem">
                      <ul>
                        {feature.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cách vận hành */}
        <section className="bg-[#0D1B4B] px-6 py-16 sm:px-8">
          <div className="mx-auto grid max-w-[1500px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="elementor-heading-title elementor-size-default font-archivo text-2xl font-extrabold leading-[1.3]! text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-[40px]!">
                {t("detail.processHeadingPrefix")}{" "}
                <span className="text-[#2A9FFF]">{t("detail.processHeadingHighlight")}</span>
                <br />
                {t("detail.processHeadingLine2")}
              </h2>
              <p className="mt-[30px] text-base font-light leading-relaxed text-white">
                {t("detail.processIntro")}
              </p>
              <div className="list-quy-trinh mt-[40px]">
                {processSteps.map((step) => (
                  <div className="ten-quy-trinh" key={step}>
                    {step}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-[853/606] overflow-hidden rounded-2xl">
              <Image
                alt=""
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 1000px"
                src="/wp-content/uploads/2026/05/2-6.jpg"
              />
              <Image
                alt=""
                aria-hidden
                className="pointer-events-none object-contain"
                fill
                src="/wp-content/uploads/2026/05/img-2-2-1.png"
              />
            </div>
          </div>
        </section>

        {/* Khách hàng nói gì */}
        <CustomerReviews />

        {/* Tin tức liên quan */}
        <News />

        {/* Nhận tư vấn sản phẩm */}
        <section
          className="flex flex-col items-center gap-9 bg-[#0D1B4B] bg-[url('/wp-content/uploads/2026/05/S2-1.jpg')] bg-[position:bottom_center] bg-cover bg-no-repeat px-6 py-16 sm:px-8 lg:py-[90px]"
        >
          <h2 className="elementor-heading-title elementor-size-default text-center font-archivo text-2xl font-extrabold leading-[1.3]! text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-[40px]!">
            {tDetail("consultHeadingPrefix")}{" "}
            <span className="text-[#2A9FFF]">{tDetail("consultHeadingHighlight")}</span>
          </h2>
          <div className="w-full max-w-[660px]">
            <LeadForm
              buttonLabel={tDetail("consultSubmitLabel")}
              namePlaceholder={tDetail("consultNamePlaceholder")}
              emailPlaceholder={tDetail("consultEmailPlaceholder")}
              phonePlaceholder={tDetail("consultPhonePlaceholder")}
              messagePlaceholder={tDetail("consultMessagePlaceholder")}
              source={`san-pham/${CANONICAL_PRODUCT_SLUGS[productId]}`}
              lead_type="product-consult"
              submitAlign="center"
            />
          </div>
        </section>
      </div>
      <LandingElementorHooks />
    </div>
  );
}
