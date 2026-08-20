import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import AboutPage from "@/components/about/AboutPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("metaTitle") };
}

export default function GioiThieuPage() {
  return <AboutPage />;
}
