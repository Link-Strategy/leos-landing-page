import { after, NextRequest, NextResponse } from "next/server";
import { leadRateLimiter, saveLead } from "@/lib/lead-storage";
import { isHoneypotTriggered } from "@/lib/lead-validation";
import { formatLeadMessage, sendTelegramMessage } from "@/lib/notify/telegram";
import { getClientIp } from "@/lib/rate-limit";

const THANK_YOU = "Cảm ơn bạn! Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ success: false, error: "BAD_REQUEST", message: "Dữ liệu không hợp lệ." }, { status: 400 });
  }
  const data = body as Record<string, unknown>;

  // Bots get a normal-looking success so they don't adapt; nothing is stored.
  if (isHoneypotTriggered(data)) {
    return NextResponse.json({ success: true, message: THANK_YOU });
  }

  const limit = leadRateLimiter.check(getClientIp(request.headers));
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: "RATE_LIMITED", message: "Bạn đã gửi quá nhiều lần, vui lòng thử lại sau ít phút." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  const result = await saveLead(data);
  if (!result.success || !result.lead) {
    const status = result.error === "VALIDATION_ERROR" ? 400 : 500;
    return NextResponse.json(result, { status });
  }

  const lead = result.lead;
  after(() => sendTelegramMessage(formatLeadMessage(lead)));

  return NextResponse.json({ success: true, message: THANK_YOU, lead_id: result.lead_id });
}
