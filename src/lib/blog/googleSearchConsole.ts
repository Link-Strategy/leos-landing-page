import { GoogleAuth } from "google-auth-library";
import { getSiteUrl } from "./seo";

import type { BlogSearchConsoleSubmissionDocument } from "./types";

export type SubmitSitemapResult = {
  submitted: boolean;
  warning?: string;
  sitemapUrl: string;
};

function normalizePrivateKey(value?: string) {
  if (!value) return value;
  let key = value.trim();
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }
  if (key.startsWith("'") && key.endsWith("'")) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, "\n");
}

export function isGoogleSearchConsoleConfigured() {
  return Boolean(
    process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL?.trim() &&
      normalizePrivateKey(process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY)?.trim(),
  );
}

export function getSitemapUrl() {
  return `${getSiteUrl()}/sitemap.xml`;
}

export function buildSearchConsoleSubmissionState(input: {
  status: BlogSearchConsoleSubmissionDocument["status"];
  attemptedAt?: Date;
  message?: string;
  sitemapUrl?: string;
}): BlogSearchConsoleSubmissionDocument {
  return {
    status: input.status,
    attemptedAt: input.attemptedAt ?? null,
    message: input.message,
    sitemapUrl: input.sitemapUrl,
  };
}

export async function submitSitemapToGoogleSearchConsole() {
  const sitemapUrl = getSitemapUrl();

  if (!isGoogleSearchConsoleConfigured()) {
    return {
      submitted: false,
      warning: "Search Console sitemap submission skipped: missing configuration",
      sitemapUrl,
    } satisfies SubmitSitemapResult;
  }

  const siteUrl = (process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || getSiteUrl()).trim();
  const auth = new GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL!.trim(),
      private_key: normalizePrivateKey(process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY),
    },
    scopes: ["https://www.googleapis.com/auth/webmasters"],
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const accessToken =
    typeof tokenResponse === "string" ? tokenResponse : tokenResponse.token;

  if (!accessToken) {
    return {
      submitted: false,
      warning: "Search Console sitemap submission skipped: missing access token",
      sitemapUrl,
    } satisfies SubmitSitemapResult;
  }

  const response = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
    {
      method: "PUT",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Search Console sitemap submission failed: ${response.status} ${body}`.trim(),
    );
  }

  return { submitted: true, sitemapUrl } satisfies SubmitSitemapResult;
}
