import type { Metadata } from "next";
import { getLandingDirectories, StaticLandingPage } from "@/lib/static-landing";
import { localeAlternates } from "@/lib/seo-alternates";

const reservedTopLevelRoutes = new Set([
  "category",
  "cong-ty-thanh-vien",
  "gioi-thieu",
  "lien-he",
  "san-pham",
  "tuyen-dung",
]);

export function generateStaticParams() {
  return getLandingDirectories()
    .filter((slug) => !reservedTopLevelRoutes.has(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  return { alternates: localeAlternates(locale, `/${slug}`) };
}

export default async function LandingTopLevelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <StaticLandingPage className="site-main post type-post status-publish hentry" segments={[slug]} />;
}
