import type { Metadata } from "next";
import RecruitmentPage from "@/components/recruitment/RecruitmentPage";
import { getCachedPublishedJobListings } from "@/lib/recruitment/queries";
import { localeAlternates } from "@/lib/seo-alternates";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Tuyển dụng",
    description: "Khám phá các cơ hội nghề nghiệp hấp dẫn tại LeTRON. Gia nhập đội ngũ kiến tạo công nghiệp xanh và tương lai Net Zero.",
    alternates: localeAlternates(locale, "/tuyen-dung"),
  };
}

export default async function TuyenDungPage() {
  const jobs = await getCachedPublishedJobListings();

  return (
    <RecruitmentPage jobs={jobs} />
  );
}
