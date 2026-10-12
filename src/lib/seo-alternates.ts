import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

/**
 * Canonical + hreflang for a page under app/[locale]. `path` is the locale-less pathname
 * ("" for home, "/lien-he", ...). Relative URLs resolve against the layout's metadataBase.
 * With localePrefix "as-needed", the default locale has no prefix.
 */
export function localeAlternates(locale: string, path: string): Metadata["alternates"] {
  const href = (l: string) => (l === routing.defaultLocale ? path || "/" : `/${l}${path}`);

  return {
    canonical: href(locale),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, href(l)])),
      "x-default": href(routing.defaultLocale),
    },
  };
}
