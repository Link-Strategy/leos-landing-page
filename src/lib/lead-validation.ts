// Pure lead validation (no Next/Mongo imports) — imported directly by test/lead.test.js.

export type LeadFieldError = { field: string; code: string; message: string };

export type NormalizedLead = {
  /** Explicit consent to the privacy policy (Decree 13/2023); stored with the time it was given. */
  consent: true;
  consent_at: Date;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source: string;
  lead_type: string;
};

export const LEAD_LIMITS = {
  name: 100,
  email: 200,
  phone: 30,
  company: 200,
  message: 3000,
  source: 120,
  lead_type: 50,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+().\-\s]+$/;

function text(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
}

/** Bots fill every input; the hidden `website` field must stay empty for real users. */
export function isHoneypotTriggered(data: Record<string, unknown>) {
  return text(data.website) !== "";
}

function isConsentGiven(value: unknown) {
  return value === true || value === "true" || value === "on";
}

export function normalizeLeadInput(
  data: Record<string, unknown>,
  options: { requirePhone?: boolean; now?: Date } = {},
): { lead?: NormalizedLead; errors: LeadFieldError[] } {
  const errors: LeadFieldError[] = [];

  if (!isConsentGiven(data.consent)) {
    errors.push({
      field: "consent",
      code: "CONSENT_REQUIRED",
      message: "Vui lòng đồng ý với Chính sách bảo mật để gửi thông tin",
    });
  }
  const name = text(data.name);
  const email = text(data.email);
  const phone = text(data.phone);
  const company = text(data.company);
  const message = text(data.message);
  const source = text(data.source) || "landing";
  const leadType = text(data.lead_type) || "contact";

  if (name.length < 2) {
    errors.push({ field: "name", code: "NAME_TOO_SHORT", message: "Họ tên phải có ít nhất 2 ký tự" });
  } else if (name.length > LEAD_LIMITS.name) {
    errors.push({ field: "name", code: "NAME_TOO_LONG", message: `Họ tên tối đa ${LEAD_LIMITS.name} ký tự` });
  }

  if (!EMAIL_PATTERN.test(email) || email.length > LEAD_LIMITS.email) {
    errors.push({ field: "email", code: "INVALID_EMAIL", message: "Email không hợp lệ" });
  }

  if (phone) {
    const digits = phone.replace(/\D/g, "").length;
    if (!PHONE_PATTERN.test(phone) || digits < 8 || digits > 15 || phone.length > LEAD_LIMITS.phone) {
      errors.push({ field: "phone", code: "INVALID_PHONE", message: "Số điện thoại không hợp lệ" });
    }
  } else if (options.requirePhone) {
    errors.push({ field: "phone", code: "PHONE_REQUIRED", message: "Vui lòng nhập số điện thoại" });
  }

  if (company.length > LEAD_LIMITS.company) {
    errors.push({ field: "company", code: "COMPANY_TOO_LONG", message: `Tên công ty tối đa ${LEAD_LIMITS.company} ký tự` });
  }
  if (message.length > LEAD_LIMITS.message) {
    errors.push({ field: "message", code: "MESSAGE_TOO_LONG", message: `Nội dung tối đa ${LEAD_LIMITS.message} ký tự` });
  }

  if (errors.length > 0) return { errors };

  return {
    errors,
    lead: {
      consent: true,
      consent_at: options.now ?? new Date(),
      name,
      email: email.toLowerCase(),
      phone: phone || undefined,
      company: company || undefined,
      message: message || undefined,
      source: source.slice(0, LEAD_LIMITS.source),
      lead_type: leadType.slice(0, LEAD_LIMITS.lead_type),
    },
  };
}
