import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function Partners() {
  const t = await getTranslations("partners");
  const partnerLogos = [
    "/landing/partners/saokim-logo.png",
  ];

  // Only 1 partner for now — repeat it enough times so the marquee row
  // doesn't look sparse, then double for seamless looping.
  const repeatedLogos = Array(6).fill(partnerLogos[0]);
  const marqueeLogos = [...repeatedLogos, ...repeatedLogos];

  return (
    <section className="relative py-20 bg-[var(--letron-background)]/20 border-t border-white/10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 text-center space-y-12">

        {/* Title */}
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {t("title")}
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative w-full py-4 overflow-hidden mask-gradient">

          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--letron-background)] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--letron-background)] to-transparent z-10 pointer-events-none" />

          <div className="flex w-[200%] gap-12 animate-marquee items-center">
            {marqueeLogos.map((logo, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-40 h-16 relative flex items-center justify-center"
              >
                <Image
                  src={logo}
                  alt={t("logoAlt", { index: idx + 1 })}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
