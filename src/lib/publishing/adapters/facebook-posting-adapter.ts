import {
  PostingAdapter,
  PostingPublishRequest,
  PostingPublishResponse,
} from "../index";
import { formatMessage } from "../utils";

type PostMetrics = {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  engagement: number;
  lastSyncedAt: Date;
};

interface FacebookPostResponse {
  id?: string;
  error?: {
    message: string;
    type: string;
    code: number;
  };
}

interface FacebookInsightsResponse {
  data?: Array<{
    name: string;
    values: Array<{ value: number }>;
  }>;
}

/**
 * Facebook Posting Adapter
 * Infrastructure-only: no auth validation, no business rules
 */
export class FacebookPostingAdapter implements PostingAdapter {
  platform = "facebook" as const;
  private readonly baseUrl = "https://graph.facebook.com/v19.0";

  constructor(
    private readonly token: string,
    private readonly pageId: string,
  ) {}

  // -------- publish --------

  async publish(
    request: PostingPublishRequest,
  ): Promise<PostingPublishResponse> {
    try {
      if (!request.title && !request.body) {
        return {
          success: false,
          error: "Facebook post requires title or body",
        };
      }

      const message = [request.title, request.body]
        .filter(Boolean)
        .join("\n\n");

      console.log("[Facebook] Publishing post:", {
        hasMedia: !!request.media,
        media: request.media,
        message: message.substring(0, 50) + "...",
      });

      if (!request.media) {
        return this.publishText(message);
      }

      if (request.media.type === "image") {
        return this.publishPhoto(message, request.media.url);
      }

      if (request.media.type === "video") {
        return this.publishVideo(message, request.media.url);
      }

      console.error("[Facebook] Unsupported media type:", request.media);
      return {
        success: false,
        error: `Unsupported media type: ${request.media.type || "undefined"}`,
      };
    } catch (error) {
      return this.fail(error);
    }
  }

  // -------- update --------
  /**
   * Facebook only supports limited updates (mostly text).
   * Media updates are NOT supported.
   */
  async update(
    postId: string,
    request: PostingPublishRequest,
  ): Promise<PostingPublishResponse> {
    try {
      const message = [request.title, request.body]
        .filter(Boolean)
        .join("\n\n");

      const response = await this.fbPost(`/${postId}`, {
        message,
      });

      if (response.error) {
        return this.fail(response.error.message);
      }

      return {
        success: true,
        postId,
      };
    } catch (error) {
      return this.fail(error);
    }
  }

  // -------- delete --------

  async delete(postId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${postId}?access_token=${this.token}`,
        { method: "DELETE" },
      );

      const data = await response.json();
      return response.ok && (data === true || data?.success === true);
    } catch {
      return false;
    }
  }

  // -------- metrics --------

  /**
   * Get engagement metrics for a Facebook post
   *
   * Fetches both basic metrics (reactions, comments, shares) and insights
   * (impressions, reach, engagement) from Facebook Graph API.
   */
  async getMetrics(postId: string): Promise<any> {
    try {
      // Get basic metrics (reactions summary, comments, shares)
      const metrics = ["reactions.summary(true)", "comments.summary(true)", "shares"];
      const basicData = await this.fbGet<any>(`/${postId}`, {
        fields: metrics.join(","),
      });

      // Get insights (impressions, reach, engagement)
      // Note: These require page-level permissions and may not be available for all posts
      const insights = ["post_impressions", "post_reach", "post_engaged_users"];
      let insightData: FacebookInsightsResponse = {};

      try {
        insightData = await this.fbGet<FacebookInsightsResponse>(`/${postId}/insights`, {
          metric: insights.join(","),
        });
      } catch (error) {
        console.warn("[Facebook] Failed to fetch insights (may require additional permissions):", error);
        // Continue without insights - we still have basic metrics
      }

      // Return normalized metrics
      return {
        likes: basicData.reactions?.summary?.total_count ?? 0,
        comments: basicData.comments?.summary?.total_count ?? 0,
        shares: basicData.shares?.count ?? 0,
        impressions: this.extractInsightValue(insightData, "post_impressions"),
        reach: this.extractInsightValue(insightData, "post_reach"),
        engagement: this.extractInsightValue(insightData, "post_engaged_users"),
      };
    } catch (error) {
      console.error("[Facebook] getMetrics error:", error);
      throw error;
    }
  }

  /**
   * Extract metric value from Facebook Insights response
   */
  private extractInsightValue(insightData: FacebookInsightsResponse, metricName: string): number | null {
    if (!insightData.data) return null;
    const metric = insightData.data.find((m: any) => m.name === metricName);
    return metric?.values?.[0]?.value ?? null;
  }

  // ======================================================
  // Internal helpers
  // ======================================================

  private async publishText(message: string): Promise<PostingPublishResponse> {
    const data = await this.fbPost(`/${this.pageId}/feed`, { message });

    if (data.error) {
      return this.fail(data.error.message);
    }

    return this.success(data.id!);
  }

  private async publishPhoto(
    message: string,
    url: string,
  ): Promise<PostingPublishResponse> {
    const data = await this.fbPost(`/${this.pageId}/photos`, {
      url,
      message,
    });

    if (data.error) {
      return this.fail(data.error.message);
    }

    return this.success(data.id!);
  }

  private async publishVideo(
    message: string,
    url: string,
  ): Promise<PostingPublishResponse> {
    const data = await this.fbPost(`/${this.pageId}/videos`, {
      file_url: url,
      description: message,
    });

    if (data.error) {
      return this.fail(data.error.message);
    }

    return this.success(data.id!);
  }

  private async fbGet<T>(
    path: string,
    params: Record<string, string>,
  ): Promise<T> {
    const query = new URLSearchParams({
      ...params,
      access_token: this.token,
    });

    const res = await fetch(`${this.baseUrl}${path}?${query}`);
    return res.json() as Promise<T>;
  }

  private async fbPost(
    path: string,
    params: Record<string, string>,
  ): Promise<FacebookPostResponse> {
    const body = new URLSearchParams({
      ...params,
      access_token: this.token,
    });

    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      body,
    });

    return res.json();
  }

  private success(postId: string): PostingPublishResponse {
    return {
      success: true,
      postId,
      permalink: `https://www.facebook.com/${this.pageId}/posts/${postId}`,
    };
  }

  private fail(error: unknown): PostingPublishResponse {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Unknown Facebook error",
    };
  }
}

