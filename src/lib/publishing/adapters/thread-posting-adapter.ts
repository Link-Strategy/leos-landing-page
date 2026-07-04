import type {
  PostingAdapter,
  PostingPublishRequest,
  PostingPublishResponse,
} from "../index";
import { formatMessage } from "../utils";

interface ThreadMediaPublishResponse {
  id?: string;
  error?: {
    message?: string;
    code?: number;
    type?: string;
    error_subcode?: number;
    error_user_title?: string;
    error_user_msg?: string;
  };
  message?: string;
  _httpStatus?: number;
  _rawText?: string;
}

interface ThreadPublishResponse {
  id?: string;
  error?: {
    message?: string;
    code?: number;
    type?: string;
    error_subcode?: number;
    error_user_title?: string;
    error_user_msg?: string;
  };
  message?: string;
  _httpStatus?: number;
  _rawText?: string;
}

export class ThreadPostingAdapter implements PostingAdapter {
  platform = "threads" as const;
  private readonly baseUrl = "https://graph.threads.net/v1.0";
  private readonly publishRetryDelayMs = 1500;
  private readonly publishRetryAttempts = 4;

  constructor(
    private readonly token: string,
    private readonly userId: string,
  ) {}

  async publish(
    request: PostingPublishRequest,
  ): Promise<PostingPublishResponse> {
    try {
      const text = formatMessage(request).trim();
      if (!text && !request.media) {
        return {
          success: false,
          error: "Threads post requires text or image",
        };
      }

      if (!request.media) {
        return await this.publishContainer({
          media_type: "TEXT",
          text,
        });
      }

      if (request.media.type !== "image") {
        return {
          success: false,
          error: "Threads publish currently supports text or a single image",
        };
      }

      return await this.publishContainer({
        media_type: "IMAGE",
        image_url: request.media.url,
        text,
      });
    } catch (error) {
      return this.fail(error);
    }
  }

  private async publishContainer(
    params: Record<string, string>,
  ): Promise<PostingPublishResponse> {
    const creation = await this.threadsPost<ThreadMediaPublishResponse>(
      `/${this.userId}/threads`,
      params,
    );
    console.log("[Threads] Container creation response:", creation);

    if (creation.error?.message || !creation.id) {
      return this.fail(this.describeThreadsError(
        creation,
        "Failed to create Threads publish container",
      ));
    }

    const publish = await this.publishCreatedContainer(creation.id);
    console.log("[Threads] Publish response:", publish);

    if (publish.error?.message || !publish.id) {
      return this.fail(this.describeThreadsError(
        publish,
        "Failed to publish Threads post",
      ));
    }

    return {
      success: true,
      postId: publish.id,
      permalink: `https://www.threads.net/@${this.userId}/post/${publish.id}`,
    };
  }

  private async publishCreatedContainer(creationId: string) {
    let publish = await this.threadsPost<ThreadPublishResponse>(
      `/${this.userId}/threads_publish`,
      {
        creation_id: creationId,
      },
    );

    for (
      let attempt = 1;
      attempt < this.publishRetryAttempts && this.shouldRetryPublish(publish);
      attempt += 1
    ) {
      await this.sleep(this.publishRetryDelayMs * attempt);
      publish = await this.threadsPost<ThreadPublishResponse>(
        `/${this.userId}/threads_publish`,
        {
          creation_id: creationId,
        },
      );
    }

    return publish;
  }

  private async threadsPost<T extends {
    error?: {
      message?: string;
      code?: number;
      type?: string;
      error_subcode?: number;
      error_user_title?: string;
      error_user_msg?: string;
    };
    message?: string;
    _httpStatus?: number;
    _rawText?: string;
  }>(
    path: string,
    params: Record<string, string>,
  ): Promise<T> {
    const body = new URLSearchParams({
      ...params,
      access_token: this.token,
    });

    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      body,
    });

    if (typeof response.text !== "function" && typeof response.json === "function") {
      const json = await response.json() as T;
      json._httpStatus = response.status;
      return json;
    }

    const text = await response.text();
    let data = {} as T;
    if (text) {
      try {
        data = JSON.parse(text) as T;
      } catch {
        data = {
          message: `Threads API ${response.status}: ${text}`,
        } as T;
      }
    }
    data._httpStatus = response.status;
    data._rawText = text;

    if (!response.ok && !data.error?.message && !data.message) {
      return {
        ...data,
        message: `Threads API ${response.status}: ${text || "Empty response"}`,
      };
    }

    return data;
  }

  private describeThreadsError(
    response: ThreadMediaPublishResponse | ThreadPublishResponse,
    fallback: string,
  ): string {
    const error = response.error;
    const baseMessage =
      error?.error_user_msg ||
      error?.error_user_title ||
      error?.message ||
      response.message ||
      fallback;

    const details = [
      response._httpStatus ? `status=${response._httpStatus}` : "",
      error?.code ? `code=${error.code}` : "",
      error?.error_subcode ? `subcode=${error.error_subcode}` : "",
      error?.type ? `type=${error.type}` : "",
    ].filter(Boolean);

    if (baseMessage.toLowerCase() === "an unknown error occurred" && response._rawText) {
      return `${baseMessage} (${details.join(", ") || "raw"}): ${response._rawText}`;
    }

    if (details.length > 0) {
      return `${baseMessage} (${details.join(", ")})`;
    }

    return baseMessage;
  }

  private fail(error: unknown): PostingPublishResponse {
    console.error("[Threads] Publish failure:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Unknown Threads error",
    };
  }

  private shouldRetryPublish(response: ThreadPublishResponse) {
    const error = response.error;
    return (
      !!error &&
      error.code === 24 &&
      error.error_subcode === 4279009
    );
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

