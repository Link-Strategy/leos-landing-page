import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|sitemap|rss\\.xml|robots\\.txt|site\\.webmanifest|favicon\\.ico|opengraph-image|wp-content|assets|icons|images|.*\\..*).*)",
  ],
};
