import type { BlogArticle, BlogTopicDefinition } from "./types";

export const BLOG_TOPIC_DEFINITIONS: BlogTopicDefinition[] = [
  {
    slug: "brand-operations",
    title: "Brand Operations",
    description:
      "Systems, governance, and execution patterns that keep brand work aligned as teams grow.",
    categorySlugs: ["brand-operations"],
    featuredArticleExternalIds: ["article-main", "article-related-category"],
  },
  {
    slug: "ai-workflows",
    title: "AI Workflows",
    description:
      "Practical approaches for using AI in content and brand systems without losing consistency.",
    categorySlugs: ["ai-workflows"],
    featuredArticleExternalIds: ["article-related-tag"],
  },
];

export function getBlogTopicDefinitions() {
  return BLOG_TOPIC_DEFINITIONS;
}

export function getBlogTopicBySlug(slug: string) {
  return BLOG_TOPIC_DEFINITIONS.find((topic) => topic.slug === slug) ?? null;
}

export function resolvePrimaryTopicSlug(categorySlug?: string) {
  if (!categorySlug) {
    return undefined;
  }

  return (
    BLOG_TOPIC_DEFINITIONS.find((topic) => topic.categorySlugs.includes(categorySlug))?.slug ??
    undefined
  );
}

export function sortArticlesForTopic(
  articles: BlogArticle[],
  topic: BlogTopicDefinition,
) {
  const featuredIds = topic.featuredArticleExternalIds ?? [];

  return [...articles].sort((a, b) => {
    const featuredIndexA = featuredIds.indexOf(a.externalId);
    const featuredIndexB = featuredIds.indexOf(b.externalId);
    const isFeaturedA = featuredIndexA !== -1;
    const isFeaturedB = featuredIndexB !== -1;

    if (isFeaturedA && isFeaturedB) {
      return featuredIndexA - featuredIndexB;
    }

    if (isFeaturedA) {
      return -1;
    }

    if (isFeaturedB) {
      return 1;
    }

    const freshnessA = new Date(a.publishedAt ?? a.updatedAt).getTime();
    const freshnessB = new Date(b.publishedAt ?? b.updatedAt).getTime();
    return freshnessB - freshnessA;
  });
}
