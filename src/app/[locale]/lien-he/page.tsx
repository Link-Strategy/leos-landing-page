import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import ContactPage from "@/components/contact/ContactPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("metaTitle") };
}

export default function LienHePage() {
  return <ContactPage />;
}
