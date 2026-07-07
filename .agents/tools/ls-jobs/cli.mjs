#!/usr/bin/env node
/**
 * ls-jobs CLI — Manage recruitment job listings in MongoDB.
 *
 * Usage:
 *   node .agents/tools/ls-jobs/cli.mjs <command> [options]
 *
 * Commands:
 *   save-job     --payload-file <file>   Create or update a job listing
 *   list                                 List all jobs (includes draft/closed)
 *   get          --slug <slug>           View a single job
 *   publish      --slug <slug>           Publish a job + auto revalidate + GSC sitemap
 *   close        --slug <slug>           Close a job + auto revalidate
 *   unpublish    --slug <slug>           Revert to draft + auto revalidate
 *   delete       --slug <slug>           Hard-delete a job
 *
 * Options:
 *   --payload-file <path>   Path to JSON file containing job payload
 *   --slug <slug>           Job slug to target
 */

import fs from "node:fs";
import { connectToDatabase } from "./lib/db.mjs";
import {
  upsertJob,
  publishJob,
  closeJob,
  unpublishJob,
  deleteJob,
  getJob,
  listJobs,
} from "./lib/job.mjs";

// ─── Arg parsing ──────────────────────────────────────────────────────────────

const command = process.argv[2];
const args = parseArgs(process.argv.slice(3));

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : true;
      out[key] = val;
      if (val !== true) i++;
    }
  }
  return out;
}

function ok(data) {
  console.log(JSON.stringify({ ok: true, data }, null, 2));
}

function fail(msg) {
  console.error(JSON.stringify({ ok: false, error: msg }, null, 2));
  process.exit(1);
}

// ─── Helpers: revalidate & GSC ────────────────────────────────────────────────

/**
 * Call the Next.js revalidation API to clear the job_listings cache.
 * Falls back silently if the server is not reachable.
 */
async function callRevalidate() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.APP_URL ||
    "http://localhost:3000";
  const secret = process.env.REVALIDATE_SECRET;

  try {
    const headers = { "Content-Type": "application/json" };
    if (secret) headers["Authorization"] = `Bearer ${secret}`;

    const res = await fetch(`${baseUrl}/api/recruitment/revalidate`, {
      method: "POST",
      headers,
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok) {
      console.error(`✅ Cache revalidated (tag: job_listings)`);
    } else {
      console.error(`⚠️  Revalidate API returned ${res.status}: ${JSON.stringify(body)}`);
    }
  } catch (err) {
    console.error(`⚠️  Could not reach revalidate API (server down?): ${err.message}`);
    console.error("   Run manually: curl -X POST http://localhost:3000/api/recruitment/revalidate");
  }
}

/**
 * Submit sitemap to Google Search Console via Webmasters API.
 * Requires GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL and GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY in .env.
 */
