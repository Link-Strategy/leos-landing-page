import type { Metadata } from "next";

import type { BlogArticle } from "./types";

const BRAND = "LeTRON";

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "https://letrongroup.com"
  ).replace(/\/+$/, "");
}

/**
 * Canonical URL of a blog article. Always built from this site's URL + slug: the stored `canonicalUrl`
 * is ignored because legacy articles carry another project's domain (linkstrategy.io.vn), which would
 * tell search engines the original lives elsewhere. (validateBlogSyncPayload only accepts this form anyway.)
 */
export function getArticleCanonicalUrl(article: Pick<BlogArticle, "slug">) {
  return `${getSiteUrl()}/blog/${article.slug}`;
}

export function buildBlogArticleMetadata(article: BlogArticle): Metadata {
  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt;
  const canonical = getArticleCanonicalUrl(article);
  const image = article.coverImage || "/opengraph-image.jpg";

  return {
    // The root layout title template already appends the brand; titles that carry it are used as-is.
    title: /letron/i.test(title) ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: BRAND,
      type: "article",
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.updatedAt,
      images: [
        {
          url: image,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: !article.noindex,
      follow: !article.noindex,
    },
  };
}

export function buildBlogPostingJsonLd(article: BlogArticle) {
  const canonical = getArticleCanonicalUrl(article);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: canonical,
    headline: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    url: canonical,
    datePublished: article.publishedAt || article.updatedAt,
    dateModified: article.updatedAt,
    image: article.coverImage ? [article.coverImage] : undefined,
    author: {
      "@type": "Person",
      name: article.authorName || "LeTRON Team",
    },
    publisher: {
      "@type": "Organization",
      name: BRAND,
      url: getSiteUrl(),
    },
  };
}
