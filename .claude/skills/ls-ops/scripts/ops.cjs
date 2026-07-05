const { spawnSync } = require("child_process");
const path = require("path");

const [,, action, ...args] = process.argv;
const scriptDir = __dirname;

function runScript(scriptName, scriptArgs) {
  const scriptPath = path.join(scriptDir, scriptName);
  const result = spawnSync("node", [scriptPath, ...scriptArgs], {
    stdio: "inherit",
    shell: true
  });
  process.exit(result.status);
}

switch (action) {
  case "upload":
    const uploadParams = [];
    if (args.length === 1 && !args[0].startsWith("-")) {
      uploadParams.push(args[0]);
    } else {
      for (let i = 0; i < args.length; i++) {
        if (args[i] === "-FilePath") uploadParams[0] = args[++i];
        if (args[i] === "-Folder") uploadParams[1] = args[++i];
        if (args[i] === "-FileName") uploadParams[2] = args[++i];
      }
    }
    runScript("upload.cjs", uploadParams.filter(p => p !== undefined));
    break;

  case "delete":
    runScript("delete.cjs", args);
    break;

  default:
    console.log("LeOS Operations Dispatcher");
    console.log("Usage:");
    console.log('  node .agents/skills/ls-ops/scripts/ops.cjs upload -FilePath <PATH> [-Folder <FOLDER>]');
    console.log('  node .agents/skills/ls-ops/scripts/ops.cjs delete <collection> <24-char-id>');
    process.exit(1);
}
