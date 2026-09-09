import Image from "next/image";
import { getTranslations } from "next-intl/server";
import MobileCardCarousel from "@/components/landing/MobileCardCarousel";

// Diagonal gradient stroke from the design spec. Painted with the mask/xor ring
// technique (not border-image) because border-image ignores border-radius on its
// corner tiles, which left the ring square-cornered against the card's rounded shape.
const CARD_BORDER_GRADIENT =
  "linear-gradient(149.38deg, rgba(255,255,255,0) -25.01%, rgba(255,255,255,0) -0.8%, #FFFFFF 21.06%, rgba(255,255,255,0) 58.91%, #FFFFFF 74.11%, rgba(255,255,255,0) 102.64%)";

type HeartCardData = {
  icon: string;
  iconAlt: string;
  title: string;
  titleColor: string;
  content: string;
};

function HeartCard({ icon, iconAlt, title, titleColor, content }: HeartCardData) {
  return (
    <div className="group relative min-h-[220px] w-full rounded-[20px] shadow-[0px_6px_8px_0px_#86BFEE4D] backdrop-blur-[35px] lg:w-auto lg:flex-1">
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
      {/* Hover state: solid navy card with a solid blue border */}
      <div className="absolute inset-0 rounded-[20px] border-2 border-[#2A9FFF] bg-[#132563] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 flex h-full flex-col gap-3 p-5 text-left">
        <Image src={icon} alt={iconAlt} width={44} height={44} className="h-11! w-11! object-contain" />
        <h3 className="font-inter text-[18px] font-bold leading-[24px]" style={{ color: titleColor }}>
          {title}
        </h3>
        <p className="font-open-sans text-[14px] font-normal leading-[22px] text-white">{content}</p>
      </div>
    </div>
  );
}

export default async function Heart() {
  const t = await getTranslations("heart");

  const CARDS: HeartCardData[] = [
    {
      icon: "/landing/Heart/H_icon.png",
      iconAlt: "Humanity",
      title: t("cards.humanity.title"),
      titleColor: "#1AC7F0",
      content: t("cards.humanity.content"),
    },
    {
      icon: "/landing/Heart/E_icon.png",
      iconAlt: "Excellence",
      title: t("cards.excellence.title"),
      titleColor: "#FAB81F",
      content: t("cards.excellence.content"),
    },
    {
      icon: "/landing/Heart/A_icon.png",
      iconAlt: "Appreciation",
      title: t("cards.appreciation.title"),
      titleColor: "#4AC76B",
      content: t("cards.appreciation.content"),
    },
    {
      icon: "/landing/Heart/R_icon.png",
      iconAlt: "Rapid Action",
      title: t("cards.rapidAction.title"),
      titleColor: "#FF7D1F",
      content: t("cards.rapidAction.content"),
    },
    {
      icon: "/landing/Heart/T_icon.png",
      iconAlt: "Technology",
      title: t("cards.technology.title"),
      titleColor: "#21C4C2",
      content: t("cards.technology.content"),
    },
  ];

  return (
    <section
      className="relative w-full overflow-hidden bg-cover bg-center bg-no-repeat py-10 lg:h-[650px] lg:py-[60px]"
      style={{ backgroundImage: "url('/landing/Heart/Heart_bg.png')" }}
    >
      <div className="container-le flex h-full flex-col">
        <span className="font-inter text-[12px] font-bold uppercase leading-[18px] tracking-[1.8px] text-[#63D9FF] [text-shadow:0px_0px_6px_rgba(99,217,255,0.18)] lg:mb-4 lg:text-[14px] lg:leading-[20px] lg:tracking-[2.2px]">
          {t("eyebrow")}
        </span>

        <h2 className="font-inter mt-4 text-[28px] leading-[36px] tracking-[-0.6px] font-bold text-white lg:mt-0 lg:mb-[50px] lg:text-[40px] lg:leading-[48px] lg:tracking-[-1px]">
          <span style={{ color: "#207CCD" }}>{t("titleHighlight")}</span> {t("titleSuffix")}
        </h2>

        <div className="mt-8 lg:mt-0">
          <MobileCardCarousel items={CARDS.map((card) => <HeartCard key={card.title} {...card} />)} />
          <div className="hidden lg:flex lg:items-stretch lg:gap-4">
            {CARDS.map((card) => (
              <HeartCard key={card.title} {...card} />
            ))}
          </div>
        </div>

        <div className="mt-8 flex min-h-[100px] w-full items-center justify-center rounded-2xl border border-[#2A9FFF2E] bg-[#132563] px-6 py-6 lg:mt-[60px]">
          <p className="font-inter max-w-[900px] text-center text-[18px] font-bold leading-[26px] tracking-[-0.2px] text-white lg:text-[24px] lg:leading-[32px] lg:tracking-[-0.3px]">
            {t("footer")}
          </p>
        </div>
      </div>
    </section>
  );
}
