"use client";

import { useState, useRef, FormEvent } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  jobTitle: string;
}

export function JobApplyForm({ jobTitle }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cvName, setCvName] = useState("Không có tệp nào được chọn");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCvName(e.target.files[0].name);
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

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: `Ứng tuyển vị trí: ${jobTitle}. File đính kèm: ${cvName}`,
          source: "recruitment",
          lead_type: "job_application",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.message || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch {
      setError("Không thể kết nối tới máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="elementor-element elementor-element-cf46928 elementor-button-align-start form-data form_apply_job btn elementor-widget elementor-widget-form">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center backdrop-blur-md">
          <p className="text-emerald-300 font-semibold text-lg mb-2">Đăng ký thành công!</p>
          <p className="text-emerald-400/80 text-sm">
            Cảm ơn bạn đã nộp hồ sơ ứng tuyển. Chúng tôi sẽ phản hồi lại bạn trong thời gian sớm nhất.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="elementor-element elementor-element-cf46928 elementor-button-align-start form-data form_apply_job btn elementor-widget elementor-widget-form"
      data-e-type="widget"
      data-element_type="widget"
      data-id="cf46928"
      data-widget_type="form.default"
    >
      <form className="elementor-form" onSubmit={handleSubmit}>
        <div className="elementor-form-fields-wrapper elementor-labels-above">
          {error && (
            <div className="elementor-field-group elementor-col-100 mb-4 text-rose-400 text-sm font-semibold">
              {error}
            </div>
          )}

          <div className="elementor-field-type-text elementor-field-group elementor-column elementor-field-group-name elementor-col-100">
            <label className="elementor-field-label" htmlFor="form-field-name">
              Họ và tên
            </label>
            <input
              className="elementor-field elementor-size-sm elementor-field-textual"
              id="form-field-name"
              name="name"
              placeholder="Nhập họ và tên"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="elementor-field-type-email elementor-field-group elementor-column elementor-field-group-email elementor-col-100 elementor-field-required">
            <label className="elementor-field-label" htmlFor="form-field-email">
              Email
            </label>
            <input
              className="elementor-field elementor-size-sm elementor-field-textual"
              id="form-field-email"
              name="email"
              placeholder="Nhập email của bạn"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="elementor-field-type-tel elementor-field-group elementor-column elementor-field-group-field_4bc9d85 elementor-col-100 elementor-field-required">
            <label className="elementor-field-label" htmlFor="form-field-field_4bc9d85">
              Số điện thoại
            </label>
            <input
              className="elementor-field elementor-size-sm elementor-field-textual"
              id="form-field-field_4bc9d85"
              name="phone"
              pattern="[0-9()#&amp;+*-=.]+"
              placeholder="Nhập số điện thoại của bạn"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="elementor-field-type-html elementor-field-group elementor-column elementor-field-group-field_4703be9 elementor-col-100">
            <p className="my_form_label">Đính kèm CV</p>
            <button
              type="button"
              onClick={handleCvBtnClick}
              className="my_cv_btn flex items-center gap-2 cursor-pointer bg-transparent border-0 p-0 text-left w-full outline-hidden"
            >
              <img src="/wp-content/uploads/2026/05/File-input-button.svg" alt="Upload Icon" className="shrink-0 size-30" />
              <span className="my_file_cv_name text-sm text-white/80 select-none truncate">
                {cvName}
              </span>
            </button>
          </div>

          <div className="elementor-field-type-upload elementor-field-group elementor-column elementor-field-group-field_8c7cb99 elementor-col-100 hidden">
            <input
              ref={fileInputRef}
              className="elementor-field elementor-size-sm elementor-upload-field"
              id="form-field-field_8c7cb99"
              name="cv_file"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </div>

          <div className="elementor-field-group elementor-column elementor-field-type-submit elementor-col-100 e-form__buttons">
            <button
              className="elementor-button elementor-size-sm flex items-center justify-center gap-2 disabled:opacity-50  cursor-pointer!"
              type="submit"
              disabled={loading}
            >
              <span className="elementor-button-content-wrapper flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2 className="animate-spin size-5 text-white" />
                ) : (
                  <span className="elementor-button-icon shrink-0">
                    <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.5 10H17.5M17.5 10L12.5 15M17.5 10L12.5 5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </span>
                )}
                <span className="elementor-button-text">
                  {loading ? "Đang xử lý..." : "Nộp đơn ứng tuyển"}
                </span>
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
