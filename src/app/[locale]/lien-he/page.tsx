import type { Metadata } from "next";

import { StaticLandingPage } from "@/lib/static-landing";

export const metadata: Metadata = {
  title: "Liên hệ - LeTRON",
};

export default function LienHePage() {
  return <StaticLandingPage className="site-main post-36 page type-page status-publish hentry" segments={["lien-he"]} />;
}
