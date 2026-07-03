"use client";

import HomeElementorInteractions from "./HomeElementorInteractions";
import LandingElementorHooks from "./LandingElementorHooks";

interface HomeClientProps {
  htmlContent: string;
}

export default function HomeClient({ htmlContent }: HomeClientProps) {
  return (
    <div className="site-main post-2588 page type-page status-publish hentry">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} suppressHydrationWarning={true} />
      <HomeElementorInteractions />
      <LandingElementorHooks />
    </div>
  );
}
