// Page routes introduced with the V2 messaging. Keys match the `route` fields in the `v2` messages.
export const V2_ROUTES = {
  home: "/",
  solutions: "/giai-phap",
  platform: "/nen-tang",
  technology: "/gioi-thieu#cong-nghe",
  factory: "/nha-may",
  city: "/thanh-pho-so",
  investors: "/nha-dau-tu",
  contact: "/lien-he",
  terms: "/dieu-khoan-su-dung",
} as const;

export type V2RouteKey = keyof typeof V2_ROUTES;

export function v2Href(key: string): string {
  return (V2_ROUTES as Record<string, string>)[key] ?? "/";
}

/** Pages that exist only because of V2 (used by the sitemap and the footer). */
export const V2_PAGE_PATHS = ["giai-phap", "nen-tang", "nha-may", "thanh-pho-so", "nha-dau-tu", "dieu-khoan-su-dung"] as const;
