import path from "node:path";
import { run, runOut } from "./process-utils.mjs";
import { isDeliveryAllowed, verifyManifestMappings, verifyGate } from "./gate.mjs";
import { exists, readJson, readText, writeText } from "./fs-utils.mjs";
import { gitChangedFiles } from "./git-utils.mjs";

function readGateHash(projectPath) {
  const reportPath = path.join(projectPath, REPORT_PATH);
  if (!exists(reportPath)) return "N/A";
  const report = readText(reportPath);
  const match = report.match(/Integrity-Hash:\s*`?([A-Fa-f0-9]{64})`?/);
  return match ? match[1].toUpperCase() : "N/A";
}

const RECEIPT_PATH = "report/delivery-receipt.json";
const REPORT_PATH = "report/GATE_REPORT.md";

export async function lsGitPush(runtime) {
  const commitMessage = "feat: delivery";
  const projectPath = process.cwd();
  const profile = getProfile(projectPath);

  // Step 1: Snapshot BEFORE verifyGate — prevents tree pollution from gate writes
  const changed = gitChangedFiles(projectPath, { denyPrefixes: profile.provisioning?.delivery_policy?.deny_prefixes || [] });
  const blocked = changed.filter(f => !isDeliveryAllowed(f, projectPath, profile));
  if (blocked.length) throw new Error(`Refusing to deliver protected files:\n${blocked.map(f => ` - ${f}`).join("\n")}`);
  if (changed.length === 0) throw new Error("No deliverable files found. Nothing to commit.");

  // Step 2: Run gate (may write report/GATE_REPORT.md — tree is now dirty, but we have our snapshot)
  if (!await verifyGate(runtime)) throw new Error("Verification gate failed.");

  // Step 3: Read hash AFTER gate has written GATE_REPORT.md
  const gateHash = readGateHash(projectPath);

  // Step 4: Write receipt
  const receipt = {
    tool: "ls-gitpush",
    created_at: new Date().toISOString(),
    commit_message: commitMessage,
    gate_hash: gateHash,
    changed_files: changed.sort()
  };
  writeText(path.join(projectPath, RECEIPT_PATH), JSON.stringify(receipt, null, 2) + "\n");

  // Step 5: Stage only the pre-snapshot files AND the new receipt
  console.log(`[DELIVERY] Staging ${changed.length} files + receipt with integrity ${gateHash}...`);
  run("git", ["add", "--", ...changed, RECEIPT_PATH, REPORT_PATH, "report/gate-manifest.json"], { cwd: projectPath, allowFailure: true });
  run("git", ["commit", "-m", commitMessage], { cwd: projectPath });
  run("git", ["push", "origin", "main", "--force-with-lease"], { cwd: projectPath });

  const sha = runOut("git", ["rev-parse", "HEAD"], projectPath);
  await waitForCI(projectPath, sha);
}

async function waitForCI(projectPath, sha) {
  console.log(`[CI] Waiting for GitHub Actions on commit ${sha.substring(0, 7)}...`);
  const pollInterval = 10000; // 10 seconds
  const timeout = 600000; // 10 minutes
  const maxCliErrors = 3;
  const startTime = Date.now();
  let cliErrorCount = 0;

  while (Date.now() - startTime < timeout) {
    try {
      const output = runOut("gh", ["run", "list", "--commit", sha, "--json", "status,conclusion,url,displayTitle,name"], projectPath);
      const runs = JSON.parse(output);
      cliErrorCount = 0;
      
      if (runs.length === 0) {
        console.log("[CI] No workflow run found for this commit yet. Waiting...");
      } else {
        for (const run of runs) {
          console.log(`[CI] ${formatRunStatus(run)}`);
        }

        const failed = runs.find(run => run.status === "completed" && run.conclusion !== "success");
        if (failed) {
          throw new Error(`CI FAILED: ${formatRunStatus(failed)}. View details: ${failed.url}`);
        }

        if (runs.every(run => run.status === "completed" && run.conclusion === "success")) {
          console.log("[CI] PASS: All workflows completed successfully.");
          return;
        }
      }
    } catch (e) {
      if (e.message.includes("CI FAILED")) throw e;
      
      cliErrorCount++;
      console.error(`[CI] gh CLI polling error (${cliErrorCount}/${maxCliErrors}): ${e.message}`);
      if (cliErrorCount >= maxCliErrors) {
        throw new Error(`CI POLLING ERROR: The 'gh' CLI failed ${maxCliErrors} times in a row. Ensure you are logged in ('gh auth login') and network access is available.\nOriginal error: ${e.message}`);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
  throw new Error("CI TIMEOUT: Workflow did not complete within 10 minutes.");
}

function formatRunStatus(run) {
  const workflowName = run.name || run.displayTitle || "<unknown workflow>";
  return `Workflow: ${workflowName} | Status: ${run.status}${run.conclusion ? ` | Conclusion: ${run.conclusion}` : ""}`;
}

export function verifyDelivery(runtime) {
  const projectPath = process.cwd();
  const receiptPath = path.join(projectPath, RECEIPT_PATH);
  if (!exists(receiptPath)) {
    console.log("[FAIL] Delivery Receipt missing. You MUST use 'npm run ls-gitpush' to deliver.");
    process.exitCode = 1;
    return false;
  }

  const receipt = readJson(receiptPath);
  const profile = getProfile(projectPath);
  const failures = [];
  const pass = () => {};
  const fail = (m) => failures.push(m);

  // 1. Mandatory Governance/Rules Protection (The "Steel Frame")
  verifyManifestMappings(runtime, projectPath, profile, pass, fail);

  // 2. Check for protected files in the commit itself
  const committedFiles = runOut("git", ["diff", "--name-only", "HEAD^", "HEAD"], projectPath).split("\n").filter(Boolean);
  const blocked = committedFiles.filter(f => !isDeliveryAllowed(f, projectPath, profile));
  if (blocked.length) fail(`Commit contains unauthorized changes to protected files:\n${blocked.join("\n")}`);

  if (failures.length) {
    console.log("--- LINK STRATEGY: DELIVERY AUDIT (FAILED) ---");
    failures.forEach(f => console.log(`[BLOCK] ${f}`));
    process.exitCode = 1;
    return false;
  }

  console.log("--- LINK STRATEGY: DELIVERY AUDIT (PASSED) ---");
  console.log(`[PASS] Governance/Rules integrity verified.`);
  console.log(`[PASS] Delivery Receipt found (Created: ${receipt.created_at}).`);
  return true;
}

function getProfile(projectPath) {
  const p = path.join(projectPath, "slicing-profile.json");
  return exists(p) ? readJson(p) : { mappings: {}, harvesting: [], provisioning: {} };
}
