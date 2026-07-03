#!/usr/bin/env node
import { lsGitPush, verifyDelivery } from "./lib/delivery.mjs";
import { newHandFolder, newProject } from "./lib/factory.mjs";
import { verifyGate } from "./lib/gate.mjs";
import { initHand } from "./lib/init-hand.mjs";
import { createRuntime } from "./lib/runtime.mjs";
import { selfTest, stressTest } from "./lib/self-test.mjs";
import { detectIdentity } from "./lib/identity.mjs";
import { pullCode, pushRules } from "./lib/sync.mjs";
import { verifyContracts } from "./lib/contracts.mjs";
import { showDocs } from "./lib/docs.mjs";

const command = process.argv[2];
const args = parseArgs(process.argv.slice(3));
const runtime = createRuntime(args);

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

async function main() {
  switch (command) {
    case "new-project":
      return newProject(runtime);
    case "new-hand":
      return newHandFolder(runtime);
    case "cast-dna": {
      const { castDna } = await import("./lib/cast-dna.mjs");
      return castDna(runtime);
    }
    case "verify-gate":
      if (!await verifyGate(runtime)) process.exitCode = 1;
      return;
    case "ls-gitpush":
      return lsGitPush(runtime);
    case "verify-delivery":
      return verifyDelivery(runtime);
    case "push-rules":
      return pushRules(runtime);
    case "pull-code":
      return pullCode(runtime);
    case "init-hand":
      return initHand(runtime);
    case "self-test":
      return selfTest(runtime);
    case "stress-test":
      return stressTest(runtime);
    case "ls-identity": {
      const id = detectIdentity(runtime, runtime.args);
      if (runtime.args.silent) console.log(id.tier);
      break;
    }
    case "verify-contracts":
      return verifyContracts(runtime);
    case "docs":
      return showDocs(runtime);
    default:
      printUsage();
      process.exit(command ? 1 : 0);
  }
}

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      i += 1;
    }
  }
  return parsed;
}

function printUsage() {
  console.log(`Link Strategy Engine Ops

Brain Commands (Orchestration):
  new-project --project-name NAME [--overwrite-remote]
  new-hand --path PATH
  init-hand --project-path PATH --repo-name NAME [--public] [--organization Link-Strategy]
  push-rules --hand HAND_ID
  pull-code --hand HAND_ID [--remote-branch main]
  cast-dna

Hands Commands (Execution):
  verify-gate
  ls-gitpush
  verify-delivery
  verify-contracts
  ls-identity

System:
  self-test
  stress-test [--iterations 10]
  docs <SERVICE_NAME>
`);
}
