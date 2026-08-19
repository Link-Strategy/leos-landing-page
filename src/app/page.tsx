import HomeElementorInteractions from "@/components/landing/HomeElementorInteractions";
import LandingElementorHooks from "@/components/landing/LandingElementorHooks";
import Hero from "@/components/landing/Hero";
import LeOsAi from "@/components/landing/LeOsAi";
import Pillars from "@/components/landing/Pillars";
import Culture from "@/components/landing/Culture";
import HeartTab from "@/components/landing/HeartTab";
import Products from "@/components/landing/Products";
import Counters from "@/components/landing/Counters";
import Partners from "@/components/landing/Partners";
import News from "@/components/landing/News";
import Career from "@/components/landing/Career";

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
        <Hero />
        <LeOsAi />
        <Pillars />
        <Culture />
        <HeartTab />
        <Products />
        <Partners />
        <News />
        <Career />
      </div>

      {/* Interactions and hooks */}
      <HomeElementorInteractions />
      <LandingElementorHooks />
    </div>
  );
}
