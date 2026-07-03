import fs from "node:fs";
import path from "node:path";
import { assetFromMapping, validateAssetRegistry } from "./asset-registry.mjs";
import { copyDir, copyDirWithRuleActivation, copyFile, copyIfExists, ensureDir, exists, readJson, readText, toPosix, writeText } from "./fs-utils.mjs";
import { mergeBrainPackageContract } from "./package-contract.mjs";
import { run, runOut } from "./process-utils.mjs";

export async function newProject(runtime) {
  const projectName = runtime.requireArg("project-name");
  const basePath = runtime.args["base-path"] || process.env.LS_BASE_PATH || "..";
  const projectDirName = projectName;
  const projectPath = runtime.resolvePath(basePath, projectDirName);
  const targetTier = "brain";
  const templateDir = runtime.resolvePath(".agents/templates");

  printSystemSnapshot(runtime);
  validateEnvironment(runtime);
  checkDependencies(runtime);
  validateIsolation(runtime, projectPath);

  const isUpdate = !!runtime.args["update"];
  const isForce = !!runtime.args["force-local"];

  if (exists(projectPath)) {
    if (isUpdate) {
      console.log(`[UPDATE] Existing project detected. Synchronizing Governance to: ${projectPath}`);
    } else if (isForce) {
      console.log(`[FORCE] Removing existing project directory for clean initialization: ${projectPath}`);
      fs.rmSync(projectPath, { recursive: true, force: true });
    } else {
      console.warn(`Project already exists: ${projectPath}`);
      console.warn(`To update Governance without deleting data, use: --update`);
      console.warn(`To overwrite the local workspace completely, use: --force-local`);
      return;
    }
  }

  const registryPath = runtime.resolvePath("active-projects.json");
  if (!exists(registryPath)) {
    throw new Error("[PREFLIGHT FAIL] active-projects.json missing. Cannot read blueprint.");
  }

  const registry = readJson(registryPath);
  const blueprint = registry.blueprint;

  if (!blueprint) {
    throw new Error("[PREFLIGHT FAIL] No 'blueprint' found in active-projects.json. Cannot initialize project.");
  }

  try {
    // 1. Ensure required directories
    for (const dir of (blueprint.ensure_dirs || [])) {
      ensureDir(path.join(projectPath, dir));
    }

    // 2. Git Init (Skip if update)
    if (!isUpdate) {
      run("git", ["init"], { cwd: projectPath });
    }

    // 3. Process all Sync blocks (Directories and Files)
    const syncs = blueprint.sync || [];
    for (const item of syncs) {
      const src = runtime.resolvePath(item.src);
      const dest = path.join(projectPath, item.dest);

      if (!exists(src)) continue;

      const stat = fs.statSync(src);
      if (stat.isDirectory()) {
        if (item.activate !== undefined) {
          copyDirWithRuleActivation(src, dest, item.activate);
        } else {
          copyDir(src, dest);
        }
      } else {
        // File mapping
        if (item.activate) {
          let content = fs.readFileSync(src, "utf8");
          // Replace placeholders
          content = content.replace(/\[PROJECT_NAME\]/g, projectName);
          content = content.replace(/\[PROJECT_ID\]/g, projectName.toLowerCase());

          // Trigger activation
          content = content.replace(/trigger:\s*["']?on_demand["']?/g, 'trigger: always_on');

          writeText(dest, content);
        } else if (path.basename(item.dest) === ".env.example") {
          copyIfExists(src, dest);
        } else {
          copyFile(src, dest);
        }
      }
    }

    // 4. Ensure empty blueprint directories are tracked by Git
    for (const dir of (blueprint.ensure_dirs || [])) {
      const fullDir = path.join(projectPath, dir);
      if (exists(fullDir) && fs.readdirSync(fullDir).length === 0) {
        const dirName = path.basename(dir).toUpperCase();
        writeText(path.join(fullDir, "README.md"), `# ${dirName}\n\nThis directory is part of the Link Strategy project structure.`);
      }
    }

    // 3. Initialize Satellite Registry for Brain Tier
    if (targetTier === "brain") {
      const activeHandsPath = path.join(projectPath, "active-hands.json");
      if (!exists(activeHandsPath)) {
        const templatePath = runtime.resolvePath(".agents/templates/ACTIVE_HANDS_TEMPLATE.json");
        if (exists(templatePath)) {
          let content = readText(templatePath);
          // Initialize with empty hands array but keeping the schema structure if needed, 
          // or just copy the template if it's meant to be a starting point.
          // For a new project, we want an empty hands array.
          const templateObj = JSON.parse(content);
          templateObj.hands = []; 
          writeText(activeHandsPath, JSON.stringify(templateObj, null, 2) + "\n");
        } else {
          writeText(activeHandsPath, JSON.stringify({ hands: [] }, null, 2) + "\n");
        }
      }
    }

    // 4. Generate Project Registry (Agent-Native index)
    generateProjectRegistry(projectPath, projectDirName, blueprint, targetTier);

    mergeBrainPackageContract(path.join(projectPath, "package.json"), { name: projectDirName.toLowerCase() });

  const readmeContent = `# BRAIN PROJECT: ${projectDirName}

- Created: ${new Date().toISOString().slice(0, 10)}
- Source Master: ${toPosix(path.resolve(runtime.root))}

## Brain Command Center

1. [GEMINI.md](GEMINI.md) - Project Constitution
2. [docs/](docs/) - Project documents managed freely by Brain
3. [active-hands.json](active-hands.json) - Hands/Satellite Registry

## Project Operations

- Choose the architecture path for Hands, for example \`./services/[NAME]\` or \`./app/[NAME]\`
- Create Hands folder: \`npm run new-hand -- --path ./services/[NAME]\`, then provision it with \`npm run init-hand -- --project-path ./services/[NAME] --repo-name [REPO]\`
- Harvest Code: \`npm run pull-code -- --hand [HAND_ID]\`
- Sync Rules: \`npm run push-rules -- --hand [HAND_ID]\`
`;
  writeText(path.join(projectPath, "README.md"), readmeContent);

    generateProjectRegistry(projectPath, projectDirName, blueprint, "brain");

    let remoteUrl = "";
    if (!isUpdate) {
      remoteUrl = initializeProjectRemote(runtime, projectPath, projectDirName);
      updateRegistry(runtime, projectDirName, projectPath, remoteUrl, `Automatically generated Brain Project.`);
    } else {
      console.log(`[UPDATE] Governance synchronization complete for '${projectDirName}'.`);
      // Auto-commit and push Governance updates if Git is present
      try {
        if (exists(path.join(projectPath, ".git"))) {
          run("git", ["add", "."], { cwd: projectPath });
          const status = runOut("git", ["status", "--porcelain"], projectPath);
          if (status) {
            run("git", ["commit", "-m", "chore(sync): update Governance assets from master"], { cwd: projectPath });
            run("git", ["push", "origin", "main"], { cwd: projectPath, allowFailure: true });
            console.log(`[UPDATE] Governance changes pushed to remote repository.`);
          } else {
            console.log(`[UPDATE] No changes detected. Remote is already in sync.`);
          }
        }
      } catch (pushError) {
        console.warn(`[UPDATE WARNING] Governance sync push failed: ${pushError.message}`);
      }
    }

    printVerificationReport(projectPath, projectDirName, remoteUrl);
  } catch (error) {
    console.error(`[FATAL ERROR] Project initialization failed: ${error.message}`);
    if (exists(projectPath)) {
      console.log(`[CLEANUP] Removing incomplete project directory: ${projectPath}`);
      if (canCleanupProjectPath(runtime, projectPath)) {
         fs.rmSync(projectPath, { recursive: true, force: true });
      } else {
        console.warn(`[CLEANUP] Skipped unsafe cleanup target: ${projectPath}`);
      }
    }
    throw error;
  }
}

function canCleanupProjectPath(runtime, projectPath) {
  const absoluteMaster = path.resolve(runtime.root);
  const absoluteProject = path.resolve(projectPath);
  const parent = path.resolve(absoluteMaster, runtime.args["base-path"] || process.env.LS_BASE_PATH || "..");
  return absoluteProject !== absoluteMaster &&
    path.dirname(absoluteProject) === parent &&
    path.basename(absoluteProject).length > 0;
}

function printSystemSnapshot(runtime) {
  const registryPath = runtime.resolvePath("active-projects.json");
  const registry = exists(registryPath) ? readJson(registryPath) : { projects: [] };
  const projectCount = registry.projects?.length || 0;

  console.log("\n" + "-".repeat(60));
  console.log("LINK STRATEGY MASTER - SYSTEM SNAPSHOT");
  console.log("-".repeat(60));
  console.log(`[STATE] Master Path  : ${toPosix(path.resolve(runtime.root))}`);
  console.log(`[STATE] Registry     : ${projectCount} Active Projects`);
  console.log(`[STATE] Governance   : ENFORCED (ls-rule-master-governance)`);
  console.log(`[STATE] Organization : ${process.env.LS_ORGANIZATION || "Link-Strategy"}`);
  console.log("-".repeat(60) + "\n");
}

function validateEnvironment(runtime) {
  const required = ["asset-index.json", "active-projects.json", ".agents/rules/ls-rule-master-governance.md"];
  for (const file of required) {
    if (!exists(runtime.resolvePath(file))) {
      throw new Error(`[PREFLIGHT FAIL] Missing master asset: ${file}. Ensure you are running in the Master Workspace.`);
    }
  }
}

function checkDependencies(runtime) {
  const deps = [
    { name: "git", cmd: ["git", "--version"] }
  ];
  if (!runtime.args["no-github"]) deps.push({ name: "gh", cmd: ["gh", "--version"] });
  for (const dep of deps) {
    try {
      run(dep.cmd[0], dep.cmd.slice(1), { capture: true });
    } catch (e) {
      throw new Error(`[DEPENDENCY FAIL] '${dep.name}' is not installed or not in PATH.`);
    }
  }
}

function validateIsolation(runtime, projectPath) {
  const absoluteMaster = path.resolve(runtime.root);
  const absoluteProject = path.resolve(projectPath);

  // Prevent nesting project inside Master
  if (absoluteProject.startsWith(absoluteMaster) && absoluteProject !== absoluteMaster) {
    throw new Error(`[ISOLATION VIOLATION] Cannot create project workspace inside the Master Workspace directory.\nTarget: ${absoluteProject}\nMaster: ${absoluteMaster}\nUse '--base-path ..' to create it as a sibling.`);
  }
}

function generateProjectRegistry(projectPath, projectName, blueprint, targetTier) {
  const assets = [];

  // Transform all Sync blocks into assets
  const syncs = blueprint.sync || [];
  for (const item of syncs) {
    const dest = item.dest || item.target;
    if (!dest || !exists(path.join(projectPath, dest))) continue;
    assets.push(assetFromMapping(item, { fallbackPurpose: "Synchronized project assets." }));
  }

  // Add Brain-specific assets
  if (targetTier === "brain") {
    assets.push({
      id: "active-hands",
      type: "Dataset",
      path: "active-hands.json",
      purpose: "Registry of managed Satellite repos."
    });
  }

  const registry = {
    identity: {
      name: `${projectName} Registry`,
      tier: targetTier,
      version: "1.0.0",
      generated_at: new Date().toISOString()
    },
    assets
  };

  const errors = validateAssetRegistry(registry, { rootPath: projectPath, requireGeneratedAt: true });
  if (errors.length) throw new Error(`Invalid generated project registry:\n${errors.map((error) => ` - ${error}`).join("\n")}`);

  writeText(path.join(projectPath, "asset-index.json"), JSON.stringify(registry, null, 2) + "\n");
}

function printVerificationReport(projectPath, projectName, remoteUrl) {
  const report = [
    "",
    "=".repeat(60),
    `VERIFICATION REPORT: ${projectName}`,
    "=".repeat(60),
    `[x] Workspace      : ${projectPath}`,
    `[x] Governance Sync : Rules, Workflows, Engine, Skills`,
    `[x] Registry       : Registered in active-projects.json`,
    `[x] GitHub Remote  : ${remoteUrl || "SKIPPED/FAILED"}`,
    "=".repeat(60),
    `STATUS: SUCCESS - Brain Project '${projectName}' is initialized.`,
    "=".repeat(60),
    ""
  ];
  console.log(report.join("\n"));
}

export function newHandFolder(runtime) {
  const folderPath = runtime.resolvePath(runtime.requireArg("path"));
  const templateDir = runtime.resolvePath(".agents/templates");
  const profileTemplatePath = path.join(templateDir, "SLICING_PROFILE_TEMPLATE.json");

  if (!exists(profileTemplatePath)) {
    throw new Error("[PACKAGING ERROR] SLICING_PROFILE_TEMPLATE.json not found. Cannot determine packaging rules.");
  }

  const profileTemplate = readJson(profileTemplatePath);
  const templates = profileTemplate.packaging?.templates || [];

  ensureDir(folderPath);


  for (const tpl of templates) {
    const src = path.join(templateDir, tpl.src);
    const dest = path.join(folderPath, tpl.dest);
    if (!exists(dest)) {
      if (exists(src)) {
        copyFile(src, dest);
        console.log(`[PACKAGING] Created: ${tpl.dest}`);
      } else {
        console.warn(`[PACKAGING] Warning: Template source not found: ${tpl.src}`);
      }
    } else {
      console.log(`[PACKAGING] Already exists: ${tpl.dest}`);
    }
  }

  // 1. Generate Filtered package.json (Whitelist for Hands)
  const rootPackagePath = runtime.resolvePath("package.json");
  if (exists(rootPackagePath)) {
    const rootPkg = readJson(rootPackagePath);
    const handPkg = {
      name: path.basename(folderPath).toLowerCase(),
      version: rootPkg.version || "1.0.0",
      description: `Satellite service: ${path.basename(folderPath)}`,
      private: true,
      type: rootPkg.type || "module",
      scripts: {},
      dependencies: {},
      devDependencies: {}
    };

    const scriptWhitelist = ["verify-gate", "verify-delivery", "ls-gitpush", "test", "verify-contracts"];
    if (rootPkg.scripts) {
      for (const key of scriptWhitelist) {
        if (rootPkg.scripts[key]) {
          handPkg.scripts[key] = rootPkg.scripts[key];
        }
      }
    }

    const devDepWhitelist = [];
    if (rootPkg.devDependencies) {
      for (const dep of devDepWhitelist) {
        if (rootPkg.devDependencies[dep]) {
          handPkg.devDependencies[dep] = rootPkg.devDependencies[dep];
        }
      }
    }

    writeText(path.join(folderPath, "package.json"), JSON.stringify(handPkg, null, 2) + "\n");
    console.log(`[PACKAGING] Generated filtered package.json`);
  }

  // 2. Adjust Slicing Profile (Remove package-config to prevent overwriting during init)
  const localProfilePath = path.join(folderPath, "slicing-profile.json");
  if (exists(localProfilePath)) {
    let profileContent = readText(localProfilePath);
    const relPath = toPosix(path.relative(runtime.root, folderPath));

    // Auto-replace {{SERVICE_PATH}} with the actual relative path
    profileContent = profileContent.replace(/\{\{SERVICE_PATH\}\}/g, relPath);

    const profile = JSON.parse(profileContent);
    if (Array.isArray(profile.mappings)) {
      profile.mappings = profile.mappings.filter(m => m.id !== "package-config");
    }

    writeText(localProfilePath, JSON.stringify(profile, null, 2) + "\n");
    console.log(`[PACKAGING] Adjusted slicing-profile.json (replaced {{SERVICE_PATH}} and cleaned mappings)`);

    // 3. Create Mandatory Paths early (Phase 1)
    const mandatoryPaths = profile.provisioning?.mandatory_paths || ["src", "test"];
    for (const p of mandatoryPaths) {
      const fullPath = path.join(folderPath, p);
      ensureDir(fullPath);
      if (fs.readdirSync(fullPath).length === 0) {
        writeText(path.join(fullPath, ".gitkeep"), "");
        console.log(`[PACKAGING] Created mandatory folder: ${p}/.gitkeep`);
      }
    }
  }

  console.log(`\nSUCCESS: Handover Package initialized at ${folderPath}`);
  console.log(`Next step: Edit Spec and Slicing Profile, then run 'init-hand'.\n`);
}





function updateRegistry(runtime, id, projectPath, remoteUrl, description) {
  const registryPath = runtime.resolvePath("active-projects.json");

  if (!exists(registryPath)) {
    throw new Error(`[REGISTRY ERROR] Mandatory file 'active-projects.json' is missing. Cannot register project.`);
  }

  const registry = readJson(registryPath);
  registry.projects ||= [];

  // Normalize path to be relative to Master root for portability
  const relativePath = toPosix(path.relative(runtime.root, projectPath));

  const entry = {
    id,
    path: relativePath,
    remote_url: remoteUrl || "",
    status: "active",
    description: description || `Brain Project: ${id}`
  };

  const byId = registry.projects.findIndex((p) => p.id === id);
  const byPath = registry.projects.findIndex((p) => p.path === relativePath);

  if (byId >= 0) {
    const existing = registry.projects[byId];
    if (existing.path !== relativePath) {
      console.warn(`[REGISTRY WARNING] Project ID '${id}' moved from ${existing.path} to ${relativePath}`);
    }
    registry.projects[byId] = { ...existing, ...entry };
  } else if (byPath >= 0) {
    console.warn(`[REGISTRY WARNING] Project at path '${relativePath}' renamed from ${registry.projects[byPath].id} to ${id}`);
    registry.projects[byPath] = { ...registry.projects[byPath], ...entry };
  } else {
    registry.projects.push(entry);
  }

  // Create backup before writing
  copyFile(registryPath, `${registryPath}.bak`);

  writeText(registryPath, JSON.stringify(registry, null, 2) + "\n");
}

function initializeProjectRemote(runtime, projectPath, projectDirName) {
  if (runtime.args["no-github"]) {
    if (!exists(path.join(projectPath, ".git"))) run("git", ["init"], { cwd: projectPath });
    ensureGitIdentity(projectPath);
    run("git", ["add", "."], { cwd: projectPath });
    if (runOut("git", ["status", "--porcelain"], projectPath)) {
      run("git", ["commit", "-m", "chore(init): initialize brain project"], { cwd: projectPath });
    }
    run("git", ["branch", "-M", "main"], { cwd: projectPath });
    return "";
  }

  const organization = process.env.LS_ORGANIZATION || "Link-Strategy";
  const repoName = projectDirName;
  const visibility = process.env.LS_VISIBILITY || "--private";
  try {
    if (!exists(path.join(projectPath, ".git"))) run("git", ["init"], { cwd: projectPath });
    ensureGitIdentity(projectPath);

    // Attempt to create. If it fails, we will try to fetch the existing one.
    run("gh", ["repo", "create", `${organization}/${repoName}`, visibility, "--source=.", "--remote=origin"], {
      cwd: projectPath,
      allowFailure: true
    });

    // If origin still doesn't exist, it means gh repo create failed (likely because repo existed)
    // and didn't add the remote. We must add it manually.
    const currentRemotes = runOut("git", ["remote"], projectPath, true);
    if (!currentRemotes.includes("origin")) {
      const targetUrl = `https://github.com/${organization}/${repoName}`;
      run("git", ["remote", "add", "origin", targetUrl], { cwd: projectPath });
    }

    const remoteUrl = runOut("git", ["remote", "get-url", "origin"], projectPath, true) || `https://github.com/${organization}/${repoName}`;

    // Check if remote has existing content
    const remoteRefs = runOut("git", ["ls-remote", "origin"], projectPath, true);
    const isDirtyRemote = remoteRefs.trim().length > 0;
    const forcePush = runtime.args["overwrite-remote"];

    if (isDirtyRemote && !forcePush) {
      console.warn(`[REMOTE SAFETY] Remote repository already has content. Initialization will NOT overwrite it.`);
      console.warn(`[REMOTE SAFETY] To force overwrite, run with: --overwrite-remote`);
      return remoteUrl.trim(); // Exit early but return URL for registry
    }

    run("git", ["add", "."], { cwd: projectPath });
    if (runOut("git", ["status", "--porcelain"], projectPath)) {
      run("git", ["commit", "-m", "chore(init): initialize brain project"], { cwd: projectPath });
    }
    run("git", ["branch", "-M", "main"], { cwd: projectPath });

    // Use --force-with-lease only if we are overwriting, otherwise just push
    const pushArgs = ["push", "-u", "origin", "main"];
    if (forcePush) pushArgs.push("--force");

    run("git", pushArgs, { cwd: projectPath, allowFailure: true });

    return remoteUrl.trim();
  } catch (error) {
    console.warn(`Project remote synchronization failed: ${error.message}`);
    return `https://github.com/${organization}/${repoName}`;
  }
}

function ensureGitIdentity(projectPath) {
  const email = runOut("git", ["config", "user.email"], projectPath, true);
  const name = runOut("git", ["config", "user.name"], projectPath, true);
  if (!email) run("git", ["config", "user.email", "ls-engine@example.local"], { cwd: projectPath });
  if (!name) run("git", ["config", "user.name", "LS Engine"], { cwd: projectPath });
}
