import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { brainOnlyPackageScripts, requiredSatellitePaths } from "./constants.mjs";
import { copyDir, copyFile, ensureDir, exists, readJson, readText, writeText } from "./fs-utils.mjs";
import { gitChangedFiles } from "./git-utils.mjs";
import { run, runOut } from "./process-utils.mjs";
import { syncGovernanceToWorkspace } from "./sync.mjs";

export function initHand(runtime) {
  const projectPath = path.resolve(runtime.args.path || runtime.requireArg("project-path"));
  const repoName = runtime.requireArg("repo-name");

  // 1. Prepare local folder (Brain workspace side)
  // We keep it clean: only Spec, Logs, Profile, and empty mandatory folders
  ensureDir(projectPath);
  ensurePackagingTemplates(runtime, projectPath);

  const profilePath = path.join(projectPath, "slicing-profile.json");
  const profile = exists(profilePath) ? readJson(profilePath) : {};
  const organization = runtime.args.organization || profile.provisioning?.organization || "Link-Strategy";

  const mandatoryPaths = profile.provisioning?.mandatory_paths || ["src", "test"];
  for (const p of mandatoryPaths) {
    const fullPath = path.join(projectPath, p);
    ensureDir(fullPath);
    // Ensure directories exist locally for future harvesting
    if (fs.readdirSync(fullPath).length === 0) {
      writeText(path.join(fullPath, ".gitkeep"), "");
    }
  }

  // 2. Setup Staging Area (Provisioning side)
  const stagingPath = fs.mkdtempSync(path.join(os.tmpdir(), `ls-init-${repoName}-`));
  console.log(`[INIT] Created staging area: ${stagingPath}`);

  try {
    // 3. Populate Staging Area
    // Copy whatever is in local folder (Spec, Profile, etc.) to the staging area
    copyDir(projectPath, stagingPath);

    if (!exists(path.join(stagingPath, ".git"))) {
      run("git", ["init"], { cwd: stagingPath });
    }
    ensureSatelliteGitignore(stagingPath);

    // Sync Governance and Rules to Staging - this is where .agents and .github are added
    console.log("[INIT] Synchronizing Governance and Rules to Staging...");
    syncGovernanceToWorkspace(runtime, stagingPath);

    validateSatelliteLayout(stagingPath);
    stageInitialSatelliteFiles(stagingPath);

    if (runOut("git", ["status", "--porcelain"], stagingPath)) {
      run("git", ["commit", "-m", "chore(init): initialize satellite governance"], { cwd: stagingPath });
    }
    run("git", ["branch", "-M", "main"], { cwd: stagingPath });

    const visibility = runtime.args.public ? "--public" : "--private";
    let remoteUrl = "";
    try {
      // Create repo and push from staging area
      remoteUrl = ensureOriginRemote(stagingPath, organization, repoName, visibility);
      run("git", ["push", "-u", "origin", "main", "--force-with-lease"], { cwd: stagingPath });
    } catch (error) {
      console.warn(`Remote setup failed: ${error.message}`);
      remoteUrl = `https://github.com/${organization}/${repoName}`;
    }

    // 4. Register satellite in Brain's registry (using the local projectPath)
    registerHands(runtime, projectPath, repoName, organization, remoteUrl);

    // 5. Final Cleanup Sweep on local projectPath
    // Remove any accidental infrastructure that might have leaked or existed from before
    const infrastructureToPrune = [".git", ".agents", ".github", "asset-index.json"];
    for (const item of infrastructureToPrune) {
      const fullPath = path.join(projectPath, item);
      if (exists(fullPath)) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`[CLEANUP] Pruned infrastructure from local workspace: ${item}`);
      }
    }

    console.log("\nSATELLITE INITIALIZED & PROVISIONED.");
    console.log(`- Remote Repository: ${remoteUrl}`);
    console.log(`- Local Workspace: ${projectPath} (Clean)`);

  } catch (error) {
    console.error(`[INIT ERROR] ${error.message}`);
    throw error;
  } finally {
    // 6. Cleanup Staging Area
    if (exists(stagingPath)) {
      fs.rmSync(stagingPath, { recursive: true, force: true });
      console.log(`[INIT] Staging area cleaned up: ${stagingPath}`);
    }
  }
}

