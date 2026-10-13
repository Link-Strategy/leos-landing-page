import Hero from "@/components/landing/Hero";
import Products from "@/components/landing/Products";
import V2Loop from "@/components/v2/Loop";
import { V2Cta, V2Feature, V2ProofCards, V2Sandbox } from "@/components/v2/blocks";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo-alternates";
import { setRequestLocale } from "next-intl/server";
// import Career from "@/components/landing/Career";

// Company, roadmap and investor blocks live on /gioi-thieu and /nha-dau-tu; the home page only tells the sales story.
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
        <Products />
        <V2Feature which="factory" />
        <V2Feature which="city" />
        <V2Loop>
          <V2ProofCards />
        </V2Loop>
        <V2Sandbox />
        <V2Cta />
      </div>

    </div>
  );
}
