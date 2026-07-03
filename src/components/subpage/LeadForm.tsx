"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";

export function LeadForm({
  compact = false,
  buttonLabel = "Gửi yêu cầu",
}: {
  compact?: boolean;
  buttonLabel?: string;
}) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <form
      className="relative z-10 flex flex-col gap-4 rounded-[20px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_2px_20px_rgba(12,178,255,0.12)] backdrop-blur-md"
      onSubmit={handleSubmit}
    >
      <div className={compact ? "grid gap-4 md:grid-cols-[1fr_auto]" : "grid gap-4"}>
        <label className="sr-only" htmlFor="lead-email">
          Email
        </label>
        <input
          className="h-12 rounded-full border border-white/12 bg-white/[0.08] px-5 text-[16px] text-white outline-none transition placeholder:text-white/45 focus:border-emerald-400/70"
          id="lead-email"
          name="email"
          placeholder="Email của bạn"
          required
          type="email"
        />
        {!compact ? (
          <>
            <label className="sr-only" htmlFor="lead-name">
              Họ và tên
            </label>
            <input
              className="h-12 rounded-full border border-white/12 bg-white/[0.08] px-5 text-[16px] text-white outline-none transition placeholder:text-white/45 focus:border-emerald-400/70"
              id="lead-name"
              name="name"
              placeholder="Họ và tên"
              type="text"
            />
            <label className="sr-only" htmlFor="lead-message">
              Nội dung liên hệ
            </label>
            <textarea
              className="min-h-32 rounded-[20px] border border-white/12 bg-white/[0.08] px-5 py-4 text-[16px] text-white outline-none transition placeholder:text-white/45 focus:border-emerald-400/70"
              id="lead-message"
              name="message"
              placeholder="Nội dung liên hệ"
            />
          </>
        ) : null}
        <button className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 text-[16px] font-semibold text-white transition hover:bg-emerald-400" type="submit">
          {buttonLabel}
          <ArrowRight aria-hidden className="size-4" />
        </button>
      </div>
      {submitted ? (
        <p className="text-sm leading-6 text-emerald-300">
          Cảm ơn bạn. Đội ngũ LeTRON sẽ liên hệ lại trong thời gian sớm nhất.
        </p>
      ) : null}
    </form>
  );
}