async function submitGSCSitemap() {
  const clientEmail = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL?.trim();
  const rawKey = process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY?.trim();

  if (!clientEmail || !rawKey) {
    console.error("ℹ️  GSC credentials not configured — skipping sitemap submission.");
    return;
  }

  const privateKey = rawKey.replace(/^["']|["']$/g, "").replace(/\\n/g, "\n");

  const siteUrl = (
    process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://letrongroup.com"
  ).trim().replace(/\/+$/, "");

  const sitemapUrl = `${siteUrl}/sitemap.xml`;

  try {
    const { GoogleAuth } = await import("google-auth-library");
    const auth = new GoogleAuth({
      credentials: { client_email: clientEmail, private_key: privateKey },
      scopes: ["https://www.googleapis.com/auth/webmasters"],
    });

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const accessToken =
      typeof tokenResponse === "string" ? tokenResponse : tokenResponse?.token;

    if (!accessToken) {
      console.error("⚠️  GSC: Could not obtain access token.");
      return;
    }

    const apiUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
    const res = await fetch(apiUrl, {
      method: "PUT",
      headers: { authorization: `Bearer ${accessToken}` },
    });

    if (res.ok) {
      console.error(`✅ GSC sitemap submitted: ${sitemapUrl}`);
    } else {
      const body = await res.text();
      console.error(`⚠️  GSC sitemap submission failed: ${res.status} ${body}`);
    }
  } catch (err) {
    console.error(`⚠️  GSC error: ${err.message}`);
  }
}

function printUsage() {
  console.log(`
ls-jobs — LeOS Job Listings CLI

Commands:
  save-job     --payload-file <path>   Create or update a job listing
  list                                 List all jobs (draft, published, closed)
  get          --slug <slug>           View a single job by slug
  publish      --slug <slug>           Publish job → revalidates cache + submits GSC sitemap
  close        --slug <slug>           Close job → revalidates cache
  unpublish    --slug <slug>           Revert job to draft → revalidates cache
  delete       --slug <slug>           Hard-delete a job by slug

Examples:
  node .agents/tools/ls-jobs/cli.mjs save-job --payload-file job.json
  node .agents/tools/ls-jobs/cli.mjs list
  node .agents/tools/ls-jobs/cli.mjs publish --slug ky-su-iot-cao-cap
  node .agents/tools/ls-jobs/cli.mjs delete --slug ky-su-iot-cao-cap

Payload JSON example (save-job):
{
  "title": "Kỹ sư IoT cao cấp",
  "slug": "ky-su-iot-cao-cap",
  "department": "Kỹ thuật",
  "location": "Hà Nội",
  "jobType": "full-time",
  "salary": "Thỏa thuận",
  "requirements": "## Yêu cầu\\n- 3+ năm kinh nghiệm IoT...",
  "description": "## Mô tả công việc\\n...",
  "benefits": "## Phúc lợi\\n...",
  "status": "draft",
  "order": 1
}
`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!command || command === "help" || command === "--help") {
    printUsage();
    process.exit(0);
  }

  let ctx = null;
  try {
    ctx = await connectToDatabase();

    switch (command) {
      case "save-job": {
        if (!args["payload-file"]) fail("--payload-file is required");
        const raw = fs.readFileSync(args["payload-file"], "utf-8");
        const payload = JSON.parse(raw);
        const result = await upsertJob(ctx.db, payload);
        ok(result);
        break;
      }

      case "list": {
        const jobs = await listJobs(ctx.db);
        ok(
          jobs.map((j) => ({
            id: j._id?.toString(),
            slug: j.slug,
            title: j.title,
            department: j.department,
            location: j.location,
            jobType: j.jobType,
            status: j.status,
            order: j.order,
            publishedAt: j.publishedAt,
            updatedAt: j.updatedAt,
          }))
        );
        break;
      }

      case "get": {
        if (!args.slug) fail("--slug is required");
        const job = await getJob(ctx.db, args.slug);
        if (!job) fail(`Job not found: ${args.slug}`);
        ok(job);
        break;
      }

      case "publish": {
        if (!args.slug) fail("--slug is required");
        const result = await publishJob(ctx.db, args.slug);
        ok(result);
        await ctx.close();
        ctx = null;
        await callRevalidate();
        await submitGSCSitemap();
        break;
      }

      case "close": {
        if (!args.slug) fail("--slug is required");
        const result = await closeJob(ctx.db, args.slug);
        ok(result);
        await ctx.close();
        ctx = null;
        await callRevalidate();
        break;
      }

      case "unpublish": {
        if (!args.slug) fail("--slug is required");
        const result = await unpublishJob(ctx.db, args.slug);
        ok(result);
        await ctx.close();
        ctx = null;
        await callRevalidate();
        break;
      }

      case "delete": {
        if (!args.slug) fail("--slug is required");
        const result = await deleteJob(ctx.db, args.slug);
        ok(result);
        break;
      }

      default:
        fail(`Unknown command: "${command}". Run without arguments to see usage.`);
    }
  } finally {
    if (ctx) await ctx.close();
  }
}

main().catch((err) => {
  fail(err.message || String(err));
});
