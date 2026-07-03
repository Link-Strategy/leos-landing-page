import fs from "node:fs";
import path from "node:path";
import { validateAssetRegistry } from "./asset-registry.mjs";

import { exists, listFiles, readJson, readText, relative, sha256, textFileSha256, writeText, toPosix, fileSha256 } from "./fs-utils.mjs";
import { renderSatelliteGeminiTemplate } from "./gemini-template.mjs";
import { run } from "./process-utils.mjs";

/**
 * Governance 2.0: Whitelist-Only Hashing (The Steel Frame)
 * Purely data-driven. Relies exclusively on slicing-profile.json (The SOT).
 * Integrity-Hash = Hash(Mappings - Harvesting)
 */
export function codebaseIntegrity(projectRoot, profile) {
  const mappings = Array.isArray(profile.mappings) ? profile.mappings : [];
  const harvestTargets = (profile.harvesting || []).map(h => toPosix(h.source));
  
  const allMappedFiles = new Set();
  
  mappings.forEach(m => {
    const targetRel = toPosix(m.target);
    const fullPath = path.join(projectRoot, targetRel);
    if (!exists(fullPath)) return;
    
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      listFiles(fullPath).forEach(f => {
        allMappedFiles.add(toPosix(relative(projectRoot, f)));
      });
    } else {
      allMappedFiles.add(targetRel);
    }
  });

  const manifest = Array.from(allMappedFiles)
    .filter(rel => {
      // SOT Principle: If it is marked for harvesting, it is NOT part of the Governance Hash.
      return !harvestTargets.some(h => rel === h || rel.startsWith(h + "/"));
    })
    .sort()
    .map(rel => {
       const fullPath = path.join(projectRoot, rel);
       return `${rel}\t${textFileSha256(fullPath)}`;
    });

  return { hash: sha256(manifest.join("\n")).toUpperCase(), manifest };
}

export async function verifyGate(runtime) {
  const projectPath = process.cwd();
  const failures = [];
  const passes = [];
  const pass = (m) => { passes.push(m); console.log(`[PASS] ${m}`); };
  const fail = (m) => { failures.push(m); console.log(`[FAIL] ${m}`); };

  if (!exists(projectPath)) throw new Error(`Project path missing: ${projectPath}`);
  console.log("--- LINK STRATEGY: VERIFY GATE (UNIFIED POLICY) ---");
  
  const tier = detectProjectTier(projectPath);
  const profile = getProfile(projectPath);
  const gov = profile.provisioning || {};

  if (tier !== "BRAIN") {
    verifyManifestMappings(runtime, projectPath, profile, pass, fail);
  } else {
    // Consolidated Brain Audit logic
    auditSatellites(runtime, projectPath, pass, fail);
  }

  if (tier !== "BRAIN") {
    const templatePath = runtime.resolvePath(".agents/templates/GEMINI_SATELLITE_TEMPLATE.md");
    if (exists(templatePath)) {
      const allMappings = Array.isArray(profile.mappings) ? profile.mappings : [];
      const expected = renderSatelliteGeminiTemplate(readText(templatePath), allMappings, profile.harvesting || []);
      hashMatchExpectedText(expected, path.join(projectPath, "GEMINI.md"), "GEMINI.md", pass, fail);
    } else {
      pass("GEMINI.md dynamic verification skipped (Template not present on Satellite).");
    }
  }

  const mandatory = gov.mandatory_paths || [];
  mandatory.forEach(p => {
    if (exists(path.join(projectPath, p))) pass(`${p} found.`);
    else fail(`${p} is missing.`);
  });

  validateProjectAssetRegistry(projectPath, pass, fail);

  if (tier !== "BRAIN") {
    auditGeneratedDnaCompliance(projectPath).forEach(e => fail(e));
  }

  runTests(projectPath, pass, fail);
  runLint(projectPath, pass, fail);
  verifyContractSync(projectPath, pass, fail);

  const integrity = codebaseIntegrity(projectPath, profile);
  writeGateReport(projectPath, integrity, passes, failures);

  console.log(`STATUS: ${failures.length === 0 ? "PASS" : "FAIL"}`);
  return failures.length === 0;
}

