import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedRequest } from "@/lib/api-auth";
import { revalidateBlogContent } from "@/lib/blog/cache";
import { upsertBlogArticle } from "@/lib/blog/repository";
import { validateBlogSyncPayload } from "@/lib/blog/validation";

/**
 * POST /api/blog/articles — create or update a blog article in the `articles` collection
 * (the collection every blog page reads). Used by `ls-post publish-asset` for blog assets.
 * Body: BlogSyncPayload (src/lib/blog/types.ts). Upserts by `externalId`.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json({ success: false, errors: ["Unauthorized"] }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, errors: ["Invalid JSON body"] }, { status: 400 });
  }

  const validation = validateBlogSyncPayload(body);
  if (!validation.success) {
    return NextResponse.json({ success: false, errors: validation.errors }, { status: 400 });
  }

  if (validation.data.dryRun) {
    return NextResponse.json({ success: true, dryRun: true, warnings: validation.warnings, article: validation.normalized });
  }

  try {
    const article = await upsertBlogArticle(validation.normalized);
    const revalidated = revalidateBlogContent(article.slug);
    return NextResponse.json({
      success: true,
      warnings: validation.warnings,
      url: validation.canonicalUrl,
      article: { externalId: article.externalId, slug: article.slug, status: article.status },
      revalidated,
    });
  } catch (error) {
    const message = (error as Error).message;
    if (message === "SLUG_CONFLICT" || message === "PREVIOUS_SLUG_CONFLICT") {
      return NextResponse.json({ success: false, errors: [message] }, { status: 409 });
    }
    console.error("[blog/articles] upsert failed:", error);
    return NextResponse.json({ success: false, errors: ["Internal error"] }, { status: 500 });
  }
}
