import fs from "node:fs";
import path from "node:path";

function loadEnv(root) {
  const envPath = path.resolve(root, ".env");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const [key, ...value] = trimmed.split("=");
    if (key && value.length > 0) {
      let val = value.join("=").trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      } else if (val.startsWith("'") && val.endsWith("'")) {
        val = val.slice(1, -1);
      }
      process.env[key.trim()] = val;
    }
  });
}

export function createRuntime(args, root = process.cwd()) {
  loadEnv(root);
  return {
    args,
    root,
    requireArg(name) {
      const value = args[name];
      if (!value || value === true) {
        throw new Error(`Missing required argument --${name}`);
      }
      return value;
    },
    resolvePath(...parts) {
      return path.resolve(root, ...parts);
    }
  };
}
