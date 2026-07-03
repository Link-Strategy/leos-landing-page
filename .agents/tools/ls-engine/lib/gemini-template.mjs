import { toPosix } from "./fs-utils.mjs";

export const PROTECTED_DNA_PATHS_PLACEHOLDER = "[PROTECTED_DNA_PATHS]";
export const ALLOWED_WORKSPACE_PATHS_PLACEHOLDER = "[ALLOWED_WORKSPACE_PATHS]";
export const HYBRID_DNA_PATHS_PLACEHOLDER = "[HYBRID_DNA_PATHS]";

export function renderSatelliteGeminiTemplate(templateText, mappings, harvesting) {
  let content = templateText;
  content = content.split(PROTECTED_DNA_PATHS_PLACEHOLDER).join(renderProtectedPaths(mappings, harvesting));
  content = content.split(ALLOWED_WORKSPACE_PATHS_PLACEHOLDER).join(renderWorkspacePaths(harvesting, mappings));
  content = content.split(HYBRID_DNA_PATHS_PLACEHOLDER).join(renderHybridPaths(mappings, harvesting));
  return content;
}

function renderProtectedPaths(mappings, harvesting) {
  const harvestTargets = new Set((harvesting || []).map(h => toPosix(h.source)));
  return mappings
    .map(m => toPosix(m.target))
    .filter(t => !harvestTargets.has(t))
    .sort()
    .map(t => `- \`${t}\``)
    .join("\n") || "- (Không có)";
}

function renderHybridPaths(mappings, harvesting) {
  const mappingTargets = new Set((mappings || []).map(m => toPosix(m.target)));
  return (harvesting || [])
    .map(h => toPosix(h.source))
    .filter(s => mappingTargets.has(s))
    .sort()
    .map(s => `- \`${s}\` (Brain-managed baseline)`)
    .join("\n") || "- (Không có)";
}

function renderWorkspacePaths(harvesting, mappings) {
  const mappingTargets = new Set((mappings || []).map(m => toPosix(m.target)));
  return (harvesting || [])
    .map(h => toPosix(h.source))
    .filter(s => !mappingTargets.has(s))
    .sort()
    .map(s => `- \`${s}\``)
    .join("\n") || "- (Toàn bộ workspace trừ DNA)";
}
