import { unstable_cache } from "next/cache";

import {
  getBlogArticleByExternalId,
  getBlogArticleBySlug,
  getAvailableBlogCategories,
  getBlogArticleRedirectSlug,
  getLatestPublishedBlogArticles,
  getPublicBlogArticleBySlug,
  getPublicBlogArticles,
  getPublishedBlogArticlesForFeed,
  getPublishedBlogArticlesByCategorySlugs,
  getRelatedCategoryCandidates,
  getRelatedTagCandidates,
} from "./repository";
import {
  getBlogTopicBySlug,
  getBlogTopicDefinitions,
  resolvePrimaryTopicSlug,
  sortArticlesForTopic,
} from "./topics";
import type { BlogArticle, BlogCategorySummary, BlogTopicDefinition } from "./types";

export const getCachedPublicBlogArticles = unstable_cache(
  async (categorySlug?: string) => getPublicBlogArticles({ categorySlug }),
  ["blog-public-articles"],
  { tags: ["blog"] },
);

export const getCachedAvailableBlogCategories = unstable_cache(
  async (): Promise<BlogCategorySummary[]> => getAvailableBlogCategories(),
  ["blog-available-categories"],
  { tags: ["blog"] },
);

export const getCachedPublicBlogArticleBySlug = unstable_cache(
  async (slug: string) => getPublicBlogArticleBySlug(slug),
  ["blog-public-article-by-slug"],
  { tags: ["blog"] },
);

export const getCachedRedirectSlug = unstable_cache(
  async (slug: string) => getBlogArticleRedirectSlug(slug),
  ["blog-redirect-slug"],
  { tags: ["blog"] },
);

export const getCachedPublishedBlogArticlesForFeed = unstable_cache(
  async () => getPublishedBlogArticlesForFeed(),
  ["blog-feed-articles"],
  { tags: ["blog"] },
);

export const getCachedLatestPublishedBlogArticles = unstable_cache(
  async (limit: number) => getLatestPublishedBlogArticles(limit),
  ["blog-latest-published-articles"],
  { tags: ["blog"] },
);

export const getCachedBlogArticleByExternalId = unstable_cache(
  async (externalId: string) => getBlogArticleByExternalId(externalId),
  ["blog-article-by-external-id"],
  { tags: ["blog"] },
);

export const getCachedBlogArticleBySlug = unstable_cache(
  async (slug: string) => getBlogArticleBySlug(slug),
  ["blog-article-by-slug"],
  { tags: ["blog"] },
);

type RelatedArticlesInput = {
  slug: string;
  category?: string;
  tags?: string[];
  limit?: number;
};

function getFreshnessTimestamp(article: BlogArticle) {
  return new Date(article.publishedAt ?? article.updatedAt).getTime();
}

function sortByFreshness(a: BlogArticle, b: BlogArticle) {
  return getFreshnessTimestamp(b) - getFreshnessTimestamp(a);
}

function sortByRelatedScore(a: BlogArticle, b: BlogArticle, tags: string[]) {
  const sharedTagsA = a.tags.filter((tag) => tags.includes(tag)).length;
  const sharedTagsB = b.tags.filter((tag) => tags.includes(tag)).length;

  if (sharedTagsB !== sharedTagsA) {
    return sharedTagsB - sharedTagsA;
  }

  return sortByFreshness(a, b);
}

export async function getRelatedBlogArticles({
  slug,
  category,
  tags = [],
  limit = 3,
}: RelatedArticlesInput) {
  const normalizedTags = Array.from(new Set(tags.filter(Boolean)));
  const candidateLimit = Math.max(limit * 4, 12);
  const [categoryCandidates, tagCandidates] = await Promise.all([
    getRelatedCategoryCandidates(category, {
      slug,
      limit: candidateLimit,
    }),
    getRelatedTagCandidates(normalizedTags, {
      slug,
      limit: candidateLimit,
    }),
  ]);

  const categoryMatches = categoryCandidates.sort((a, b) =>
    sortByRelatedScore(a, b, normalizedTags),
  );

  const tagMatches = tagCandidates
    .filter((article) => article.category !== category)
    .sort((a, b) => sortByRelatedScore(a, b, normalizedTags));

  const selected: BlogArticle[] = [];
  const selectedSlugs = new Set<string>([slug]);

  for (const article of [...categoryMatches, ...tagMatches]) {
    if (selectedSlugs.has(article.slug)) {
      continue;
    }

    selected.push(article);
    selectedSlugs.add(article.slug);

    if (selected.length >= limit) {
      return selected;
    }
  }

  const fallbackArticles = await getLatestPublishedBlogArticles(candidateLimit);
  for (const article of fallbackArticles) {
    if (selectedSlugs.has(article.slug)) {
      continue;
    }

    selected.push(article);
    selectedSlugs.add(article.slug);

    if (selected.length >= limit) {
      break;
    }
  }

  return selected;
}

type TopicHubData = {
  topic: BlogTopicDefinition;
  articles: BlogArticle[];
};

export async function getTopicHubData(slug: string): Promise<TopicHubData | null> {
  const topic = getBlogTopicBySlug(slug);
  if (!topic) {
    return null;
  }

  const articles = await getPublishedBlogArticlesByCategorySlugs(topic.categorySlugs);
  return {
    topic,
    articles: sortArticlesForTopic(articles, topic),
  };
}

export async function getReadNextInTopic(slug: string, limit = 2) {
  const article = await getPublicBlogArticleBySlug(slug);
  if (!article?.primaryTopicSlug) {
    return null;
  }

  const hubData = await getTopicHubData(article.primaryTopicSlug);
  if (!hubData) {
    return null;
  }

  const articles = hubData.articles.filter((candidate) => candidate.slug !== slug).slice(0, limit);
  return {
    topic: hubData.topic,
    articles,
  };
}

export async function getNonEmptyTopicHubs() {
  const topics = getBlogTopicDefinitions();
  const hubs = await Promise.all(
    topics.map(async (topic) => {
      const articles = await getPublishedBlogArticlesByCategorySlugs(topic.categorySlugs, 1);
      if (articles.length === 0) {
        return null;
      }

      return {
        topic,
        latestUpdatedAt: articles[0]?.updatedAt ?? null,
      };
    }),
  );

  return hubs.filter(Boolean) as Array<{
    topic: BlogTopicDefinition;
    latestUpdatedAt: string | null;
  }>;
}

export const getCachedTopicHubData = unstable_cache(
  async (slug: string) => getTopicHubData(slug),
  ["blog-topic-hub-data"],
  { tags: ["blog"] },
);

export const getCachedReadNextInTopic = unstable_cache(
  async (slug: string, limit: number) => getReadNextInTopic(slug, limit),
  ["blog-read-next-in-topic"],
  { tags: ["blog"] },
);

export const getCachedNonEmptyTopicHubs = unstable_cache(
  async () => getNonEmptyTopicHubs(),
  ["blog-non-empty-topic-hubs"],
  { tags: ["blog"] },
);

export function resolveArticlePrimaryTopicSlug(article: BlogArticle) {
  return resolvePrimaryTopicSlug(article.categorySlug);
}

export const getCachedRelatedBlogArticles = unstable_cache(
  async (
    slug: string,
    category: string | undefined,
    tags: string[],
    limit: number,
  ) =>
    getRelatedBlogArticles({
      slug,
      category,
      tags,
      limit,
    }),
  ["blog-related-articles"],
  { tags: ["blog"] },
);
