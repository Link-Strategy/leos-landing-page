import {
  PostingAdapter,
  PostingPublishRequest,
  PostingPublishResponse,
} from "../index";

interface GraphError {
  message: string;
  type?: string;
  code?: number;
  error_subcode?: number;
  error_user_title?: string;
  error_user_msg?: string;
}

interface GraphResponse<T> {
  id?: string;
  permalink?: string;
  error?: GraphError;
  data?: T;
}

interface InsightMetric {
  name: "impressions" | "reach" | "engagement";
  values: Array<{ value: number }>;
}

type MediaStatus = "IN_PROGRESS" | "PENDING" | "FINISHED" | "ERROR" | "UNKNOWN";

/**
 * Instagram Posting Adapter
 * - No auth validation
 * - No carousel
 * - No post update / delete
 */
export class InstagramPostingAdapter implements PostingAdapter {
  platform = "instagram" as const;
  private readonly baseUrl = "https://graph.instagram.com/v23.0";

  constructor(
    private readonly token: string,
    private readonly igAccountId: string,
  ) {}

  // ======================================================
  // Publish
  // ======================================================

  async publish(
    request: PostingPublishRequest,
  ): Promise<PostingPublishResponse> {
    try {
      console.log("[Instagram] Publishing post:", {
        hasMedia: !!request.media,
        media: request.media,
        igAccountId: this.igAccountId,
        tokenPrefix: this.token.substring(0, 20) + "...",
        tokenLength: this.token.length,
      });

      if (!request.media) {
        return this.fail("Instagram requires at least one image or video");
      }

      const caption = request.title?.trim() || request.body?.trim() || "";

      if (request.media.type === "image") {
        return await this.publishImage(caption, request.media.url);
      }

      if (request.media.type === "video") {
        return await this.publishVideo(caption, request.media.url);
      }

      console.error("[Instagram] Unsupported media type:", request.media);
      return this.fail(
        `Unsupported media type: ${request.media.type || "undefined"}`,
      );
    } catch (error) {
      return this.fail(error);
    }
  }

  // ======================================================
  // Unsupported operations
  // ======================================================

  async update(): Promise<PostingPublishResponse> {
    return this.fail("Instagram does not support editing published posts");
  }

  async delete(): Promise<boolean> {
    // Instagram Graph API does not support deleting posts
    return false;
  }

  // ======================================================
  // Metrics
  // ======================================================

  /**
   * Get engagement metrics for an Instagram post
   *
   * Fetches insights from Instagram Graph API.
   * Available metrics: impressions, reach, engagement, likes, comments, saves
   */
  async getMetrics(mediaId: string): Promise<any> {
    try {
      // Get basic metrics (like_count, comments_count)
      const basicData = await this.fbGet<any>(`/${mediaId}`, {
        fields: "like_count,comments_count,media_type,timestamp",
      });

      // Get insights (impressions, reach, engagement, saved)
      // Available metrics depend on media type (image/video)
      const metrics = ["impressions", "reach", "engagement", "saved"];
      let insightData: any = null;

      try {
        insightData = await this.fbGet<any>(`/${mediaId}/insights`, {
          metric: metrics.join(","),
        });
      } catch (error) {
        console.warn("[Instagram] Failed to fetch insights (may require additional permissions):", error);
        // Continue without insights - we still have basic metrics
      }

      // Extract insight values
      const getInsightValue = (name: string): number | null => {
        if (!insightData?.data) return null;
        const metric = insightData.data.find((m: any) => m.name === name);
        return metric?.values?.[0]?.value ?? null;
      };

      // Return normalized metrics
      return {
        like_count: basicData.like_count ?? 0,
        comments_count: basicData.comments_count ?? 0,
        impressions: getInsightValue("impressions"),
        reach: getInsightValue("reach"),
        engagement: getInsightValue("engagement"),
        saved: getInsightValue("saved"),
      };
    } catch (error) {
      console.error("[Instagram] getMetrics error:", error);
      throw error;
    }
  }

  // ======================================================
  // Internal publish flow
  // ======================================================

  private async publishImage(
    caption: string,
    imageUrl: string,
  ): Promise<PostingPublishResponse> {
    const containerId = await this.createContainer({
      image_url: imageUrl,
      caption,
    });

    await this.waitUntilReady(containerId);
    return this.publishContainer(containerId);
  }

  private async publishVideo(
    caption: string,
    videoUrl: string,
  ): Promise<PostingPublishResponse> {
    const containerId = await this.createContainer({
      media_type: "VIDEO",
      video_url: videoUrl,
      caption,
    });

    await this.waitUntilReady(containerId);
    return this.publishContainer(containerId);
  }

