import type { Metadata } from "next";

import { StaticLandingPage } from "@/lib/static-landing";

export const metadata: Metadata = {
  title: "Công ty thành viên - LeTRON",
};

export default function CongTyThanhVienPage() {
  return (
    <StaticLandingPage
      className="site-main post-258 page type-page status-publish hentry"
      segments={["cong-ty-thanh-vien"]}
    />
  );
}
