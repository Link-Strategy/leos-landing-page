import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LeTRON Group",
    short_name: "LeTRON",
    description: "Nền tảng vận hành tự chủ cho nhà máy và khu công nghiệp: máy vận hành, người định hướng, số liệu làm chứng.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d1b4b",
    theme_color: "#0d1b4b",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
      { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-256x256.png", sizes: "256x256", type: "image/png" },
      { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}

