// Branded 404 for URLs that match no route (e.g. /khong-ton-tai). The app has no single root layout
// (it lives under app/[locale]), so Next's default blank 404 was shown. Bypasses layouts: import what it needs.
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Archivo, Outfit } from "next/font/google";

const archivo = Archivo({ subsets: ["latin", "vietnamese"], display: "swap", variable: "--font-archivo" });
const outfit = Outfit({ subsets: ["latin"], display: "swap", variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "404 - Không tìm thấy trang | LeTRON",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="vi" className={`${archivo.variable} ${outfit.variable}`}>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg,#0d1b4b 0%,#0a2a6e 100%)",
          color: "#fff",
          fontFamily: "var(--font-outfit), system-ui, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <main style={{ maxWidth: 520 }}>
          <p style={{ margin: 0, fontSize: 96, fontWeight: 800, lineHeight: 1, color: "#2a9fff", fontFamily: "var(--font-archivo), sans-serif" }}>
            404
          </p>
          <h1 style={{ margin: "16px 0 8px", fontSize: 28, fontFamily: "var(--font-archivo), sans-serif" }}>
            Không tìm thấy trang
          </h1>
          <p style={{ margin: "0 0 28px", opacity: 0.8, lineHeight: 1.6 }}>
            Trang bạn tìm không tồn tại hoặc đã được chuyển đi. Hãy quay về trang chủ hoặc xem các sản phẩm của LeTRON.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/"
              style={{ padding: "12px 28px", borderRadius: 999, background: "linear-gradient(180deg,#76c6ff,#2a75f3)", color: "#fff", fontWeight: 600, textDecoration: "none" }}
            >
              Về trang chủ
            </Link>
            <Link
              href="/san-pham"
              style={{ padding: "12px 28px", borderRadius: 999, border: "1px solid rgba(255,255,255,.4)", color: "#fff", fontWeight: 600, textDecoration: "none" }}
            >
              Xem sản phẩm
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
