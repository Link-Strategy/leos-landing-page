import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { buildBlogArticleMetadata, buildBlogPostingJsonLd, getArticleCanonicalUrl } from "../src/lib/blog/seo.ts";
import { buildBreadcrumbJsonLd, buildJobPostingJsonLd, buildOrganizationJsonLd } from "../src/lib/jsonld.ts";

const article = {
  slug: "kinh-te-tuan-hoan",
  title: "Kinh tế tuần hoàn trong vật liệu xây dựng",
  excerpt: "Tóm tắt bài viết.",
  // Legacy article from another project's domain — must never leak into canonical/og:url.
  canonicalUrl: "https://linkstrategy.io.vn/blog/kinh-te-tuan-hoan",
  coverImage: "https://cdn.example.test/cover.jpg",
  publishedAt: "2026-10-01T00:00:00.000Z",
  updatedAt: "2026-10-02T00:00:00.000Z",
  noindex: false,
};

describe("blog canonical", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.letrongroup.com/";
  });

  it("ignores a stored canonicalUrl on another domain", () => {
    assert.equal(getArticleCanonicalUrl(article), "https://www.letrongroup.com/blog/kinh-te-tuan-hoan");
    const meta = buildBlogArticleMetadata(article);
    assert.equal(meta.alternates.canonical, "https://www.letrongroup.com/blog/kinh-te-tuan-hoan");
    assert.equal(meta.openGraph.url, "https://www.letrongroup.com/blog/kinh-te-tuan-hoan");
    assert.equal(buildBlogPostingJsonLd(article).url, "https://www.letrongroup.com/blog/kinh-te-tuan-hoan");
  });

  it("falls back to the site's OG image when the article has no cover", () => {
    const meta = buildBlogArticleMetadata({ ...article, coverImage: undefined });
    assert.equal(meta.openGraph.images[0].url, "/opengraph-image");
  });

  it("does not double the brand in article titles", () => {
    assert.equal(buildBlogArticleMetadata({ ...article, title: "Bài mới" }).title, "Bài mới");
    assert.deepEqual(buildBlogArticleMetadata({ ...article, title: "Bài mới | LeTRON" }).title, { absolute: "Bài mới | LeTRON" });
  });

  it("marks noindex articles", () => {
    assert.equal(buildBlogArticleMetadata({ ...article, noindex: true }).robots.index, false);
  });
});

describe("JSON-LD builders", () => {
  it("builds Organization with the real contact facts", () => {
    const org = buildOrganizationJsonLd("https://www.letrongroup.com");
    assert.equal(org["@type"], "Organization");
    assert.equal(org.url, "https://www.letrongroup.com");
    assert.equal(org.address.addressCountry, "VN");
    assert.equal(org.email, "office@letrongroup.com");
  });

  it("ties the brand to official profiles via alternateName and sameAs", () => {
    const org = buildOrganizationJsonLd("https://www.letrongroup.com");
    assert.ok(org.alternateName.includes("LeTRON Group"));
    assert.ok(org.sameAs.every((u) => u.startsWith("https://")));
  });

  it("builds JobPosting; validThrough only for real dates", () => {
    const job = {
      title: "Kỹ sư IoT",
      description: "## Mô tả\n\nLàm việc với **cảm biến**.",
      department: "Kỹ thuật",
      location: "Hà Nội",
      jobType: "full-time",
      publishedAt: "2026-09-01T03:00:00.000Z",
      createdAt: "2026-08-01T00:00:00.000Z",
    };
    const open = buildJobPostingJsonLd(job, "https://x.test/tuyen-dung/ky-su-iot", "https://x.test");
    assert.equal(open["@type"], "JobPosting");
    assert.equal(open.employmentType, "FULL_TIME");
    assert.equal(open.datePosted, "2026-09-01");
    assert.ok(!("validThrough" in open), "no deadline -> no validThrough");
    assert.ok(!open.description.includes("#") && !open.description.includes("*"));

    const dated = buildJobPostingJsonLd({ ...job, deadline: "2026-12-31" }, "https://x.test/j", "https://x.test");
    assert.ok(dated.validThrough.startsWith("2026-12-31"));
    const text = buildJobPostingJsonLd({ ...job, deadline: "Tuyển liên tục" }, "https://x.test/j", "https://x.test");
    assert.ok(!("validThrough" in text));
  });

  it("maps every job type, with OTHER as fallback", () => {
    const base = { title: "t", description: "d", department: "x", location: "y", createdAt: "2026-01-01T00:00:00Z" };
    const type = (jobType) => buildJobPostingJsonLd({ ...base, jobType }, "u", "s").employmentType;
    assert.deepEqual(["part-time", "contract", "internship", "weird"].map(type), ["PART_TIME", "CONTRACTOR", "INTERN", "OTHER"]);
  });
});

describe("buildBreadcrumbJsonLd", () => {
  it("numbers the items from 1 in order", () => {
    const b = buildBreadcrumbJsonLd([
      { name: "LeTRON", url: "https://www.letrongroup.com" },
      { name: "Nhà máy", url: "https://www.letrongroup.com/nha-may" },
    ]);
    assert.equal(b["@type"], "BreadcrumbList");
    assert.deepEqual(b.itemListElement.map((i) => i.position), [1, 2]);
    assert.equal(b.itemListElement[1].item, "https://www.letrongroup.com/nha-may");
  });
});
