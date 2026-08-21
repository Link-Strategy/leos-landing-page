import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function Culture() {
  const t = await getTranslations("culture");

  return (
    <section className="relative pt-24 pb-0 bg-transparent overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-[#2A9FFF]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-6 sm:px-8 text-center space-y-4">
        {/* Heading */}
        <h2 className="text-3xl sm:text-[40px]! font-bold tracking-tight text-white leading-tight [text-shadow:4px_0px_20px_rgba(0,140,255,0.2)]">
          {t("titleLine1")}
          <br />
          {t("titleLine2Prefix")}
          <span className="text-[#2A9FFF]">
            {t("titleLine2Highlight")}
          </span>
        </h2>

        {/* Body text */}
        <p className="text-white text-base sm:text-lg leading-relaxed">
          {t("description")}
        </p>
      </div>

      {/* Divider image — runs full-bleed to separate this section from the next */}
      <div className="relative mt-6 w-full h-20 sm:h-auto sm:aspect-1920/148">
        <Image
          src="/landing/Culture/Culture-spacing.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>
    </section>
  );
}
