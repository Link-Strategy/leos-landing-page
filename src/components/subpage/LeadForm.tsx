"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

export function LeadForm({
  compact = false,
  buttonLabel = "Gui yeu cau",
  source,
  lead_type,
}: {
  compact?: boolean;
  buttonLabel?: string;
  source?: string;
  lead_type?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
          message: formData.get("message") || undefined,
          source: source || "landing",
          lead_type: lead_type || "contact",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.message || "Co loi xay ra, vui long thu lai.");
      }
    } catch {
      setError("Khong the ket noi toi server. Vui long thu lai.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="relative z-10 rounded-[20px] border border-emerald-500/30 bg-emerald-500/10 p-6 text-center backdrop-blur-md">
        <p className="text-emerald-300 font-semibold text-lg mb-2">Da gui thanh cong!</p>
        <p className="text-emerald-400/70 text-sm">
          Cam on ban. Doi ngu LeOS se lien he lai trong thoi gian som nhat.
        </p>
      </div>
    );
  }

  return (
    <form
      className="relative z-10 flex flex-col gap-4 rounded-[20px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_2px_20px_rgba(12,178,255,0.12)] backdrop-blur-md"
      onSubmit={handleSubmit}
    >
      <div className={compact ? "grid gap-4 md:grid-cols-[1fr_auto]" : "grid gap-4"}>
        <label className="sr-only" htmlFor="lead-email">Email</label>
        <input
          className="h-12 rounded-full border border-white/12 bg-white/[0.08] px-5 text-[16px] text-white outline-none transition placeholder:text-white/45 focus:border-emerald-400/70"
          id="lead-email"
          name="email"
          placeholder="Email cua ban"
          required
          type="email"
        />
        {!compact ? (
          <>
            <label className="sr-only" htmlFor="lead-name">Ho va ten</label>
            <input
              className="h-12 rounded-full border border-white/12 bg-white/[0.08] px-5 text-[16px] text-white outline-none transition placeholder:text-white/45 focus:border-emerald-400/70"
              id="lead-name"
              name="name"
              placeholder="Ho va ten"
              required
              type="text"
            />
            <label className="sr-only" htmlFor="lead-message">Noi dung lien he</label>
            <textarea
              className="min-h-32 rounded-[20px] border border-white/12 bg-white/[0.08] px-5 py-4 text-[16px] text-white outline-none transition placeholder:text-white/45 focus:border-emerald-400/70"
              id="lead-message"
              name="message"
              placeholder="Noi dung lien he"
            />
          </>
        ) : null}
        <button
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 text-[16px] font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight aria-hidden className="size-4" />}
          {loading ? "Dang gui..." : buttonLabel}
        </button>
      </div>
      {error ? (
        <p className="text-sm leading-6 text-red-400">{error}</p>
      ) : null}
    </form>
  );
}