function auditSatellites(runtime, root, pass, fail) {
  const registryPath = path.join(root, "active-hands.json");
  if (!exists(registryPath)) {
    fail("active-hands.json is missing.");
    return;
  }

  try {
    const registry = readJson(registryPath);
    const hands = registry.hands || [];
    pass(`Registry found: ${hands.length} hands registered.`);

    const ids = new Set();
    const paths = new Set();
    for (const hand of hands) {
      if (ids.has(hand.id)) fail(`Duplicate Satellite ID detected: ${hand.id}`);
      if (paths.has(hand.path)) fail(`Duplicate Satellite Path detected: ${hand.path}`);
      ids.add(hand.id);
      paths.add(hand.path);

      // 1. Evidence Validation
      validateHarvestEvidence(hand, root).forEach(e => fail(`Satellite '${hand.id}': ${e}`));

      // 2. Deep Contract Audit
      auditGeneratedDnaCompliance(path.join(root, hand.path)).forEach(e => fail(`Generated DNA Audit '${hand.id}': ${e}`));
    }
  } catch (e) {
    fail(`active-hands.json error: ${e.message}`);
  }


  // 3. Global Quality Audit (Skipped for Zero-npm Architecture)
  // Each satellite is responsible for its own linting.
}

function validateHarvestEvidence(hand, root) {
  const errors = [];
  if (!hand.remote_url) errors.push("remote_url is required.");
  if (!isSha1(hand.last_sha)) errors.push("last_sha invalid.");
  if (!isSha256(hand.last_gate_hash)) errors.push("last_gate_hash invalid.");
  if (!isNonEmptyString(hand.gate_run_id)) errors.push("gate_run_id missing.");
  if (hand.ci_status !== "success") errors.push(`ci_status is '${hand.ci_status}' (must be success).`);

  const requiredEvidence = [
    { p: hand.gate_report_path, l: "gate_report_path" },
    { p: hand.gate_manifest_path, l: "gate_manifest_path" },
    { p: hand.delivery_receipt_path, l: "delivery_receipt_path" }
  ];

  requiredEvidence.forEach(ev => {
    if (!ev.p) {
      errors.push(`${ev.l} is missing or empty in registry.`);
      return;
    }
    const fullPath = path.resolve(root, ev.p);
    if (!exists(fullPath)) {
      errors.push(`${ev.l} file not found: ${ev.p}`);
    }
  });

  if (hand.delivery_receipt_hash && exists(path.resolve(root, hand.delivery_receipt_path))) {
    const actual = fileSha256(path.resolve(root, hand.delivery_receipt_path));
    if (actual !== hand.delivery_receipt_hash.toUpperCase()) {
      errors.push(`delivery_receipt_hash mismatch for ${hand.id}.`);
    }
  }

  return errors;
}

function auditGeneratedDnaCompliance(projectPath) {
  const errors = [];
  const tsconfigPath = path.join(projectPath, "tsconfig.json");

  if (exists(tsconfigPath)) {
    try {
      const tsconfig = readJson(tsconfigPath);
      const paths = tsconfig.compilerOptions?.paths || {};
      validateTsAlias(paths, "@contracts/*", "assets/contracts/generated/typescript", errors);
      validateTsAlias(paths, "@configs/*", "assets/configs/generated/typescript", errors);
    } catch (e) { errors.push(`tsconfig.json error: ${e.message}`); }
  }

  validateJestAliases(projectPath, errors);
  validateGeneratedDnaImports(projectPath, errors);
  validateFlutterConfigDependency(projectPath, errors);
  validateDartConfigLayout(projectPath, errors);

  return errors;
}

function validateTsAlias(paths, alias, generatedPath, errors) {
  const rawTargets = paths[alias] || [];
  const targets = Array.isArray(rawTargets) ? rawTargets : [rawTargets];
  const normalized = targets.map(t => toPosix(String(t)));
  const hasGenerated = normalized.some(t => t.includes(generatedPath));
  const hasLocal = normalized.some(t => t.includes(generatedPath) && !t.startsWith("../"));
  const hasBrainFallback = normalized.some(t => t.includes(generatedPath) && t.startsWith("../"));

  if (!hasGenerated) {
    errors.push(`tsconfig.json missing ${alias} -> ${generatedPath}.`);
    return;
  }
  if (!hasLocal || !hasBrainFallback) {
    errors.push(`tsconfig.json ${alias} must include both Hand-local and Brain fallback routes.`);
  }
}

