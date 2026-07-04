import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  isGoogleSearchConsoleConfigured,
  submitSitemapToGoogleSearchConsole,
} from "@/lib/blog/googleSearchConsole";

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();
    const paths = ["/", "/blog", "/rss.xml", "/sitemap.xml"];
    if (slug) paths.push(`/blog/${slug}`);
    for (const p of paths) revalidatePath(p);

    // Submit sitemap to Google Search Console
    let gscSubmitted = false;
    let gscWarning: string | undefined;
    if (isGoogleSearchConsoleConfigured()) {
      try {
        const result: any = await submitSitemapToGoogleSearchConsole();
        gscSubmitted = result.submitted;
        gscWarning = result.warning;
      } catch (err: any) {
        gscWarning = err.message;
      }
    }

    return NextResponse.json({
      ok: true,
      revalidated: paths,
      gsc: gscSubmitted ? "submitted" : "skipped",
      gscWarning,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }
}
