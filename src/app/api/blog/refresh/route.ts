import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedRequest } from "@/lib/api-auth";
import { revalidateBlogContent } from "@/lib/blog/cache";
import { isValidBlogSlug } from "@/lib/blog/validation";
import {
  isGoogleSearchConsoleConfigured,
  submitSitemapToGoogleSearchConsole,
} from "@/lib/blog/googleSearchConsole";

export async function POST(request: NextRequest) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await request.json();
    if (slug && !isValidBlogSlug(slug)) {
      return NextResponse.json({ ok: false, error: "slug format is invalid" }, { status: 400 });
    }
    const paths = revalidateBlogContent(slug || undefined);

    // Submit sitemap to Google Search Console
    let gscSubmitted = false;
    let gscWarning: string | undefined;
    if (isGoogleSearchConsoleConfigured()) {
      try {
        const result = await submitSitemapToGoogleSearchConsole();
        gscSubmitted = result.submitted;
        gscWarning = result.warning;
      } catch (err) {
        gscWarning = (err as Error).message;
      }
    }

    return NextResponse.json({
      ok: true,
      revalidated: paths,
      gsc: gscSubmitted ? "submitted" : "skipped",
      gscWarning,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