function ensurePackagingTemplates(runtime, projectPath) {
  const templateDir = runtime.resolvePath(".agents/templates");
  const profileTemplatePath = path.join(templateDir, "SLICING_PROFILE_TEMPLATE.json");
  if (!exists(profileTemplatePath)) return;
  const profileTemplate = readJson(profileTemplatePath);
  const templates = profileTemplate.packaging?.templates || [];
  for (const tpl of templates) {
    const src = path.join(templateDir, tpl.src);
    const dest = path.join(projectPath, tpl.dest);
    if (!exists(dest) && exists(src)) copyFile(src, dest);
  }
}

function registerHands(runtime, projectPath, repoName, organization, remoteUrl) {
  const registryPath = runtime.resolvePath("active-hands.json");
  if (!exists(registryPath)) return;
  const registry = readJson(registryPath);
  registry.hands ||= [];
  const relPath = path.relative(runtime.root, projectPath).replaceAll("\\", "/");

  const entry = {
    id: repoName,
    path: relPath,
    remote_url: remoteUrl,
    last_sha: "",
    ci_status: "unknown",
    gate_run_id: "",
    harvested_at: "",
    gate_report_path: "",
    gate_manifest_path: "",
    delivery_receipt_path: ""
  };

  const byId = registry.hands.findIndex((h) => h.id === repoName);
  const byPath = registry.hands.findIndex((h) => h.path === relPath);

  if (byId >= 0) {
    const existing = registry.hands[byId];
    if (existing.path !== relPath) {
      console.warn(`[REGISTRY WARNING] Satellite ID '${repoName}' moved from ${existing.path} to ${relPath}`);
    }
    registry.hands[byId] = { ...existing, ...entry };
  } else if (byPath >= 0) {
    console.warn(`[REGISTRY WARNING] Satellite at path '${relPath}' renamed from ${registry.hands[byPath].id} to ${repoName}`);
    registry.hands[byPath] = { ...registry.hands[byPath], ...entry };
  } else {
    registry.hands.push(entry);
  }

  writeText(registryPath, JSON.stringify(registry, null, 2) + "\n");
}

export function ensureSatelliteGitignore(projectPath) {
  const gitignorePath = path.join(projectPath, ".gitignore");
  const required = [".env", ".env.*", "!.env.example", "node_modules/", "dist/", "build/", ".gemini/", "GATE_REPORT.md", ".agents/reports/gate-manifest.json"];
  const current = exists(gitignorePath) ? readText(gitignorePath).split(/\r?\n/) : [];
  const next = [...current];
  for (const line of required) {
    if (!next.includes(line)) next.push(line);
  }
  writeText(gitignorePath, `${next.filter(Boolean).join("\n")}\n`);
}

export function validateSatelliteLayout(projectPath) {
  const missing = requiredSatellitePaths.filter((rel) => !exists(path.join(projectPath, rel)));
  if (!exists(path.join(projectPath, "src")) && !exists(path.join(projectPath, "lib"))) {
    missing.push("src or lib");
  }
  if (!exists(path.join(projectPath, "test"))) {
    missing.push("test");
  }
  if (missing.length) throw new Error(`Satellite init is missing required files/folders:\n${missing.map((item) => ` - ${item}`).join("\n")}`);
  const pkg = readJson(path.join(projectPath, "package.json"));
  const brainScripts = [...brainOnlyPackageScripts].filter((name) => pkg.scripts?.[name]);
  if (brainScripts.length) throw new Error(`Satellite package.json exposes Brain-only scripts:\n${brainScripts.map((item) => ` - ${item}`).join("\n")}`);
}

