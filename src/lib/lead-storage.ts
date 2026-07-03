import { getBlogDb } from "./mongodb";

export interface Lead {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source?: string;
  lead_type?: string;
  created_at: Date;
}

export interface LeadResult {
  success: boolean;
  lead_id?: string;
  error?: string;
  message?: string;
  fields?: Array<{ field: string; code: string; message: string }>;
}

export function validateLead(data: Record<string, unknown>): LeadResult {
  const errors: Array<{ field: string; code: string; message: string }> = [];
  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim();

  if (!name || name.length < 2) {
    errors.push({ field: "name", code: "NAME_TOO_SHORT", message: "Ten phai co it nhat 2 ky tu" });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: "email", code: "INVALID_EMAIL", message: "Email khong hop le" });
  }

  if (errors.length > 0) {
    return { success: false, error: "VALIDATION_ERROR", fields: errors };
  }

  return { success: true };
}

export async function saveLead(data: Record<string, unknown>): Promise<LeadResult> {
  const validation = validateLead(data);
  if (!validation.success) return validation;

  const lead: Lead = {
    name: String(data.name || "").trim(),
    email: String(data.email || "").trim(),
    phone: String(data.phone || "").trim() || undefined,
    company: String(data.company || "").trim() || undefined,
    message: String(data.message || "").trim() || undefined,
    source: String(data.source || "landing").trim() || undefined,
    lead_type: String(data.lead_type || "contact").trim() || undefined,
    created_at: new Date(),
  };

  try {
    const db = await getBlogDb();
    const result = await db.collection("leads").insertOne(lead);
    return { success: true, lead_id: result.insertedId.toString() };
  } catch (err) {
    return { success: false, error: "SERVER_ERROR", message: err instanceof Error ? err.message : String(err) };
  }
}
