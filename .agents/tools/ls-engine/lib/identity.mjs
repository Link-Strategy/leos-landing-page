import path from "node:path";
import { exists } from "./fs-utils.mjs";

export function detectIdentity(runtime, options = {}) {
  const root = runtime.root;
  
  let tier = "UNKNOWN";
  let role = "Inquiry Only";
  let color = "\x1b[37m"; // White

  // Tier detection based on key indicator files
  const isMaster = exists(path.join(root, "active-projects.json")) && 
                   exists(path.join(root, ".agents/rules/brain"));
  
  const isBrain = exists(path.join(root, "active-hands.json"));
  
  const isHands = (exists(path.join(root, "01_TASK_SPEC.md")) && exists(path.join(root, "03_LOGS.md"))) ||
                  exists(path.join(root, "slicing-profile.json"));

  if (isMaster) {
    tier = "MASTER (The Root)";
    role = "DNA Sovereign / Infrastructure Owner";
    color = "\x1b[35m"; // Magenta
  } else if (isBrain) {
    tier = "BRAIN (Orchestrator)";
    role = "Project Manager / Satellite Controller";
    color = "\x1b[36m"; // Cyan
  } else if (isHands) {
    tier = "HANDS (Executor)";
    role = "Technical Implementation / Freelancer";
    color = "\x1b[32m"; // Green
  }

  if (!options.silent) printIdentityCard(tier, role, color, root);
  return { tier, role, isMaster, isBrain, isHands };
}

function printIdentityCard(tier, role, color, root) {
  const reset = "\x1b[0m";
  const bold = "\x1b[1m";
  
  console.log(`\n${color}${bold}╔══════════════════════════════════════════════════════════╗${reset}`);
  console.log(`${color}${bold}║             LINK STRATEGY - IDENTITY CARD                ║${reset}`);
  console.log(`${color}${bold}╠══════════════════════════════════════════════════════════╣${reset}`);
  console.log(`${color}${bold}║${reset}  TIER:   ${bold}${tier.padEnd(46)}${reset} ${color}${bold}║${reset}`);
  console.log(`${color}${bold}║${reset}  ROLE:   ${role.padEnd(46)} ${color}${bold}║${reset}`);
  console.log(`${color}${bold}║${reset}  PATH:   ${root.padEnd(46)} ${color}${bold}║${reset}`);
  console.log(`${color}${bold}╠══════════════════════════════════════════════════════════╣${reset}`);
  console.log(`${color}${bold}║${reset}  Status: ACTIVE SYSTEM RUNTIME                          ${color}${bold}║${reset}`);
  console.log(`${color}${bold}╚══════════════════════════════════════════════════════════╝${reset}\n`);
}
