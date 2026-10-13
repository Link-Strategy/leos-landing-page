import Hero from "@/components/landing/Hero";
import Vision from "@/components/landing/Vision";
import Heart from "@/components/landing/Heart";
import TechArchitecture from "@/components/landing/TechArchitecture";
import PartnerShowcase from "@/components/landing/PartnerShowcase";
import AppDownload from "@/components/landing/AppDownload";
import RoadMap from "@/components/landing/RoadMap";
import PartnerAccess from "@/components/landing/PartnerAccess";
// import LeOsAi from "@/components/landing/LeOsAi";
// import Pillars from "@/components/landing/Pillars";
// import Culture from "@/components/landing/Culture";
// import HeartTab from "@/components/landing/HeartTab";
import Products from "@/components/landing/Products";
// import Counters from "@/components/landing/Counters";
// import Partners from "@/components/landing/Partners";
import News from "@/components/landing/News";
import V2Loop from "@/components/v2/Loop";
import { V2Cta, V2Feature, V2Philosophy, V2Portfolio, V2Principles, V2Proof } from "@/components/v2/blocks";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo-alternates";
import { setRequestLocale } from "next-intl/server";
// import Career from "@/components/landing/Career";

// Static page; the News section reads blog articles, so refresh hourly (blog publishes also revalidate "/").
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: localeAlternates(locale, "") };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Without this, next-intl reads request headers and Next renders the page per request (no CDN cache).
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="site-main">
      <div className="legacy-scope">
        <Hero />
        <V2Principles />
        <V2Feature which="factory" />
        <V2Feature which="city" />
        <V2Loop />
        <V2Portfolio />
        <V2Proof />
        <V2Philosophy />
        <Vision />
        <Heart />
        <TechArchitecture />
        <PartnerShowcase />
        <AppDownload />
        <RoadMap />
        <PartnerAccess />
        {/* <LeOsAi /> */}
        {/* <Pillars /> */}
        {/* <Culture /> */}
        {/* <HeartTab /> */}
        {/* <Partners /> */}
        <Products />
        <News />
        <V2Cta />
        {/* <Career /> */}
      </div>

    </div>
  );
}
