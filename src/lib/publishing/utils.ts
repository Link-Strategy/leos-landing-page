import { PostingPublishRequest } from "./index";

export function formatMessage(request: PostingPublishRequest): string {
  const parts: string[] = [];

  if (request.title) parts.push(request.title);
  if (request.body) parts.push(request.body);

  if (request.hashtags?.length) {
    parts.push(
      request.hashtags
        .map((t: string) => (t.startsWith("#") ? t : `#${t}`))
        .join(" "),
    );
  }

  if (request.mentions?.length) {
    parts.push(request.mentions.map((m: string) => `@${m}`).join(" "));
  }

  return parts.join("\n\n");
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

