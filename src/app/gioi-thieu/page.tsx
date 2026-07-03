import type { Metadata } from "next";

import { StaticLandingPage } from "@/lib/static-landing";

export const metadata: Metadata = {
  title: "Giới thiệu - LeTRON",
};

export default function GioiThieuPage() {
  return <StaticLandingPage className="site-main post-723 page type-page status-publish hentry" segments={["gioi-thieu"]} />;
}
