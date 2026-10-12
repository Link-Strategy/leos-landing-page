import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { notFound } from "next/navigation";

import LandingElementorHooks from "@/components/landing/LandingElementorHooks";
import LeadFormPortal from "@/components/subpage/LeadFormPortal";
import { LEAD_FORM_SLOT_ID } from "@/components/subpage/lead-form-slot";

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

/**
 * Replace the (dead) Elementor <form> inside the widget with `data-id={widgetDataId}` by an empty slot
 * that <LeadFormPortal> fills on the client. The widget wrapper stays, so its scoped CSS still applies.
 */
export function replaceWidgetFormWithSlot(html: string, widgetDataId: string) {
  const widgetIndex = html.indexOf(`data-id="${widgetDataId}"`);
  if (widgetIndex === -1) return html;

  const formStart = html.indexOf("<form", widgetIndex);
  const formEnd = html.indexOf("</form>", formStart);
  if (formStart === -1 || formEnd === -1) return html;

  return `${html.slice(0, formStart)}<div id="${LEAD_FORM_SLOT_ID}"></div>${html.slice(formEnd + "</form>".length)}`;
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

type LeadFormSlot = {
  /** data-id of the Elementor form widget to replace (e.g. "0287d46" on /lien-he). */
  widgetDataId: string;
  source: string;
  leadType?: "contact" | "product_inquiry";
  messageRows?: number;
};

export function StaticLandingPage({
  className = "site-main page type-page status-publish hentry",
  segments = [],
  leadForm,
}: {
  className?: string;
  segments?: string[];
  leadForm?: LeadFormSlot;
}) {
  let html = getLandingMainHtml(segments);
  if (leadForm) html = replaceWidgetFormWithSlot(html, leadForm.widgetDataId);

  return (
    <div className={className}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <LandingElementorHooks />
      {leadForm && (
        <LeadFormPortal source={leadForm.source} leadType={leadForm.leadType} messageRows={leadForm.messageRows} />
      )}
    </div>
  );
}
