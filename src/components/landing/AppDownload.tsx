import Image from "next/image";
import { getTranslations } from "next-intl/server";
import SectionEdgeFade from "@/components/ui/section-edge-fade";

const CIRCLE = "/landing/AppDownload/Circle.png";
const PHONE_DEVICE = "/landing/AppDownload/PhoneDevice.png";
const PHONE_DEVICE_MOBILE = "/landing/AppDownload/PhoneDeviceMobile.png";
const CH_PLAY = "/landing/AppDownload/CH_Play.png";
const APP_STORE = "/landing/AppDownload/AppStore.png";

// Order matches the panel feature list below: real-time status, alerts, operation log.
const PANEL_ICONS = [
  "/landing/AppDownload/Clock.svg",
  "/landing/AppDownload/Warning.svg",
  "/landing/AppDownload/Log.svg",
];

type PanelFeature = { title: string; description: string };

function StoreButtons({ googlePlayAlt, appStoreAlt }: { googlePlayAlt: string; appStoreAlt: string }) {
  return (
    <div className="flex items-center gap-3">
      {/* TODO: swap href="#" for the real store listing URLs once the app is published. */}
      <a href="#" className="cursor-pointer">
        <Image src={CH_PLAY} alt={googlePlayAlt} width={156} height={52} className="h-[44px] w-auto lg:h-[52px]" />
      </a>
      <a href="#" className="cursor-pointer">
        <Image src={APP_STORE} alt={appStoreAlt} width={156} height={52} className="h-[44px] w-auto lg:h-[52px]" />
      </a>
    </div>
  );
}

export default async function AppDownload() {
  const t = await getTranslations("appDownload");
  const features = t.raw("panel.features") as PanelFeature[];

  return (
    <section
      className="relative w-full overflow-hidden lg:h-[500px]"
      style={{
        background: "linear-gradient(90deg, #020E30 0%, #031B4C 34%, #0D1B4B 68%, #020E30 100%)",
      }}
    >
      <SectionEdgeFade position="top" />
      <SectionEdgeFade position="bottom" />

      <div className="container-le relative z-10 flex flex-col items-center gap-10 py-14 text-center lg:h-full lg:flex-row lg:items-center lg:justify-between lg:gap-0 lg:py-0 lg:text-left">
        {/* Text column */}
        <div className="flex w-full flex-col items-center gap-5 lg:w-[360px] lg:shrink-0 lg:items-start">
          <p
            className="font-inter text-[14px] leading-[18px]! font-bold tracking-[2.2px] text-white uppercase lg:text-[12px] lg:leading-[16px]! lg:text-[#63D9FF]"
            style={{ textShadow: "0px 0px 6px rgba(99,217,255,0.18)" }}
          >
            {t("eyebrow")}
          </p>
          <h2 className="font-inter text-[32px] leading-[38px]! font-bold tracking-[-0.5px] lg:text-[40px] lg:leading-[48px]! lg:tracking-[-1px]">
            <span className="text-white">{t("headerWhite")} </span>
            <span className="text-[#2A9FFF]">{t("headerAccent")}</span>
          </h2>
          <p className="font-open-sans text-[16px] leading-[26px]! font-normal text-white lg:text-[18px] lg:leading-[30px]!">
            {t("description")}
          </p>
          <StoreButtons googlePlayAlt={t("storeGooglePlayAlt")} appStoreAlt={t("storeAppStoreAlt")} />
        </div>

        {/* Phone — desktop layers Circle.png (glow) + PhoneDevice.png; mobile uses the flattened
            PhoneDeviceMobile.png, which already bakes in the glow rings and feature badges. */}
        <div className="w-full max-w-[350px] lg:h-[432px] lg:w-[360px] lg:max-w-none lg:shrink-0">
          <div className="relative aspect-[382/400] w-full lg:hidden">
            <Image src={PHONE_DEVICE_MOBILE} alt={t("phoneAlt")} fill className="object-contain" />
          </div>
          <div className="relative hidden h-full w-full lg:block">
            <Image src={CIRCLE} alt="" fill className="object-contain" />
            <Image src={PHONE_DEVICE} alt={t("phoneAlt")} fill className="object-contain" />
          </div>
        </div>

        {/* Feature panel — desktop only; mobile hides it in favor of the badges baked into PhoneDeviceMobile.png */}
        <div
          className="hidden w-[420px] shrink-0 flex-col gap-6 rounded-[28px] border p-8 lg:flex"
          style={{
            borderColor: "rgba(42,159,255,0.42)",
            background: "linear-gradient(90deg, #071332 0%, #0D224E 100%)",
            boxShadow: "0px 10px 28px 0px rgba(0,115,255,0.18)",
          }}
        >
          <div>
            <p className="font-inter mb-3! text-[12px] leading-[16px]! font-bold tracking-[0.72px] text-[#2A9FFF]">
              {t("panel.eyebrow")}
            </p>
            <h3 className="font-inter text-[24px] leading-[32px]! font-bold text-[#F0F9FF]">{t("panel.heading")}</h3>
          </div>

          <div className="flex flex-col gap-3">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className="flex items-center gap-3 rounded-[14px] border p-4"
                style={{
                  borderColor: "rgba(42,159,255,0.28)",
                  background: "linear-gradient(90deg, #102956 0%, #0D224E 100%)",
                }}
              >
                <div className="relative size-10 shrink-0">
                  <Image src={PANEL_ICONS[idx]} alt="" fill className="object-contain" />
                </div>
                <div>
                  <p className="font-inter text-[13px] leading-[20px]! font-medium text-[#F0F9FF]">{feature.title}</p>
                  <p className="font-inter text-[10px] leading-[16px]! font-normal text-[#F0F9FF]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
