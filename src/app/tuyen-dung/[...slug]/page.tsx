import { getLandingDirectories, StaticLandingPage } from "@/lib/static-landing";

export function generateStaticParams() {
  return getLandingDirectories(["tuyen-dung"]).map((slug) => ({ slug: [slug] }));
}

export default async function TuyenDungDetailPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  return (
    <StaticLandingPage
      className="site-main post type-post status-publish hentry"
      segments={["tuyen-dung", ...slug]}
    />
  );
}
