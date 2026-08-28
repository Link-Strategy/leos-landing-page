import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import SanPhamPage from "@/components/products/SanPhamPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "productsPage" });
  return { title: t("metaTitle") };
}

export default function SanPham() {
  return <SanPhamPage />;
}
