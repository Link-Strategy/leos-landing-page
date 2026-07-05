import { NextRequest, NextResponse } from "next/server";
import { getBlogDb } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { articleExternalId, ctaId, destinationUrl } = await request.json();
    if (!articleExternalId || !ctaId) {
      return NextResponse.json({ ok: false, error: "Missing articleExternalId or ctaId" }, { status: 400 });
    }

    const db = await getBlogDb();
    await db.collection("click_events").insertOne({
      articleExternalId,
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
