import type { Metadata } from "next";
import RecruitmentPage from "@/components/recruitment/RecruitmentPage";
import { getCachedPublishedJobListings } from "@/lib/recruitment/queries";

export const metadata: Metadata = {
  title: "Tuyển dụng - LeTRON",
  description: "Khám phá các cơ hội nghề nghiệp hấp dẫn tại LeTRON. Gia nhập đội ngũ kiến tạo công nghiệp xanh và tương lai Net Zero.",
};

export default async function TuyenDungPage() {
  const jobs = await getCachedPublishedJobListings();

  return (
    <RecruitmentPage jobs={jobs} />
  );
}
