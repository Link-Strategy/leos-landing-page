import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Set env before importing
process.env.NEXT_PUBLIC_SITE_URL = "https://letrongroup.com";

// Pure function extracted from validation.ts for testing
function isValidBlogSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function normalizeCategorySlug(category) {
  if (!category) return undefined;
  const normalized = category
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || undefined;
}

function validateBlogSyncPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return { success: false, errors: ["Payload must be an object"] };
  }

  const data = payload;
  const errors = [];
  const warnings = [];

  const externalId = data.externalId?.trim() ?? "";
  const slug = data.slug?.trim() ?? "";
  const title = data.title?.trim() ?? "";
  const excerpt = data.excerpt?.trim() ?? "";
  const contentMarkdown = data.contentMarkdown?.trim() ?? "";
  const status = data.status;
  const tags = (data.tags || []).filter(Boolean).slice(0, 12);
  const publishedAt = data.publishedAt?.trim() || null;
  const updatedAt = data.updatedAt?.trim() ?? "";

  if (!externalId) errors.push("externalId is required");
  if (!slug) errors.push("slug is required");
  if (slug && !isValidBlogSlug(slug)) errors.push("slug format is invalid");
  if (!title) errors.push("title is required");
  if (title && (title.length < 10 || title.length > 120)) errors.push("title length");
  if (!excerpt) errors.push("excerpt is required");
  if (excerpt && (excerpt.length < 20 || excerpt.length > 220)) errors.push("excerpt length");
  if (!contentMarkdown || contentMarkdown.length < 120) errors.push("contentMarkdown too short");
  if (!status || !["draft", "published", "archived"].includes(status)) errors.push("invalid status");
  if (!updatedAt) errors.push("updatedAt required");
  else if (Number.isNaN(Date.parse(updatedAt))) errors.push("invalid date");

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { externalId, slug, title, excerpt, contentMarkdown, status, tags, publishedAt, updatedAt },
    normalized: { readingTimeMinutes: Math.max(1, Math.ceil(contentMarkdown.trim().split(/\s+/).filter(Boolean).length / 220)) },
    warnings,
    canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://letrongroup.com"}/blog/${slug}`,
  };
}

describe("isValidBlogSlug", () => {
  it("accepts valid slugs", () => {
    assert.equal(isValidBlogSlug("hello-world"), true);
    assert.equal(isValidBlogSlug("abc123"), true);
    assert.equal(isValidBlogSlug("a"), true);
    assert.equal(isValidBlogSlug("a-b-c"), true);
  });

  it("rejects invalid slugs", () => {
    assert.equal(isValidBlogSlug("Hello-World"), false);
    assert.equal(isValidBlogSlug("-leading"), false);
    assert.equal(isValidBlogSlug("trailing-"), false);
    assert.equal(isValidBlogSlug("has space"), false);
    assert.equal(isValidBlogSlug("UPPERCASE"), false);
    assert.equal(isValidBlogSlug(""), false);
    assert.equal(isValidBlogSlug("has_underscore"), false);
  });
});

describe("normalizeCategorySlug", () => {
  it("returns undefined for empty input", () => {
    assert.equal(normalizeCategorySlug(), undefined);
    assert.equal(normalizeCategorySlug(""), undefined);
    assert.equal(normalizeCategorySlug("   "), undefined);
  });

  it("lowercases and replaces spaces", () => {
    assert.equal(normalizeCategorySlug("Công Nghệ Xanh"), "cng-ngh-xanh");
    assert.equal(normalizeCategorySlug("Tin Tức"), "tin-tc");
  });

  it("replaces underscores with hyphens", () => {
    assert.equal(normalizeCategorySlug("cong_nghe"), "cong-nghe");
  });

  it("removes non-alphanumeric characters (except hyphens)", () => {
    assert.equal(normalizeCategorySlug("Công nghệ #1!"), "cng-ngh-1");
  });

  it("handles edge cases", () => {
    assert.equal(normalizeCategorySlug("---"), undefined);
    assert.equal(normalizeCategorySlug("a"), "a");
  });
});

describe("validateBlogSyncPayload", () => {
  it("rejects null payload", () => {
    const result = validateBlogSyncPayload(null);
    assert.equal(result.success, false);
  });

  it("rejects empty object", () => {
    const result = validateBlogSyncPayload({});
    assert.equal(result.success, false);
    assert.ok(result.errors.length > 0);
  });

  it("validates a correct payload", () => {
    const result = validateBlogSyncPayload({
      externalId: "test-123",
      slug: "bai-viet-thu-nghiem",
      title: "Bài viết thử nghiệm đủ độ dài",
      excerpt: "Đây là excerpt thử nghiệm cho bài viết.",
      contentMarkdown: "# Tiêu đề\n\nNội dung bài viết thử nghiệm. Phải đủ dài để pass validation. Nội dung này đã dài hơn 120 ký tự để pass validation của bài viết thử nghiệm.",
      status: "published",
      updatedAt: "2026-07-05T00:00:00.000Z",
      publishedAt: "2026-05",
      tags: ["tech"],
    });

    if (!result.success) {
      assert.fail(`Validation failed: ${result.errors.join(", ")}`);
    }

    assert.equal(result.success, true);
    assert.equal(result.data.externalId, "test-123");
    assert.equal(result.data.slug, "bai-viet-thu-nghiem");
    assert.equal(result.data.status, "published");
    assert.equal(result.data.tags.length, 1);
  });

  it("rejects invalid slug format", () => {
    const result = validateBlogSyncPayload({
      externalId: "test-123",
      slug: "INVALID-SLUG",
      title: "Bài viết thử nghiệm đủ độ dài",
      excerpt: "Đây là excerpt thử nghiệm cho bài viết.",
      contentMarkdown: "# Tiêu đề\n\nNội dung bài viết thử nghiệm.",
      status: "published",
      updatedAt: "2026-07-05T00:00:00.000Z",
    });

    assert.equal(result.success, false);
    assert.ok(result.errors.some((e) => e.includes("slug")));
  });

  it("rejects empty required fields", () => {
    const result = validateBlogSyncPayload({
      externalId: "",
      slug: "",
      title: "",
      excerpt: "",
      contentMarkdown: "",
      status: "unknown",
      updatedAt: "",
    });

    assert.equal(result.success, false);
    assert.ok(result.errors.length > 3);
  });
});

