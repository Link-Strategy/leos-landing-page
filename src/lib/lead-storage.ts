import { getBlogDb } from "./mongodb";
import { normalizeLeadInput, type LeadFieldError, type NormalizedLead } from "./lead-validation";
import { checkRateLimit } from "./rate-limit-db";

export interface Lead extends NormalizedLead {
  cv_key?: string;
  created_at: Date;
}

export interface LeadResult {
  success: boolean;
  lead_id?: string;
  lead?: Lead;
  error?: string;
  message?: string;
  fields?: LeadFieldError[];
}

/** Shared by /api/contact and /api/apply: 5 submissions per IP per 10 minutes (counted in MongoDB). */
export function checkLeadRateLimit(ip: string) {
  return checkRateLimit("lead", ip, { limit: 5, windowMs: 10 * 60 * 1000 });
}

export async function saveLead(
  data: Record<string, unknown>,
  options: { requirePhone?: boolean; cvKey?: string } = {},
): Promise<LeadResult> {
  const { lead: normalized, errors } = normalizeLeadInput(data, options);
  if (!normalized) {
    return { success: false, error: "VALIDATION_ERROR", message: "Vui lòng kiểm tra lại thông tin.", fields: errors };
  }

  const lead: Lead = {
    ...normalized,
    ...(options.cvKey ? { cv_key: options.cvKey } : {}),
    created_at: new Date(),
  };

  try {
    const db = await getBlogDb();
    const result = await db.collection("leads").insertOne(lead);
    return { success: true, lead_id: result.insertedId.toString(), lead };
  } catch (err) {
    console.error("[leads] insert failed:", err);
    return { success: false, error: "SERVER_ERROR", message: "Không thể lưu thông tin, vui lòng thử lại sau." };
  }
}
