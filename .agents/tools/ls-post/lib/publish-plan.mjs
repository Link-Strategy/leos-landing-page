// Decide which targets still need publishing, so a partially failed asset can be retried
// without re-posting to platforms that already succeeded. Pure — covered by test/publish-plan.test.js.

/** All publish targets of an asset: "blog" and/or social platforms. */
export function getPublishTargets(asset, socialPlatforms) {
  if (asset.platform === "blog") return ["blog"];
  if (asset.platform === "multi") return [...socialPlatforms];
  return socialPlatforms.includes(asset.platform) ? [asset.platform] : [];
}

/** Targets that have not succeeded yet (never attempted, failed, or skipped for a missing token). */
export function getPendingTargets(targets, previousResults = []) {
  const succeeded = new Set(previousResults.filter((r) => r && r.ok).map((r) => r.platform));
  return targets.filter((t) => !succeeded.has(t));
}

/** Previous results with each retried target replaced by its newest result. */
export function mergePublishResults(previousResults = [], newResults = []) {
  const retried = new Set(newResults.map((r) => r.platform));
  return [...previousResults.filter((r) => !retried.has(r.platform)), ...newResults];
}
