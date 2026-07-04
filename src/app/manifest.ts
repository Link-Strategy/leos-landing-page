import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LeOS - Công nghệ xanh, Vận hành thông minh",
    short_name: "LeOS",
    description: "Hệ điều hành vận hành cho doanh nghiệp tài nguyên & môi trường",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a5c36",
    icons: [
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { src: "/logo.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}

