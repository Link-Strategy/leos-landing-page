import type { Metadata } from "next";

import { StaticLandingPage } from "@/lib/static-landing";

export const metadata: Metadata = {
  title: "Sản phẩm - LeTRON",
};

export default function SanPhamPage() {
  return <StaticLandingPage className="site-main post-423 page type-page status-publish hentry" segments={["san-pham"]} />;
}
