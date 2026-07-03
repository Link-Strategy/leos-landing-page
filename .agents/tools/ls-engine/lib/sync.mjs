import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { copyDir, copyFile, ensureDir, exists, generateTierAssetRegistry, listFiles, readJson, readText, relative, toPosix, writeText } from "./fs-utils.mjs";
import { renderSatelliteGeminiTemplate } from "./gemini-template.mjs";
import { mergePackageContract } from "./package-contract.mjs";
import { run, runOut } from "./process-utils.mjs";

export function pushRules(runtime) {
  const hand = requireHand(runtime);
  const projectPath = runtime.resolvePath(hand.path);
  console.log(`[SYNC] Pushing rules to ${hand.id}: ${projectPath}`);
  syncRulesToSatellite(runtime, projectPath, hand.remote_url);
}

function syncRulesToSatellite(runtime, projectPath, remoteUrl) {
  if (!exists(projectPath)) return;
  const staging = fs.mkdtempSync(path.join(os.tmpdir(), "ls-sync-push-"));
  try {
    run("git", ["clone", "--depth", "1", remoteUrl, "."], { cwd: staging });
    copyProfile(projectPath, staging);
    const allMappings = syncGovernanceToWorkspace(runtime, staging);

    const roots = [...new Set(["slicing-profile.json", ...allMappings.map(m => m.target.split("/")[0])])].filter(f => exists(path.join(staging, f)));
    if (roots.length > 0) {
      run("git", ["add", ...roots], { cwd: staging });
      if ((run("git", ["status", "--porcelain"], { cwd: staging, capture: true }).stdout || "").trim()) {
        run("git", ["commit", "-m", "chore(sync): [skip ci] push updated Governance and rules"], { cwd: staging });
        run("git", ["push", "origin", "main", "--force-with-lease"], { cwd: staging });
      }
    }
  } finally { fs.rmSync(staging, { recursive: true, force: true }); }
}

export function syncGovernanceToWorkspace(runtime, projectPath) {
  const profile = exists(path.join(projectPath, "slicing-profile.json")) ? readJson(path.join(projectPath, "slicing-profile.json")) : { mappings: [] };
  const allMappings = (Array.isArray(profile.mappings) ? profile.mappings : []).filter(mapping => {
    const source = runtime.resolvePath(mapping.source);
    return exists(source);
  });

  for (const mapping of allMappings) {
    const source = runtime.resolvePath(mapping.source);
    const target = path.join(projectPath, mapping.target);
    if (!exists(source)) continue;

    const name = path.basename(target);
    if (name === "asset-index.json") generateTierAssetRegistry(source, target, "hands", allMappings);
    else if (name === "GEMINI.md") writeText(target, renderSatelliteGeminiTemplate(readText(source), allMappings, profile.harvesting || []));
    else if (!name.match(/02_DECISION_LOGS\.md|03_LOGS\.md/)) {
      if (exists(target)) fs.rmSync(target, { recursive: true, force: true });
      if (fs.statSync(source).isDirectory()) copyDir(source, target);
      else copyFile(source, target);
    }
  }

  return allMappings;
}

export async function pullCode(runtime) {
  const hand = requireHand(runtime);
  const projectPath = runtime.resolvePath(hand.path);
  const gateRun = assertRemoteCiPassed(runtime, hand.remote_url, runtime.args["remote-branch"] || "main");
  
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "ls-harvest-"));
  try {
    run("git", ["init"], { cwd: temp });
    run("git", ["remote", "add", "origin", hand.remote_url], { cwd: temp });
    // Fetch specifically the SHA we want
    run("git", ["fetch", "--depth", "1", "origin", gateRun.sha], { cwd: temp });
    run("git", ["checkout", "FETCH_HEAD"], { cwd: temp });

    harvestTrackedSnapshot(temp, runtime.root, projectPath);
    const evidence = downloadGateReports(runtime, projectPath, gateRun);
    updateHandsRegistryAfterHarvest(runtime, projectPath, gateRun.sha, evidence, gateRun);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
}

function requireHand(runtime) {
  const handId = runtime.requireArg("hand");
  const registry = readJson(runtime.resolvePath("active-hands.json"));
  const hand = (registry.hands || []).find(item => item.id === handId);
  if (!hand) throw new Error(`Hand ID '${handId}' not found in active-hands.json.`);
  if (!hand.remote_url) throw new Error(`Hand '${handId}' is missing remote_url in active-hands.json.`);
  return hand;
}

