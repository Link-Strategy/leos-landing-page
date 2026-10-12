// Lead notification emails over the company's existing SMTP mailbox.
// Env: SMTP_HOST, SMTP_PORT (default 465), SMTP_SECURE (default: port 465), SMTP_USER, SMTP_PASS,
//      MAIL_FROM (default SMTP_USER), LEAD_EMAIL_TO_SALES (contact/product leads), LEAD_EMAIL_TO_HR (job applications).
// No alias imports so tests can import this file directly.

type LeadForEmail = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source?: string;
  lead_type?: string;
};

const SUBJECTS: Record<string, string> = {
  contact: "Lead liên hệ mới",
  product_inquiry: "Yêu cầu tư vấn sản phẩm",
  job_application: "Hồ sơ ứng tuyển mới",
};

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Recipient list for a lead type, from comma-separated env values. */
export function getLeadRecipients(leadType: string | undefined, env: Record<string, string | undefined> = process.env) {
  const raw = leadType === "job_application" ? env.LEAD_EMAIL_TO_HR : env.LEAD_EMAIL_TO_SALES;
  return (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function formatLeadEmail(lead: LeadForEmail, extra: { cvUrl?: string } = {}) {
  // Header values must not carry newlines (header injection); user text is escaped in HTML.
  const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();
  const subject = `[LeTRON] ${SUBJECTS[lead.lead_type ?? ""] ?? "Lead mới"}: ${oneLine(lead.name).slice(0, 80)}`;

  const rows: Array<[string, string]> = [
    ["Họ tên", lead.name],
    ["Email", lead.email],
  ];
  if (lead.phone) rows.push(["Điện thoại", lead.phone]);
  if (lead.company) rows.push(["Công ty", lead.company]);
  if (lead.source) rows.push(["Nguồn", lead.source]);

  const text = [
    ...rows.map(([k, v]) => `${k}: ${v}`),
    ...(lead.message ? ["", lead.message] : []),
    ...(extra.cvUrl ? ["", `Tải CV (link hết hạn sau 7 ngày): ${extra.cvUrl}`] : []),
  ].join("\n");

  const e = escapeHtml;
  const html = `<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
${rows.map(([k, v]) => `<tr><td style="color:#555"><b>${e(k)}</b></td><td>${e(v)}</td></tr>`).join("\n")}
</table>${lead.message ? `<p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${e(lead.message)}</p>` : ""}${
    extra.cvUrl
      ? `<p style="font-family:Arial,sans-serif;font-size:14px"><a href="${e(extra.cvUrl)}">Tải CV</a> (link hết hạn sau 7 ngày)</p>`
      : ""
  }`;

  return { subject, text, html };
}

/** Never throws: a failed email must not fail the form submission. */
export async function sendLeadEmail(lead: LeadForEmail, extra: { cvUrl?: string } = {}): Promise<boolean> {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  const to = getLeadRecipients(lead.lead_type);
  if (!host || !user || !pass || to.length === 0) {
    console.warn("[email] SMTP_* or LEAD_EMAIL_TO_* not set — email notification skipped");
    return false;
  }

  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;

  try {
    const { createTransport } = await import("nodemailer");
    const transporter = createTransport({ host, port, secure, auth: { user, pass } });
    const { subject, text, html } = formatLeadEmail(lead, extra);
    await transporter.sendMail({
      from: process.env.MAIL_FROM?.trim() || user,
      to,
      replyTo: lead.email,
      subject,
      text,
      html,
    });
    return true;
  } catch (error) {
    console.error("[email] sendMail failed:", (error as Error).message);
    return false;
  }
}
