import {
  PostingAdapter,
  PostingPublishRequest,
  PostingPublishResponse,
} from "../index";

/**
 * WordPress site configuration
 */
interface WordPressSiteConfig {
  siteId?: string; // WordPress.com
  siteUrl?: string; // Self-hosted
}

interface WordPressPostResponse {
  ID?: number; // wp.com
  id?: number; // self-hosted
  link?: string;
  URL?: string;
  comment_count?: number;
  error?: string;
  message?: string;
}

interface WordPressPostPayload {
  title: string;
  content: string;
  status: "publish" | "draft";
  excerpt?: string;
  featured_image?: string; // URL to featured image
}

/**
 * WordPress Posting Adapter
 * - Supports WordPress.com & self-hosted
 * - No auth verification
 * - No logging
 */
export class WordPressPostingAdapter implements PostingAdapter {
  platform = "wordpress" as const;

  constructor(
    private readonly token: string,
    private readonly siteConfig: WordPressSiteConfig,
  ) {}

  // ======================================================
  // Publish
  // ======================================================

  async publish(
    request: PostingPublishRequest,
  ): Promise<PostingPublishResponse> {
    try {
      if (!request.title && !request.body) {
        return this.fail("Title or body is required for WordPress post");
      }

      const payload = this.buildPayload(request);
      // WordPress.com requires /posts/new endpoint for creating posts
      const endpoint = this.endpoint(this.isWpCom() ? "posts/new" : "posts");

      console.log("[WordPress] Publishing post:", {
        endpoint,
        siteConfig: this.siteConfig,
        payload: {
          ...payload,
          content: payload.content?.substring(0, 50) + "...",
        },
      });

      const data = await this.post<WordPressPostResponse>(endpoint, payload);

      console.log("[WordPress] Publish response:", data);

      if (data.error) {
        return this.fail(data.error || data.message);
      }

      return this.success(data);
    } catch (error) {
      console.error("[WordPress] Publish error:", error);
      return this.fail(error);
    }
  }

  // ======================================================
  // Update
  // ======================================================

  async update(
    postId: string,
    request: PostingPublishRequest,
  ): Promise<PostingPublishResponse> {
    try {
      const payload = this.buildPayload(request);
      const data = await this.post<WordPressPostResponse>(
        this.endpoint(`posts/${postId}`),
        payload,
      );

      if (data.error) {
        return this.fail(data.error || data.message);
      }

      return this.success(data);
    } catch (error) {
      return this.fail(error);
    }
  }

  // ======================================================
  // Delete
  // ======================================================

  /**
   * Get engagement metrics for a WordPress post
   * WordPress doesn't provide detailed engagement metrics via API
   * Returns basic stats if available
   */
  async getMetrics(postId: string): Promise<any> {
    try {
      const path = this.isWpCom()
        ? `posts/${postId}?fields=like_count,comment_count`
        : `posts/${postId}`;

      const res = await fetch(this.endpoint(path), {
        method: "GET",
        headers: this.headers(),
      });

      const data = await res.json();

      // WordPress.com provides some basic stats
      if (this.isWpCom()) {
        return {
          likes: data.like_count ?? 0,
          comments: data.comment_count ?? 0,
        };
      }

      // Self-hosted WordPress has limited metrics
      return {
        comments: data.comment_count ?? 0,
      };
    } catch (error) {
      console.error("[WordPress] getMetrics error:", error);
      // WordPress metrics may not be available, return empty
      return {};
    }
  }

  async delete(postId: string): Promise<boolean> {
    try {
      // WordPress.com uses POST /delete
      const path = this.isWpCom()
        ? `posts/${postId}/delete`
        : `posts/${postId}?force=true`;

      const res = await fetch(this.endpoint(path), {
        method: this.isWpCom() ? "POST" : "DELETE",
        headers: this.headers(),
      });

      return res.ok;
    } catch {
      return false;
    }
  }

  // ======================================================
  // Metrics
  // ======================================================

  // TODO: Add metrics methods if needed

  // ======================================================
  // Helper Methods
  // ======================================================

  private isWpCom(): boolean {
    return !!this.siteConfig.siteId;
  }

  private endpoint(path: string): string {
    if (this.isWpCom()) {
      return `https://public-api.wordpress.com/rest/v1.1/sites/${this.siteConfig.siteId}/${path}`;
    }
    return `${this.siteConfig.siteUrl}/wp-json/wp/v2/${path}`;
  }

  private headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  private async post<T>(url: string, body: any): Promise<T> {
    const res = await fetch(url, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`WordPress API error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }

  private buildPayload(request: PostingPublishRequest): WordPressPostPayload {
    return {
      title: request.title || "",
      content: request.body || "",
      status: "publish",
      excerpt: request.body?.substring(0, 200),
      featured_image: request.media?.url,
    };
  }

  private success(data: WordPressPostResponse): PostingPublishResponse {
    return {
      success: true,
      postId: String(data.ID || data.id || ""),
      permalink: data.link || data.URL || "",
    };
  }

  private fail(error: any): PostingPublishResponse {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

