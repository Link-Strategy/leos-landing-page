import type { Metadata } from "next";

import type { BlogArticle } from "./types";

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "https://linkstrategy.io.vn"
  ).replace(/\/+$/, "");
}

export function buildBlogArticleMetadata(article: BlogArticle): Metadata {
  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt;
  const canonical = article.canonicalUrl || `${getSiteUrl()}/blog/${article.slug}`;
  const image = article.coverImage || "/icon.svg";

  return {
    title: `${title} | Link Strategy`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Link Strategy",
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
  const canonical = article.canonicalUrl || `${getSiteUrl()}/blog/${article.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    url: canonical,
    datePublished: article.publishedAt || article.updatedAt,
    dateModified: article.updatedAt,
    image: article.coverImage ? [article.coverImage] : undefined,
    author: {
      "@type": "Person",
      name: article.authorName || "Link Strategy Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Link Strategy",
      url: getSiteUrl(),
    },
  };
}
