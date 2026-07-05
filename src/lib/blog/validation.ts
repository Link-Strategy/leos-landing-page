import type {
  BlogArticleDocument,
  BlogStatus,
  BlogSyncPayload,
  BlogValidationResult,
} from "./types";

const VALID_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MIN_TITLE_LENGTH = 10;
const MAX_TITLE_LENGTH = 120;
const MIN_EXCERPT_LENGTH = 20;
const MAX_EXCERPT_LENGTH = 220;
const MIN_CONTENT_LENGTH = 120;

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "https://letrongroup.com"
  ).replace(/\/+$/, "");
}

function normalizeTags(tags?: string[]) {
  return Array.from(
    new Set(
      (tags ?? [])
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ).slice(0, 12);
}

export function normalizeCategorySlug(category?: string) {
  if (!category) {
    return undefined;
  }

  const normalized = category
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || undefined;
}

function getReadingTimeMinutes(contentMarkdown: string) {
  const words = contentMarkdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function isValidBlogSlug(slug: string) {
  return VALID_SLUG_PATTERN.test(slug);
}

function isValidCanonicalUrl(canonicalUrl: string, slug: string) {
  try {
    const siteUrl = new URL(getSiteUrl());
    const candidateUrl = new URL(canonicalUrl);

    return (
      candidateUrl.origin === siteUrl.origin &&
      candidateUrl.pathname === `/blog/${slug}` &&
      !candidateUrl.search &&
      !candidateUrl.hash
    );
  } catch {
    return false;
  }
}

export function validateBlogSyncPayload(payload: unknown): BlogValidationResult {
  if (!payload || typeof payload !== "object") {
    return { success: false, errors: ["Payload must be an object"] };
  }

  const data = payload as Partial<BlogSyncPayload>;
  const errors: string[] = [];
  const warnings: string[] = [];

  const externalId = data.externalId?.trim() ?? "";
  const slug = data.slug?.trim() ?? "";
  const previousSlug = data.previousSlug?.trim() || null;
  const title = data.title?.trim() ?? "";
  const excerpt = data.excerpt?.trim() ?? "";
  const contentMarkdown = data.contentMarkdown?.trim() ?? "";
  const status = data.status;
  const authorName = data.authorName?.trim() || undefined;
  const category = data.category?.trim() || undefined;
  const categorySlug = normalizeCategorySlug(category);
  const tags = normalizeTags(data.tags);
  const publishedAt = data.publishedAt?.trim() || null;
  const updatedAt = data.updatedAt?.trim() ?? "";
  const seoTitle = data.seoTitle?.trim() || title || undefined;
  const seoDescription = data.seoDescription?.trim() || excerpt || undefined;
  const coverImage = data.coverImage?.trim() || undefined;
  const noindex = data.noindex === true;
  const dryRun = data.dryRun === true;

  if (!externalId) errors.push("externalId is required");
  if (!slug) errors.push("slug is required");
  if (slug && !isValidBlogSlug(slug)) errors.push("slug format is invalid");
  if (previousSlug && !isValidBlogSlug(previousSlug)) {
    errors.push("previousSlug format is invalid");
  }
  if (previousSlug && previousSlug === slug) {
    errors.push("previousSlug must be different from slug");
  }
  if (!title) errors.push("title is required");
  if (title && (title.length < MIN_TITLE_LENGTH || title.length > MAX_TITLE_LENGTH)) {
    errors.push(`title length must be ${MIN_TITLE_LENGTH}-${MAX_TITLE_LENGTH} characters`);
  }
  if (!excerpt) errors.push("excerpt is required");
  if (
    excerpt &&
    (excerpt.length < MIN_EXCERPT_LENGTH || excerpt.length > MAX_EXCERPT_LENGTH)
  ) {
    errors.push(
      `excerpt length must be ${MIN_EXCERPT_LENGTH}-${MAX_EXCERPT_LENGTH} characters`,
    );
  }
  if (!contentMarkdown || contentMarkdown.length < MIN_CONTENT_LENGTH) {
    errors.push("contentMarkdown is too short");
  }
  if (!status || !["draft", "published", "archived"].includes(status)) {
    errors.push("status must be draft, published, or archived");
  }
  if (!updatedAt) {
    errors.push("updatedAt is required");
  } else if (Number.isNaN(Date.parse(updatedAt))) {
    errors.push("updatedAt must be a valid ISO date string");
  }
  if (publishedAt && Number.isNaN(Date.parse(publishedAt))) {
    errors.push("publishedAt must be a valid ISO date string");
  }
  if (coverImage && !isValidUrl(coverImage)) {
    errors.push("coverImage must be a valid URL");
  }

  const canonicalUrl =
    data.canonicalUrl?.trim() || `${getSiteUrl()}/blog/${slug}`;
  if (!isValidUrl(canonicalUrl)) {
    errors.push("canonicalUrl must be a valid URL");
  } else if (!isValidCanonicalUrl(canonicalUrl, slug)) {
    errors.push("canonicalUrl must match the current site blog URL");
  }

  if (status === "published") {
    if (!seoTitle) errors.push("seoTitle fallback failed");
    if (!seoDescription) errors.push("seoDescription fallback failed");
    if (!publishedAt) warnings.push("publishedAt missing; using updatedAt as publish date");
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  const updatedAtDate = new Date(updatedAt);
  const publishedAtDate =
    status === "published"
      ? new Date(publishedAt || updatedAt)
      : publishedAt
        ? new Date(publishedAt)
        : null;

  const normalized: BlogArticleDocument = {
    externalId,
    slug,
    previousSlug,
    title,
    excerpt,
    contentMarkdown,
    status: status as BlogStatus,
    authorName,
    category,
    categorySlug,
    tags,
    publishedAt: publishedAtDate,
    updatedAt: updatedAtDate,
    seoTitle,
    seoDescription,
    coverImage,
    canonicalUrl,
    noindex,
    readingTimeMinutes: getReadingTimeMinutes(contentMarkdown),
    createdAt: updatedAtDate,
  };

  return {
    success: true,
    data: {
      externalId,
      slug,
      previousSlug,
      title,
      excerpt,
      contentMarkdown,
      status: status as BlogStatus,
      authorName,
      category,
      tags,
      publishedAt,
      updatedAt,
      seoTitle,
      seoDescription,
      coverImage,
      canonicalUrl,
      noindex,
      dryRun,
    },
    normalized,
    warnings,
    canonicalUrl,
  };
}
