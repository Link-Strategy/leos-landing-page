import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { copyDir, copyFile, ensureDir, exists, readJson, writeText } from "./fs-utils.mjs";
import { stageInitialSatelliteFiles } from "./init-hand.mjs";
import { run } from "./process-utils.mjs";
import { harvestTrackedSnapshot, pushRules } from "./sync.mjs";
import { newProject } from "./factory.mjs";

export async function selfTest(runtime) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ls-engine-selftest-"));
  const fixtureBase = path.join(tempRoot, "brain");
  const deliveryRemote = path.join(tempRoot, "delivery-remote.git");
  const harvestTarget = path.join(fixtureBase, "harvest-target");

  try {
    seedSelfTestBrain(runtime, fixtureBase);
    console.log(`[SELF-TEST] fixture root: ${fixtureBase}`);
    
    // Call newProject directly instead of spawning
    const testRuntime = { 
      ...runtime, 
      root: fixtureBase, 
      args: { "project-name": "CROSS", "base-path": "..", "no-github": true },
      resolvePath: (...parts) => path.resolve(fixtureBase, ...parts),
      requireArg: (name) => "CROSS"
    };
    await newProject(testRuntime);
    
    const projectPath = path.join(tempRoot, "CROSS");
    hardenSelfTestProject(projectPath);
    
    // Initialize a fake remote to satisfy pushRules
    const fakeRemote = path.join(tempRoot, "fake-remote.git");
    run("git", ["init", "--bare", fakeRemote]);
    updateRegistryWithRemote(fixtureBase, "CROSS", fakeRemote);
    updateHandsRegistryWithRemote(fixtureBase, projectPath, fakeRemote);

    pushRules({ ...runtime, root: fixtureBase, args: { hand: "CROSS" }, resolvePath: (...parts) => path.resolve(fixtureBase, ...parts), requireArg: name => ({ hand: "CROSS" })[name] });
    
    run("git", ["init"], { cwd: projectPath });
    run("git", ["config", "user.email", "selftest@example.local"], { cwd: projectPath });
    run("git", ["config", "user.name", "LS Engine Self Test"], { cwd: projectPath });
    run("git", ["remote", "add", "origin", fakeRemote], { cwd: projectPath });
    
    stageInitialSatelliteFiles(projectPath);
    run("git", ["add", "."], { cwd: projectPath });
    run("git", ["commit", "-m", "chore(init): initialize satellite fixture"], { cwd: projectPath });
    
    pushRules({ ...runtime, root: fixtureBase, args: { hand: "CROSS" }, resolvePath: (...parts) => path.resolve(fixtureBase, ...parts), requireArg: name => ({ hand: "CROSS" })[name] });

    run("git", ["init", "--bare", deliveryRemote], { cwd: tempRoot });
    run("git", ["remote", "set-url", "origin", deliveryRemote], { cwd: projectPath });
    updateRegistryWithRemote(fixtureBase, "CROSS", deliveryRemote);

    writeText(path.join(projectPath, "src", "features", "selftest", "index.js"), "export const delivered = true;\n");
    writeText(path.join(projectPath, "03_LOGS.md"), "# Logs\n\n- Self-test direct-main delivery.\n");
    
    updateHandsRegistryWithSuccess(fixtureBase, projectPath, deliveryRemote);

    ensureDir(harvestTarget);
    console.log("[SELF-TEST] Harvest phase...");
    harvestTrackedSnapshot(projectPath, fixtureBase);

    if (!exists(path.join(harvestTarget, "src", "features", "selftest", "index.js"))) throw new Error("Self-test harvest did not copy src/features/selftest/index.js.");
    if (!exists(path.join(harvestTarget, "03_LOGS.md"))) throw new Error("Self-test harvest did not copy 03_LOGS.md.");

    console.log("[SELF-TEST] PASS");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function updateRegistryWithRemote(fixtureBase, id, remoteUrl) {
  const regPath = path.join(fixtureBase, "active-projects.json");
  const reg = readJson(regPath);
  reg.projects ||= [];
  let p = reg.projects.find(p => p.id === id);
  if (!p) {
    p = { id, path: `../${id}` };
    reg.projects.push(p);
  }
  p.remote_url = remoteUrl;
  writeText(regPath, JSON.stringify(reg, null, 2) + "\n");
}

function updateHandsRegistryWithRemote(fixtureBase, projectPath, remoteUrl) {
  const regPath = path.join(fixtureBase, "active-hands.json");
  const rel = path.relative(fixtureBase, projectPath).replace(/\\/g, "/");
  const reg = exists(regPath) ? readJson(regPath) : { hands: [] };
  reg.hands ||= [];
  const existing = reg.hands.find(hand => hand.id === "CROSS");
  const entry = { id: "CROSS", path: rel, remote_url: remoteUrl, ci_status: "unknown", last_sha: "", harvested_at: "" };
  if (existing) Object.assign(existing, entry);
  else reg.hands.push(entry);
  writeText(regPath, JSON.stringify(reg, null, 2) + "\n");
}

function updateHandsRegistryWithSuccess(fixtureBase, projectPath, remoteUrl) {
  const regPath = path.join(fixtureBase, "active-hands.json");
  const rel = path.relative(fixtureBase, projectPath).replace(/\\/g, "/");
  const reg = { 
    hands: [{
      id: "CROSS",
      path: rel,
      remote_url: remoteUrl,
      ci_status: "success",
      last_sha: "0000000000000000000000000000000000000000"
    }]
  };
  writeText(regPath, JSON.stringify(reg, null, 2) + "\n");
}

export function stressTest(runtime) {
  const iterations = Number(runtime.args.iterations || 1);
  for (let i = 1; i <= iterations; i += 1) {
    console.log(`[STRESS-TEST] ${i}/${iterations}`);
    selfTest(runtime);
  }
}

function seedSelfTestBrain(runtime, targetRoot) {
  ensureDir(targetRoot);
  [".agents/rules", ".agents/workflows", ".agents/templates", ".agents/tools/ls-engine", ".github", "assets/contracts"].forEach(d => {
    copyDir(runtime.resolvePath(d), path.join(targetRoot, d));
  });
  ["package.json", "asset-index.json"].forEach(f => {
    copyFile(runtime.resolvePath(f), path.join(targetRoot, f));
  });
  
  const masterRulePath = path.join(targetRoot, ".agents/rules/ls-rule-master-governance.md");
  if (!exists(masterRulePath)) {
    writeText(masterRulePath, "# Master Governance\n");
  }

  writeText(path.join(targetRoot, "active-projects.json"), JSON.stringify({ projects: [], blueprint: selfTestBlueprint() }, null, 2));
}

function selfTestBlueprint() {
  return {
    sync: [
      { src: ".agents/rules", dest: ".agents/rules" },
      { src: "package.json", dest: "package.json" }
    ]
  };
}

function hardenSelfTestProject(projectPath) {
  ensureDir(path.join(projectPath, "src/features/selftest"));
  writeText(path.join(projectPath, "01_TASK_SPEC.md"), "# Spec\n");
  writeText(path.join(projectPath, "02_DECISION_LOGS.md"), "# Decisions\n");
  writeText(path.join(projectPath, "03_LOGS.md"), "# Logs\n");
  writeText(path.join(projectPath, "slicing-profile.json"), JSON.stringify({
    mappings: { DNA: [{ id: "pkg", source: "package.json", target: "package.json" }] },
    harvesting: [
      { source: "src/features/selftest/", target: "harvest-target/src/features/selftest/" },
      { source: "03_LOGS.md", target: "harvest-target/03_LOGS.md" }
    ]
  }, null, 2));
  writeText(path.join(projectPath, "package.json"), JSON.stringify({ name: "cross", version: "1.0.0" }, null, 2));
}