export function harvestTrackedSnapshot(sourceRoot, monolithRoot, projectPath) {
  const profilePath = projectPath && exists(path.join(projectPath, "slicing-profile.json"))
    ? path.join(projectPath, "slicing-profile.json")
    : path.join(sourceRoot, "slicing-profile.json");
  const profile = readJson(profilePath);

  // Step 1: Harvest explicitly declared items (explicit source → custom target in monolith)
  (profile.harvesting || []).forEach(h => {
    const src = safeJoin(sourceRoot, h.source);
    const dest = safeJoin(monolithRoot, h.target);
    if (exists(src)) {
      if (fs.statSync(src).isDirectory()) { pruneStale(src, dest); copyDir(src, dest); }
      else copyFile(src, dest);
    }
  });

  // Step 2: Auto-harvest remaining Hands-created files (hybrid approach)
  // Rule: harvest everything in satellite root EXCEPT:
  //   - Brain-owned: root-level names from mappings[] targets (DNA Brain pushed down)
  //   - Already covered: root-level names from harvesting[] sources (handled in Step 1)
  //   - Denied: deny_prefixes from provisioning policy + hardcoded essentials
  if (!projectPath) return;

  // Build Brain-owned exclusion set from root-level name of each mapping target
  const brainOwned = new Set(["slicing-profile.json"]);
  (profile.mappings || []).forEach(m => {
    const rootName = toPosix(m.target).split("/")[0];
    if (rootName) brainOwned.add(rootName);
  });

  // Build already-covered set from root-level name of each harvesting source
  const explicitlyCovered = new Set();
  (profile.harvesting || []).forEach(h => {
    const rootName = toPosix(h.source).split("/")[0];
    if (rootName) explicitlyCovered.add(rootName);
  });

  // Build deny set from profile + hardcoded essentials
  const denied = new Set([
    ".git", "node_modules", "dist", "build",
    ...(profile.provisioning?.delivery_policy?.deny_prefixes || [])
      .map(p => p.replace(/\/+$/, "")),
  ]);

  // Scan root of satellite and auto-harvest extras to projectPath
  for (const entry of fs.readdirSync(sourceRoot, { withFileTypes: true })) {
    const name = entry.name;
    if (brainOwned.has(name) || explicitlyCovered.has(name) || denied.has(name)) continue;
    const src = path.join(sourceRoot, name);
    const dest = path.join(projectPath, name);
    console.log(`[HARVEST] Auto-harvesting: ${name}`);
    if (entry.isDirectory()) { pruneStale(src, dest); copyDir(src, dest); }
    else copyFile(src, dest);
  }
}

function copyProfile(sourceRoot, targetRoot) {
  const source = path.join(sourceRoot, "slicing-profile.json");
  if (exists(source)) copyFile(source, path.join(targetRoot, "slicing-profile.json"));
}

function normalize(v) { return toPosix(String(v || "").trim()).replace(/\/+$/g, ""); }
function safeJoin(root, rel) {
  const n = normalize(rel);
  if (!n || n.startsWith("../") || n.includes("/../") || path.isAbsolute(n)) throw new Error(`Unsafe path: ${rel}`);
  const t = path.resolve(root, ...n.split("/"));
  if (!t.startsWith(path.resolve(root))) throw new Error(`Path escapes root: ${rel}`);
  return t;
}
function pruneStale(src, dest) {
  if (!exists(dest)) return;
  const files = new Set(fs.readdirSync(src));
  fs.readdirSync(dest).forEach(e => { if (!files.has(e)) fs.rmSync(path.join(dest, e), { recursive: true, force: true }); });
}

export function assertRemoteCiPassed(runtime, url, branch = "main") {
  const repo = parseGitHubRepo(url);
  if (!repo) {
    const sha = runOut("git", ["ls-remote", url, `refs/heads/${branch}`]).split(/\s+/)[0];
    console.warn(`[SYNC] Non-GitHub remote: ${url}. Bypassing CI check.`);
    return { sha, repo: { owner: "local", name: "local" }, runId: "0", workflowName: "local" };
  }

  // Fetch the last 20 successful runs on this branch
  const res = JSON.parse(run("gh", ["api", `/repos/${repo.owner}/${repo.name}/actions/runs?branch=${encodeURIComponent(branch)}&status=success&per_page=20`], { capture: true }).stdout);
  const runs = res.workflow_runs || [];
  
  // Find the first successful Hands delivery (skip automated brain syncs)
  const handsRun = runs.find(r => {
    const msg = r.head_commit?.message || "";
    return !msg.startsWith("chore(sync):") && !msg.startsWith("chore(init):");
  });

  if (!handsRun) {
    throw new Error(`No successful Hands CI run found on branch '${branch}'. (Checked last 20 runs)`);
  }

  console.log(`[SYNC] Found latest successful Hands delivery: ${handsRun.head_sha.substring(0, 7)} ("${handsRun.head_commit.message.split("\n")[0]}")`);
  return { 
    sha: handsRun.head_sha, 
    repo, 
    runId: String(handsRun.id), 
    workflowName: handsRun.name 
  };
}

