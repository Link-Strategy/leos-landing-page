"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import MobileCardCarousel from "@/components/landing/MobileCardCarousel";
import MasterButton from "@/components/ui/master-button";
import SectionEdgeFade from "@/components/ui/section-edge-fade";

// Same mask/xor ring technique as Heart.tsx — border-image ignores border-radius
// on its corner tiles, which is wrong for a rounded card.
const CARD_BORDER_GRADIENT =
  "linear-gradient(149.38deg, rgba(255,255,255,0) -25.01%, rgba(255,255,255,0) -0.8%, #FFFFFF 21.06%, rgba(255,255,255,0) 58.91%, #FFFFFF 74.11%, rgba(255,255,255,0) 102.64%)";

type FooterType = "price" | "kwh" | "contact";

type ServiceCardData = {
  key: string;
  circleBg: string;
  icon: string;
  title: string;
  subTitle: string;
  content: string;
  primaryColor: string;
  badge: string;
  badgeBg: string;
  badgeBorder: string;
  footerType: FooterType;
  price?: string;
  hoverBorderColor: string;
};

function ServiceCardFooter({
  card,
  priceFrom,
  pricePerMonth,
  caasPrefix,
  caasUnit,
  caasSuffix,
  contactQuote,
}: {
  card: ServiceCardData;
  priceFrom: string;
  pricePerMonth: string;
  caasPrefix: string;
  caasUnit: string;
  caasSuffix: string;
  contactQuote: string;
}) {
  const highlightClass = "font-inter text-[24px] font-bold leading-[30px]";
  const normalClass = "font-inter text-[15px] font-medium leading-[30px] text-white";

  if (card.footerType === "price") {
    return (
      <p>
        <span className={normalClass}>{priceFrom} </span>
        <span className={highlightClass} style={{ color: card.primaryColor }}>
          {card.price}₫
        </span>
        <span className={normalClass}>{pricePerMonth}</span>
      </p>
    );
  }

  if (card.footerType === "kwh") {
    return (
      <p>
        <span className={normalClass}>{caasPrefix}</span>
        <span className={highlightClass} style={{ color: card.primaryColor }}>
          {caasUnit}
        </span>
        <span className={normalClass}>{caasSuffix}</span>
      </p>
    );
  }

  return (
    <p className={highlightClass} style={{ color: card.primaryColor }}>
      {contactQuote}
    </p>
  );
}

