export const tierNames = new Set(["brain", "hands"]);

export const requiredSatellitePaths = ["01_TASK_SPEC.md", "03_LOGS.md", "GEMINI.md", "README.md", "package.json"];
// src or lib must be present separately checked in init logic or just allowed here


export const satellitePackageScripts = {
  "verify-gate": "node .agents/tools/ls-engine/cli.mjs verify-gate",
  "verify-delivery": "node .agents/tools/ls-engine/cli.mjs verify-delivery",
  "ls-gitpush": "node .agents/tools/ls-engine/cli.mjs ls-gitpush",
  "ls-identity": "node .agents/tools/ls-engine/cli.mjs ls-identity",
  "verify-contracts": "node .agents/tools/ls-engine/cli.mjs verify-contracts"
};

export const brainPackageScripts = {
  "new-hand": "node .agents/tools/ls-engine/cli.mjs new-hand",
  "init-hand": "node .agents/tools/ls-engine/cli.mjs init-hand",
  "push-rules": "node .agents/tools/ls-engine/cli.mjs push-rules",
  "pull-code": "node .agents/tools/ls-engine/cli.mjs pull-code",
  "cast-dna": "node .agents/tools/ls-engine/cli.mjs cast-dna",
  "verify-contracts": "node .agents/tools/ls-engine/cli.mjs verify-contracts",
  "verify-gate": "node .agents/tools/ls-engine/cli.mjs verify-gate",
  "self-test": "node .agents/tools/ls-engine/cli.mjs self-test"
};

// Alias for backward compatibility
export const brainOnlyPackageScripts = Object.keys(brainPackageScripts).filter(
  (name) => !Object.keys(satellitePackageScripts).includes(name)
);
