import { describe, it } from "node:test";
import assert from "node:assert/strict";

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "https://letrongroup.com"
  ).replace(/\/+$/, "");
}

describe("getSiteUrl", () => {
  it("returns NEXT_PUBLIC_SITE_URL when set", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://letrongroup.com";
    process.env.APP_URL = "https://app.letrongroup.com";
    assert.equal(getSiteUrl(), "https://letrongroup.com");
  });

  it("removes trailing slash", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://letrongroup.com/";
    assert.equal(getSiteUrl(), "https://letrongroup.com");
  });

  it("falls back to APP_URL", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.APP_URL = "https://app.letrongroup.com";
    assert.equal(getSiteUrl(), "https://app.letrongroup.com");
  });

  it("falls back to NEXT_PUBLIC_APP_URL", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.APP_URL;
    process.env.NEXT_PUBLIC_APP_URL = "https://pub.letrongroup.com";
    assert.equal(getSiteUrl(), "https://pub.letrongroup.com");
  });

  it("uses hardcoded default when nothing is set", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.APP_URL;
    delete process.env.NEXT_PUBLIC_APP_URL;
    assert.equal(getSiteUrl(), "https://letrongroup.com");
  });
});