export function downloadGateReports(runtime, projectPath, runInfo) {
  const dir = path.join(projectPath, "report");
  if (exists(dir)) fs.rmSync(dir, { recursive: true, force: true });
  ensureDir(dir);
  if (runInfo.runId === "0") {
    // Mock report for local tests
    const emptyHash = "0000000000000000000000000000000000000000000000000000000000000000";
    writeText(path.join(dir, "GATE_REPORT.md"), `Integrity-Hash: ${emptyHash}\n`);
    writeText(path.join(dir, "gate-manifest.json"), JSON.stringify({ project_hash: emptyHash, files: {} }, null, 2) + "\n");
    writeText(path.join(dir, "delivery-receipt.json"), JSON.stringify({ tool: "ls-gitpush", gate_hash: emptyHash, changed_files: [] }, null, 2) + "\n");
  } else {
    run("gh", ["run", "download", runInfo.runId, "--repo", `${runInfo.repo.owner}/${runInfo.repo.name}`, "--pattern", "gate-report", "--dir", dir]);
  }
  listFiles(dir).forEach(f => { 
    if (["GATE_REPORT.md", "gate-manifest.json", "delivery-receipt.json"].includes(path.basename(f))) {
      const dest = path.join(dir, path.basename(f));
      if (f !== dest) fs.renameSync(f, dest);
    }
  });

  // Clean up any empty subdirectories created by gh run download
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    if (entry.isDirectory()) {
      const subDir = path.join(dir, entry.name);
      if (fs.readdirSync(subDir).length === 0) fs.rmSync(subDir, { recursive: true, force: true });
    }
  });

  const report = listFiles(dir).find(f => path.basename(f) === "GATE_REPORT.md");
  const manifest = listFiles(dir).find(f => path.basename(f) === "gate-manifest.json");
  const receipt = listFiles(dir).find(f => path.basename(f) === "delivery-receipt.json");

  if (!report) throw new Error(`GATE_REPORT.md not found in downloaded artifacts for run ${runInfo.runId}`);
  if (!manifest) throw new Error(`gate-manifest.json not found in downloaded artifacts for run ${runInfo.runId}`);
  if (!receipt) throw new Error(`delivery-receipt.json not found in downloaded artifacts for run ${runInfo.runId}`);

  const reportContent = readText(report);
  const hashMatch = reportContent.match(/Integrity-Hash:\s*`?([A-Fa-f0-9]{64})`?/);
  if (!hashMatch) throw new Error(`GATE_REPORT.md does not contain a valid Integrity-Hash for run ${runInfo.runId}`);
  
  return { 
    last_gate_hash: hashMatch[1].toUpperCase(), 
    delivery_receipt_hash: createHash("sha256").update(fs.readFileSync(receipt)).digest("hex").toUpperCase(), 
    gate_report_path: relative(runtime.root, report), 
    gate_manifest_path: relative(runtime.root, manifest), 
    delivery_receipt_path: relative(runtime.root, receipt) 
  };
}

function updateHandsRegistryAfterHarvest(runtime, projectPath, sha, evidence, runInfo) {
  const regPath = runtime.resolvePath("active-hands.json");
  if (!exists(regPath)) return;
  const reg = readJson(regPath);
  const rel = toPosix(path.relative(runtime.root, projectPath));
  const hand = reg.hands?.find(h => toPosix(h.path) === rel || toPosix(h.path) === `./${rel}`);
  if (hand) { Object.assign(hand, { last_sha: sha, ci_status: "success", gate_run_id: runInfo.runId, harvested_at: new Date().toISOString(), ...evidence }); writeText(regPath, JSON.stringify(reg, null, 2) + "\n"); }
}

export function parseGitHubRepo(url) {
  const m = url.match(/github\.com[/:]([^/]+)\/(.+?)(?:\.git)?$/i);
  return m ? { owner: m[1], name: m[2] } : null;
}
