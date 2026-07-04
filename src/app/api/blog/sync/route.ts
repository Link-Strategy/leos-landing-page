import { NextRequest, NextResponse } from "next/server";
import { getBlogDb } from "@/lib/mongodb";
import { generateSlug, type BlogAsset } from "@/lib/blog-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.body) {
      return NextResponse.json({ ok: false, error: "Missing title or body" }, { status: 400 });
    }

    const db = await getBlogDb();
    const doc: Omit<BlogAsset, '_id'> = {
      title: body.title,
      body: body.body,
      excerpt: body.excerpt || body.body.slice(0, 180),
      status: "published",
      platform: "blog",
      platform_metadata: {
        slug: body.slug || generateSlug(body.title),
        category: body.category || "General",
        tags: body.tags || [],
        authorName: body.author || "LeOS Team",
      },
      publish_at: new Date(),
      created_at: new Date(),
    };

    await db.collection("assets").insertOne(doc);
    return NextResponse.json({ ok: true, slug: doc.platform_metadata?.slug });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}

