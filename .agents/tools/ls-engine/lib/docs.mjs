import { spawn } from "child_process";
import fs from "fs";
import path from "path";

/**
 * Preview OpenAPI spec using @redocly/cli
 * @param {import("./runtime.mjs").Runtime} runtime 
 */
export async function showDocs(runtime) {
  // Support both: npm run docs identity AND npm run docs -- --service identity
  const service = runtime.args.service || process.argv[3];
  
  if (!service || service.startsWith("--")) {
    const availableSpecs = fs.readdirSync(path.join("assets", "contracts", "api"))
      .filter(f => f.endsWith("-api.yaml"))
      .map(f => f.replace("-api.yaml", ""));
    
    console.log("\x1b[31m[ERROR]\x1b[0m Missing service name.");
    console.log("Available services:", availableSpecs.join(", "));
    console.log("\nUsage: npm run docs <service-name>");
    console.log("Example: npm run docs identity");
    return;
  }

  const specPath = path.join("assets", "contracts", "api", `${service}-api.yaml`);
  
  if (!fs.existsSync(specPath)) {
    throw new Error(`API Spec not found: ${specPath}`);
  }

  console.log(`\n\x1b[32m[LS-ENGINE]\x1b[0m Starting Swagger/Redoc preview for: \x1b[1m${service}\x1b[0m`);
  console.log(`\x1b[34m[INFO]\x1b[0m Spec path: ${specPath}`);
  console.log(`\x1b[35m[LINK]\x1b[0m http://127.0.0.1:8080`);
  console.log(`\x1b[90m(If the link above is not clickable, please copy and paste it into your browser)\x1b[0m`);
  
  // Use redoc-cli serve with --open to automatically launch browser (best effort)
  const child = spawn("npx", ["redoc-cli", "serve", specPath, "--open"], {
    shell: true,
    stdio: "inherit",
  });

  return new Promise((resolve, reject) => {
    child.on("error", (err) => {
      console.error("\x1b[31m[ERROR]\x1b[0m Failed to start Redocly:", err);
      reject(err);
    });
    
    child.on("exit", (code) => {
      if (code === 0 || code === null) {
        resolve();
      } else {
        reject(new Error(`Redocly exited with code ${code}`));
      }
    });
  });
}
