import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { assetToBlogPayload, deriveExcerpt, BLOG_SLUG_PATTERN } from "../.agents/tools/ls-post/lib/blog-article.mjs";

describe("assetToBlogPayload", () => {
  const now = new Date("2026-10-12T00:00:00Z");
  const asset = {
    _id: { toString: () => "6650a1b2c3d4e5f601234567" },
    platform: "blog",
    title: "Kinh tế tuần hoàn trong ngành vật liệu xây dựng",
    body: "# Tiêu đề\n\nChất thải công nghiệp đang là nguồn tài nguyên bị đặt sai chỗ trong chuỗi giá trị.\n\nĐoạn hai.",
    media: [{ type: "image", url: "https://bucket.s3.amazonaws.com/a.jpg" }],
    publish_at: "2026-10-20T00:00:00Z",
    platform_metadata: { slug: "kinh-te-tuan-hoan", category: "Công nghệ xanh", tags: ["esg"] },
  };

  it("maps an ls-post blog asset to the /api/blog/articles payload", () => {
    const payload = assetToBlogPayload(asset, now);
    assert.equal(payload.externalId, "6650a1b2c3d4e5f601234567");
    assert.equal(payload.slug, "kinh-te-tuan-hoan");
    assert.equal(payload.status, "published");
    assert.equal(payload.contentMarkdown, asset.body);
    assert.equal(payload.coverImage, "https://bucket.s3.amazonaws.com/a.jpg");
    assert.deepEqual(payload.tags, ["esg"]);
    assert.equal(payload.updatedAt, now.toISOString());
    assert.ok(!("seoTitle" in payload), "undefined fields are dropped");
  });

  it("never publishes with a future date", () => {
    assert.equal(assetToBlogPayload(asset, now).publishedAt, now.toISOString());
    const past = { ...asset, publish_at: "2026-10-01T00:00:00Z" };
    assert.equal(assetToBlogPayload(past, now).publishedAt, "2026-10-01T00:00:00.000Z");
  });

  it("prefers an explicit excerpt", () => {
    const withExcerpt = { ...asset, platform_metadata: { ...asset.platform_metadata, excerpt: "Tóm tắt riêng cho bài viết." } };
    assert.equal(assetToBlogPayload(withExcerpt, now).excerpt, "Tóm tắt riêng cho bài viết.");
  });
});

describe("deriveExcerpt", () => {
  it("skips headings and strips markdown", () => {
    assert.equal(deriveExcerpt("# H1\n\nMột **đoạn** có [link](https://x.y)."), "Một đoạn có link.");
  });

  it("caps at 220 characters on a word boundary", () => {
    const out = deriveExcerpt("từ ".repeat(200));
    assert.ok(out.length <= 220);
    assert.ok(out.endsWith("..."));
  });
});

describe("BLOG_SLUG_PATTERN", () => {
  it("matches the app's slug rule", () => {
    assert.ok(BLOG_SLUG_PATTERN.test("kinh-te-tuan-hoan"));
    assert.ok(!BLOG_SLUG_PATTERN.test("Kinh-Tế"));
    assert.ok(!BLOG_SLUG_PATTERN.test("-bad-"));
  });
});
