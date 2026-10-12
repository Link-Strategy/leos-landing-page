// Lead notifications to a Telegram group. Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.
// No alias imports so tests can import this file directly.

export function escapeTelegramHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

type LeadForNotification = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  interest?: string;
  message?: string;
  source?: string;
  lead_type?: string;
};

const LEAD_TYPE_LABELS: Record<string, string> = {
  contact: "📩 Lead liên hệ mới",
  product_inquiry: "📦 Yêu cầu tư vấn sản phẩm",
  job_application: "🧑‍💼 Hồ sơ ứng tuyển mới",
};

export function formatLeadMessage(lead: LeadForNotification, extra: { cvUrl?: string } = {}) {
  const e = escapeTelegramHtml;
  const lines = [
    `<b>${LEAD_TYPE_LABELS[lead.lead_type ?? ""] ?? "📩 Lead mới"}</b>`,
    `👤 ${e(lead.name)}`,
    `✉️ ${e(lead.email)}`,
  ];
  if (lead.phone) lines.push(`📞 ${e(lead.phone)}`);
  if (lead.company) lines.push(`🏢 ${e(lead.company)}`);
  if (lead.interest) lines.push(`🎯 ${e(lead.interest)}`);
  if (lead.source) lines.push(`🔗 Nguồn: ${e(lead.source)}`);
  if (lead.message) lines.push("", e(lead.message.slice(0, 1500)));
  if (extra.cvUrl) lines.push("", `📎 <a href="${e(extra.cvUrl)}">Tải CV</a> (link hết hạn sau 7 ngày)`);
  return lines.join("\n");
}

/** Never throws: a failed notification must not fail the form submission. */
export async function sendTelegramMessage(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    console.warn("[telegram] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set — notification skipped");
    return false;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
    if (!res.ok) {
      console.error("[telegram] sendMessage failed:", res.status, (await res.text()).slice(0, 200));
      return false;
    }
    return true;
  } catch (error) {
    console.error("[telegram] sendMessage error:", (error as Error).message);
    return false;
  }
}
