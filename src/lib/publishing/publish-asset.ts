import {
  getPostingPublisher,
  loadPlatformAuthFromEnv,
  type Platform,
  type PostingPublishRequest,
  type PublishResult,
} from "./index";
import { assetToBlogPayload } from "@/lib/blog/asset-to-article.mjs";
import { revalidateBlogContent } from "@/lib/blog/cache";
import { upsertBlogArticle } from "@/lib/blog/repository";
import { validateBlogSyncPayload } from "@/lib/blog/validation";

/** Social platforms a `multi` asset fans out to (mirrors .agents/tools/ls-post/lib/execution.mjs). */
export const SOCIAL_PLATFORMS: Platform[] = [
  "linkedin",
  "facebook",
  "threads",
  "instagram",
  "tiktok",
  "youtube",
  "zalo",
];

/** Shape of an ls-post asset as stored in the `assets` collection (only the fields posting needs). */
export type PostingAsset = {
  platform?: string;
  title?: string;
  body?: string;
  cta?: string | null;
  hashtags?: string[];
  media?: unknown;
};

type AssetMediaItem = { type?: string; url?: string };

// ls-post stores `media` as an array (image | video | document); adapters take one image/video.
function pickMedia(media: unknown): PostingPublishRequest["media"] {
  const items: AssetMediaItem[] = Array.isArray(media) ? media : media ? [media as AssetMediaItem] : [];
  const item = items.find(
    (m) => (m?.type === "image" || m?.type === "video") && typeof m.url === "string" && m.url,
  );
  return item ? { type: item.type as "image" | "video", url: item.url! } : undefined;
}

export function getAssetPlatforms(asset: PostingAsset): Platform[] {
  if (asset.platform === "multi") return SOCIAL_PLATFORMS;
  return SOCIAL_PLATFORMS.includes(asset.platform as Platform) ? [asset.platform as Platform] : [];
}

/**
 * Publish a `platform: "blog"` asset into the `articles` collection (what the blog pages read).
 * Same mapping and validation as POST /api/blog/articles; never throws.
 */
export async function publishBlogAsset(asset: Record<string, unknown>): Promise<PublishResult> {
  const validation = validateBlogSyncPayload(assetToBlogPayload(asset));
  if (!validation.success) {
    return { platform: "blog", status: "failed", error: validation.errors.join("; ") };
  }

  try {
    const article = await upsertBlogArticle(validation.normalized);
    revalidateBlogContent(article.slug);
    return { platform: "blog", status: "published", permalink: validation.canonicalUrl, publishedAt: new Date() };
  } catch (error) {
    return { platform: "blog", status: "failed", error: (error as Error).message };
  }
}

export async function publishAssetToPlatform(platform: Platform, asset: PostingAsset): Promise<PublishResult> {
  const auth = loadPlatformAuthFromEnv(platform);
  if (!auth) {
    return { platform, status: "skipped", error: `${platform.toUpperCase()}_ACCESS_TOKEN not configured` };
  }

  // CTA is part of the post text (ls-post validates platform limits on body + cta).
  const cta = typeof asset.cta === "string" ? asset.cta.trim() : "";
  const body = [asset.body, cta].filter(Boolean).join("\n\n");

  return getPostingPublisher().publish(platform, auth, {
    title: asset.title,
    body,
    media: pickMedia(asset.media),
    hashtags: asset.hashtags,
  });
}
