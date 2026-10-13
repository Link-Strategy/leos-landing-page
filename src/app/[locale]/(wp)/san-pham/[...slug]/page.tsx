import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import ProductDetailPage from "@/components/products/ProductDetailPage";
import { CANONICAL_PRODUCT_SLUGS, PRODUCT_SLUG_TO_ID } from "@/lib/products";
import { localeAlternates } from "@/lib/seo-alternates";

export function generateStaticParams() {
  return Object.keys(PRODUCT_SLUG_TO_ID).map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const productId = PRODUCT_SLUG_TO_ID[slug[0]];
  if (!productId) return {};

  const t = await getTranslations({ locale, namespace: "products" });
  // Duplicate WordPress slugs (e.g. ledb-bo-nao-so, -2) declare the product's canonical slug.
  return {
    title: t(`items.${productId}.title`),
    alternates: localeAlternates(locale, `/san-pham/${CANONICAL_PRODUCT_SLUGS[productId]}`),
  };
}

export default async function SanPhamDetailPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  return <ProductDetailPage slug={slug[0]} />;
}
