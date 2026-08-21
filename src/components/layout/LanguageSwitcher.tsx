"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("header");
  const activeLocale = useLocale();
  const pathname = usePathname();
  const otherLocale = routing.locales.find((locale) => locale !== activeLocale) ?? routing.defaultLocale;

  return (
    <Link
      href={pathname}
      locale={otherLocale}
      aria-label={t("languageToggle")}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center ${className ?? ""}`}
    >
      <Image src="/icons/toggle-lang.png" alt="" width={40} height={40} />
    </Link>
  );
}
