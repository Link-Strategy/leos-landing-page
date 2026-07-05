import { NextRequest, NextResponse } from "next/server";
import { getCachedPublicBlogArticles, getCachedPublicBlogArticleBySlug } from "@/lib/blog/queries";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");

    if (slug) {
      const article = await getCachedPublicBlogArticleBySlug(slug);
      if (!article) {
        return NextResponse.json({ post: null }, { status: 404 });
      }
      return NextResponse.json({ post: article });
    }

    let articles = await getCachedPublicBlogArticles(category || undefined);

    const total = articles.length;
    const paged = articles.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      posts: paged,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blog posts", details: (error as Error).message },
      { status: 500 }
    );
  }
}