export function stageInitialSatelliteFiles(projectPath) {
  const changed = gitChangedFiles(projectPath);
  const allowed = changed.filter(isInitialSatelliteAllowed);
  const blocked = changed.filter((file) => !isInitialSatelliteAllowed(file));
  if (blocked.length) throw new Error(`Refusing to initialize Satellite with files outside init allowlist:\n${blocked.join("\n")}`);
  if (allowed.length) run("git", ["add", "--", ...allowed], { cwd: projectPath });
}

function isInitialSatelliteAllowed(file) {
  const normalized = file.replaceAll("\\", "/");
  return normalized === ".env.example" ||
    normalized === ".gitignore" ||
    normalized === "GEMINI.md" ||
    normalized === "README.md" ||
    normalized === "01_TASK_SPEC.md" ||
    normalized === "02_DECISION_LOGS.md" ||
    normalized === "03_LOGS.md" ||
    normalized === "asset-index.json" ||
    normalized === "slicing-profile.json" ||
    normalized === "package.json" ||
    normalized === "package-lock.json" ||
    normalized === "npm-shrinkwrap.json" ||
    normalized === "pnpm-lock.yaml" ||
    normalized === "yarn.lock" ||
    normalized === "tsconfig.json" ||
    normalized === "tsconfig.build.json" ||
    normalized === "next-env.d.ts" ||
    normalized === "next.config.js" ||
    normalized === "next.config.mjs" ||
    normalized === "next.config.ts" ||
    normalized === "nest-cli.json" ||
    normalized === "components.json" ||
    normalized === "postcss.config.js" ||
    normalized === "postcss.config.mjs" ||
    normalized === "tailwind.config.js" ||
    normalized === "tailwind.config.ts" ||
    normalized === "vite.config.js" ||
    normalized === "vite.config.ts" ||
    normalized === ".eslintrc.js" ||
    normalized === ".eslintrc.json" ||
    normalized === "eslint.config.js" ||
    normalized === "eslint.config.mjs" ||
    normalized === ".prettierrc" ||
    normalized === "Dockerfile" ||
    normalized === "jest.config.cjs" ||
    normalized === "jest.config.ts" ||
    normalized === "pubspec.yaml" ||
    normalized === "pubspec.lock" ||
    normalized === "pubspec_overrides.yaml" ||
    normalized === "analysis_options.yaml" ||
    normalized === ".metadata" ||
    normalized.startsWith(".agents/") ||
    normalized.startsWith(".github/") ||
    normalized.startsWith("assets/") ||
    normalized.startsWith("components/") ||
    normalized.startsWith("docs/") ||
    normalized.startsWith("infra/") ||
    normalized.startsWith("public/") ||
    normalized.startsWith("scripts/") ||
    normalized.startsWith("src/") ||
    normalized.startsWith("lib/") ||
    normalized.startsWith("test/") ||
    normalized.startsWith("android/") ||
    normalized.startsWith("ios/") ||
    normalized.startsWith("linux/") ||
    normalized.startsWith("macos/") ||
    normalized.startsWith("windows/") ||
    normalized.startsWith("web/");
}

function ensureOriginRemote(projectPath, organization, repoName, visibility) {
  const targetUrl = `https://github.com/${organization}/${repoName}`;
  const existingOrigin = runOut("git", ["remote", "get-url", "origin"], projectPath, true);
  if (existingOrigin) return existingOrigin.trim();

  const result = run("gh", ["repo", "create", `${organization}/${repoName}`, visibility, "--source=.", "--remote=origin"], {
    cwd: projectPath,
    capture: true,
    allowFailure: true
  });

  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "").trim();
    // If repo exists, manually add origin so we can still push
    if (detail.includes("already exists")) {
      console.log(`[INIT] Repo already exists on GitHub. Mapping origin to: ${targetUrl}`);
      run("git", ["remote", "add", "origin", targetUrl], { cwd: projectPath });
      return targetUrl;
    }
    throw new Error(`Failed to create GitHub repo or configure origin. Install/authenticate gh or add origin manually.\n${detail}`);
  }
  return targetUrl;
}
