import { revalidatePath, revalidateTag } from "next/cache";

export function revalidateBlogContent(slug?: string, topicSlug?: string) {
  const paths = ["/", "/blog", "/rss.xml", "/sitemap.xml"];
  if (slug) {
    paths.push(`/blog/${slug}`);
  }
  if (topicSlug) {
    paths.push(`/blog/topics/${topicSlug}`);
  }

  try {
    for (const path of paths) {
      revalidatePath(path);
    }
    revalidateTag("blog", "max");
  } catch (err: any) {
    console.warn(`[Cache] Skipping Next.js cache revalidation (running outside server context): ${err.message}`);
  }

  return paths;
}
