import { NextRequest, NextResponse } from "next/server";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";

// Receives Content-Security-Policy-Report-Only violation reports (see next.config.ts) and logs a one-line
// summary to the platform logs. Public by nature, so it is size-limited and rate-limited per instance.
const limiter = createRateLimiter({ limit: 30, windowMs: 60_000 });
const MAX_BYTES = 10_000;

type CspReport = Record<string, unknown>;

export async function POST(request: NextRequest) {
  if (!limiter.check(getClientIp(request.headers)).allowed) {
    return new NextResponse(null, { status: 204 });
  }

  const text = await request.text();
  if (text.length > MAX_BYTES) {
    return new NextResponse(null, { status: 413 });
  }

  try {
    const body = JSON.parse(text);
    // Legacy `report-uri` format: { "csp-report": {...} }; Reporting API sends [{ type, body }].
    const report: CspReport = body?.["csp-report"] ?? body?.[0]?.body ?? {};
    const pick = (k: string) => String(report[k] ?? report[k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] ?? "").slice(0, 200);
    console.warn(
      "[csp-report]",
      JSON.stringify({
        directive: pick("effective-directive") || pick("violated-directive"),
        blocked: pick("blocked-uri"),
        document: pick("document-uri"),
        source: pick("source-file"),
        line: pick("line-number"),
      }),
    );
  } catch {
    // Malformed report: ignore.
  }

  return new NextResponse(null, { status: 204 });
}
