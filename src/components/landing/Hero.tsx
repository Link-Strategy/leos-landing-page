import { useTranslations } from "next-intl";
import { ContactMasterButton } from "@/components/contact/ContactDialog";
import SectionEdgeFade from "@/components/ui/section-edge-fade";
import HeroOrbit from "@/components/landing/HeroOrbit";
import HeroPrinciples from "@/components/landing/HeroPrinciples";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      className="relative flex min-h-[600px] items-center overflow-hidden bg-cover bg-center bg-no-repeat pt-[calc(var(--header-height-mobile)+20px)] lg:min-h-[800px] lg:items-start lg:pt-[calc(var(--header-height)+40px)]"
      style={{ backgroundImage: "url('/landing/Hero/Hero_bg.webp')" }}
    >
      <SectionEdgeFade position="bottom" />

      <div className="container-le relative z-10 flex w-full flex-col items-center gap-16 py-16 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10 lg:py-0">
        {/* Left content */}
        <div className="flex flex-col items-center text-center lg:items-start lg:self-start lg:text-left">
          <div className="flex flex-col items-center gap-[14px] lg:items-start">
            <span className="font-inter text-[14px] font-bold uppercase leading-[16px] tracking-[2.2px] text-[#63D9FF] [text-shadow:0px_0px_6px_rgba(99,217,255,0.18)]">
              {t("badge")}
            </span>

            <h1 className="font-inter text-[40px] font-extrabold leading-[1.2] tracking-[-1.5px] text-white sm:text-[60px] sm:leading-[76px] sm:tracking-[-2.2px] whitespace-pre-line">
              {t("title")}
            </h1>

            <p className="font-inter text-[18px] font-bold leading-[26px] tracking-[-0.3px] text-[#63D9FF] sm:text-[22px] sm:leading-[30px]">
              {t("subtitle")}
            </p>

            <p className="font-open-sans text-[16px] font-light leading-[26px] tracking-[0px] text-[#F4F4F4] sm:text-[18px] sm:leading-[30px]">
              {t("description")}
            </p>

            {/* Three principles with tooltips; the standalone principles section is gone */}
            <HeroPrinciples />
          </div>

          <div className="mt-8 flex w-full flex-col items-center gap-4 lg:w-auto lg:flex-row lg:justify-start">
            <ContactMasterButton type="full-fill" content={t("ctaPrimary")} />
          </div>
          <p className="pt-5 font-inter text-[13px] font-semibold uppercase tracking-[1.6px] text-white/60">{t("proof")}</p>
        </div>

        {/* Right visual: V2 sun + two-orbit diagram */}
        <HeroOrbit sunAlt={t("badge")} caption={t("orbitCaption")} />
      </div>

    </section>
  );
}
