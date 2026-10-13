"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import ConsentCheckbox from "@/components/legal/ConsentCheckbox";

const fieldWrapperStyle = {
  backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.0576) 100%)",
};

const fieldInnerStyle = {
  // Second layer replaces the brightness the old nested blur used to add (fields have no backdrop-filter now).
  backgroundImage:
    "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(235,247,255,0.05) 100%), linear-gradient(rgba(127,176,238,0.3), rgba(127,176,238,0.3))",
  boxShadow: "inset 0 2px 16px 0 rgba(0,149,255,0.26)",
};

const inputClass =
  "h-13 w-full rounded-full bg-transparent px-6 text-[15px] text-white outline-none transition placeholder:text-white/70 focus:ring-2 focus:ring-[#2A9FFF]/60";

export function LeadForm({
  buttonLabel = "Gửi yêu cầu",
  source,
  lead_type,
  namePlaceholder = "Họ và tên",
  emailPlaceholder = "Email của bạn",
  phonePlaceholder = "Số điện thoại",
  messagePlaceholder = "Nội dung liên hệ",
  submitAlign = "left",
  phoneRequired = true,
  organizationPlaceholder,
  interestLabel,
  interestPlaceholder,
  interestOptions,
  counterSuffix,
  maxMessage,
  notice,
  thankYou,
  defaultInterest,
  defaultMessage,
}: {
  buttonLabel?: string;
  source?: string;
  lead_type?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  phonePlaceholder?: string;
  messagePlaceholder?: string;
  submitAlign?: "left" | "center";
  /** Phone is required by default; the V2 contact form makes it optional. */
  phoneRequired?: boolean;
  /** V2 contact form extras: show an organization field, an interest select and a character counter. */
  organizationPlaceholder?: string;
  interestLabel?: string;
  interestPlaceholder?: string;
  interestOptions?: string[];
  counterSuffix?: string;
  maxMessage?: number;
  notice?: string;
  /** V2 confirmation: heading, text and three preparation steps shown after a successful send. */
  thankYou?: { title: string; body: string; steps: { eyebrow: string; title: string; body: string }[] };
  /** Pre-filled by the contact dialog from what the visitor clicked. */
  defaultInterest?: string;
  defaultMessage?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageLength, setMessageLength] = useState(defaultMessage?.length ?? 0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone") || undefined,
          company: formData.get("company") || undefined,
          interest: formData.get("interest") || undefined,
          message: formData.get("message") || undefined,
          website: formData.get("website") || undefined,
          consent: formData.get("consent") === "on",
          source: source || "landing",
          lead_type: lead_type || "contact",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        // Validation errors come back per field (src/lib/lead-validation.ts); show them all.
        const fieldMessages = Array.isArray(data.fields)
          ? data.fields.map((f: { message?: string }) => f.message).filter(Boolean).join(" · ")
          : "";
        setError(fieldMessages || data.message || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch {
      setError("Không thể kết nối tới server. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    if (thankYou) {
      return (
        <div className="flex flex-col gap-4 rounded-2xl border border-white/15 bg-white/10 p-6">
          <p className="m-0 text-lg font-semibold text-emerald-300">{thankYou.title}</p>
          <p className="m-0 text-sm text-white/80">{thankYou.body}</p>
          <ul className="m-0 grid list-none gap-3 p-0">
            {thankYou.steps.map((step) => (
              <li key={step.title} className="rounded-xl border border-white/20 bg-white/5 p-4">
                <p className="m-0 text-[11px] font-bold uppercase tracking-[1.6px] text-[#63D9FF]">{step.eyebrow}</p>
                <p className="m-0 mt-1 text-base font-semibold text-white">{step.title}</p>
                <p className="m-0 mt-1 text-sm leading-6 text-white/75">{step.body}</p>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return (
      <div className="rounded-2xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur-md">
        <p className="mb-2 text-lg font-semibold text-emerald-300">Đã gửi thành công!</p>
        <p className="text-sm text-white/70">
          Cảm ơn bạn. Đội ngũ LeTRON sẽ liên hệ lại trong thời gian sớm nhất.
        </p>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {/* Honeypot: hidden from people, filled by bots; /api/contact silently drops these. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <input autoComplete="off" name="website" tabIndex={-1} type="text" />
      </div>
      <label className="sr-only" htmlFor="lead-name">Họ và tên</label>
      <div className="rounded-full p-px" style={fieldWrapperStyle}>
        <input className={inputClass} id="lead-name" name="name" placeholder={namePlaceholder} style={fieldInnerStyle} type="text" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-full p-px" style={fieldWrapperStyle}>
          <label className="sr-only" htmlFor="lead-email">Email</label>
          <input className={inputClass} id="lead-email" name="email" placeholder={emailPlaceholder} required style={fieldInnerStyle} type="email" />
        </div>
        <div className="rounded-full p-px" style={fieldWrapperStyle}>
          <label className="sr-only" htmlFor="lead-phone">Số điện thoại</label>
          <input className={inputClass} id="lead-phone" name="phone" placeholder={phonePlaceholder} required={phoneRequired} style={fieldInnerStyle} type="tel" />
        </div>
      </div>

      {organizationPlaceholder ? (
        <>
          <label className="sr-only" htmlFor="lead-company">{organizationPlaceholder}</label>
          <div className="rounded-full p-px" style={fieldWrapperStyle}>
            <input className={inputClass} id="lead-company" maxLength={200} name="company" placeholder={organizationPlaceholder} style={fieldInnerStyle} type="text" />
          </div>
        </>
      ) : null}

      {interestOptions && interestOptions.length > 0 ? (
        <>
          <label className="sr-only" htmlFor="lead-interest">{interestLabel ?? interestPlaceholder}</label>
          <div className="rounded-full p-px" style={fieldWrapperStyle}>
            <select className={`${inputClass} appearance-none`} defaultValue={defaultInterest && interestOptions.includes(defaultInterest) ? defaultInterest : ""} id="lead-interest" name="interest" style={fieldInnerStyle}>
              <option value="" style={{ color: "#0d1b4b" }}>{interestPlaceholder}</option>
              {interestOptions.map((option) => (
                <option key={option} style={{ color: "#0d1b4b" }} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </>
      ) : null}

      <label className="sr-only" htmlFor="lead-message">Nội dung liên hệ</label>
      <div className="rounded-[26px] p-px" style={fieldWrapperStyle}>
        <textarea
          className="h-36 w-full resize-none rounded-[26px] bg-transparent px-6 py-4 text-[15px] leading-relaxed text-white outline-none transition placeholder:text-white/70 focus:ring-2 focus:ring-[#2A9FFF]/60"
          id="lead-message"
          name="message"
          defaultValue={defaultMessage}
          maxLength={maxMessage}
          required={Boolean(maxMessage)}
          onChange={(e) => setMessageLength(e.target.value.length)}
          placeholder={messagePlaceholder}
          style={fieldInnerStyle}
        />
      </div>
      {maxMessage ? (
        <p className="m-0 -mt-2 text-right text-xs text-white/60">
          {messageLength.toLocaleString("vi-VN")} {counterSuffix ?? `/ ${maxMessage}`}
        </p>
      ) : null}
      {notice ? <p className="m-0 text-xs leading-5 text-white/65">{notice}</p> : null}

      <ConsentCheckbox id="lead-consent" />

      {error ? <p className="text-sm leading-6 text-red-200">{error}</p> : null}

      <div className={`pt-2 ${submitAlign === "center" ? "flex justify-center" : ""}`}>
        <div
          className="inline-block rounded-full p-px transition-transform duration-300 hover:-translate-y-1"
          style={{ backgroundImage: "linear-gradient(180deg, #31B0FF 0%, #81AEF2 100%)" }}
        >
          <button
            className="relative flex h-13 cursor-pointer items-center gap-2 overflow-hidden rounded-full px-7 text-base font-semibold text-white transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            style={{
              backgroundImage: "linear-gradient(180deg, #76C6FF 0%, #2A75F3 100%)",
              boxShadow:
                "inset 0 -4px 16px 0 rgba(0,106,255,0.30), inset 0 -2px 6px 0 rgba(255,255,255,0.75), inset 0 -3px 0 0 rgba(30,154,255,0.18), 0 1px 10px 0 rgba(0,0,0,0.15)",
            }}
            type="submit"
          >
            {buttonLabel}
            {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight aria-hidden className="size-4" />}
          </button>
        </div>
      </div>
    </form>
  );
}
