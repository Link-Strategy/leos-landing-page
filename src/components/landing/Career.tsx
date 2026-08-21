import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function Career() {
  const t = await getTranslations("career");
  const locale = await getLocale();

  return (
    <section
      className="relative flex items-center py-24 sm:py-28 lg:min-h-165 overflow-hidden border-t border-white/10 bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: "url('/landing/Career/CTA.png')" }}
    >
      {/* Frame — pinned to ~950px so the side accent lines line up with the border baked into CTA.png regardless of section width.
          Grid (not absolute positioning) so the line images stretch to match the content column's actual height. */}
      <div className="relative z-10 mx-auto grid w-full max-w-237.5 grid-cols-[auto_1fr_auto] items-stretch gap-3 px-6 sm:gap-6 sm:px-10">
        <div className="relative w-8 sm:w-10 lg:w-13.75">
          <Image src="/landing/Career/line-left.png" alt="" fill className="object-contain object-left" />
        </div>

        <div className="relative text-center space-y-3 sm:space-y-5 lg:space-y-8">

          {/* Heading */}
          <h2 className="font-display font-extrabold! leading-[130%]! sm:leading-[140%]! lg:leading-[150%]! text-xl! sm:text-2xl! md:text-4xl! lg:text-[64px]!">
            {locale === "vi" ? (
              <Image
                src="/landing/Career/carrer-header.svg"
                alt={t("titleLine1")}
                width={484}
                height={102}
                className="mx-auto h-8! w-auto sm:h-9! md:h-24!"
              />
            ) : (
              <span
                className="block text-transparent!"
                style={{ WebkitTextStroke: "1px #FFFFFF" }}
              >
                {t("titleLine1")}
              </span>
            )}
            <span className="block">
              <span className="text-white/80">{t("titleHighlightPrefix")}</span>
              <span className="text-[#2A9FFF]">{t("titleHighlightAccent")}</span>
            </span>
          </h2>

          {/* Email input — 610x52 per design */}
          <div className="pt-2 flex justify-center">
            <div
              className="relative w-full max-w-152.5 rounded-full p-px"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.36) 50%, rgba(255,255,255,0.16) 100%)",
              }}
            >
              <input
                type="email"
                name="email"
                placeholder={t("emailPlaceholder")}
                className="w-full h-13 rounded-full bg-transparent px-6 text-white text-sm sm:text-base placeholder:text-white/70 outline-none"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(235,247,255,0.05) 100%)",
                  boxShadow: "inset 0 2px 16px 0 rgba(0,149,255,0.26)",
                  backdropFilter: "blur(26px)",
                }}
              />
            </div>
          </div>

          {/* Button */}
          <div className="pt-2 flex justify-center">
            <Link href="/tuyen-dung">
              <div
                className="p-px rounded-full hover:-translate-y-1 transition-transform duration-300"
                style={{ backgroundImage: "linear-gradient(180deg, #31B0FF 0%, #81AEF2 100%)" }}
              >
                <button
                  className="relative cursor-pointer overflow-hidden px-6 lg:py-1 h-[52px] rounded-full text-white text-sm lg:text-base 2xl:text-xl font-semibold font-display hover:brightness-110 transition-all duration-300 flex items-center gap-[10px]"
                  style={{
                    backgroundImage: "linear-gradient(180deg, #76C6FF 0%, #2A75F3 100%)",
                    boxShadow:
                      "inset 0 -4px 16px 0 rgba(0,106,255,0.30), inset 0 -2px 6px 0 rgba(255,255,255,0.75), inset 0 -3px 0 0 rgba(30,154,255,0.18), 0 1px 10px 0 rgba(0,0,0,0.15)",
                  }}
                >
                  {t("cta")}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </Link>
          </div>

        </div>

        <div className="relative w-8 sm:w-10 lg:w-13.75">
          <Image src="/landing/Career/line-right.png" alt="" fill className="object-contain object-right" />
        </div>
      </div>
    </section>
  );
}
