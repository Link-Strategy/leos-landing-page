import { sendLeadEmail } from "./email";
import { formatLeadMessage, sendTelegramMessage } from "./telegram";

type LeadForNotification = Parameters<typeof formatLeadMessage>[0];

/** Notify the team on every configured channel (Telegram + email). Never throws. */
export async function notifyLead(lead: LeadForNotification, extra: { cvUrl?: string } = {}) {
  await Promise.allSettled([
    sendTelegramMessage(formatLeadMessage(lead, extra)),
    sendLeadEmail(lead, extra),
  ]);
}