  // ======================================================
  // Graph helpers
  // ======================================================

  private async createContainer(
    params: Record<string, string>,
  ): Promise<string> {
    const res = await this.fbPost<GraphResponse<never>>(
      `/${this.igAccountId}/media`,
      params,
    );

    if (res.error || !res.id) {
      const errorMsg = this.describeGraphError(res.error);
      console.error("[Instagram] Create container error:", res.error);

      if (res.error?.code === 190) {
        throw new Error(
          `Instagram access token is invalid or expired. ` +
            `Please re-connect your Instagram account in Settings > Social Connections. ` +
            `(${errorMsg})`,
        );
      }

      if (this.isMediaValidationError(res.error)) {
        throw new Error(
          `Instagram rejected the media URL. ` +
            `Use a publicly downloadable JPG or PNG image URL. ` +
            `(${errorMsg})`,
        );
      }

      throw new Error(errorMsg);
    }

    return res.id;
  }

  private async publishContainer(
    containerId: string,
  ): Promise<PostingPublishResponse> {
    const res = await this.fbPost<GraphResponse<never>>(
      `/${this.igAccountId}/media_publish`,
      { creation_id: containerId },
    );

    if (res.error || !res.id) {
      if (res.error?.code === 190) {
        return this.fail(
          `Instagram access token is invalid or expired. ` +
            `Please re-connect your Instagram account in Settings > Social Connections. ` +
            `(${this.describeGraphError(res.error)})`,
        );
      }
      return this.fail(this.describeGraphError(res.error));
    }

    const permalink = await this.fetchPermalink(res.id);

    return {
      success: true,
      postId: res.id,
      permalink,
    };
  }

  private async waitUntilReady(
    containerId: string,
    maxAttempts = 15,
  ): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.getMediaStatus(containerId);

      if (status === "FINISHED") return;
      if (status === "ERROR") {
        throw new Error("Media processing failed");
      }

      await this.sleep(2000);
    }

    throw new Error("Media processing timeout");
  }

  private async getMediaStatus(containerId: string): Promise<MediaStatus> {
    const res = await this.fbGet<{ status_code?: MediaStatus }>(
      `/${containerId}`,
      { fields: "status_code" },
    );

    return res.status_code ?? "UNKNOWN";
  }

  private async fetchPermalink(mediaId: string): Promise<string> {
    const res = await this.fbGet<{ permalink?: string }>(`/${mediaId}`, {
      fields: "permalink",
    });

    return res.permalink ?? `https://www.instagram.com/p/${mediaId}/`;
  }

  // ======================================================
  // Low-level HTTP
  // ======================================================

  private async fbGet<T>(
    path: string,
    params: Record<string, string>,
  ): Promise<T> {
    const query = new URLSearchParams({
      ...params,
      access_token: this.token,
    });

    const res = await fetch(`${this.baseUrl}${path}?${query}`);
    return this.parseJsonResponse<T>(res);
  }

  private async fbPost<T>(
    path: string,
    params: Record<string, string>,
  ): Promise<T> {
    const body = new URLSearchParams({
      ...params,
      access_token: this.token,
    });

    const url = `${this.baseUrl}${path}`;
    console.log("[Instagram] API Request:", {
      method: "POST",
      url,
      params: Object.keys(params),
      bodySize: body.toString().length,
    });

    const res = await fetch(url, {
      method: "POST",
      body,
    });

    const json = await this.parseJsonResponse<T>(res);
    console.log("[Instagram] API Response:", {
      status: res.status,
      ok: res.ok,
      hasError: !!(json as any).error,
    });

    return json;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }

  private async parseJsonResponse<T>(res: Response): Promise<T> {
    if (typeof res.text !== "function" && typeof res.json === "function") {
      return res.json() as Promise<T>;
    }

    const text = await res.text();
    if (!text) return {} as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      return {
        error: {
          message: `Instagram API ${res.status}: ${text}`,
        },
      } as T;
    }
  }

  private describeGraphError(error?: GraphError): string {
    if (!error) return "Failed to create media";
    return (
      error.error_user_msg ||
      error.error_user_title ||
      error.message ||
      "Instagram API error"
    );
  }

  private isMediaValidationError(error?: GraphError): boolean {
    if (!error) return false;
    const message = `${error.message || ""} ${error.error_user_msg || ""} ${error.error_user_title || ""}`.toLowerCase();
    return (
      error.code === 9004 ||
      error.error_subcode === 2207052 ||
      message.includes("media uri") ||
      message.includes("photo or video") ||
      message.includes("download") ||
      message.includes("image url")
    );
  }

  private fail(error?: unknown): PostingPublishResponse {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Instagram error",
    };
  }
}

