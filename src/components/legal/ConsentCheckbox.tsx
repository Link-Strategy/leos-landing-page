"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

const COPY = {
  vi: { before: "Tôi đồng ý để LeTRON xử lý thông tin của tôi theo ", link: "Chính sách bảo mật", after: "." },
  en: { before: "I agree to LeTRON processing my information in accordance with the ", link: "Privacy policy", after: "." },
} as const;

/** Required, unticked-by-default consent box (Decree 13/2023 asks for explicit consent). Submits `consent=on`. */
export default function ConsentCheckbox({
  id = "consent",
  className = "",
  onChange,
}: {
  id?: string;
  className?: string;
  onChange?: (checked: boolean) => void;
}) {
  const t = COPY[useLocale() === "en" ? "en" : "vi"];

  return (
    <label htmlFor={id} className={`flex cursor-pointer items-start gap-3 text-sm leading-6 text-white/85 ${className}`}>
      <input
        id={id}
        name="consent"
        type="checkbox"
        required
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 size-4 shrink-0 cursor-pointer accent-[#2a9fff]"
      />
      <span>
        {t.before}
        <Link href="/chinh-sach-bao-mat" target="_blank" className="underline underline-offset-2 hover:text-white">
          {t.link}
        </Link>
        {t.after}
      </span>
    </label>
  );
}
