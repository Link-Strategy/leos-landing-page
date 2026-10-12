import Image from "next/image";
import { getTranslations } from "next-intl/server";
import SectionEdgeFade from "@/components/ui/section-edge-fade";

// mission_card.png / vision_card.png ship with a soft drop-shadow bleed baked
// into their canvas (568x458), so the solid card shape sits well inside the
// PNG rather than touching its edges. object-cover on the raw file therefore
// left a visible gap between the padded content and the card's visible frame.
// mission_card_fill.png / vision_card_fill.png are pre-cropped to the shape's
// bounding box (498x402) so the artwork covers the container edge-to-edge,
// matching the design's "background fills first, padding applies inside" intent.
// This aspect ratio must match that 498x402 exactly — any mismatch forces
// object-cover to crop, and since the file's own margin isn't symmetric
// top-to-bottom, a centered crop eats the thin top margin before the thicker
// bottom one, which is what caused the missing top gap.
const CARD_ASPECT = "498/402";

type VisionCardProps = {
  cardBg: string;
  icon: string;
  iconAlt: string;
  header: string;
  accentColor: string;
  content: string;
  footer: string;
};

function VisionCard({ cardBg, icon, iconAlt, header, accentColor, content, footer }: VisionCardProps) {
  return (
    <div className="relative mx-auto w-full max-w-[380px] shrink-0 lg:mx-0 lg:max-w-[500px]" style={{ aspectRatio: CARD_ASPECT }}>
      <Image src={cardBg} alt="" fill className="object-cover object-center" />

      <div className="relative flex h-full flex-col px-5 py-4 lg:px-[30px] lg:py-5">
        {/* Header: icon + title */}
        <div className="flex items-center gap-2 lg:gap-3">
          <Image
            src={icon}
            alt={iconAlt}
            width={48}
            height={48}
            className="h-9! w-9! shrink-0 object-contain lg:h-12! lg:w-12!"
          />
          <span className="font-inter text-[13px] font-bold leading-[20px] tracking-[0.6px] text-white lg:text-[15px] lg:leading-[22px]">
            {header}
          </span>
        </div>

        {/* Decorative divider — separate from the header text, starts under the title and dot-capped */}
        <div
          className="relative mt-4 ml-11 h-px w-[228px] lg:ml-[60px] lg:w-[300px]"
          style={{ backgroundColor: `${accentColor}80` }}
        >
          <span
            className="absolute left-0 top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <span
            className="absolute right-0 top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        </div>

        {/* Body */}
        <p className="font-open-sans mt-6! text-[15px] font-normal leading-[26px] text-white lg:mt-10! lg:text-[18px] lg:leading-[30px]">
          &ldquo;{content}&rdquo;
        </p>

        {/* Footer — pinned to the bottom of the card */}
        <p className="font-open-sans mt-auto! mb-5! pt-2 text-[12px] italic leading-[18px] text-white/90 lg:text-[14px] lg:leading-[22px]">
          &ldquo;{footer}&rdquo;
        </p>
      </div>
    </div>
  );
}

export default async function Vision() {
  const t = await getTranslations("vision");

  return (
    <section
      className="relative w-full overflow-hidden bg-cover bg-center bg-no-repeat pt-10 lg:h-[800px] lg:pt-[60px]"
      style={{ backgroundImage: "url('/landing/Virsion/Vision_bg.png')" }}
    >
      <SectionEdgeFade position="top" />
      <SectionEdgeFade position="bottom" />

      <div className="container-le relative z-10 flex h-full flex-col items-center">
        <div className="flex flex-col items-center gap-4 text-center lg:gap-6">
          <span className="font-inter text-[12px] font-bold uppercase leading-[18px] tracking-[2.6px] text-[#63D9FF] [text-shadow:0px_0px_6px_rgba(99,217,255,0.18)] lg:text-[14px] lg:leading-[20px] lg:tracking-[3.4px]">
            {t("eyebrow")}
          </span>

          <h2
            className="font-inter max-w-[900px] bg-[linear-gradient(90deg,#6DEBFF_0%,#38CFFF_55%,#F5FCFF_100%)] bg-clip-text text-[32px] font-bold leading-[40px] tracking-[-0.8px] text-transparent [filter:drop-shadow(0px_4px_8px_rgba(6,19,49,0.64))_drop-shadow(0px_0px_18px_rgba(46,209,255,0.22))] sm:text-[40px] sm:leading-[50px] lg:text-[50px] lg:leading-[60px] lg:tracking-[-1.4px]"
          >
            {t("title")}
          </h2>
        </div>

        <div className="mt-10 flex w-full flex-1 flex-col items-center gap-8 lg:mt-12 lg:flex-row lg:justify-center lg:gap-10">
          <VisionCard
            cardBg="/landing/Virsion/mission_card_fill.png"
            icon="/landing/Virsion/mission_icon.png"
            iconAlt={t("mission.iconAlt")}
            header={t("mission.header")}
            accentColor="#76C6FF"
            content={t("mission.content")}
            footer={t("mission.footer")}
          />

          <Image
            src="/landing/Virsion/center_icon.png"
            alt={t("centerIconAlt")}
            width={126}
            height={107}
            className="h-14! w-auto object-contain shrink-0 lg:h-[90px]!"
          />

          <VisionCard
            cardBg="/landing/Virsion/vision_card_fill.png"
            icon="/landing/Virsion/vision_icon.png"
            iconAlt={t("vision.iconAlt")}
            header={t("vision.header")}
            accentColor="#FAAF4D"
            content={t("vision.content")}
            footer={t("vision.footer")}
          />
        </div>
      </div>
    </section>
  );
}