function validateJestAliases(projectPath, errors) {
  const candidates = [
    path.join(projectPath, "jest.config.cjs"),
    path.join(projectPath, "test", "jest-e2e.json")
  ].filter(exists);

  for (const file of candidates) {
    const content = toPosix(readText(file));
    const label = relative(projectPath, file);
    validateJestAliasText(content, label, "@contracts", "assets/contracts/generated/typescript", errors);
    validateJestAliasText(content, label, "@configs", "assets/configs/generated/typescript", errors);
  }
}

function validateJestAliasText(content, label, alias, generatedPath, errors) {
  if (!content.includes(alias)) {
    errors.push(`${label} missing mapper for ${alias}/*.`);
    return;
  }
  if (!content.includes(generatedPath)) {
    errors.push(`${label} ${alias} mapper missing ${generatedPath}.`);
    return;
  }
  if (!content.includes(`../../${generatedPath}`)) {
    errors.push(`${label} ${alias} mapper missing Brain fallback route.`);
  }
}

function validateGeneratedDnaImports(projectPath, errors) {
  const sourceRoots = ["src", "lib", "test"].map(p => path.join(projectPath, p)).filter(exists);
  const sourceFiles = sourceRoots.flatMap(root => listFiles(root)).filter(f => /\.(ts|tsx|js|jsx|dart)$/.test(f));
  const relativeAssetsPattern = /(?:from\s+|import\s+|require\()\s*['"][^'"]*assets\/(?:contracts|configs)\//i;

  for (const file of sourceFiles) {
    const content = toPosix(readText(file));
    const label = relative(projectPath, file);
    if (content.includes("@contracts/configs")) {
      errors.push(`Forbidden config import through @contracts in ${label}.`);
    }
    if (content.includes("package:letron_contracts/configs")) {
      errors.push(`Forbidden Flutter config import through letron_contracts in ${label}.`);
    }
    if (relativeAssetsPattern.test(content)) {
      errors.push(`Forbidden relative generated DNA import in ${label}.`);
    }
  }
}

function validateFlutterConfigDependency(projectPath, errors) {
  const pubspecPath = path.join(projectPath, "pubspec.yaml");
  if (!exists(pubspecPath)) return;

  const pubspec = readText(pubspecPath);
  const dartFiles = ["lib", "test"]
    .map(p => path.join(projectPath, p))
    .filter(exists)
    .flatMap(root => listFiles(root))
    .filter(f => f.endsWith(".dart"));
  const importsConfigs = dartFiles.some(f => readText(f).includes("package:letron_configs/"));

  if (pubspec.includes("letron_contracts:") && importsConfigs && !pubspec.includes("letron_configs:")) {
    errors.push("pubspec.yaml imports letron_configs but missing letron_configs dependency.");
  }
}

function validateDartConfigLayout(projectPath, errors) {
  const dartConfigDir = path.join(projectPath, "assets", "configs", "generated", "dart");
  if (!exists(dartConfigDir)) return;

  const directDartFiles = fs.readdirSync(dartConfigDir, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith(".dart"))
    .map(entry => entry.name);

  if (directDartFiles.length > 0) {
    errors.push(`Generated Dart configs must live under assets/configs/generated/dart/lib/: ${directDartFiles.join(", ")}`);
  }
}

function isSha1(v) { return typeof v === "string" && /^[a-fA-F0-9]{40}$/.test(v); }
function isSha256(v) { return typeof v === "string" && /^[a-fA-F0-9]{64}$/.test(v); }
function isNonEmptyString(v) { return typeof v === "string" && v.trim().length > 0; }

export function isDeliveryAllowed(file, projectPath, profile) {
  const norm = toPosix(file);
  const policy = profile.provisioning?.delivery_policy || {};
  
  const allow = policy.allow_baseline || [];
  if (allow.includes(norm) || allow.some(b => norm.endsWith("/" + b))) return true;

  const deny = policy.deny_prefixes || [];
  if (deny.some(p => norm === p || norm.startsWith(p))) return false;
  
  if (isGovernanceFile(norm, profile)) return false;

  return true;
}

export function isGovernanceFile(file, profile) {
  const mappings = Array.isArray(profile.mappings) ? profile.mappings : [];
  const harvest = (profile.harvesting || []).map(h => toPosix(h.source));

  const isMapped = mappings.some(m => {
    const target = toPosix(m.target);
    return file === target || file.startsWith(target + "/");
  });

  if (!isMapped) return false;

  return !harvest.some(h => file === h || file.startsWith(h + "/"));
}

function getProfile(projectPath) {
  const p = path.join(projectPath, "slicing-profile.json");
  return exists(p) ? readJson(p) : { mappings: [], harvesting: [], provisioning: {} };
}

function validateProjectAssetRegistry(projectPath, pass, fail) {
  const regPath = path.join(projectPath, "asset-index.json");
  if (!exists(regPath)) return;
  try {
    const errors = validateAssetRegistry(readJson(regPath), { rootPath: projectPath, requireGeneratedAt: false });
    if (errors.length) errors.forEach(e => fail(`asset-index.json: ${e}`));
    else pass("asset-index.json valid.");
  } catch (e) { fail(`asset-index.json invalid: ${e.message}`); }
}

function hashMatchExpectedText(expectedText, target, label, pass, fail) {
  if (sha256(normalizeText(expectedText)) === sha256(normalizeText(readText(target)))) pass(`${label} matches Master.`);
  else fail(`${label} modified outside governance.`);
}

function detectProjectTier(projectPath) {
  const regPath = path.join(projectPath, "asset-index.json");
  if (!exists(regPath)) return "HAND";
  try { return (readJson(regPath).identity?.tier || "HAND").toUpperCase(); } catch { return "HAND"; }
}

function normalizeText(c) { return c.replace(/\r\n/g, "\n"); }

function runTests(projectPath, pass, fail) {
  const pkgPath = path.join(projectPath, "package.json");
  if (exists(pkgPath)) {
    const pkg = readJson(pkgPath);
    if (pkg.scripts?.test) {
      if (!exists(path.join(projectPath, "node_modules"))) {
        pass("node_modules missing, skipping npm test (Zero-npm mode).");
        return;
      }
      if (run("npm", ["test"], { cwd: projectPath, allowFailure: true }).status === 0) pass("npm test passed.");
      else fail("npm test failed.");
      return;
    }
  }
  fail("Test script missing in package.json.");
}

function runLint(projectPath, pass, fail) {
  const pkgPath = path.join(projectPath, "package.json");
  if (exists(pkgPath)) {
    const pkg = readJson(pkgPath);
    if (pkg.scripts?.lint) {
      if (!exists(path.join(projectPath, "node_modules"))) {
        pass("node_modules missing, skipping npm run lint (Zero-npm mode).");
        return;
      }
      if (run("npm", ["run", "lint"], { cwd: projectPath, allowFailure: true }).status === 0) pass("npm run lint passed.");
      else fail("npm run lint failed.");
      return;
    }
    pass("No lint script found, skipping quality check.");
    return;
  }
  fail("package.json missing for lint check.");
}

function verifyContractSync(projectPath, pass, fail) {
  const schemaDir = path.join(projectPath, "assets/contracts/schema");
  if (!exists(schemaDir)) return;
  let allSynced = true;
    listFiles(schemaDir).filter(f => f.endsWith(".json")).forEach(s => {
    const relativeSchema = relative(schemaDir, s).replace(/\\/g, "/");
    const parsed = path.posix.parse(relativeSchema);
    const outputStem = path.posix.join(parsed.dir, parsed.name);
    const expected = sha256(readText(s).replace(/\r\n/g, "\n"));
    ["typescript", "dart", "python"].forEach(l => {
      const ext = l === "typescript" ? ".ts" : (l === "dart" ? ".dart" : ".py");
      const gen = l === "dart"
        ? path.join(projectPath, "assets/contracts/generated", l, "lib", `${outputStem}${ext}`)
        : path.join(projectPath, "assets/contracts/generated", l, `${outputStem}${ext}`);
      if (!exists(gen) || !readText(gen).includes(expected)) {
        fail(`Contract drift: ${outputStem} (${l}) outdated.`);
        allSynced = false;
      }
    });
  });
  if (allSynced) pass("Contracts in sync.");
}

function writeGateReport(projectPath, integrity, passes, failures) {
  const reportDir = path.join(projectPath, "report");
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
  
  const manifestPath = path.join(reportDir, "gate-manifest.json");
  const currentManifest = exists(manifestPath) ? readJson(manifestPath) : null;
  
  // Smart Update: If project hash hasn't changed, reuse the old timestamp to prevent Git diff
  const timestamp = (currentManifest && currentManifest.project_hash === integrity.hash) 
    ? currentManifest.generated_at 
    : new Date().toISOString();

  const manifestData = {
    generated_at: timestamp,
    project_hash: integrity.hash,
    files: integrity.manifest.reduce((acc, l) => { const [p, h] = l.split("\t"); acc[p] = h; return acc; }, {})
  };

  const manifestContent = JSON.stringify(manifestData, null, 2);
  
  // Only write if something changed (hashes or timestamp)
  if (!currentManifest || JSON.stringify(currentManifest) !== manifestContent) {
    fs.writeFileSync(manifestPath, manifestContent);
  }

  const reportPath = path.join(reportDir, "GATE_REPORT.md");
  const content = `# GATE VERIFICATION REPORT
Status: ${failures.length === 0 ? "✅ PASS" : "❌ FAIL"}
Integrity-Hash: \`${integrity.hash}\`

## 🔍 Details
${failures.map(f => `- ❌ ${f}`).join("\n")}
${passes.map(p => `- ✅ ${p}`).join("\n")}

> [!NOTE]
> Manifest: [gate-manifest.json](gate-manifest.json)
`;
  
  // Smart update for MD report as well
  if (!exists(reportPath) || readText(reportPath) !== content) {
    writeText(reportPath, content);
  }
}

export function verifyManifestMappings(runtime, projectPath, profile, pass, fail) {
  const allMappings = Array.isArray(profile.mappings) ? profile.mappings : [];
  const harvestTargets = new Set((profile.harvesting || []).map(h => toPosix(h.source)));

  allMappings.forEach(m => {
    const targetNorm = toPosix(m.target);

    // 1. Skip if it's explicitly harvested (Hands has authority to modify)
    if (harvestTargets.has(targetNorm)) return;

    // 2. Skip special files handled elsewhere (e.g. GEMINI.md by template, asset-index.json by schema)
    if (["GEMINI.md", "asset-index.json"].includes(targetNorm)) return;

    const src = runtime.resolvePath(m.source);
    const trg = path.join(projectPath, m.target);
    if (!exists(trg)) return fail(`Missing target: ${m.target}`);
    
    if (exists(src)) {
      const srcStat = fs.statSync(src);
      const trgStat = fs.statSync(trg);
      
      if (srcStat.isDirectory() && trgStat.isDirectory()) {
        const srcFiles = listFiles(src).map(f => relative(src, f));
        let dirPass = true;
        for (const rel of srcFiles) {
          const sFile = path.join(src, rel);
          const tFile = path.join(trg, rel);
          if (!exists(tFile)) {
            fail(`Directory ${m.target}: missing file ${rel}`);
            dirPass = false;
            continue;
          }
          if (textFileSha256(sFile) !== textFileSha256(tFile)) {
            fail(`Directory ${m.target}: file ${rel} modified outside governance.`);
            dirPass = false;
          }
        }
        if (dirPass) pass(`${m.target} directory matches Master.`);
      } else if (srcStat.isFile() && trgStat.isFile()) {
        if (textFileSha256(src) === textFileSha256(trg)) pass(`${m.target} matches Master.`);
        else fail(`${m.target} modified outside governance.`);
      } else {
        fail(`${m.target} type mismatch (File vs Directory) compared to Master.`);
      }
    }
  });
}
