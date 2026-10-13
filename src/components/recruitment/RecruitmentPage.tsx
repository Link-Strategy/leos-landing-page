import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { RecruitmentBenefitCard } from "./RecruitmentBenefitCard";
import { RecruitmentOpenPositionsButton } from "./RecruitmentOpenPositionsButton";
import { JobListingsSection } from "./JobListingsSection";
import type { JobListing } from "@/lib/recruitment/types";

interface Props {
  jobs: JobListing[];
}

const ENVIRONMENT_POINTS = [
  "Làm việc trên các dự án thực, tác động trực tiếp đến môi trường và xã hội",
  "Văn hóa tốc độ cao – ưu tiên hành động và kết quả",
  "Minh bạch bằng dữ liệu – mọi quyết định có cơ sở rõ ràng",
  "Khuyến khích đổi mới và thử nghiệm liên tục",
  "Cộng tác đa lĩnh vực: công nghệ – công nghiệp – tài chính",
];

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <h3 className="m-0 font-archivo text-sm font-bold uppercase tracking-[0.16em] text-[#63D9FF] [text-shadow:0_0_6px_rgba(99,217,255,0.18)] lg:text-base">
      {children}
    </h3>
  );
}

function SectionHeading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`m-0 font-archivo text-3xl font-extrabold leading-[1.3] text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-4xl lg:text-[44px] ${className}`}
    >
      {children}
    </h2>
  );
}

function Highlight({ children }: { children: ReactNode }) {
  return <span className="text-[#2A9FFF]">{children}</span>;
}

function BenefitIcon({ src }: { src: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className="size-full" />;
}

export default function RecruitmentPage({ jobs }: Props) {
  return (
    <div className="w-full bg-[#0D1B4B] text-white">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#091437_0%,#0D1B4B_100%)] pb-12 pt-[calc(var(--header-height-mobile)+24px)] lg:pb-16 lg:pt-[calc(var(--header-height)+40px)]">
        <div className="container-le">
          <nav aria-label="breadcrumbs" className="breadcrumb-home text-sm text-zinc-400">
            <p className="m-0">
              <Link href="/">Home</Link>
              <span className="separator"> / </span>
              <span className="last">Tuyển dụng</span>
            </p>
          </nav>
          <h1 className="mt-4 mb-0 font-archivo text-3xl font-extrabold leading-[1.3] text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-4xl lg:text-5xl">
            Gia nhập đội ngũ <Highlight>LeTRON</Highlight>
          </h1>
          <p className="mt-4 mb-0 max-w-2xl text-base font-light leading-relaxed text-zinc-300">
            Cùng LeTRON kiến tạo những giải pháp công nghệ tái định hình ngành công nghiệp xanh — nơi bạn được trao cơ hội phát triển và tạo ra tác động thực sự.
          </p>
        </div>
      </section>

      {/* Working environment */}
      <section className="relative overflow-hidden bg-[#0D1B4B] py-12 lg:py-20">
        <div className="container-le grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <Eyebrow>Môi trường làm việc</Eyebrow>
            <SectionHeading>
              Môi trường kiến tạo
              <br />
              vận hành như <Highlight>một hệ thống</Highlight>
            </SectionHeading>
            <p className="m-0 text-base leading-relaxed text-zinc-300">
              LETRON xây dựng môi trường nơi con người, công nghệ và dữ liệu phối hợp để giải quyết những bài toán công nghiệp quy mô lớn.
            </p>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {ENVIRONMENT_POINTS.map((text) => (
                <li key={text} className="flex items-start gap-3 text-base leading-snug text-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/images/recruitment/recruitment-icon-4.svg" alt="" className="mt-0.5 size-5 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mx-auto aspect-[853/606] w-full max-w-[640px] lg:max-w-none">
            <Image
              alt=""
              src="/images/recruitment/img-tuyen-dung.webp"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <Image
              alt=""
              aria-hidden
              src="/images/recruitment/img-2-2-1.png"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="pointer-events-none object-fill"
            />
          </div>
        </div>
      </section>

      {/* HR policy */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#0D1B4B_0%,#091437_100%)] py-12 lg:py-20">
        <div className="container-le grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 grid grid-cols-2 gap-3 sm:gap-4 lg:order-1">
            <RecruitmentBenefitCard
              icon={<BenefitIcon src="/assets/images/recruitment/recruitment-icon-6.svg" />}
              title="Cơ hội phát triển nhanh"
              description={<>Lộ trình rõ ràng, trao quyền theo năng lực</>}
              hoverBackgroundColor="#1CBBB466"
              hoverBorderColor="#1CBBB4"
            />
            <RecruitmentBenefitCard
              icon={<BenefitIcon src="/assets/images/recruitment/recruitment-icon-7.svg" />}
              title="Phúc lợi đầy đủ"
              description={<>Bảo hiểm, nghỉ phép, chế độ theo quy định và mở rộng</>}
              hoverBackgroundColor="#C8960C66"
              hoverBorderColor="#C8960C"
            />
            <RecruitmentBenefitCard
              icon={<BenefitIcon src="/assets/images/recruitment/recruitment-icon-8.svg" />}
              title="Thu nhập cạnh tranh"
              description={<>Lương, thưởng gắn với hiệu quả và kết quả công việc</>}
              hoverBackgroundColor="#228B2266"
              hoverBorderColor="#228B22"
            />
            <RecruitmentBenefitCard
              icon={<BenefitIcon src="/assets/images/recruitment/recruitment-icon-9.svg" />}
              title="Cơ hội phát triển nhanh"
              description={<>Lộ trình rõ ràng, trao quyền theo năng lực</>}
              hoverBackgroundColor="#FF800066"
              hoverBorderColor="#FF7E00"
            />
          </div>
          <div className="order-1 flex flex-col items-start gap-4 lg:order-2">
            <Eyebrow>Chính sách nhân sự</Eyebrow>
            <SectionHeading>
              Đãi ngộ xứng đáng
              <br />
              <Highlight>với giá trị tạo ra</Highlight>
            </SectionHeading>
            <p className="m-0 text-base leading-relaxed text-zinc-300">
              Chính sách được thiết kế để thu hút, phát triển và giữ chân những nhân sự có năng lực tạo tác động thực
            </p>
            <RecruitmentOpenPositionsButton />
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section id="open-positions" className="relative overflow-hidden bg-[#091437] py-12 lg:py-20">
        <div className="container-le flex flex-col items-center gap-4 text-center">
          <div id="cac-vi-tri-dang-tuyen" className="scroll-mt-28">
            <Eyebrow>Các vị trí đang tuyển</Eyebrow>
          </div>
          <SectionHeading>
            Tìm kiếm công việc mơ ước <Highlight>tại LeTRON</Highlight>
          </SectionHeading>
          <p className="m-0 mb-6 text-base leading-relaxed text-zinc-300">
            Phát triển bản thân và tỏa sáng tại môi trường làm việc hạnh phúc.
          </p>
          <div className="w-full text-left">
            <JobListingsSection jobs={jobs} />
          </div>
        </div>
      </section>
    </div>
  );
}
