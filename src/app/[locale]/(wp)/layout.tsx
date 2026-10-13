import type { ReactNode } from "react";
import WpAssets from "@/components/layout/WpAssets";

// Routes that still render legacy Elementor markup (recruitment, per-company product pages, exported static pages).
// Everything else lives outside this group and ships without the WordPress CSS/JS.
export default function WpLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <WpAssets />
      {children}
    </>
  );
}
