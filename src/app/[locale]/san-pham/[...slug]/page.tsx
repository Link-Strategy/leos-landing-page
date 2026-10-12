import type { Metadata } from "next";
import { getLandingDirectories, StaticLandingPage } from "@/lib/static-landing";
import { localeAlternates } from "@/lib/seo-alternates";

export function generateStaticParams() {
  return getLandingDirectories(["san-pham"]).map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  return { alternates: localeAlternates(locale, `/san-pham/${slug.join("/")}`) };
}

export default async function SanPhamDetailPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  return (
    <StaticLandingPage
      className="site-main product type-product status-publish hentry"
      segments={["san-pham", ...slug]}
    />
  );
}
