import { NextRequest, NextResponse } from "next/server";
import { getBlogDb } from "@/lib/mongodb";
import { blogAssetToPost, type BlogAsset } from "@/lib/blog-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");

    const db = await getBlogDb();
    const query: Record<string, unknown> = { platform: "blog", status: "published" };
    if (category) query.category = category;

    const assets = await db.collection<BlogAsset>("assets")
      .find(query)
      .sort({ publish_at: -1, created_at: -1 })
      .toArray();

    let posts = assets.map(blogAssetToPost);

    if (slug) {
      posts = posts.filter((p) => p.slug === slug);
      if (posts.length === 0) {
        return NextResponse.json({ post: null }, { status: 404 });
      }
      return NextResponse.json({ post: posts[0] });
    }

    const total = posts.length;
    const paged = posts.slice((page - 1) * limit, page * limit);

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
