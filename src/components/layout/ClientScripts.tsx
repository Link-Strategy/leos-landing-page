"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

export default function ClientScripts() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isBlog = pathname?.startsWith("/blog") ?? false;
  const isCategory = pathname?.startsWith("/category") ?? false;
  const skipElementor = isBlog || isCategory;
  const showElementor = mounted && !skipElementor && typeof pathname === "string";

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }

    if (!showElementor) return;

    const lazyloadRunObserver = () => {
      const lazyloadBackgrounds = document.querySelectorAll(
        ".e-con.e-parent:not(.e-lazyloaded)"
      );
      const lazyloadBackgroundObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const lazyloadBackground = entry.target as HTMLElement;
              if (lazyloadBackground) {
                lazyloadBackground.classList.add("e-lazyloaded");
              }
              lazyloadBackgroundObserver.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "200px 0px 200px 0px" }
      );
      lazyloadBackgrounds.forEach((lazyloadBackground) => {
        lazyloadBackgroundObserver.observe(lazyloadBackground);
      });
    };

    lazyloadRunObserver();

    const events = ["DOMContentLoaded", "elementor/lazyload/observe"];
    events.forEach((event) => {
      document.addEventListener(event, lazyloadRunObserver);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, lazyloadRunObserver);
      });
    };
  }, [showElementor]);

  return (
    <>
      {/* ====== GLOBAL SCRIPTS (load on ALL pages) ====== */}
      <Script src="/wp-includes/js/jquery/jquery.min.js?ver=3.7.1" strategy="beforeInteractive" />
      <Script src="/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js?ver=11" strategy="afterInteractive" />

      {/* hooks.min.js must be loaded before i18n.min.js to prevent "Cannot read properties of undefined (reading 'hooks')" crash */}
      <Script src="/wp-includes/js/dist/hooks.min.js?ver=dd5603f07f9220ed27f1" strategy="beforeInteractive" />
      <Script src="/wp-includes/js/dist/i18n.min.js?ver=c26c3dc7bed366793375" strategy="beforeInteractive" />

      <Script id="set-locale-data" strategy="beforeInteractive">
        {`if (typeof window !== "undefined" && window.wp?.i18n) {
          window.wp.i18n.setLocaleData( { "text directionltr": [ "ltr" ] } );
        }`}
      </Script>

      {/* ====== ELEMENTOR SCRIPTS (chỉ trên routes cần Elementor) — chỉ render sau mount ====== */}
      {showElementor && (
        <>
          <Script src="/wp-content/themes/saokimdigital/assets/js/main.js?ver=1.0.0" strategy="afterInteractive" />
          <Script src="/wp-content/themes/hello-elementor/assets/js/hello-frontend.js?ver=3.4.7" strategy="afterInteractive" />
          <Script src="/wp-content/plugins/elementor/assets/js/webpack.runtime.min.js?ver=4.0.8" strategy="afterInteractive" />
          <Script src="/wp-content/plugins/elementor/assets/js/frontend-modules.min.js?ver=4.0.8" strategy="afterInteractive" />
          <Script src="/wp-includes/js/jquery/ui/core.min.js?ver=1.13.3" strategy="afterInteractive" />

          <Script id="elementor-frontend-config" strategy="afterInteractive">
            {`var elementorFrontendConfig = {"environmentMode":{"edit":false,"wpPreview":false,"isScriptDebug":false},"i18n":{"shareOnFacebook":"Chia sẻ trên Facebook","shareOnTwitter":"Chia sẻ trên Twitter","pinIt":"Ghim nó","download":"Tải xuống","downloadImage":"Tải hình ảnh","fullscreen":"Toàn màn hình","zoom":"Thu phóng","share":"Chia sẻ","playVideo":"Phát video","previous":"Quay về","next":"Tiếp theo","close":"Đóng","a11yCarouselPrevSlideMessage":"Slide trước","a11yCarouselNextSlideMessage":"Slide tiếp theo","a11yCarouselFirstSlideMessage":"Đây là slide đầu tiên","a11yCarouselLastSlideMessage":"Đây là slide cuối cùng","a11yCarouselPaginationBulletMessage":"Đi đến slide"},"is_rtl":false,"breakpoints":{"xs":0,"sm":480,"md":768,"lg":1025,"xl":1440,"xxl":1600},"responsive":{"breakpoints":{"mobile":{"label":"Di động dọc","value":767,"default_value":767,"direction":"max","is_enabled":true},"mobile_extra":{"label":"Chế độ ngang di động","value":880,"default_value":880,"direction":"max","is_enabled":false},"tablet":{"label":"Máy tính bảng dọc","value":1024,"default_value":1024,"direction":"max","is_enabled":true},"tablet_extra":{"label":"Máy tính bảng ngang","value":1200,"default_value":1200,"direction":"max","is_enabled":false},"laptop":{"label":"Laptop","value":1550,"default_value":1366,"direction":"max","is_enabled":true},"widescreen":{"label":"Trang rộng","value":2400,"default_value":2400,"direction":"min","is_enabled":false}},"hasCustomBreakpoints":true},"version":"4.0.8","is_static":false,"experimentalFeatures":{"e_font_icon_svg":true,"additional_custom_breakpoints":true,"container":true,"e_optimized_markup":true,"theme_builder_v2":true,"hello-theme-header-footer":true,"e_pro_free_trial_popup":true,"nested-elements":true,"e_atomic_elements":true,"atomic_widgets_should_enforce_capabilities":true,"editor_mcp":true,"e_bc_migrations":true,"e_classes":true,"global_classes_should_enforce_capabilities":true,"e_variables":true,"e_variables_manager":true,"e_opt_in_v4_page":true,"e_opt_in_v4":true,"e_components":true,"e_interactions":true,"e_widget_creation":true,"import-export-customization":true,"e_pro_atomic_form":true,"mega-menu":true,"e_pro_variables":true,"e_pro_interactions":true},"urls":{"assets":"\\/wp-content\\/plugins\\/elementor\\/assets\\/","ajaxurl":"\\/wp-admin\\/admin-ajax.php","uploadUrl":"\\/wp-content\\/uploads"},"nonces":{"floatingButtonsClickTracking":"e07854600d","atomicFormsSendForm":"fe10f89e12"},"swiperClass":"swiper","settings":{"page":[],"editorPreferences":[]},"kit":{"active_breakpoints":["viewport_mobile","viewport_tablet","viewport_laptop"],"viewport_laptop":1550,"global_image_lightbox":"yes","lightbox_enable_counter":"yes","lightbox_enable_fullscreen":"yes","lightbox_enable_zoom":"yes","lightbox_enable_share":"yes","lightbox_title_src":"title","lightbox_description_src":"description","hello_header_logo_type":"logo","hello_header_menu_layout":"horizontal","hello_footer_logo_type":"logo"},"post":{"id":2588,"title":"Trang%20ch%E1%BB%A7%20-%20LETRON","excerpt":"","featuredImage":false}};`}
          </Script>

          <Script src="/wp-content/plugins/elementor/assets/js/frontend.min.js?ver=4.0.8" strategy="afterInteractive" />
          <Script src="/wp-content/plugins/elementor-pro/assets/lib/smartmenus/jquery.smartmenus.min.js?ver=1.2.1" strategy="afterInteractive" />
          <Script src="/wp-content/plugins/elementor/assets/lib/jquery-numerator/jquery-numerator.min.js?ver=0.2.1" strategy="afterInteractive" />
          <Script src="/wp-includes/js/imagesloaded.min.js?ver=5.0.0" strategy="afterInteractive" />
          <Script src="/wp-content/plugins/elementor/assets/lib/swiper/v8/swiper.min.js?ver=8.4.5" strategy="afterInteractive" />
          <Script src="/wp-content/plugins/elementor-pro/assets/js/webpack-pro.runtime.min.js?ver=4.0.4" strategy="afterInteractive" />
          <Script id="elementor-pro-frontend-config" strategy="afterInteractive">
            {`var ElementorProFrontendConfig = {"ajaxurl":"/wp-admin/admin-ajax.php","nonce":"3d0f92342a","urls":{"assets":"/wp-content/plugins/elementor-pro/assets/","rest":"/wp-json/"},"settings":{"lazy_load_background_images":true},"popup":{"hasPopUps":true},"shareButtonsNetworks":{"facebook":{"title":"Facebook","has_counter":true},"twitter":{"title":"Twitter"},"linkedin":{"title":"LinkedIn","has_counter":true},"pinterest":{"title":"Pinterest","has_counter":true},"reddit":{"title":"Reddit","has_counter":true},"vk":{"title":"VK","has_counter":true},"odnoklassniki":{"title":"OK","has_counter":true},"tumblr":{"title":"Tumblr"},"digg":{"title":"Digg"},"skype":{"title":"Skype"},"stumbleupon":{"title":"StumbleUpon","has_counter":true},"mix":{"title":"Mix"},"telegram":{"title":"Telegram"},"pocket":{"title":"Pocket","has_counter":true},"xing":{"title":"XING","has_counter":true},"whatsapp":{"title":"WhatsApp"},"email":{"title":"Email"},"print":{"title":"Print"},"x-twitter":{"title":"X"},"threads":{"title":"Threads"}},"facebook_sdk":{"lang":"vi","app_id":""},"lottie":{"defaultAnimationUrl":"/wp-content/plugins/elementor-pro/modules/lottie/assets/animations/default.json"}};`}
          </Script>

          <Script src="/wp-content/plugins/elementor-pro/assets/js/frontend.min.js?ver=4.0.4" strategy="afterInteractive" />
          <Script src="/wp-content/plugins/elementor-pro/assets/js/elements-handlers.min.js?ver=4.0.4" strategy="afterInteractive" />
        </>
      )}
    </>
  );
}
