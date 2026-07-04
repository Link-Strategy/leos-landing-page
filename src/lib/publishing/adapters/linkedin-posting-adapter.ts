import {
  PostingAdapter,
  PostingPublishRequest,
  PostingPublishResponse,
} from "../index";

interface LinkedInPostResponse {
  id?: string;
  error?: string;
  message?: string;
}

interface LinkedInRegisterUploadResponse {
  value?: {
    uploadMechanism?: {
      "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"?: {
        uploadUrl?: string;
      };
    };
    asset?: string;
  };
  message?: string;
  error?: string;
}

interface LinkedInMetricsResponse {
  elements?: Array<{
    totalShareStatistics?: {
      shareCount?: number;
      likeCount?: number;
      commentCount?: number;
      impressionCount?: number;
      clickCount?: number;
      engagement?: number;
    };
  }>;
}

/**
 * LinkedIn Posting Adapter
 * Infrastructure-only: no auth validation, no business rules
 *
 * LinkedIn Share API v2 Documentation:
 * https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api
 */
export class LinkedInPostingAdapter implements PostingAdapter {
  platform = "linkedin" as const;
  private readonly baseUrl = "https://api.linkedin.com/v2";

  constructor(
    private readonly token: string,
    private readonly personUrn: string, // urn:li:person:MEMBER_ID
  ) {}

  // -------- publish --------

