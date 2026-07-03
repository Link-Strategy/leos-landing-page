import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { notFound } from "next/navigation";

import LandingElementorHooks from "@/components/landing/LandingElementorHooks";

const landingRoot = path.join(process.cwd(), "public", "landing");

function normalizeAssetPaths(html: string) {
  return html
    .replace(/\r\n?/g, "\n")
    .replaceAll('src="wp-content/', 'src="/wp-content/')
    .replaceAll("src='wp-content/", "src='/wp-content/")
    .replaceAll('srcset="wp-content/', 'srcset="/wp-content/')
    .replaceAll(", wp-content/", ", /wp-content/")
    .replaceAll('href="wp-content/', 'href="/wp-content/')
    .replaceAll("href='wp-content/", "href='/wp-content/")
    .replaceAll('poster="wp-content/', 'poster="/wp-content/');
}

function normalizeInternalLinks(html: string) {
  return html
    .replace(/\bhref=""/g, 'href="/"')
    .replace(/\bhref="https:\/\/demo\.saokim\.com\.vn\/letron\/?([^"#?]*)([^"]*)"/g, (_match, pathPart, tail) => {
      const normalizedPath = pathPart ? `/${pathPart}` : "/";
      return `href="${normalizedPath}${tail}"`;
    })
    .replace(/\bhref="(?!https?:|mailto:|tel:|data:|#|\/|javascript:)([^"]+)"/g, 'href="/$1"');
}

export function normalizeLandingHtml(html: string) {
  return normalizeInternalLinks(normalizeAssetPaths(html));
}

export function getLandingMainHtml(segments: string[] = []) {
  const pagePath = path.join(landingRoot, ...segments, "index.html");

  if (!existsSync(pagePath)) {
    notFound();
  }

  const source = readFileSync(pagePath, "utf8");
  const mainMatch = source.match(/<main\b[^>]*id="content"[^>]*>([\s\S]*?)<\/main>/i);
  const bodyMatch = source.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  const content = mainMatch?.[1] ?? bodyMatch?.[1];

  if (!content) {
    throw new Error(`Could not find page content in ${path.relative(process.cwd(), pagePath)}`);
  }

  return normalizeLandingHtml(content)
    .replace(/<a\b[^>]*class="skip-link screen-reader-text"[\s\S]*?<\/a>/i, "")
    .replace(/<header\b[^>]*class="[^"]*elementor-location-header[^"]*"[^>]*>[\s\S]*?<\/header>/i, "")
    .replace(/<footer\b[^>]*class="[^"]*elementor-location-footer[^"]*"[^>]*>[\s\S]*?<\/footer>/i, "")
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/<style\b[^>]*id="wp-emoji-styles-inline-css"[\s\S]*?<\/style>/gi, "");
}

export function getLandingDirectories(segments: string[] = []) {
  const dirPath = path.join(landingRoot, ...segments);

  if (!existsSync(dirPath)) {
    return [];
  }

  return readdirSync(dirPath)
    .filter((name) => !name.startsWith("__") && name !== "wp-content" && name !== "wp-includes")
    .filter((name) => {
      const childPath = path.join(dirPath, name);
      return statSync(childPath).isDirectory() && existsSync(path.join(childPath, "index.html"));
    })
    .sort();
}

export function StaticLandingPage({
  className = "site-main page type-page status-publish hentry",
  segments = [],
}: {
  className?: string;
  segments?: string[];
}) {
  return (
    <div className={className}>
      <div dangerouslySetInnerHTML={{ __html: getLandingMainHtml(segments) }} />
      <LandingElementorHooks />
    </div>
  );
}
