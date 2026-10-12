import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import PrivacyPolicy from "@/components/legal/PrivacyPolicy";
import { localeAlternates } from "@/lib/seo-alternates";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Privacy policy" : "Chính sách bảo mật",
    alternates: localeAlternates(locale, "/chinh-sach-bao-mat"),
  };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PrivacyPolicy locale={locale} />;
}
