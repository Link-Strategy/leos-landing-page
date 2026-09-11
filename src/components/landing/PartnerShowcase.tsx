import Image from "next/image";
import { getTranslations } from "next-intl/server";
import SectionEdgeFade from "@/components/ui/section-edge-fade";

// Only 1 real partner today — repeat it so the row/marquee doesn't look sparse.
// The layout switches to marquee automatically once the list passes 3 entries,
// so this will just work once more real partners are added here.
const PARTNER_LOGO = "/landing/Partners/saokim.png";
const partnerLogos = Array(6).fill(PARTNER_LOGO);

// Same border-gradient mask technique as TechArchitecture's CoreTechCircle —
// border-image ignores border-radius, so the ring is painted as a masked overlay instead.
const CARD_BORDER_GRADIENT =
  "linear-gradient(154.46deg, #FFFFFF -24.6%, rgba(255,255,255,0) 29.84%, #FFFFFF 51.76%, rgba(255,255,255,0) 66.9%, #FFFFFF 121.94%)";

// Mobile width is viewport-based (not %) so it still resolves correctly inside the
// marquee row, whose own width is intrinsic (w-max) and can't be a sizing reference.
// container-le's mobile padding is 20px/side + gap-2 (8px) x2 between 3 cards = 56px.
function PartnerCard({ logo, alt }: { logo: string; alt: string }) {
  return (
    <div
      className="relative flex aspect-[236/132] w-[calc((100vw-56px)/3)] shrink-0 items-center justify-center rounded-[12px] p-2 backdrop-blur-[3.1px] lg:aspect-auto lg:h-[132px] lg:w-[236px] lg:rounded-[20px] lg:p-7"
      style={{
        background: "#13256333",
        boxShadow: "0px 0px 24px 0px #0073FF2E",
      }}
    >
      <div
        className="absolute inset-0 rounded-[12px] lg:rounded-[20px]"
        style={{
          padding: 1,
          background: CARD_BORDER_GRADIENT,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div className="relative z-10 h-full w-full">
        <Image src={logo} alt={alt} fill className="object-contain" />
      </div>
    </div>
  );
}

export default async function PartnerShowcase() {
  const t = await getTranslations("partnerShowcase");
  const isMarquee = partnerLogos.length > 3;
  const displayLogos = isMarquee ? [...partnerLogos, ...partnerLogos] : partnerLogos;

  return (
    <section
      className="relative w-full overflow-hidden bg-cover bg-center bg-no-repeat lg:h-[300px]"
      style={{ backgroundImage: "url('/landing/Partners/Partner_bg.png')" }}
    >
      <SectionEdgeFade position="top" />
      <SectionEdgeFade position="bottom" />

      <div className="container-le relative z-10 flex h-full flex-col gap-10 py-14 lg:flex-row lg:items-center lg:gap-0 lg:py-0">
        {/* Text column */}
        <div className="w-full lg:w-[33%]">
          <p
            className="font-inter mb-5! inline-block text-[14px] leading-[20px]! font-bold tracking-[2.2px] text-white uppercase"
            style={{ boxShadow: "0px 0px 6px 0px #63D9FF2E" }}
          >
            {t("eyebrow")}
          </p>
          <h2 className="font-inter mb-3! text-[32px] leading-[40px]! font-bold tracking-[-1px] sm:text-[40px] sm:leading-[48px]!">
            <span className="text-white">{t("headerWhite")} </span>
            <span className="text-[#2A9FFF]">{t("headerAccent")}</span>
          </h2>
          <p className="font-open-sans text-[16px] leading-[26px]! font-normal text-white">
            {t("description")}
          </p>
        </div>

        {/* Partner cards column */}
        <div className="w-full lg:w-[67%]">
          {isMarquee ? (
            <div className="relative w-full overflow-hidden mask-gradient">
              <div className="flex w-max animate-marquee gap-2 lg:gap-4">
                {displayLogos.map((logo, idx) => (
                  <PartnerCard
                    key={idx}
                    logo={logo}
                    alt={t("logoAlt", { index: (idx % partnerLogos.length) + 1 })}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2 lg:justify-start lg:gap-4">
              {displayLogos.map((logo, idx) => (
                <PartnerCard key={idx} logo={logo} alt={t("logoAlt", { index: idx + 1 })} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
