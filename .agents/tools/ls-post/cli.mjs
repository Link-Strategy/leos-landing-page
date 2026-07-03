#!/usr/bin/env node

import fs from "node:fs";
import { createRuntime } from "./lib/runtime.mjs";
import { connectToDatabase } from "./lib/db.mjs";
import { saveIdea } from "./lib/idea.mjs";
import { saveBrief } from "./lib/brief.mjs";
import { saveAsset } from "./lib/asset.mjs";
import { saveSignal } from "./lib/signal.mjs";
import { searchContent, getContent, searchTaxonomy } from "./lib/query.mjs";
import { publishAsset, fetchMetrics } from "./lib/execution.mjs";
import { scheduleAssetPost, unscheduleAssetPost } from "./lib/qstash.mjs";

const command = process.argv[2];
const rawArgs = process.argv.slice(3);
const args = parseArgs(rawArgs);
const runtime = createRuntime(args);

main().catch((error) => {
  console.error(JSON.stringify({
    ok: false,
    error: error.message || error
  }, null, 2));
  process.exit(1);
});

async function main() {
  if (!command) {
    printUsage();
    process.exit(0);
  }

  let dbContext = null;
  
  try {
    switch (command) {
      case "save-idea": {
        const payload = await getPayload();
        dbContext = await connectToDatabase(runtime);
        const res = await saveIdea(runtime, dbContext, payload);
        outputResult(res);
        break;
      }
      case "save-brief": {
        const payload = await getPayload();
        dbContext = await connectToDatabase(runtime);
        const res = await saveBrief(runtime, dbContext, payload);
        outputResult(res);
        break;
      }
      case "save-asset": {
        const payload = await getPayload();
        dbContext = await connectToDatabase(runtime);
        const res = await saveAsset(runtime, dbContext, payload);
        outputResult(res);
        break;
      }
      case "save-signal": {
        const payload = await getPayload();
        dbContext = await connectToDatabase(runtime);
        const res = await saveSignal(runtime, dbContext, payload);
        outputResult(res);
        break;
      }
      case "search-content": {
        dbContext = await connectToDatabase(runtime);
        const searchParams = {
          query: args.query || "",
          types: args.types ? args.types.split(",") : ["ideas", "briefs", "assets", "signals"],
          status: args.status || null,
          limit: args.limit ? parseInt(args.limit, 10) : 20
        };
        const res = await searchContent(runtime, dbContext, searchParams);
        outputResult(res);
        break;
      }
      case "search-taxonomy": {
        dbContext = await connectToDatabase(runtime);
        const searchParams = {
          query: args.query || "",
          type: args.type || null
        };
        const res = await searchTaxonomy(runtime, dbContext, searchParams);
        outputResult(res);
        break;
      }
      case "get-content": {
        const collection = runtime.requireArg("collection");
        const id = runtime.requireArg("id");
        dbContext = await connectToDatabase(runtime);
        const res = await getContent(runtime, dbContext, collection, id);
        outputResult(res);
        break;
      }
      case "publish-asset": {
        const assetId = runtime.requireArg("asset-id");
        dbContext = await connectToDatabase(runtime);
        const res = await publishAsset(runtime, dbContext, assetId);
        outputResult(res);
        break;
      }
      case "fetch-metrics": {
        const assetId = runtime.requireArg("asset-id");
        dbContext = await connectToDatabase(runtime);
        const res = await fetchMetrics(runtime, dbContext, assetId);
        outputResult(res);
        break;
      }
      case "schedule-asset": {
        // Manually (re)schedule a planned asset onto QStash
        const assetId = runtime.requireArg("asset-id");
        dbContext = await connectToDatabase(runtime);
        const { db } = dbContext;
        const { ObjectId } = await import("mongodb");
        let queryId;
        try { queryId = new ObjectId(assetId); } catch { queryId = assetId; }
        const asset = await db.collection("assets").findOne({ _id: queryId });
        if (!asset) {
          outputResult({ ok: false, message: `Asset not found: ${assetId}` });
          break;
        }
        await unscheduleAssetPost(runtime, dbContext, assetId);
        const msgId = await scheduleAssetPost(runtime, dbContext, assetId, {
          ...asset,
          publish_at: asset.publish_at instanceof Date
            ? asset.publish_at.toISOString()
            : asset.publish_at,
        });
        outputResult({
          ok: true,
          message: msgId ? `Asset scheduled. QStash messageId: ${msgId}` : "Asset publish_at is in the past — skipped.",
          data: { asset_id: assetId, qstash_message_id: msgId ?? null }
        });
        break;
      }
      case "unschedule-asset": {
        // Cancel a pending QStash job for an asset
        const assetId = runtime.requireArg("asset-id");
        dbContext = await connectToDatabase(runtime);
        await unscheduleAssetPost(runtime, dbContext, assetId);
        outputResult({ ok: true, message: `Unscheduled asset ${assetId}` });
        break;
      }
      default:
        console.error(`Unknown command: ${command}`);
        printUsage();
        process.exit(1);
    }
  } finally {
    if (dbContext && dbContext.close) {
      await dbContext.close();
    }
  }
}

