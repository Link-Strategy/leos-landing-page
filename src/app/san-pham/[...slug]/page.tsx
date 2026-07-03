import { getLandingDirectories, StaticLandingPage } from "@/lib/static-landing";

export function generateStaticParams() {
  return getLandingDirectories(["san-pham"]).map((slug) => ({ slug: [slug] }));
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
