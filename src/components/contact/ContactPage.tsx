import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import LandingElementorHooks from "@/components/landing/LandingElementorHooks";
import { LeadForm } from "@/components/subpage/LeadForm";

export default function ContactPage() {
  const t = useTranslations("contact");

  const phone1 = t("phone1");
  const phone2 = t("phone2");
  const email = t("email");

  return (
    <div className="site-main post-36 page type-page status-publish hentry">
      <div
        className="elementor elementor-36"
        data-elementor-id={36}
        data-elementor-post-type="page"
        data-elementor-type="wp-page"
      >
        {/* Header */}
        <section className="relative isolate flex min-h-[350px] flex-col overflow-hidden px-6 pb-8 pt-[calc(var(--header-height-mobile)+24px)]! sm:min-h-[620px] sm:justify-end sm:px-8 sm:pb-14 lg:min-h-[720px] lg:pt-[calc(var(--header-height)+32px)]!">
          <Image
            alt=""
            src="/contact/banner-contact.png"
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(13,27,75,0.1)_0%,rgba(13,27,75,0.3)_50%,#0D1B4B_100%)]" />
          <div className="mx-auto w-full max-w-[1680px]">
            <nav aria-label="breadcrumbs" className="rank-math-breadcrumb text-sm text-zinc-400">
              <p>
                <Link href="/">{t("breadcrumbHome")}</Link>
                <span className="separator"> / </span>
                <span className="last">{t("breadcrumbCurrent")}</span>
              </p>
            </nav>
            <h1 className="elementor-heading-title elementor-size-default mt-4 font-archivo text-3xl font-extrabold leading-[1.3]! text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-4xl">
              {t("heroTitlePrefix")}<span className="text-[#2A9FFF]">{t("heroTitleHighlight")}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-zinc-400">
              {t("heroDescription")}
            </p>
          </div>
        </section>

        {/* Form + thông tin liên hệ */}
        <section className="mx-auto w-full max-w-[1680px] px-6 py-16 sm:px-8">
          <div
            className="relative isolate overflow-hidden rounded-[20px] bg-no-repeat shadow-[0px_2px_20px_0px_rgba(12,178,255,0.12)] backdrop-blur-[36px]"
            style={{
              backgroundImage: "url('/wp-content/uploads/2026/05/bg-color-1.png')",
              backgroundSize: "cover",
              backgroundPosition: "20% 0%",
            }}
          >
            <span
              aria-hidden="true"
              className="leosai-glow-border-span pointer-events-none absolute inset-0 rounded-[inherit] p-px"
            />

            {/* Lớp dưới cùng: ảnh bản đồ, phủ toàn bộ khung — chỉ áp dụng ở desktop (mobile bố cục dọc nên tách riêng theo từng khối) */}
            <Image
              alt=""
              aria-hidden
              className="absolute inset-0 -z-30 hidden object-cover object-right lg:block"
              fill
              sizes="100vw"
              src="/contact/MAP.png"
            />

            {/* Lớp giữa: gradient phủ toàn khung, chuyển màu mượt xuyên qua ranh giới 2 cột nên không còn đường ngăn cách — chỉ desktop */}
            <div className="absolute inset-0 -z-20 hidden bg-[linear-gradient(90deg,rgba(13,27,75,0.97)_0%,rgba(13,27,75,0.92)_38%,rgba(13,27,75,0.55)_52%,rgba(13,27,75,0.15)_66%,rgba(13,27,75,0)_82%)] lg:block" />

            {/* Lớp trên cùng: nội dung form + thông tin */}
            <div className="relative flex flex-col lg:flex-row">
              {/* Form */}
              <div className="flex flex-col justify-center p-6 sm:p-10 lg:w-1/2 lg:p-[60px]">
                <h2 className="elementor-heading-title elementor-size-default mb-7! font-archivo text-2xl font-extrabold leading-[1.3]! text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-[32px]!">
                  {t("formHeadingLine1")}
                  <br />
                  {t("formHeadingLine2Prefix")}<span className="text-[#2A9FFF]">{t("formHeadingLine2Highlight")}</span>
                </h2>
                <LeadForm
                  buttonLabel={t("formSubmitLabel")}
                  namePlaceholder={t("formNamePlaceholder")}
                  emailPlaceholder={t("formEmailPlaceholder")}
                  phonePlaceholder={t("formPhonePlaceholder")}
                  messagePlaceholder={t("formMessagePlaceholder")}
                  source="lien-he"
                  lead_type="contact"
                />
              </div>

              {/* Bản đồ + message liên hệ */}
              <div className="relative min-h-[440px] overflow-hidden sm:min-h-[520px] lg:w-1/2 lg:min-h-0 lg:overflow-visible">
                {/* Mobile/tablet: map + gradient riêng cho khối này (desktop dùng lớp phủ chung ở trên) */}
                <Image
                  alt=""
                  aria-hidden
                  className="absolute inset-0 -z-20 object-cover lg:hidden"
                  fill
                  sizes="100vw"
                  src="/contact/MAP.png"
                />
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(13,27,75,0.92)_0%,rgba(13,27,75,0.55)_22%,rgba(13,27,75,0.1)_55%,rgba(13,27,75,0)_75%)] lg:hidden" />

                <div className="absolute inset-0 flex flex-col items-center px-6 py-6 pt-10 sm:px-10 sm:py-8 sm:pt-12 lg:px-0 lg:py-0 lg:pt-12">
                  {/* Message bubble */}
                  <div className="relative w-[88%] max-w-[420px] rounded-2xl bg-white p-5 text-[#0D1B4B] shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                    <span className="absolute -bottom-4 left-1/2 size-8 -translate-x-1/2 rotate-45 rounded-sm bg-white" />

                    {/* Đường viền trang trí góc trên-trái */}
                    <svg
                      aria-hidden="true"
                      className="pointer-events-none absolute -left-4 -top-4 h-[97px] w-[59px] overflow-visible sm:h-[124px] sm:w-[75px]"
                      fill="none"
                      viewBox="0 0 118 194"
                    >
                      <defs>
                        <linearGradient id="contactBracketLeft" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8749" />
                          <stop offset="100%" stopColor="#8FCDFF" />
                        </linearGradient>
                      </defs>
                      <path d="M117 1H37C17.1178 1 1 17.1178 1 37V193" stroke="url(#contactBracketLeft)" strokeLinecap="round" strokeWidth="2" />
                      <circle cx="1" cy="193" fill="#8FCDFF" r="7" />
                    </svg>

                    {/* Đường viền trang trí góc dưới-phải */}
                    <svg
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-4 -bottom-4 h-[54px] w-[105px] overflow-visible sm:h-[68px] sm:w-[133px]"
                      fill="none"
                      style={{ transform: "scaleY(-1)" }}
                      viewBox="0 0 211 108"
                    >
                      <defs>
                        <linearGradient id="contactBracketRight" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="5.92%" stopColor="#FFFFFF" />
                          <stop offset="99.9%" stopColor="#8FCDFF" />
                        </linearGradient>
                      </defs>
                      <path d="M1 1H174C193.882 1 210 17.1178 210 37V107" stroke="url(#contactBracketRight)" strokeLinecap="round" strokeWidth="2" />
                      <circle cx="210" cy="107" fill="#8FCDFF" r="7" />
                    </svg>

                    <div className="flex items-start gap-2 text-sm font-medium leading-snug">
                      <Image alt="" aria-hidden className="mt-0.5 flex-shrink-0" height={24} src="/contact/MapPin.svg" width={24} />
                      <p>
                        {t("addressLabel")}{" "}
                        <a className="text-[#2A9FFF] underline underline-offset-2" href="#">
                          {t("mapLinkLabel")}
                        </a>
                      </p>
                    </div>

                    <div className="my-3 h-px w-full bg-[#0D1B4B]/10" />

                    <div className="flex flex-col gap-2 text-sm font-medium sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <a className="flex items-center gap-2" href={`tel:${phone1.replace(/\D/g, "")}`}>
                        <Image alt="" aria-hidden height={24} src="/contact/telephone.svg" width={24} />
                        {phone1}
                      </a>
                      <a className="flex items-center gap-2" href={`tel:${phone2.replace(/\D/g, "")}`}>
                        <Image alt="" aria-hidden height={24} src="/contact/phone.svg" width={24} />
                        {phone2}
                      </a>
                    </div>

                    <div className="my-3 h-px w-full bg-[#0D1B4B]/10" />

                    <a className="flex items-center gap-2 text-sm font-medium" href={`mailto:${email}`}>
                      <Image alt="" aria-hidden height={24} src="/contact/mail.svg" width={24} />
                      {email}
                    </a>
                  </div>

                  <Image alt="" aria-hidden className="mt-5 h-[71px] w-auto lg:h-[124px]" height={124} src="/contact/decorative-icon.png" width={110} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <LandingElementorHooks />
    </div>
  );
}
