"use client";

import { useState, useRef, FormEvent } from "react";
import { Loader2 } from "lucide-react";
import ConsentCheckbox from "@/components/legal/ConsentCheckbox";

interface Props {
  jobTitle: string;
  jobSlug: string;
}

const CV_MAX_BYTES = 5 * 1024 * 1024;
const CV_EXTENSIONS = ["pdf", "doc", "docx"];

export function JobApplyForm({ jobTitle, jobSlug }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cvName, setCvName] = useState("Không có tệp nào được chọn");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCvName(e.target.files[0].name);
      setError("");
    } else {
      setCvName("Không có tệp nào được chọn");
    }
  };

  const handleCvBtnClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name.trim() || name.trim().length < 2) {
      setError("Họ và tên phải có ít nhất 2 ký tự");
      setLoading(false);
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email không hợp lệ");
      setLoading(false);
      return;
    }
    if (!phone.trim()) {
      setError("Số điện thoại là bắt buộc");
      setLoading(false);
      return;
    }

    if (!consent) {
      setError("Vui lòng đồng ý với Chính sách bảo mật để gửi hồ sơ");
      setLoading(false);
      return;
    }

    const cvFile = fileInputRef.current?.files?.[0];
    if (!cvFile) {
      setError("Vui lòng đính kèm CV");
      setLoading(false);
      return;
    }
    if (!CV_EXTENSIONS.includes(cvFile.name.toLowerCase().split(".").pop() ?? "")) {
      setError("CV phải là file PDF, DOC hoặc DOCX");
      setLoading(false);
      return;
    }
    if (cvFile.size > CV_MAX_BYTES) {
      setError("CV tối đa 5MB");
      setLoading(false);
      return;
    }

    const body = new FormData();
    body.set("name", name.trim());
    body.set("email", email.trim());
    body.set("phone", phone.trim());
    body.set("job_title", jobTitle);
    body.set("job_slug", jobSlug);
    body.set("website", websiteRef.current?.value ?? "");
    body.set("consent", consent ? "true" : "");
    body.set("cv_file", cvFile);

    try {
      const res = await fetch("/api/apply", { method: "POST", body });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.fields?.[0]?.message || data.message || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch {
      setError("Không thể kết nối tới máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center backdrop-blur-md">
          <p className="text-emerald-300 font-semibold text-lg mb-2">Đăng ký thành công!</p>
          <p className="text-emerald-400/80 text-sm">
            Cảm ơn bạn đã nộp hồ sơ ứng tuyển. Chúng tôi sẽ phản hồi lại bạn trong thời gian sớm nhất.
          </p>
        </div>
      </div>
    );
  }

  const labelClass = "mb-2 block font-archivo text-sm font-semibold text-white";
  const inputClass =
    "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-sans text-sm text-white placeholder:text-white/40 shadow-[inset_0_2px_8px_rgba(0,149,255,0.12)] outline-hidden transition-colors focus:border-[#2A9FFF]";

  return (
    <div className="w-full">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {/* Honeypot: hidden from people, filled by bots. */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
          <input ref={websiteRef} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {error && <div className="text-sm font-semibold text-rose-400">{error}</div>}

        <div>
          <label className={labelClass} htmlFor="form-field-name">
            Họ và tên
          </label>
          <input
            className={inputClass}
            id="form-field-name"
            name="name"
            placeholder="Nhập họ và tên"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="form-field-email">
            Email
          </label>
          <input
            className={inputClass}
            id="form-field-email"
            name="email"
            placeholder="Nhập email của bạn"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="form-field-phone">
            Số điện thoại
          </label>
          <input
            className={inputClass}
            id="form-field-phone"
            name="phone"
            pattern="[0-9()#&amp;+*-=.]+"
            placeholder="Nhập số điện thoại của bạn"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <p className={labelClass}>Đính kèm CV</p>
          <button
            type="button"
            onClick={handleCvBtnClick}
            className="flex w-full cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-left outline-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/recruitment/File-input-button.svg" alt="Upload Icon" className="h-[39px] w-[123px] shrink-0" />
            <span className="select-none truncate text-sm text-white/80">{cvName}</span>
          </button>
          <input
            ref={fileInputRef}
            className="hidden"
            id="form-field-cv"
            name="cv_file"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
        </div>

        <div>
          <ConsentCheckbox id="apply-consent" onChange={setConsent} />
        </div>

        <div>
          <button
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-0 bg-[linear-gradient(180deg,#4DB1FF_0%,#2A9FFF_100%)] px-6 py-2.5 font-archivo text-base font-semibold text-white shadow-[0_4px_16px_rgba(42,159,255,0.3)] transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin text-white" />
            ) : (
              <svg className="shrink-0" fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 10H17.5M17.5 10L12.5 15M17.5 10L12.5 5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            )}
            <span>{loading ? "Đang xử lý..." : "Nộp đơn ứng tuyển"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
