/**
 * lib/publishing/index.ts
 *
 * Posting Publisher Service — simplified for LS Posting System.
 * Tokens are read from .env (no DB OAuth layer).
 * Copied & adapted from Link Strategy shared/infrastructure/services/social/index.ts
 */

import { getPostingAdapterFactory } from "./adapters/posting-adapter-factory";

export type Platform =
  | "linkedin"
  | "facebook"
  | "threads"
  | "instagram"
  | "blog"
  | "tiktok"
  | "youtube"
  | "wordpress"
  | "zalo";

// ── Shared request/response types ─────────────────────────────────────────────

export interface PostingPublishRequest {
  title?: string;
  body?: string;
  media?: {
    type: "image" | "video";
    url: string;
  };
  article?: {
    url: string;
    title?: string;
    description?: string;
  };
  hashtags?: string[];
  mentions?: string[];
}

export interface PostingPublishResponse {
  success: boolean;
  postId?: string;
  permalink?: string;
  error?: string;
}

export interface PostingAdapter {
  platform: string;
  publish(request: PostingPublishRequest): Promise<PostingPublishResponse>;
  update?(postId: string, request: PostingPublishRequest): Promise<PostingPublishResponse>;
  delete?(postId: string): Promise<boolean>;
  getMetrics?(postId: string): Promise<Record<string, unknown>>;
}

export interface PostingAdapterFactory {
  create(platform: string, auth: PlatformEnvAuth): Promise<PostingAdapter>;
}

/**
 * Auth shape — tokens loaded directly from .env
 * Format per platform: PLATFORM_ACCESS_TOKEN, PLATFORM_PAGE_ID
 * e.g. LINKEDIN_ACCESS_TOKEN, LINKEDIN_PAGE_ID
 *      FACEBOOK_ACCESS_TOKEN, FACEBOOK_PAGE_ID
 *      THREADS_ACCESS_TOKEN,  THREADS_USER_ID
 *      INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_ACCOUNT_ID
 */
export interface PlatformEnvAuth {
  platform: Platform;
  accessToken: string;
  pageId: string;
  metadata?: Record<string, unknown>;
}

// ── Publisher Service ─────────────────────────────────────────────────────────

export interface PublishResult {
  platform: Platform;
  status: "published" | "failed" | "skipped";
  platformPostId?: string;
  permalink?: string;
  publishedAt?: Date;
  error?: string;
}

export class PostingPublisherService {
  /**
   * Publish to a single platform using auth loaded from .env.
   * Returns a structured PublishResult — never throws.
   */
  async publish(
    platform: Platform,
    auth: PlatformEnvAuth,
    payload: { title?: string; body?: string; media?: PostingPublishRequest["media"]; article?: PostingPublishRequest["article"]; hashtags?: string[]; mentions?: string[] },
  ): Promise<PublishResult> {
    try {
      const factory = getPostingAdapterFactory();
      const adapter = await factory.create(platform, auth);

      const request: PostingPublishRequest = {
        title: payload.title,
        body: payload.body,
        media: payload.media,
        article: payload.article,
        hashtags: payload.hashtags,
        mentions: payload.mentions,
      };

      const response = await adapter.publish(request);

      if (response.success) {
        return {
          platform,
          status: "published",
          platformPostId: response.postId,
          permalink: response.permalink,
          publishedAt: new Date(),
        };
      }

      return {
        platform,
        status: "failed",
        error: response.error || "Adapter returned success=false without error message",
      };
    } catch (error) {
      console.error(`[PostingPublisher] Failed to publish to ${platform}:`, error);
      return {
        platform,
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

// ── Singleton ─────────────────────────────────────────────────────────────────

let _instance: PostingPublisherService | null = null;

export function getPostingPublisher(): PostingPublisherService {
  if (!_instance) _instance = new PostingPublisherService();
  return _instance;
}

// ── Env token loader ──────────────────────────────────────────────────────────

/**
 * Load PlatformEnvAuth from environment variables.
 * Returns null if the required token is not configured.
 *
 * Env var convention:
 *   LINKEDIN_ACCESS_TOKEN  / LINKEDIN_PAGE_ID
 *   FACEBOOK_ACCESS_TOKEN  / FACEBOOK_PAGE_ID
 *   THREADS_ACCESS_TOKEN   / THREADS_USER_ID
 *   INSTAGRAM_ACCESS_TOKEN / INSTAGRAM_ACCOUNT_ID
 */
export function loadPlatformAuthFromEnv(platform: Platform): PlatformEnvAuth | null {
  const envKey = platform.toUpperCase();

  const accessToken = process.env[`${envKey}_ACCESS_TOKEN`]?.trim();

  const pageIdKey =
    platform === "threads" ? `${envKey}_USER_ID` :
      platform === "instagram" ? `${envKey}_ACCOUNT_ID` :
        `${envKey}_PAGE_ID`;

  const pageId = process.env[pageIdKey]?.trim() ?? "";

  if (!accessToken) {
    console.warn(`[Publishing] ${envKey}_ACCESS_TOKEN not configured — skipping ${platform}`);
    return null;
  }

  return { platform, accessToken, pageId };
}
