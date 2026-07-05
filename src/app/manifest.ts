import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LeTRON - Công nghệ xanh, Vận hành thông minh",
    short_name: "LeTRON",
    description: "Hệ điều hành vận hành cho doanh nghiệp tài nguyên & môi trường",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a5c36",
    icons: [
      { src: "/favicon.svg", sizes: "48x48", type: "image/svg+xml" },
      { src: "/logo.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
      { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-256x256.png", sizes: "256x256", type: "image/png" },
      { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}

