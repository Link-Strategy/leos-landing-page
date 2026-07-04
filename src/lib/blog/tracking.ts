import {
  BLOG_TRACK_CTA_IDS,
  BLOG_TRACK_DESTINATION_KINDS,
  BLOG_TRACK_SURFACES,
  type BlogTrackClickPayload,
  type BlogTrackCtaId,
  type BlogTrackDestinationKind,
} from "./types";
import { getSiteUrl } from "./seo";

export function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    ""
  ).replace(/\/+$/, "");
}

function buildDestinationUrl(href: string) {
  if (/^https?:\/\//.test(href)) {
    return href;
  }

  return `${getSiteUrl()}${href.startsWith("/") ? href : `/${href}`}`;
}

export function buildBlogCategoryHref(categorySlug: string) {
  return `/blog?category=${encodeURIComponent(categorySlug)}`;
}

export function isValidTrackingSurface(value: string): value is (typeof BLOG_TRACK_SURFACES)[number] {
  return BLOG_TRACK_SURFACES.includes(value as (typeof BLOG_TRACK_SURFACES)[number]);
}

export function isValidTrackingCtaId(value: string): value is BlogTrackCtaId {
  return BLOG_TRACK_CTA_IDS.includes(value as BlogTrackCtaId);
}

export function isValidTrackingDestinationKind(
  value: string,
): value is BlogTrackDestinationKind {
  return BLOG_TRACK_DESTINATION_KINDS.includes(value as BlogTrackDestinationKind);
}

export function getBlogCtaAllowlist() {
  return {
    article_cta_primary: {
      ctaId: "article_cta_primary" as const,
      surface: "article_cta" as const,
      destinationKind: "pricing" as const,
      href: "/#pricing",
      destinationUrl: buildDestinationUrl("/#pricing"),
    },
    article_cta_secondary: {
      ctaId: "article_cta_secondary" as const,
      surface: "article_cta" as const,
      destinationKind: "about" as const,
      href: "/about",
      destinationUrl: buildDestinationUrl("/about"),
    },
  };
}

export function validateTrackedDestination(payload: BlogTrackClickPayload) {
  const allowlist = getBlogCtaAllowlist();

  if (!isValidTrackingCtaId(payload.ctaId)) {
    return false;
  }

  const expected = allowlist[payload.ctaId];
  if (!expected) {
    return false;
  }

  return (
    payload.surface === expected.surface &&
    payload.destinationKind === expected.destinationKind &&
    payload.destinationUrl === expected.destinationUrl
  );
}
