import { NextRequest, NextResponse } from "next/server";
import { saveLead } from "@/lib/lead-storage";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "BAD_REQUEST", message: "Invalid request body" },
        { status: 400 }
      );
    }

    const result = await saveLead(body);

    if (!result.success) {
      const status = result.error === "VALIDATION_ERROR" ? 400 : 500;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(
      { success: true, message: "Cam on ban. Chung toi se lien he lai som nhat.", lead_id: result.lead_id },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR", message: (error as Error).message },
      { status: 500 }
    );
  }
}
