import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import SanPhamPage from "@/components/products/SanPhamPage";
import { localeAlternates } from "@/lib/seo-alternates";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "productsPage" });
  return { title: t("metaTitle"), alternates: localeAlternates(locale, "/san-pham") };
}

export default async function SanPham({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Without this, next-intl reads request headers and Next renders the page per request (no CDN cache).
  const { locale } = await params;
  setRequestLocale(locale);
  return <SanPhamPage />;
}
