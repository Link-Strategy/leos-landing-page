import { describe, it } from "node:test";
import assert from "node:assert/strict";

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
