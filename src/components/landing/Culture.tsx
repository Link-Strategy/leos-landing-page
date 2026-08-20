import { getTranslations } from "next-intl/server";

export default async function Culture() {
  const t = await getTranslations("culture");

  return (
    <section className="relative py-24 bg-transparent overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-[#2A9FFF]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-6 sm:px-8 text-center space-y-4">
        {/* Subtitle */}
        <div className="text-[#4AB3FF] text-xs tracking-widest uppercase font-semibold">
          {t("eyebrow")}
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight [text-shadow:4px_0px_20px_rgba(0,140,255,0.2)]">
          {t("titleLine1")}
          <br />
          {t("titleLine2Prefix")}
          <span className="text-[#2A9FFF]">
            {t("titleLine2Highlight")}
          </span>
        </h2>

        {/* Body text */}
        <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
          {t("description")}
        </p>
      </div>
    </section>
  );
}
