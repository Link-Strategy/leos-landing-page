import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import ProductDetailPage from "@/components/products/ProductDetailPage";
import { PRODUCT_SLUG_TO_ID } from "@/lib/products";

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
  return { title: `${t(`items.${productId}.title`)} - LeTRON` };
}

export default async function SanPhamDetailPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  return <ProductDetailPage slug={slug[0]} />;
}