  async publish(
    request: PostingPublishRequest,
  ): Promise<PostingPublishResponse> {
    try {
      if (!request.title && !request.body) {
        return {
          success: false,
          error: "LinkedIn post requires title or body",
        };
      }

      const text = [request.title, request.body]
        .filter(Boolean)
        .join("\n\n");

      console.log("[LinkedIn] Publishing post:", {
        hasMedia: !!request.media,
        media: request.media,
        text: text.substring(0, 50) + "...",
      });

      // LinkedIn Share API v2
      if (request.article?.url) {
        return this.publishArticle(text, request.article);
      }

      if (!request.media) {
        return this.publishText(text);
      }

      if (request.media.type === "image") {
        return this.publishImage(text, request.media.url);
      }

      if (request.media.type === "video") {
        return this.publishVideo(text, request.media.url);
      }

      console.error("[LinkedIn] Unsupported media type:", request.media);
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
   * LinkedIn does NOT support editing posts after publication
   * This is a platform limitation
   */
  async update(
    postId: string,
    request: PostingPublishRequest,
  ): Promise<PostingPublishResponse> {
    return {
      success: false,
      error: "LinkedIn does not support editing posts after publication",
    };
  }

  // -------- delete --------

  async delete(postId: string): Promise<boolean> {
    try {
      // LinkedIn uses URN format for post IDs
      const shareUrn = this.normalizeShareUrn(postId);

      const response = await fetch(`${this.baseUrl}/shares/${shareUrn}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
      });

      return response.ok;
    } catch (error) {
      console.error("[LinkedIn] Delete error:", error);
      return false;
    }
  }

  // -------- metrics --------

  /**
   * Get engagement metrics for a LinkedIn post
   *
   * Fetches share statistics including likes, comments, shares, impressions
   * from LinkedIn Analytics API.
   *
   * Note: Requires r_organization_social scope for organization posts
   */
  async getMetrics(postId: string): Promise<any> {
    try {
      const shareUrn = this.normalizeShareUrn(postId);

      // Get share statistics
      const response = await fetch(
        `${this.baseUrl}/socialActions/${encodeURIComponent(shareUrn)}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "X-Restli-Protocol-Version": "2.0.0",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch LinkedIn metrics: ${response.status}`);
      }

      const data: LinkedInMetricsResponse = await response.json();

      // Extract metrics from response
      const stats = data.elements?.[0]?.totalShareStatistics || {};

      return {
        likes: stats.likeCount ?? 0,
        comments: stats.commentCount ?? 0,
        shares: stats.shareCount ?? 0,
        impressions: stats.impressionCount ?? null,
        clicks: stats.clickCount ?? null,
        engagement: stats.engagement ?? null,
      };
    } catch (error) {
      console.error("[LinkedIn] getMetrics error:", error);
      throw error;
    }
  }

  // ======================================================
  // Internal helpers
  // ======================================================

  /**
   * Publish text-only post
   */
  private async publishText(text: string): Promise<PostingPublishResponse> {
    const payload = {
      author: this.personUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text,
          },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    const data = await this.linkedInPost("/ugcPosts", payload);

    if (data.error) {
      return this.fail(data.message || data.error);
    }

    return this.success(data.id!);
  }

  /**
   * Publish post with image
   */
  private async publishImage(
    text: string,
    imageUrl: string,
  ): Promise<PostingPublishResponse> {
    const upload = await this.uploadMediaToLinkedIn("image", imageUrl);
    if (!upload.success) {
      return this.fail(upload.error);
    }

    const payload = {
      author: this.personUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text,
          },
          shareMediaCategory: "IMAGE",
          media: [
            {
              status: "READY",
              description: {
                text: text.substring(0, 100),
              },
              media: upload.asset,
              title: {
                text: text.substring(0, 50),
              },
            },
          ],
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    const data = await this.linkedInPost("/ugcPosts", payload);

    if (data.error) {
      return this.fail(data.message || data.error);
    }

    return this.success(data.id!);
  }

  /**
   * Publish post with article URL
   */
  private async publishArticle(
    text: string,
    article: { url: string; title?: string; description?: string },
  ): Promise<PostingPublishResponse> {
    const payload = {
      author: this.personUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text,
          },
          shareMediaCategory: "ARTICLE",
          media: [
            {
              status: "READY",
              originalUrl: article.url,
              ...(article.title
                ? {
                    title: {
                      text: article.title,
                    },
                  }
                : {}),
              ...(article.description
                ? {
                    description: {
                      text: article.description,
                    },
                  }
                : {}),
            },
          ],
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    const data = await this.linkedInPost("/ugcPosts", payload);
    if (data.error) {
      return this.fail(data.message || data.error);
    }
    return this.success(data.id!);
  }

  /**
   * Publish post with video
   */
  private async publishVideo(
    text: string,
    videoUrl: string,
  ): Promise<PostingPublishResponse> {
    const upload = await this.uploadMediaToLinkedIn("video", videoUrl);
    if (!upload.success) {
      return this.fail(upload.error);
    }

    const payload = {
      author: this.personUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text,
          },
          shareMediaCategory: "VIDEO",
          media: [
            {
              status: "READY",
              description: {
                text: text.substring(0, 100),
              },
              media: upload.asset,
              title: {
                text: text.substring(0, 50),
              },
            },
          ],
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    const data = await this.linkedInPost("/ugcPosts", payload);

    if (data.error) {
      return this.fail(data.message || data.error);
    }

    return this.success(data.id!);
  }

  /**
   * Make a POST request to LinkedIn API
   */
  private async linkedInPost(
    path: string,
    body: any,
  ): Promise<LinkedInPostResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify(body),
      });

      const data = await this.readJsonBody(response);
      const restLiId =
        response.headers.get("X-RestLi-Id") ||
        response.headers.get("x-restli-id");
      if (!response.ok) {
        console.error("[LinkedIn] Publish response error:", {
          status: response.status,
          data,
        });
      } else {
        console.log("[LinkedIn] Publish response:", {
          status: response.status,
          data,
        });
      }

      if (!response.ok) {
        return {
          error:
            (data?.message as string | undefined) ||
            (data?.error as string | undefined) ||
            "LinkedIn API error",
          message: data?.message as string | undefined,
        };
      }

      const postId =
        restLiId ||
        (data?.id as string | undefined) ||
        (data?.value as string | undefined);
      if (!postId) {
        return {
          error: "LinkedIn response missing post ID (X-RestLi-Id)",
        };
      }

      return { id: postId };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private async uploadMediaToLinkedIn(
    mediaType: "image" | "video",
    mediaUrl: string,
  ): Promise<{ success: true; asset: string } | { success: false; error: string }> {
    const registration = await this.registerUpload(mediaType);
    if (!registration.success) {
      return registration;
    }

    const source = await this.downloadMedia(mediaUrl, mediaType);
    if (!source.success) {
      return source;
    }

    const uploaded = await this.uploadBinaryToLinkedIn(
      registration.uploadUrl,
      source.content,
      source.contentType,
    );
    if (!uploaded.success) {
      return uploaded;
    }

    return { success: true, asset: registration.asset };
  }

  private async registerUpload(
    mediaType: "image" | "video",
  ): Promise<
    | { success: true; uploadUrl: string; asset: string }
    | { success: false; error: string }
  > {
    try {
      const recipe =
        mediaType === "video"
          ? "urn:li:digitalmediaRecipe:feedshare-video"
          : "urn:li:digitalmediaRecipe:feedshare-image";
      const payload = {
        registerUploadRequest: {
          recipes: [recipe],
          owner: this.personUrn,
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      };

      const response = await fetch(
        `${this.baseUrl}/assets?action=registerUpload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = (await this.readJsonBody(
        response,
      )) as LinkedInRegisterUploadResponse | undefined;
      if (!response.ok) {
        return {
          success: false,
          error:
            data?.message ||
            data?.error ||
            `LinkedIn register upload failed (${response.status})`,
        };
      }

      const uploadUrl =
        data?.value?.uploadMechanism?.[
          "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
        ]?.uploadUrl;
      const asset = data?.value?.asset;
      if (!uploadUrl || !asset) {
        return {
          success: false,
          error: "LinkedIn register upload response missing uploadUrl or asset",
        };
      }

      return { success: true, uploadUrl, asset };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "LinkedIn register upload failed",
      };
    }
  }

  private async downloadMedia(
    mediaUrl: string,
    mediaType: "image" | "video",
  ): Promise<
    | { success: true; content: ArrayBuffer; contentType: string }
    | { success: false; error: string }
  > {
    try {
      const response = await fetch(mediaUrl);
      if (!response.ok) {
        return {
          success: false,
          error: `Unable to download media file (${response.status})`,
        };
      }

      const content = await response.arrayBuffer();
      const fallbackContentType =
        mediaType === "video" ? "video/mp4" : "image/jpeg";
      const contentType =
        response.headers.get("content-type") || fallbackContentType;
      return { success: true, content, contentType };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to download media file",
      };
    }
  }

  private async uploadBinaryToLinkedIn(
    uploadUrl: string,
    content: ArrayBuffer,
    contentType: string,
  ): Promise<{ success: true } | { success: false; error: string }> {
    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": contentType,
        },
        body: content,
      });
      if (!response.ok) {
        return {
          success: false,
          error: `LinkedIn binary upload failed (${response.status})`,
        };
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "LinkedIn binary upload failed",
      };
    }
  }

  private async readJsonBody(response: Response): Promise<any | undefined> {
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return undefined;
    }
    try {
      return await response.json();
    } catch {
      return undefined;
    }
  }

  /**
   * Normalize LinkedIn share URN
   * Converts post ID to proper URN format if needed
   */
  private normalizeShareUrn(postId: string): string {
    if (postId.startsWith("urn:li:share:")) {
      return postId;
    }
    if (postId.startsWith("urn:li:ugcPost:")) {
      return postId;
    }
    // Assume it's a raw ID
    return `urn:li:share:${postId}`;
  }

  /**
   * Extract post ID from LinkedIn URN
   */
  private extractPostId(urn: string): string {
    if (urn.startsWith("urn:li:share:")) {
      return urn.replace("urn:li:share:", "");
    }
    if (urn.startsWith("urn:li:ugcPost:")) {
      return urn.replace("urn:li:ugcPost:", "");
    }
    return urn;
  }

  private success(postId: string): PostingPublishResponse {
    return {
      success: true,
      postId,
      permalink: `https://www.linkedin.com/feed/update/${postId}`,
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
            : "Unknown LinkedIn error",
    };
  }
}

