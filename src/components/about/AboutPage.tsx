import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

import Career from "@/components/landing/Career";
import { AboutHeartValues } from "./AboutHeartValues";
import { LeadershipReveal } from "./LeadershipReveal";
import TechArchitecture from "@/components/landing/TechArchitecture";
import { V2Philosophy, V2Portfolio, V2Readiness } from "@/components/v2/blocks";
import { Eyebrow, Lead, SectionHead, SectionTitle, V2Card, V2CardGrid, V2Notice, V2Section, type V2CardItem } from "@/components/v2/ui";

// About page, one story in the V2 voice: who LeTRON is → vision & mission → the Chairman's philosophy → H.E.A.R.T →
// the three capability units → patents → technology & R&D (formerly /cong-nghe) → leadership → join us. Every block uses the shared V2 kit so spacing and type match
// the rest of the site.
export default async function AboutPage() {
  const t = await getTranslations("about");
  const v2 = await getTranslations("v2.aboutV2");
  const tech = await getTranslations("v2");
  const eco = v2.raw("eco") as V2CardItem[];
  const capabilities = tech.raw("technologyPage.capabilities") as V2CardItem[];

  return (
    <div className="site-main">
      {/* Hero */}
      <section className="relative isolate flex h-[350px] items-end overflow-hidden pb-8 sm:h-[620px] sm:pb-14">
        <Image alt="" src="/about/Banner.webp" fill priority sizes="100vw" className="absolute inset-0 -z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(13,27,75,0.1)_0%,rgba(13,27,75,0.3)_50%,#0D1B4B_100%)]" />
        <div className="container-le">
          <nav aria-label="breadcrumbs" className="breadcrumb-home text-sm text-zinc-400">
            <p>
              <Link href="/">{t("breadcrumbHome")}</Link>
              <span className="separator"> / </span>
              <span className="last">{t("breadcrumbCurrent")}</span>
            </p>
          </nav>
          <h1 className="heading-reset mt-4 font-archivo text-3xl font-extrabold leading-[1.3]! text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-4xl">
            {t("heroTitlePrefix")}
            <span className="text-[#2A9FFF]">{t("heroTitleHighlight")}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-zinc-400">{t("heroDescription")}</p>
        </div>
      </section>

      {/* Who we are */}
      <V2Section>
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <Eyebrow>{t("introEyebrow")}</Eyebrow>
            <SectionTitle>{t("introTitle")}</SectionTitle>
          </div>
          <div className="flex flex-col gap-4">
            <Lead>{t("introParagraph1")}</Lead>
            <Lead>{t("introParagraph2")}</Lead>
          </div>
        </div>
      </V2Section>

      {/* Vision & mission */}
      <V2Section tone="mid">
        <div className="grid gap-5 md:grid-cols-2">
          <V2Card item={{ eyebrow: v2("visionEyebrow"), title: v2("visionTitle"), body: v2("visionBody") }} />
          <V2Card item={{ eyebrow: v2("missionEyebrow"), title: v2("missionTitle"), body: v2("missionBody") }} />
        </div>
      </V2Section>

      <V2Philosophy />

      {/* H.E.A.R.T */}
      <V2Section tone="mid">
        <SectionHead eyebrow={t("heartEyebrow")} title={t("heartTitle")} lead={t("heartLead")} />
        <AboutHeartValues />
      </V2Section>

      {/* Capability units */}
      <V2Section>
        <SectionHead eyebrow={v2("ecoEyebrow")} title={v2("ecoTitle")} />
        <V2CardGrid items={eco} />
      </V2Section>

      {/* Technology & R&D: patents, architecture, capabilities, readiness. /cong-nghe redirects here. */}
      <div id="cong-nghe" className="scroll-mt-28">
        <V2Portfolio />
        <TechArchitecture />
        <V2Section>
          <SectionHead eyebrow={tech("technologyPage.capEyebrow")} title={tech("technologyPage.capTitle")} />
          <V2CardGrid items={capabilities} linkLabel={tech("common.viewSolution")} />
        </V2Section>
        <V2Section tone="mid">
          <SectionHead
            eyebrow={tech("technologyPage.honestEyebrow")}
            title={tech("technologyPage.honestTitle")}
            lead={tech("technologyPage.honestBody")}
          />
          <V2Readiness />
          <div className="mt-8">
            <V2Notice title={tech("technologyPage.docsTitle")} body={tech("technologyPage.docsBody")} />
          </div>
        </V2Section>
      </div>

      {/* Leadership */}
      <V2Section>
        <SectionHead eyebrow={t("leadershipEyebrow")} title={t("leadershipHeading")} className="items-center text-center mx-auto" />
        <LeadershipReveal />
      </V2Section>

      <Career />
    </div>
  );
}
