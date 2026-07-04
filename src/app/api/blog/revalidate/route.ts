import { NextRequest, NextResponse } from "next/server";

import { revalidateBlogContent } from "@/lib/blog/cache";
import { isValidBlogSlug } from "@/lib/blog/validation";

function isAuthorized(request: NextRequest) {
  const expected = process.env.BLOG_API_BEARER_TOKEN?.trim();
  if (!expected) {
    return false;
  }

  const header = request.headers.get("authorization");
  return header === `Bearer ${expected}`;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, errors: ["Unauthorized"] },
      { status: 401 },
    );
  }

  let slug: string | undefined;
  try {
    const body = (await request.json()) as { slug?: string };
    slug = body.slug?.trim() || undefined;
  } catch {
    return NextResponse.json(
      { success: false, errors: ["Invalid JSON body"] },
      { status: 400 },
    );
  }

  if (slug && !isValidBlogSlug(slug)) {
    return NextResponse.json(
      { success: false, errors: ["slug format is invalid"] },
      { status: 400 },
    );
  }

  const revalidated = revalidateBlogContent(slug);
  return NextResponse.json({
    success: true,
    slug,
    revalidated,
  });
}
