// Map an ls-post blog asset (collection `assets`) to a BlogSyncPayload (src/lib/blog/types.ts).
// Plain JS so both the app (QStash scheduled posts) and the ls-post CLI (.agents/) share one copy.
// Pure — covered by test/blog-article.test.js.

export const BLOG_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function stripMarkdown(text) {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** First real paragraph of the body, cut to the validator's 220-char limit. */
export function deriveExcerpt(body = "") {
  const paragraph = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find((p) => p && !p.startsWith("#") && !p.startsWith("!["));
  const text = stripMarkdown(paragraph ?? body);
  return text.length <= 220 ? text : `${text.slice(0, 217).replace(/\s+\S*$/, "")}...`;
}

export function assetToBlogPayload(asset, now = new Date()) {
  const meta = asset.platform_metadata ?? {};
  const publishAt = asset.publish_at ? new Date(asset.publish_at) : null;
  const publishedAt = publishAt && publishAt <= now ? publishAt : now;
  const firstImage = Array.isArray(asset.media) ? asset.media.find((m) => m?.type === "image" && m.url) : null;

  const payload = {
    externalId: String(asset._id),
    slug: meta.slug,
    title: asset.title,
    excerpt: meta.excerpt || deriveExcerpt(asset.body),
    contentMarkdown: asset.body,
    status: "published",
    authorName: meta.authorName || "LeTRON",
    category: meta.category,
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    publishedAt: publishedAt.toISOString(),
    updatedAt: now.toISOString(),
    seoTitle: meta.seoTitle,
    seoDescription: meta.seoDescription,
    coverImage: meta.coverImage || firstImage?.url,
    noindex: meta.noindex === true,
  };

  // Drop undefined so the API's optional-field handling applies.
  return Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined));
}
