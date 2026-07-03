import type { Metadata } from "next";

import RecruitmentPage from "@/components/recruitment/RecruitmentPage";

export const metadata: Metadata = {
  title: "Tuyển dụng - LeTRON",
};

export default function TuyenDungPage() {
  return <RecruitmentPage />;
}
