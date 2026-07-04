export const BLOG_STATUSES = ["draft", "published", "archived"] as const;
export const BLOG_TRACK_CTA_IDS = [
  "article_cta_primary",
  "article_cta_secondary",
] as const;
export const BLOG_TRACK_SURFACES = ["article_cta"] as const;
export const BLOG_TRACK_DESTINATION_KINDS = ["pricing", "about", "app"] as const;

export type BlogStatus = (typeof BLOG_STATUSES)[number];
export type BlogTrackCtaId = (typeof BLOG_TRACK_CTA_IDS)[number];
export type BlogTrackSurface = (typeof BLOG_TRACK_SURFACES)[number];
export type BlogTrackDestinationKind =
  (typeof BLOG_TRACK_DESTINATION_KINDS)[number];

export type BlogSyncPayload = {
  externalId: string;
  slug: string;
  previousSlug?: string | null;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  status: BlogStatus;
  authorName?: string;
  category?: string;
  tags?: string[];
  publishedAt?: string | null;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  coverImage?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  dryRun?: boolean;
};

export type SearchConsoleSubmissionStatus =
  | "success"
  | "failed"
  | "skipped"
  | "not_applicable";

export type BlogSearchConsoleSubmission = {
  status: SearchConsoleSubmissionStatus;
  attemptedAt?: string | null;
  message?: string;
  sitemapUrl?: string;
};

export type BlogSearchConsoleSubmissionDocument = {
  status: SearchConsoleSubmissionStatus;
  attemptedAt?: Date | null;
  message?: string;
  sitemapUrl?: string;
};

export type BlogArticleDocument = {
  externalId: string;
  slug: string;
  previousSlug?: string | null;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  status: BlogStatus;
  authorName?: string;
  category?: string;
  categorySlug?: string;
  tags: string[];
  publishedAt?: Date | null;
  updatedAt: Date;
  seoTitle?: string;
  seoDescription?: string;
  coverImage?: string;
  canonicalUrl?: string;
  noindex: boolean;
  readingTimeMinutes: number;
  createdAt: Date;
  searchConsoleSubmission?: BlogSearchConsoleSubmissionDocument;
  lastRefreshRequestedAt?: Date | null;
  lastRefreshReason?: string;
};

export type BlogArticle = {
  externalId: string;
  slug: string;
  previousSlug?: string | null;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  status: BlogStatus;
  authorName?: string;
  category?: string;
  categorySlug?: string;
  tags: string[];
  publishedAt?: string | null;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  coverImage?: string;
  canonicalUrl?: string;
  noindex: boolean;
  readingTimeMinutes: number;
  createdAt: string;
  searchConsoleSubmission?: BlogSearchConsoleSubmission;
  lastRefreshRequestedAt?: string | null;
  lastRefreshReason?: string;
  primaryTopicSlug?: string;
};

export type BlogCategorySummary = {
  label: string;
  slug: string;
  count: number;
};

export type BlogTrackClickPayload = {
  articleExternalId: string;
  articleSlug: string;
  ctaId: BlogTrackCtaId;
  surface: BlogTrackSurface;
  destinationKind: BlogTrackDestinationKind;
  destinationUrl: string;
};

export type BlogClickEventDocument = {
  articleExternalId: string;
  articleSlug: string;
  categorySlug?: string | null;
  ctaId: BlogTrackCtaId;
  surface: BlogTrackSurface;
  destinationKind: BlogTrackDestinationKind;
  destinationUrl: string;
  sourcePath: string;
  createdAt: Date;
};

export type BlogValidationResult =
  | {
      success: true;
      data: BlogSyncPayload;
      normalized: BlogArticleDocument;
      warnings: string[];
      canonicalUrl: string;
    }
  | {
      success: false;
      errors: string[];
    };

export type BlogSyncSuccess = {
  success: true;
  slug: string;
  status: BlogStatus;
  dryRun: boolean;
  warnings: string[];
  revalidated: string[];
};

export type BlogSyncFailure = {
  success: false;
  errors: string[];
};

export type BlogTrackClickSuccess = {
  success: true;
};

export type BlogTrackClickFailure = {
  success: false;
  errors: string[];
};

export type BlogRefreshPayload = {
  externalId?: string;
  slug?: string;
  reason?: string;
};

export type BlogRefreshSuccess = {
  success: true;
  slug: string;
  revalidated: string[];
  warnings: string[];
};

export type BlogRefreshFailure = {
  success: false;
  errors: string[];
};

export type BlogTopicDefinition = {
  slug: string;
  title: string;
  description: string;
  categorySlugs: string[];
  featuredArticleExternalIds?: string[];
};
