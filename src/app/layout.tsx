import type { Metadata, Viewport } from "next";
import { Archivo, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import HeaderTailwind from "@/components/layout/HeaderTailwind";
import Footer from "@/components/layout/Footer";
import ClientScripts from "@/components/layout/ClientScripts";
import ScrollToTop from "@/components/layout/ScrollToTop";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LeOS - Công nghệ xanh, Vận hành thông minh",
    template: "%s | LeOS",
  },
  description: "Giải pháp công nghệ chuyển hóa rác thải và vật liệu xây dựng xanh hàng đầu Việt Nam.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.APP_URL?.trim() || "https://letrongroup.com"),
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "LeOS",
    type: "website",
    locale: "vi_VN",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${archivo.variable} ${outfit.variable}`}>
      <head>

        <link href="/wp-content/themes/saokimdigital/style.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/custom-frontend.min.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/post-6.css" rel="stylesheet" />
        <link href="/wp-content/plugins/elementor/assets/css/widget-image.min.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/custom-pro-widget-nav-menu.min.css" rel="stylesheet" />
        <link href="/wp-content/plugins/elementor-pro/assets/css/widget-search.min.css" rel="stylesheet" />
        <link href="/wp-content/plugins/elementor/assets/lib/animations/styles/e-animation-rotate.min.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/custom-widget-icon-box.min.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/custom-widget-image-box.min.css" rel="stylesheet" />
        <link href="/wp-content/plugins/elementor/assets/css/widget-heading.min.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/custom-widget-icon-list.min.css" rel="stylesheet" />
        <link href="/wp-content/plugins/elementor/assets/css/widget-nested-accordion.min.css" rel="stylesheet" />
        <link href="/wp-content/plugins/elementor/assets/lib/animations/styles/fadeInUp.min.css" rel="stylesheet" />
        <link href="/wp-content/plugins/elementor/assets/css/widget-counter.min.css" rel="stylesheet" />
        <link href="/wp-content/plugins/elementor/assets/lib/swiper/v8/css/swiper.min.css" rel="stylesheet" />
        <link href="/wp-content/plugins/elementor/assets/css/conditionals/e-swiper.min.css" rel="stylesheet" />
        <link href="/wp-content/plugins/elementor-pro/assets/css/widget-loop-common.min.css" rel="stylesheet" />
        <link href="/wp-content/plugins/elementor-pro/assets/css/widget-loop-carousel.min.css" rel="stylesheet" />
        <link href="/wp-content/plugins/elementor-pro/assets/css/widget-form.min.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/post-2588.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/base-desktop.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/post-29.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/post-63.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/post-2407.css" rel="stylesheet" />
        <link href="/wp-content/plugins/elementor-pro/assets/css/widget-nested-carousel.min.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/custom-widget-nested-tabs.min.css" rel="stylesheet" />
        <link href="/wp-content/plugins/elementor/assets/lib/animations/styles/e-animation-grow.min.css" rel="stylesheet" />
        <link href="/wp-content/plugins/elementor-pro/assets/css/widget-post-info.min.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/post-2377.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/post-723.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/post-258.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/post-423.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/post-36.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/post-1360.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/post-221.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/post-390.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/post-604.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/post-653.css" rel="stylesheet" />
        <link href="/wp-content/uploads/elementor/css/custom-pro-widget-loop-grid.min.css" rel="stylesheet" />
        <link href="/wp-content/plugins/elementor-pro/assets/css/widget-share-buttons.min.css" rel="stylesheet" />
        <link href="/wp-content/plugins/elementor/assets/css/widget-video.min.css" rel="stylesheet" />
        <link href="/wp-content/plugins/elementor/assets/lib/animations/styles/fadeInRight.min.css" rel="stylesheet" />
        <link href="/wp-content/plugins/elementor/assets/lib/animations/styles/fadeInLeft.min.css" rel="stylesheet" />
        <link href="/wp-content/plugins/elementor/assets/lib/animations/styles/fadeIn.min.css" rel="stylesheet" />
        <link href="/wp-content/plugins/elementor-pro/assets/css/conditionals/popup.min.css" rel="stylesheet" />

      </head>
      <body>

        <HeaderTailwind />
        <main>{children}</main>
        <Footer />
        <ScrollToTop />
        <ClientScripts />
      </body>
    </html>
  );
}
