import type { Metadata } from "next";
import RecruitmentPage from "@/components/recruitment/RecruitmentPage";
import { JobListingsSection } from "@/components/recruitment/JobListingsSection";
import { getCachedPublishedJobListings } from "@/lib/recruitment/queries";

export const metadata: Metadata = {
  title: "Tuyển dụng - LeTRON",
  description: "Khám phá các cơ hội nghề nghiệp hấp dẫn tại LeTRON. Gia nhập đội ngũ kiến tạo công nghiệp xanh và tương lai Net Zero.",
};

export default async function TuyenDungPage() {
  const jobs = await getCachedPublishedJobListings();

  return (
    <>
      {/* Static hero, intro, benefits from Elementor/WordPress */}
      <RecruitmentPage />

      {/* Dynamic job listings from MongoDB */}
      <section
        id="open-positions"
        className="w-full bg-[#0d1b4b] px-20 max-[1550px]:px-[60px] max-lg:px-[25px] max-md:px-4 py-[60px]"
      >
        <div className="mx-auto flex w-full max-w-full flex-col gap-10">
          {/* Section header */}
          <div className="flex flex-col gap-3">
            <p className="font-['Archivo',Helvetica] text-sm font-semibold uppercase tracking-[0.4em] text-[#2a9fff]">
              Cơ hội nghề nghiệp
            </p>
            <h2 className="font-['Archivo',Helvetica] text-[32px] font-bold leading-tight text-white lg:text-[40px]">
              Vị trí đang tuyển dụng
            </h2>
            {jobs.length > 0 && (
              <p className="text-white/60">
                Chúng tôi đang tìm kiếm <strong className="text-white">{jobs.length} nhân tài</strong> để cùng
                kiến tạo tương lai bền vững.
              </p>
            )}
          </div>

          {/* Job listing grid with department filter */}
          <JobListingsSection jobs={jobs} />
        </div>
      </section>
    </>
  );
}
