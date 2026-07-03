import type { Metadata } from "next";

import { StaticLandingPage } from "@/lib/static-landing";

export const metadata: Metadata = {
  title: "Tin tức - Sự kiện - LeTRON",
};

export default function TinTucSuKienPage() {
  return (
    <StaticLandingPage
      className="site-main archive category category-tin-tuc-su-kien"
      segments={["category", "tin-tuc-su-kien"]}
    />
  );
}