async function getPayload() {
  if (args.payload) {
    try {
      return JSON.parse(args.payload);
    } catch (e) {
      throw new Error(`Failed to parse --payload JSON: ${e.message}`);
    }
  }

  if (args["payload-file"]) {
    const filePath = runtime.resolvePath(args["payload-file"]);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Payload file not found: ${filePath}`);
    }
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (e) {
      throw new Error(`Failed to parse payload file JSON: ${e.message}`);
    }
  }

  // Fallback to stdin
  return new Promise((resolve, reject) => {
    let input = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      input += chunk;
    });
    process.stdin.on("end", () => {
      if (!input.trim()) {
        reject(new Error("No payload provided. Use --payload, --payload-file, or pipe JSON to stdin."));
        return;
      }
      try {
        resolve(JSON.parse(input));
      } catch (e) {
        reject(new Error(`Failed to parse stdin JSON: ${e.message}`));
      }
    });
    // Set a timeout to prevent hanging if there's no stdin
    setTimeout(() => {
      if (!input) {
        reject(new Error("Timeout waiting for stdin payload. Use --payload or --payload-file."));
      }
    }, 1000);
  });
}

function outputResult(result) {
  console.log(JSON.stringify(result, null, 2));
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
  console.log(`Link Strategy Posting System Local CLI

Usage: node .agents/tools/ls-post/cli.mjs <command> [arguments]

Commands:
  save-idea       Save or update a content idea
                  Requires --payload '<json>' or --payload-file <path> or piped stdin
  
  save-brief      Save or update a strategic brief
                  Requires --payload '<json>' or --payload-file <path> or piped stdin
  
  save-asset      Save or update a draft copy and schedule posting
                  Requires --payload '<json>' or --payload-file <path> or piped stdin
  
  save-signal     Register performance learning and structured feedback
                  Requires --payload '<json>' or --payload-file <path> or piped stdin

  search-content  Search across ideas, briefs, assets, and signals
                  Arguments: [--query TEXT] [--types ideas,briefs,assets] [--status STATUS] [--limit COUNT]

  search-taxonomy Search active taxonomy mappings
                  Arguments: [--query TEXT] [--type thesis|mental_model|cluster|goal]

  get-content     Load a complete document by ID
                  Arguments: --collection NAME --id ID

  publish-asset   Simulate posting of a scheduled asset
                  Arguments: --asset-id ID

  fetch-metrics   Retrieve live metrics for a published asset
                  Arguments: --asset-id ID

  schedule-asset  (Re)register a planned asset onto QStash for timed publishing
                  Arguments: --asset-id ID
                  Requires QSTASH_TOKEN and APP_URL env vars

  unschedule-asset  Cancel a pending QStash scheduled job for an asset
                    Arguments: --asset-id ID
`);
}
