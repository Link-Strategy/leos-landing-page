import { spawnSync } from "node:child_process";

export function run(cmd, cmdArgs, options = {}) {
  const resolved = resolveCommand(cmd);
  const result = spawnSync(resolved.command, cmdArgs, {
    cwd: options.cwd || process.cwd(),
    encoding: "utf8",
    shell: resolved.shell,
    stdio: options.capture ? "pipe" : "inherit"
  });
  if (result.error) {
    throw new Error(`Failed to start ${cmd}: ${result.error.message}`);
  }
  if (options.allowFailure) return result;
  if (result.status !== 0) {
    const detail = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    throw new Error(`${cmd} ${cmdArgs.join(" ")} failed with exit code ${result.status}${detail ? `\n${detail}` : ""}`);
  }
  return result;
}

export function runOut(cmd, cmdArgs, cwd = process.cwd(), allowFailure = false) {
  const result = run(cmd, cmdArgs, { cwd, capture: true, allowFailure });
  return (result.stdout || "").trim();
}

export function resolveCommand(cmd) {
  if (process.platform !== "win32") return { command: cmd, shell: false };
  if (cmd === "npm" || cmd === "npx") return { command: cmd, shell: true };
  return { command: cmd, shell: false };
}
