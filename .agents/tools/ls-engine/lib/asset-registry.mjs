import path from "node:path";
import { tierNames } from "./layer-policy.mjs";

const assetDetectionRules = [
  { match: (p) => p.includes("/rules/"), type: "Rule" },
  { match: (p) => p.includes("/workflows/"), type: "Workflow" },
  { match: (p) => p.includes("/skills/"), type: "Skill" },
  { match: (p) => p.includes("/tools/"), type: "Tool" },
  { match: (p) => p.includes("/templates/"), type: "Template" },
  { match: (p) => p.startsWith("src/") || p === "package.json", type: "Shell" },
  { match: (p) => p.endsWith(".md") && !p.includes(".agents/"), type: "Task" }
];

export function assetTypeForPath(assetPath, fallback = "DNA") {
  return assetDetectionRules.find((rule) => rule.match(assetPath))?.type || fallback;
}

export function assetFromMapping(mapping, { fallbackPurpose = "Synchronized project assets.", fallbackType = "DNA" } = {}) {
  const assetPath = mapping.target || mapping.dest;
  const id = mapping.id || `sync-${path.basename(assetPath).toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  return {
    id,
    type: mapping.type || assetTypeForPath(assetPath, fallbackType),
    path: assetPath,
    purpose: mapping.purpose || mapping.description || fallbackPurpose
  };
}

export function validateAssetRegistry(registry, { rootPath = "", requireGeneratedAt = false } = {}) {
  const errors = [];
  if (!registry || typeof registry !== "object" || Array.isArray(registry)) {
    return ["asset-index.json must contain a JSON object."];
  }

  const identity = registry.identity;
  if (!identity || typeof identity !== "object" || Array.isArray(identity)) {
    errors.push("identity must be an object.");
  } else {
    if (!isNonEmptyString(identity.name)) errors.push("identity.name is required.");
    if (!isNonEmptyString(identity.tier)) errors.push("identity.tier is required.");
    else if (!tierNames.has(identity.tier)) errors.push(`identity.tier '${identity.tier}' is not supported.`);
    if (!isNonEmptyString(identity.version)) errors.push("identity.version is required.");
    if (requireGeneratedAt && !isNonEmptyString(identity.generated_at)) errors.push("identity.generated_at is required.");
    if (identity.generated_at && Number.isNaN(Date.parse(identity.generated_at))) errors.push("identity.generated_at must be an ISO date string.");
  }

  if (!Array.isArray(registry.assets)) {
    errors.push("assets must be an array.");
    return errors;
  }

  const ids = new Set();
  for (const [index, asset] of registry.assets.entries()) {
    const label = `assets[${index}]`;
    if (!asset || typeof asset !== "object" || Array.isArray(asset)) {
      errors.push(`${label} must be an object.`);
      continue;
    }
    for (const field of ["id", "type", "path", "purpose"]) {
      if (!isNonEmptyString(asset[field])) errors.push(`${label}.${field} is required.`);
    }
    if (isNonEmptyString(asset.id)) {
      if (ids.has(asset.id)) errors.push(`${label}.id '${asset.id}' is duplicated.`);
      ids.add(asset.id);
    }
    if (isNonEmptyString(asset.path)) {
      errors.push(...validateRegistryPath(asset.path, label, rootPath));
    }
  }

  return errors;
}

function validateRegistryPath(assetPath, label, rootPath) {
  const errors = [];
  const normalized = assetPath.replaceAll("\\", "/");
  if (path.isAbsolute(assetPath) || normalized.startsWith("../") || normalized.includes("/../") || normalized === "." || normalized === "") {
    errors.push(`${label}.path '${assetPath}' must be a relative path inside the workspace.`);
  }
  if (rootPath) {
    const resolvedRoot = path.resolve(rootPath);
    const resolvedTarget = path.resolve(rootPath, ...normalized.split("/"));
    if (resolvedTarget !== resolvedRoot && !resolvedTarget.startsWith(`${resolvedRoot}${path.sep}`)) {
      errors.push(`${label}.path '${assetPath}' escapes the workspace root.`);
    }
  }
  return errors;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
