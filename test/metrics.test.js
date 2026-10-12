import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { normalizePlatformMetrics } from "../src/lib/publishing/metrics.ts";

describe("normalizePlatformMetrics", () => {
  it("maps Facebook adapter output", () => {
    const m = normalizePlatformMetrics("facebook", { likes: 10, comments: 2, shares: 1, impressions: 500, reach: 300, engagement: 13 });
    assert.deepEqual(m, { views: 500, likes: 10, comments: 2, shares: 1, reach: 300, engagement: 13 });
  });

  it("maps Instagram field names (views/total_interactions)", () => {
    const m = normalizePlatformMetrics("instagram", { like_count: 4, comments_count: 1, views: 300, reach: 90, shares: 2, total_interactions: 9 });
    assert.deepEqual(m, { views: 300, likes: 4, comments: 1, shares: 2, reach: 90, engagement: 9 });
    const legacy = normalizePlatformMetrics("instagram", { like_count: 4, comments_count: 1, impressions: 120, reach: 90 });
    assert.equal(legacy.views, 120);
    assert.equal(legacy.engagement, 5);
  });

  it("maps TikTok and YouTube (string counts) and derives engagement", () => {
    assert.deepEqual(normalizePlatformMetrics("tiktok", { view_count: 1000, like_count: 50, comment_count: 5, share_count: 3 }), {
      views: 1000, likes: 50, comments: 5, shares: 3, reach: null, engagement: 58,
    });
    assert.deepEqual(normalizePlatformMetrics("youtube", { viewCount: "120", likeCount: "7", commentCount: "1" }), {
      views: 120, likes: 7, comments: 1, shares: null, reach: null, engagement: 8,
    });
  });

  it("returns null for unsupported platforms or empty results", () => {
    assert.equal(normalizePlatformMetrics("zalo", {}), null);
    assert.equal(normalizePlatformMetrics("threads", { likes: 1 }), null);
    assert.equal(normalizePlatformMetrics("facebook", null), null);
  });
});
