import { runOut } from "./process-utils.mjs";
import { toPosix } from "./fs-utils.mjs";

export function gitChangedFiles(projectPath, options = {}) {
  const denyPrefixes = options.denyPrefixes || [];
  const output = runOut("git", ["status", "--porcelain"], projectPath);
  if (!output) return [];
  return output
    .split(/\r?\n/)
    .map(parsePorcelainPath)
    .filter(Boolean)
    .filter(file => {
      const normalized = toPosix(file);
      return !denyPrefixes.some(prefix => normalized === prefix || normalized.startsWith(prefix));
    });
}

function parsePorcelainPath(line) {
  const pathStart = line[2] === " " ? 3 : 2;
  const raw = line.slice(pathStart).trim();
  const rename = raw.split(" -> ");
  return rename[rename.length - 1];
}
