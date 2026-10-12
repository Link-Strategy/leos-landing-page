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

export default function middleware(request: NextRequest) {
  if (!request.cookies.has("NEXT_LOCALE")) {
    const hostname = request.headers.get("host") ?? "";
    const country = request.headers.get("x-vercel-ip-country");
    const preferredLocale = resolvePreferredLocale(hostname, country);

    if (preferredLocale) {
      const headers = new Headers(request.headers);
      headers.set("accept-language", preferredLocale);
      request = new NextRequest(request, { headers });
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|sitemap|rss\\.xml|robots\\.txt|site\\.webmanifest|favicon\\.ico|opengraph-image|wp-content|assets|icons|images|.*\\..*).*)",
  ],
};
