import { randomUUID } from "node:crypto";
import { after, NextRequest, NextResponse } from "next/server";
import { buildCvKey, CV_MAX_BYTES, detectCvType } from "@/lib/cv-file";
import { checkLeadRateLimit, saveLead } from "@/lib/lead-storage";
import { isHoneypotTriggered, normalizeLeadInput } from "@/lib/lead-validation";
import { notifyLead } from "@/lib/notify";
import { getClientIp } from "@/lib/rate-limit";
import { getPresignedDownloadUrl, putPrivateObject } from "@/lib/s3";

/**
 * POST /api/apply — job application (multipart/form-data).
 * Fields: name, email, phone, job_title, job_slug, website (honeypot), cv_file (pdf/doc/docx ≤ 5MB).
 * The CV is stored privately on S3; Telegram + email notifications carry a 7-day presigned link.
 */
const THANK_YOU = "Cảm ơn bạn đã ứng tuyển! Bộ phận tuyển dụng sẽ liên hệ với bạn sớm.";

function fieldError(field: string, code: string, message: string) {
  return NextResponse.json(
    { success: false, error: "VALIDATION_ERROR", message, fields: [{ field, code, message }] },
    { status: 400 },
  );
}

export async function POST(request: NextRequest) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ success: false, error: "BAD_REQUEST", message: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  for (const key of ["name", "email", "phone", "job_title", "job_slug", "website", "consent"]) {
    const value = form.get(key);
    if (typeof value === "string") data[key] = value;
  }

  if (isHoneypotTriggered(data)) {
    return NextResponse.json({ success: true, message: THANK_YOU });
  }

  const limit = await checkLeadRateLimit(getClientIp(request.headers));
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: "RATE_LIMITED", message: "Bạn đã gửi quá nhiều lần, vui lòng thử lại sau ít phút." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  const file = form.get("cv_file");
  if (!(file instanceof File) || file.size === 0) {
    return fieldError("cv_file", "CV_REQUIRED", "Vui lòng đính kèm CV.");
  }
  if (file.size > CV_MAX_BYTES) {
    return fieldError("cv_file", "CV_TOO_LARGE", "CV tối đa 5MB.");
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const cvType = detectCvType(file.name, bytes.subarray(0, 8));
  if (!cvType) {
    return fieldError("cv_file", "CV_INVALID_TYPE", "CV phải là file PDF, DOC hoặc DOCX.");
  }

  const jobTitle = String(data.job_title ?? "").trim().slice(0, 200);
  const jobSlug = String(data.job_slug ?? "").trim().slice(0, 120);
  const leadInput = {
    consent: data.consent,
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: jobTitle ? `Ứng tuyển vị trí: ${jobTitle}` : undefined,
    source: jobSlug ? `tuyen-dung/${jobSlug}` : "tuyen-dung",
    lead_type: "job_application",
  };

  // Validate the form before touching S3: a rejected submission must not leave an orphan CV behind.
  const check = normalizeLeadInput(leadInput, { requirePhone: true });
  if (!check.lead) {
    return NextResponse.json(
      { success: false, error: "VALIDATION_ERROR", message: "Vui lòng kiểm tra lại thông tin.", fields: check.errors },
      { status: 400 },
    );
  }

  const cvKey = buildCvKey(file.name, randomUUID());
  try {
    await putPrivateObject(cvKey, bytes, cvType.contentType);
  } catch (error) {
    console.error("[apply] CV upload failed:", error);
    return NextResponse.json(
      { success: false, error: "UPLOAD_FAILED", message: "Không thể tải CV lên, vui lòng thử lại sau." },
      { status: 500 },
    );
  }

  const result = await saveLead(leadInput, { requirePhone: true, cvKey });
  if (!result.success || !result.lead) {
    const status = result.error === "VALIDATION_ERROR" ? 400 : 500;
    return NextResponse.json(result, { status });
  }

  const lead = result.lead;
  after(async () => {
    let cvUrl: string | undefined;
    try {
      cvUrl = await getPresignedDownloadUrl(cvKey);
    } catch (error) {
      console.error("[apply] presign failed:", error);
    }
    await notifyLead(lead, { cvUrl });
  });

  return NextResponse.json({ success: true, message: THANK_YOU, lead_id: result.lead_id });
}
