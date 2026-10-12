import { revalidatePath, revalidateTag } from "next/cache";
import { routing } from "@/i18n/routing";

export function revalidateBlogContent(slug?: string, topicSlug?: string) {
  const pagePaths = ["", "/blog"];
  if (slug) {
    pagePaths.push(`/blog/${slug}`);
  }
  if (topicSlug) {
    pagePaths.push(`/blog/topics/${topicSlug}`);
  }

  // Pages live under app/[locale]; next-intl rewrites "/blog" → "/vi/blog", so revalidate per locale.
  const paths = [
    ...routing.locales.flatMap((locale) => pagePaths.map((p) => `/${locale}${p}`)),
    "/rss.xml",
    "/sitemap",
  ];

  try {
    for (const path of paths) {
      revalidatePath(path);
    }
    revalidateTag("blog", "max");
  } catch (err) {
    console.warn(`[Cache] Skipping Next.js cache revalidation (running outside server context): ${(err as Error).message}`);
  }

  return paths;
}
