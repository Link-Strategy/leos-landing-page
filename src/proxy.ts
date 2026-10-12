import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing, type Locale } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Domain ending in .vn always defaults to Vietnamese, regardless of visitor location.
// Other domains fall back to Vercel Edge Geolocation: VN -> vi, elsewhere -> en.
// Returns undefined when there's no signal to act on (e.g. local dev, no geo header),
// letting next-intl fall back to its own Accept-Language/defaultLocale negotiation.
function resolvePreferredLocale(hostname: string, country: string | null): Locale | undefined {
  if (hostname.endsWith(".vn")) return "vi";
  if (!country) return undefined;
  return country === "VN" ? "vi" : "en";
}

// Search engines must always get the default (vi) page at "/" — Google recommends against
// locale-based auto-redirects, and a US crawler would otherwise be sent to /en. hreflang covers /en.
const CRAWLER_UA = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|preview/i;

// Only the canonical production host should be indexed; *.vercel.app deployment URLs serve the same site.
function isNonCanonicalHost(hostname: string): boolean {
  return hostname.endsWith(".vercel.app");
}

export default function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";

  if (CRAWLER_UA.test(request.headers.get("user-agent") ?? "")) {
    const headers = new Headers(request.headers);
    headers.set("accept-language", "vi");
    request = new NextRequest(request, { headers });
  } else if (!request.cookies.has("NEXT_LOCALE")) {
    const country = request.headers.get("x-vercel-ip-country");
    const preferredLocale = resolvePreferredLocale(hostname, country);

    if (preferredLocale) {
      const headers = new Headers(request.headers);
      headers.set("accept-language", preferredLocale);
      request = new NextRequest(request, { headers });
    }
  }

  const response = intlMiddleware(request);
  if (isNonCanonicalHost(hostname)) response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|sitemap|rss\\.xml|robots\\.txt|site\\.webmanifest|favicon\\.ico|opengraph-image|wp-content|assets|icons|images|.*\\..*).*)",
  ],
};
