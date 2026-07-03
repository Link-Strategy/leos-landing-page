import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { assetFromMapping, validateAssetRegistry } from "./asset-registry.mjs";

export function toPosix(value) {
  return value.split(path.sep).join("/");
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function exists(target) {
  return fs.existsSync(target);
}

export function readText(file) {
  return fs.readFileSync(file, "utf8");
}

export function readJson(file) {
  return JSON.parse(readText(file).replace(/^\uFEFF/, ""));
}

export function writeText(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content, "utf8");
}

export function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

export function copyIfExists(src, dest) {
  if (exists(src)) copyFile(src, dest);
}

export function copyDir(src, dest) {
  if (!exists(src)) return;
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else if (entry.isFile()) copyFile(srcPath, destPath);
  }
}

export function removeContents(dir) {
  if (!exists(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    fs.rmSync(path.join(dir, entry), { recursive: true, force: true });
  }
}

export function listFiles(dir) {
  if (!exists(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

export function sha256(content) {
  return createHash("sha256").update(content).digest("hex").toUpperCase();
}

export function textSha256(content) {
  return sha256(content.replace(/\r\n/g, "\n").trim());
}

export function fileSha256(file) {
  return createHash("sha256").update(fs.readFileSync(file)).digest("hex").toUpperCase();
}

export function textFileSha256(file) {
  return textSha256(fs.readFileSync(file, "utf8"));
}

export function relative(rootPath, file) {
  return toPosix(path.relative(rootPath, file));
}

export function copyFileWithRuleActivation(src, dest, activate = true) {
  ensureDir(path.dirname(dest));
  if (activate && src.endsWith(".md")) {
    let content = readText(src);
    // Dynamic trigger rewrite
    const updated = content.replace(/trigger:\s*["']?on_demand["']?/g, 'trigger: always_on');
    writeText(dest, updated);
  } else {
    fs.copyFileSync(src, dest);
  }
}

export function copyDirWithRuleActivation(src, dest, activate = true) {
  if (!exists(src)) return;
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDirWithRuleActivation(srcPath, destPath, activate);
    else if (entry.isFile()) copyFileWithRuleActivation(srcPath, destPath, activate);
  }
}

export function generateTierAssetRegistry(src, dest, targetTier, mappings = [], projectName = "Satellite") {
  const assets = [];
  const registryRoot = path.dirname(dest);

  for (const m of mappings) {
    const target = m.target || m.dest;
    if (!target) continue;
    const targetPath = path.join(registryRoot, target);
    if (path.resolve(targetPath) !== path.resolve(dest) && !exists(targetPath)) continue;
    assets.push(assetFromMapping(m, { fallbackPurpose: "Synchronized satellite assets." }));
  }

  const registry = {
    identity: {
      name: `${projectName} Registry`,
      tier: targetTier,
      version: "1.1.0",
      generated_at: new Date().toISOString()
    },
    assets
  };

  const errors = validateAssetRegistry(registry, { rootPath: registryRoot, requireGeneratedAt: true });
  if (errors.length) throw new Error(`Invalid generated asset registry:\n${errors.map((error) => ` - ${error}`).join("\n")}`);

  fs.writeFileSync(dest, JSON.stringify(registry, null, 2) + "\n", "utf8");
}
