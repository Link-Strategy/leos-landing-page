"use client";

import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

interface LeadFormProps {
  /** Where the lead came from, e.g. "lien-he" or "san-pham/ledb-bo-nao-so". */
  source: string;
  leadType?: "contact" | "product_inquiry";
  submitLabel?: string;
  messageRows?: number;
}

/**
 * Lead form rendered with Elementor's form markup/classes so it inherits the
 * page's existing widget styles (it replaces dead Elementor forms in static HTML).
 */
export default function LeadForm({
  source,
  leadType = "contact",
  submitLabel = "Gửi ngay",
  messageRows = 8,
}: LeadFormProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      message: form.get("message"),
      website: form.get("website"),
      source,
      lead_type: leadType,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setDone(data.message || "Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm.");
        return;
      }

      const errors: FieldErrors = {};
      for (const f of data.fields ?? []) errors[f.field as keyof FieldErrors] = f.message;
      setFieldErrors(errors);
      setError(data.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } catch {
      setError("Không thể kết nối tới máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center" role="status">
        <p className="mb-1 text-lg font-semibold text-emerald-600">Đã gửi thành công!</p>
        <p className="text-sm text-emerald-700">{done}</p>
      </div>
    );
  }

  const fieldHint = (field: keyof FieldErrors) =>
    fieldErrors[field] ? (
      <span className="mt-1 block text-xs font-medium text-rose-500" role="alert">
        {fieldErrors[field]}
      </span>
    ) : null;

  return (
    <form className="elementor-form" onSubmit={handleSubmit} noValidate aria-label="Form liên hệ">
      <div className="elementor-form-fields-wrapper elementor-labels-above">
        {/* Honeypot: hidden from people, filled by bots. */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
          <label htmlFor="lead-website">Website</label>
          <input id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="elementor-field-type-text elementor-field-group elementor-column elementor-field-group-name elementor-col-100 elementor-field-required">
          <input
            className="elementor-field elementor-size-md elementor-field-textual"
            name="name"
            placeholder="Họ & tên*"
            type="text"
            maxLength={100}
            required
            aria-invalid={!!fieldErrors.name}
          />
          {fieldHint("name")}
        </div>
        <div className="elementor-field-type-email elementor-field-group elementor-column elementor-field-group-email elementor-col-50 elementor-field-required">
          <input
            className="elementor-field elementor-size-md elementor-field-textual"
            name="email"
            placeholder="Email*"
            type="email"
            maxLength={200}
            required
            aria-invalid={!!fieldErrors.email}
          />
          {fieldHint("email")}
        </div>
        <div className="elementor-field-type-tel elementor-field-group elementor-column elementor-field-group-field_89f6fdf elementor-col-50">
          <input
            className="elementor-field elementor-size-md elementor-field-textual"
            name="phone"
            placeholder="Số điện thoại"
            type="tel"
            maxLength={30}
            aria-invalid={!!fieldErrors.phone}
          />
          {fieldHint("phone")}
        </div>
        <div className="elementor-field-type-textarea elementor-field-group elementor-column elementor-field-group-message elementor-col-100">
          <textarea
            className="elementor-field-textual elementor-field elementor-size-md"
            name="message"
            placeholder="Nội dung"
            rows={messageRows}
            maxLength={3000}
            aria-invalid={!!fieldErrors.message}
          />
          {fieldHint("message")}
        </div>

        {error && (
          <div className="elementor-field-group elementor-col-100 text-sm font-semibold text-rose-500" role="alert">
            {error}
          </div>
        )}

        <div className="elementor-field-group elementor-column elementor-field-type-submit elementor-col-100 e-form__buttons">
          <button className="elementor-button elementor-size-sm disabled:opacity-60" type="submit" disabled={loading}>
            <span className="elementor-button-content-wrapper">
              <span className="elementor-button-icon">
                {loading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M6 12H18M18 12L14 8M18 12L14 16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                )}
              </span>
              <span className="elementor-button-text">{loading ? "Đang gửi..." : submitLabel}</span>
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}
