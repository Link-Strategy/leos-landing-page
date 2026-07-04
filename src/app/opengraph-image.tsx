import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LeOS - Công nghệ xanh, Vận hành thông minh";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a5c36 0%, #0d7a48 50%, #1a1a2e 100%)",
          position: "relative",
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          {/* Simple leaf-inspired icon */}
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" stroke="#4ade80" strokeWidth="3" fill="none" />
            <path d="M40 20C40 20 55 30 55 45C55 55 48 60 40 60" stroke="#4ade80" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M40 20C40 20 25 30 25 45C25 55 32 60 40 60" stroke="#22d3ee" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="40" cy="40" r="5" fill="#4ade80" />
          </svg>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 64, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1 }}>
              LeOS
            </span>
            <span style={{ fontSize: 20, color: "#86efac", marginTop: 4, letterSpacing: "0.1em" }}>
              CÔNG NGHỆ XANH — VẬN HÀNH THÔNG MINH
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "16px",
          }}
        >
          <span style={{ fontSize: 18, color: "#ffffffcc" }}>Green Technology</span>
          <span style={{ width: 1, height: 24, background: "#ffffff33" }} />
          <span style={{ fontSize: 18, color: "#ffffffcc" }}>IoT &amp; AI Platform</span>
          <span style={{ width: 1, height: 24, background: "#ffffff33" }} />
          <span style={{ fontSize: 18, color: "#ffffffcc" }}>ESG Compliance</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
