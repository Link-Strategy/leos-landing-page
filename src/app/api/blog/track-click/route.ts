import { NextRequest, NextResponse } from "next/server";
import { getBlogDb } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { articleId, ctaId, destinationUrl } = await request.json();
    if (!articleId || !ctaId) {
      return NextResponse.json({ ok: false, error: "Missing articleId or ctaId" }, { status: 400 });
    }

    const db = await getBlogDb();
    await db.collection("click_events").insertOne({
      articleId,
      ctaId,
      destinationUrl: destinationUrl || "",
      sourcePath: request.headers.get("referer") || "",
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
