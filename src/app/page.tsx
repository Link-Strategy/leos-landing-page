import StaticSection from "@/components/landing/StaticSection";
import HomeElementorInteractions from "@/components/landing/HomeElementorInteractions";
import LandingElementorHooks from "@/components/landing/LandingElementorHooks";
import HeartTab from "@/components/landing/HeartTab";
import Products from "@/components/landing/Products";

export default function Home() {
  return (
    <div className="site-main post-2588 page type-page status-publish hentry">
      {/* Scope container for Elementor styling */}
      <div
        className="elementor elementor-2588"
        data-elementor-id="2588"
        data-elementor-post-type="page"
        data-elementor-type="wp-page"
      >
        {/* Load all split HTML sections statically */}
        <StaticSection name="01-hero" />
        <StaticSection name="02-leosai" />
        <StaticSection name="03-pillars" />
        <StaticSection name="04-culture" />
        <HeartTab />
        <Products />
        <StaticSection name="07-esg" />
        <StaticSection name="08-partners" />
        <StaticSection name="09-news" />
        <StaticSection name="10-career" />
      </div>

      {/* Interactions and hooks */}
      <HomeElementorInteractions />
      <LandingElementorHooks />
    </div>
  );
}