function ServiceCard({
  card,
  priceFrom,
  pricePerMonth,
  caasPrefix,
  caasUnit,
  caasSuffix,
  contactQuote,
}: {
  card: ServiceCardData;
  priceFrom: string;
  pricePerMonth: string;
  caasPrefix: string;
  caasUnit: string;
  caasSuffix: string;
  contactQuote: string;
}) {
  return (
    <div className="group relative w-full rounded-[20px] shadow-[0px_6px_8px_0px_#86BFEE4D] backdrop-blur-[35px] lg:h-[240px]">
      {/* Default state: translucent glass card with a diagonal gradient ring border */}
      <div className="absolute inset-0 rounded-[20px] bg-[#FFFFFF1A] transition-opacity duration-300 group-hover:opacity-0">
        <div
          className="absolute inset-0 rounded-[20px]"
          style={{
            padding: 1,
            background: CARD_BORDER_GRADIENT,
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      </div>
      {/* Hover state: same glass background, only the border color switches to the card's own color */}
      <div
        className="absolute inset-0 rounded-[20px] border-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ borderColor: card.hoverBorderColor }}
      />

      {/* Badge — top-right corner */}
      <div
        className="absolute top-[18px] right-[20px] z-10 flex h-[28px] w-[122px] items-center justify-center rounded-[6px] border"
        style={{ background: card.badgeBg, borderColor: card.badgeBorder }}
      >
        <span
          className="font-inter text-[11px] font-semibold leading-[16px]"
          style={{ color: card.primaryColor }}
        >
          {card.badge}
        </span>
      </div>

      <div className="relative z-[1] flex flex-col gap-5 p-5 lg:h-full lg:flex-row lg:items-stretch">
        <div className="mx-auto mt-[36px] flex w-[164px] shrink-0 items-center justify-center lg:mx-0 lg:mt-0 lg:h-full">
          <div
            className="relative flex h-[174px] w-[164px] shrink-0 items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${card.circleBg}')` }}
          >
            <Image src={card.icon} alt={card.title} width={64} height={64} className="h-16! w-16! object-contain" />
          </div>
        </div>

        <div className="flex flex-1 flex-col lg:h-full">
          <div>
            <h3 className="font-inter text-[40px] leading-[44px] font-bold text-white">{card.title}</h3>
            <p
              className="font-inter mb-2 text-[18px] font-semibold leading-[24px]"
              style={{ color: card.primaryColor }}
            >
              {card.subTitle}
            </p>
          </div>
          <p className="font-open-sans text-[15px] leading-[24px] font-normal text-[#E5F0FA]">{card.content}</p>

          <div className="mt-4 lg:mt-auto">
            <div className="mb-2 border-t" style={{ borderColor: card.primaryColor }} />
            <ServiceCardFooter
              card={card}
              priceFrom={priceFrom}
              pricePerMonth={pricePerMonth}
              caasPrefix={caasPrefix}
              caasUnit={caasUnit}
              caasSuffix={caasSuffix}
              contactQuote={contactQuote}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiceModel() {
  const t = useTranslations("serviceModel");

  const CARDS: ServiceCardData[] = [
    {
      key: "haas",
      circleBg: "/landing/ServiceModel/HaaS_bg.png",
      icon: "/landing/ServiceModel/HaaS.png",
      title: t("cards.haas.title"),
      subTitle: t("cards.haas.subTitle"),
      content: t("cards.haas.content"),
      primaryColor: "#2ED1FF",
      badge: t("cards.haas.badge"),
      badgeBg: "#051F47CC",
      badgeBorder: "#2ED1FF5C",
      footerType: "price",
      price: "3.990.000",
      hoverBorderColor: "#2A9FFF",
    },
    {
      key: "saas",
      circleBg: "/landing/ServiceModel/SaaS_bg.png",
      icon: "/landing/ServiceModel/SaaS.png",
      title: t("cards.saas.title"),
      subTitle: t("cards.saas.subTitle"),
      content: t("cards.saas.content"),
      primaryColor: "#708CFF",
      badge: t("cards.saas.badge"),
      badgeBg: "#0A1240D1",
      badgeBorder: "#708CFF5C",
      footerType: "price",
      price: "2.990.000",
      hoverBorderColor: "#708CFFCC",
    },
    {
      key: "caas",
      circleBg: "/landing/ServiceModel/CaaS_bg.png",
      icon: "/landing/ServiceModel/CaaS.png",
      title: t("cards.caas.title"),
      subTitle: t("cards.caas.subTitle"),
      content: t("cards.caas.content"),
      primaryColor: "#61DBED",
      badge: t("cards.caas.badge"),
      badgeBg: "#052140D1",
      badgeBorder: "#61DBED5C",
      footerType: "kwh",
      hoverBorderColor: "#61DBEDCC",
    },
    {
      key: "aaas",
      circleBg: "/landing/ServiceModel/AaaS_bg.png",
      icon: "/landing/ServiceModel/AaaS.png",
      title: t("cards.aaas.title"),
      subTitle: t("cards.aaas.subTitle"),
      content: t("cards.aaas.content"),
      primaryColor: "#9970FF",
      badge: t("cards.aaas.badge"),
      badgeBg: "#1A0F38D1",
      badgeBorder: "#A366FF5C",
      footerType: "contact",
      hoverBorderColor: "#A366FFCC",
    },
  ];

  return (
    <section
      className="relative w-full overflow-hidden bg-cover bg-center bg-no-repeat py-10 lg:h-[900px] lg:py-0"
      style={{ backgroundImage: "url('/landing/ServiceModel/Service_bg.png')" }}
    >
      <SectionEdgeFade position="top" />
      <SectionEdgeFade position="bottom" />

      <div className="container-le relative z-10 flex h-full flex-col lg:pt-[60px] lg:pb-[50px]">
        <span
          className="font-inter mb-4 text-[12px] font-bold uppercase leading-[16px] tracking-[2.2px] text-[#63D9FF] [text-shadow:0px_0px_6px_rgba(99,217,255,0.18)]"
        >
          {t("eyebrow")}
        </span>

        <h2 className="font-inter mb-10 text-[28px] leading-[36px] font-bold tracking-[-0.6px] text-white lg:text-[50px] lg:leading-[56px] lg:tracking-[-1px]">
          {t("titleLine1")}
          <br />
          {t("titleLine2Prefix")}
          <span style={{ color: "#2A9FFF" }}>{t("titleLine2Highlight")}</span>
        </h2>

        <div>
          <MobileCardCarousel
            items={CARDS.map((card) => (
              <ServiceCard
                key={card.key}
                card={card}
                priceFrom={t("priceFrom")}
                pricePerMonth={t("pricePerMonth")}
                caasPrefix={t("caasPrefix")}
                caasUnit={t("caasUnit")}
                caasSuffix={t("caasSuffix")}
                contactQuote={t("contactQuote")}
              />
            ))}
          />
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
            {CARDS.map((card) => (
              <ServiceCard
                key={card.key}
                card={card}
                priceFrom={t("priceFrom")}
                pricePerMonth={t("pricePerMonth")}
                caasPrefix={t("caasPrefix")}
                caasUnit={t("caasUnit")}
                caasSuffix={t("caasSuffix")}
                contactQuote={t("contactQuote")}
              />
            ))}
          </div>
        </div>

        <div className="relative z-30 mt-8 flex flex-col items-start gap-6 lg:mt-auto lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full items-center gap-[14px] rounded-xl border border-[#38D1F247] bg-[#09193E85] px-4 py-3 lg:w-auto lg:border-0 lg:bg-transparent lg:p-0">
            <Image
              src="/landing/ServiceModel/service_info_icon.png"
              alt=""
              width={34}
              height={34}
              className="h-[34px]! w-[34px]! shrink-0 object-contain"
            />
            <div className="h-[48px] w-px shrink-0 bg-[#59E5FF94]" />
            <p className="font-inter max-w-[520px] text-[15px] leading-[24px] font-normal text-[#E0EDFA]">
              {t("footerNote")}
            </p>
          </div>

          <MasterButton type="full-fill" isShowIcon content={t("cta")} onClick={() => {}} />
        </div>
      </div>
    </section>
  );
}
