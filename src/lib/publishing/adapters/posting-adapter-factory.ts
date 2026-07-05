/**
 * lib/publishing/adapters/posting-adapter-factory.ts
 *
 * Simplified factory — no DB OAuth, no token refresh.
 * Receives PlatformEnvAuth directly (token already loaded from .env).
 * Adapted from Link Strategy posting-adapter-factory.ts.
 */

import type { PostingAdapter, PostingAdapterFactory, PlatformEnvAuth, Platform } from "../index";

class SimplePlatformPostingAdapterFactory implements PostingAdapterFactory {
  private cache: Map<string, PostingAdapter> = new Map();

  async create(platform: string, auth: PlatformEnvAuth): Promise<PostingAdapter> {
    const key = `${platform}-${auth.pageId}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const adapter = await this.buildAdapter(platform as Platform, auth);
    this.cache.set(key, adapter);
    return adapter;
  }

  private async buildAdapter(platform: Platform, auth: PlatformEnvAuth): Promise<PostingAdapter> {
    const token = auth.accessToken;
    const pageId = auth.pageId;

    switch (platform) {
      case "linkedin": {
        const { LinkedInPostingAdapter } = await import("./linkedin-posting-adapter");
        const personUrn = pageId.startsWith("urn:li:person:")
          ? pageId
          : `urn:li:person:${pageId}`;
        return new LinkedInPostingAdapter(token, personUrn);
      }

      case "facebook": {
        const { FacebookPostingAdapter } = await import("./facebook-posting-adapter");
        return new FacebookPostingAdapter(token, pageId);
      }

      case "threads": {
        const { ThreadPostingAdapter } = await import("./thread-posting-adapter");
        return new ThreadPostingAdapter(token, pageId);
      }

      case "instagram": {
        const { InstagramPostingAdapter } = await import("./instagram-posting-adapter");
        return new InstagramPostingAdapter(token, pageId);
      }

      case "tiktok": {
        const { TikTokPostingAdapter } = await import("./tiktok-posting-adapter");
        return new TikTokPostingAdapter(token);
      }

      case "youtube": {
        const { YouTubePostingAdapter } = await import("./youtube-posting-adapter");
        return new YouTubePostingAdapter(token);
      }

      case "zalo": {
        const { ZaloPostingAdapter } = await import("./zalo-posting-adapter");
        return new ZaloPostingAdapter(token);
      }

      case "blog":
        throw new Error("Platform 'blog' does not use a social posting adapter — publish via Blog API instead.");

      default:
        throw new Error(`Unsupported posting platform: ${platform}`);
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

let _instance: SimplePlatformPostingAdapterFactory | null = null;

export function getPostingAdapterFactory(): SimplePlatformPostingAdapterFactory {
  if (!_instance) _instance = new SimplePlatformPostingAdapterFactory();
  return _instance;
}
