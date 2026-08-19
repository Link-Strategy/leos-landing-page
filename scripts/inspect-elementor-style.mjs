#!/usr/bin/env node
// Quickly look up every CSS rule (across all breakpoints) that Elementor
// generated for a given data-id, instead of manually inspecting each
// screen size in DevTools.
//
// Usage:
//   node scripts/inspect-elementor-style.mjs <data-id> [css-file-path]
//
// Examples:
//   node scripts/inspect-elementor-style.mjs 391ba12
//   node scripts/inspect-elementor-style.mjs 391ba12 public/wp-content/uploads/elementor/css/post-6.css
//
// Defaults to reading public/wp-content/uploads/elementor/css/post-2588.css (homepage kit).

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const [, , targetId, cssPathArg] = process.argv;

if (!targetId) {
  console.error("Missing data-id. Example: node scripts/inspect-elementor-style.mjs 391ba12");
  process.exit(1);
}

const cssPath = resolve(
  process.cwd(),
  cssPathArg || "public/wp-content/uploads/elementor/css/post-2588.css",
);

const css = readFileSync(cssPath, "utf8");

// Walk the CSS by brace depth to correctly split each rule / @media block,
// since the file is minified into a single line so splitting by newline won't work.
function parseRules(text) {
  const rules = [];
  let i = 0;
  let mediaStack = [];

  while (i < text.length) {
    // Skip whitespace
    while (i < text.length && /\s/.test(text[i])) i++;
    if (i >= text.length) break;

    if (text.startsWith("@media", i)) {
      const braceIdx = text.indexOf("{", i);
      const condition = text.slice(i, braceIdx).trim();
      mediaStack.push(condition);
      i = braceIdx + 1;
      continue;
    }

    if (text[i] === "}") {
      if (mediaStack.length > 0) mediaStack.pop();
      i++;
      continue;
    }

    const braceIdx = text.indexOf("{", i);
    if (braceIdx === -1) break;
    const selector = text.slice(i, braceIdx).trim();

    // Find the rule's closing } (rules aren't nested, so a simple search works)
    const closeIdx = text.indexOf("}", braceIdx);
    const declarations = text.slice(braceIdx + 1, closeIdx).trim();

    rules.push({
      media: mediaStack.length ? mediaStack[mediaStack.length - 1] : "(desktop / base)",
      selector,
      declarations,
    });

    i = closeIdx + 1;
  }

  return rules;
}

const rules = parseRules(css);
const needle = `elementor-element-${targetId}`;
const matches = rules.filter((r) => r.selector.includes(needle));

if (matches.length === 0) {
  console.log(`No rules found for data-id "${targetId}" in ${cssPath}`);
  process.exit(0);
}

const VISUAL_KEYWORDS = [
  "color",
  "background",
  "background-color",
  "background-image",
  "border",
  "border-radius",
  "box-shadow",
  "text-shadow",
  "font-size",
  "font-weight",
  "font-family",
  "line-height",
  "padding",
  "margin",
  "width",
  "height",
  "gap",
  "fill",
  "opacity",
];

function isVisualProp(prop) {
  return VISUAL_KEYWORDS.some((k) => prop === k || prop.endsWith(`-${k}`));
}

function extractVisualDeclarations(declarationText) {
  return declarationText
    .split(";")
    .map((d) => d.trim())
    .filter(Boolean)
    .filter((d) => {
      const colonIdx = d.indexOf(":");
      if (colonIdx === -1) return false;
      const prop = d.slice(0, colonIdx).trim();
      return isVisualProp(prop);
    });
}

console.log(`\n=== data-id="${targetId}" — ${matches.length} matching rules, read from ${cssPath} ===\n`);

let currentMedia = null;
for (const rule of matches) {
  if (rule.media !== currentMedia) {
    currentMedia = rule.media;
    console.log(`--- ${currentMedia} ---`);
  }
  const visual = extractVisualDeclarations(rule.declarations);
  console.log(`  selector: ${rule.selector}`);
  if (visual.length) {
    for (const decl of visual) console.log(`    ${decl};`);
  } else {
    console.log(`    (no notable visual properties — full: ${rule.declarations.slice(0, 200)})`);
  }
}
console.log("");
