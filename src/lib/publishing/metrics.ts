// Normalize each adapter's getMetrics() shape into one structure. Pure — tested in test/metrics.test.js.

export type NormalizedMetrics = {
  views: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  reach: number | null;
  engagement: number | null;
};

type Raw = Record<string, unknown>;

function num(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function withEngagement(m: Omit<NormalizedMetrics, "engagement">, engagement: unknown): NormalizedMetrics {
  const explicit = num(engagement);
  const parts = [m.likes, m.comments, m.shares].filter((v): v is number => v !== null);
  return { ...m, engagement: explicit ?? (parts.length ? parts.reduce((a, b) => a + b, 0) : null) };
}

/** Returns null for platforms whose adapter has no metrics (threads, zalo) or an empty result. */
export function normalizePlatformMetrics(platform: string, raw: Raw | null | undefined): NormalizedMetrics | null {
  if (!raw || Object.keys(raw).length === 0) return null;

  switch (platform) {
    case "facebook":
    case "linkedin":
      return withEngagement(
        { views: num(raw.impressions), likes: num(raw.likes), comments: num(raw.comments), shares: num(raw.shares), reach: num(raw.reach) },
        raw.engagement,
      );
    case "instagram":
      // `views` replaced the deprecated `impressions`; total_interactions is Instagram's own engagement figure.
      return withEngagement(
        {
          views: num(raw.views ?? raw.impressions),
          likes: num(raw.like_count),
          comments: num(raw.comments_count),
          shares: num(raw.shares),
          reach: num(raw.reach),
        },
        raw.total_interactions,
      );
    case "tiktok":
      return withEngagement(
        { views: num(raw.view_count), likes: num(raw.like_count), comments: num(raw.comment_count), shares: num(raw.share_count), reach: null },
        undefined,
      );
    case "youtube":
      return withEngagement(
        { views: num(raw.viewCount), likes: num(raw.likeCount), comments: num(raw.commentCount), shares: null, reach: null },
        undefined,
      );
    default:
      return null;
  }
}
