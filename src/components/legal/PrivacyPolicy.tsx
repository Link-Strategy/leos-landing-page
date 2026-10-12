import { ORGANIZATION } from "@/lib/jsonld";

export const PRIVACY_POLICY_UPDATED = "12/10/2026";

type Section = { heading: string; paragraphs?: string[]; items?: string[] };

const CONTENT: Record<"vi" | "en", { title: string; intro: string; updatedLabel: string; sections: Section[] }> = {
  vi: {
    title: "Chính sách bảo mật",
    updatedLabel: "Cập nhật lần cuối",
    intro:
      "Chính sách này giải thích cách Công ty Cổ phần Tập đoàn LeTRON (“LeTRON”) thu thập, sử dụng và bảo vệ dữ liệu cá nhân của bạn khi bạn sử dụng website letrongroup.com, phù hợp với Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.",
    sections: [
      {
        heading: "1. Dữ liệu chúng tôi thu thập",
        items: [
          "Khi bạn gửi form liên hệ hoặc form tư vấn sản phẩm: họ tên, email, số điện thoại (nếu bạn nhập), nội dung tin nhắn và trang bạn gửi form.",
          "Khi bạn ứng tuyển: họ tên, email, số điện thoại, vị trí ứng tuyển và tệp CV (PDF, DOC hoặc DOCX) bạn tải lên.",
          "Dữ liệu kỹ thuật: địa chỉ IP được dùng tạm thời để giới hạn gửi form liên tục (chống spam) và không được lưu lại cùng thông tin của bạn; cookie NEXT_LOCALE ghi nhớ ngôn ngữ bạn chọn.",
        ],
      },
      {
        heading: "2. Mục đích sử dụng",
        items: [
          "Phản hồi yêu cầu liên hệ, tư vấn sản phẩm và giải pháp của LeTRON.",
          "Tiếp nhận và xem xét hồ sơ ứng tuyển, liên hệ ứng viên.",
          "Vận hành, bảo vệ và cải thiện website.",
        ],
        paragraphs: ["Chúng tôi không bán dữ liệu cá nhân của bạn và không dùng vào mục đích khác khi chưa có sự đồng ý của bạn."],
      },
      {
        heading: "3. Lưu trữ và bên xử lý dữ liệu",
        items: [
          "Thông tin form được lưu trong cơ sở dữ liệu MongoDB của LeTRON.",
          "Tệp CV được lưu ở dạng riêng tư trên Amazon S3; chỉ nhân sự phụ trách tuyển dụng nhận được liên kết tải có thời hạn 7 ngày.",
          "Khi có yêu cầu mới, LeTRON có thể gửi thông báo nội bộ (qua email hoặc ứng dụng nhắn tin nội bộ như Telegram) tới bộ phận kinh doanh hoặc nhân sự.",
          "Website được vận hành trên hạ tầng Vercel.",
        ],
      },
      {
        heading: "4. Thời gian lưu trữ",
        paragraphs: [
          "Chúng tôi lưu dữ liệu trong thời gian cần thiết để thực hiện các mục đích nêu trên hoặc theo yêu cầu của pháp luật, sau đó xóa hoặc ẩn danh hóa.",
        ],
      },
      {
        heading: "5. Quyền của bạn",
        paragraphs: [
          "Bạn có quyền yêu cầu truy cập, chỉnh sửa, xóa dữ liệu cá nhân, rút lại sự đồng ý hoặc phản đối việc xử lý dữ liệu. Hãy gửi yêu cầu tới email bên dưới; chúng tôi sẽ phản hồi trong thời hạn theo quy định của pháp luật.",
        ],
      },
      {
        heading: "6. Liên hệ",
        items: [
          `Công ty Cổ phần Tập đoàn LeTRON`,
          `Địa chỉ: ${ORGANIZATION.address.streetAddress}, ${ORGANIZATION.address.addressLocality}, ${ORGANIZATION.address.addressRegion}`,
          `Email: ${ORGANIZATION.email}`,
          "Điện thoại: 02033.668.838",
        ],
      },
    ],
  },
  en: {
    title: "Privacy policy",
    updatedLabel: "Last updated",
    intro:
      "This policy explains how LeTRON Group Joint Stock Company (“LeTRON”) collects, uses and protects your personal data when you use letrongroup.com, in line with Vietnam's Decree 13/2023/ND-CP on personal data protection.",
    sections: [
      {
        heading: "1. Data we collect",
        items: [
          "When you submit a contact or product-consultation form: your name, email, phone number (if provided), message and the page you submitted from.",
          "When you apply for a job: your name, email, phone number, the position and the CV file (PDF, DOC or DOCX) you upload.",
          "Technical data: your IP address is used only transiently to rate-limit repeated submissions (spam protection) and is not stored with your details; the NEXT_LOCALE cookie remembers your language.",
        ],
      },
      {
        heading: "2. How we use it",
        items: [
          "To respond to enquiries and provide information about LeTRON products and solutions.",
          "To receive and review job applications and contact applicants.",
          "To operate, secure and improve the website.",
        ],
        paragraphs: ["We do not sell your personal data and do not use it for other purposes without your consent."],
      },
      {
        heading: "3. Storage and processors",
        items: [
          "Form submissions are stored in LeTRON's MongoDB database.",
          "CV files are stored privately on Amazon S3; only the recruiting staff receive a download link, which expires after 7 days.",
          "For each new request LeTRON may send an internal notification (by email or an internal messaging app such as Telegram) to the sales or HR team.",
          "The website runs on Vercel infrastructure.",
        ],
      },
      {
        heading: "4. Retention",
        paragraphs: [
          "We keep data for as long as needed for the purposes above or as required by law, then delete or anonymise it.",
        ],
      },
      {
        heading: "5. Your rights",
        paragraphs: [
          "You may request access to, correction or deletion of your personal data, withdraw your consent, or object to processing. Email us at the address below; we will respond within the period required by law.",
        ],
      },
      {
        heading: "6. Contact",
        items: [
          "LeTRON Group Joint Stock Company",
          `Address: ${ORGANIZATION.address.streetAddress}, ${ORGANIZATION.address.addressLocality}, ${ORGANIZATION.address.addressRegion}`,
          `Email: ${ORGANIZATION.email}`,
          "Phone: 02033.668.838",
        ],
      },
    ],
  },
};

export default function PrivacyPolicy({ locale }: { locale: string }) {
  const c = CONTENT[locale === "en" ? "en" : "vi"];

  return (
    <section className="bg-[#0d1b4b] px-6 pb-20 pt-[calc(var(--header-height-mobile)+32px)] text-white lg:pt-[calc(var(--header-height)+48px)]">
      <article className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-4xl font-bold">{c.title}</h1>
        <p className="mb-8 text-sm text-white/60">
          {c.updatedLabel}: {PRIVACY_POLICY_UPDATED}
        </p>
        <p className="mb-8 leading-relaxed text-white/85">{c.intro}</p>
        {c.sections.map((section) => (
          <div key={section.heading} className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-[#2a9fff]">{section.heading}</h2>
            {section.items && (
              <ul className="mb-3 list-disc space-y-2 pl-6 leading-relaxed text-white/85">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {section.paragraphs?.map((p) => (
              <p key={p} className="leading-relaxed text-white/85">
                {p}
              </p>
            ))}
          </div>
        ))}
      </article>
    </section>
  );
}
