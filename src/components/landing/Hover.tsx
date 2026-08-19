import React from "react";

interface HoverProps {
  title: string;
  tags: string[];
  active: boolean;
  dataId: string;
  color: string;
  side?: "left" | "right" | "top" | "bottom";
}

export default function Hover({ title, tags, active, dataId, color, side = "bottom" }: HoverProps) {
  const positionStyle: React.CSSProperties =
    side === "left"
      ? { top: "50%", right: "100%", marginRight: "16px", transform: "translateY(-50%)" }
      : side === "right"
        ? { top: "50%", left: "100%", marginLeft: "16px", transform: "translateY(-50%)" }
        : side === "top"
          ? { bottom: "100%", left: "50%", marginBottom: "16px", transform: "translateX(-50%)" }
          : { top: "100%", left: "0", marginTop: "8px" };

  return (
    <div
      className="elementor-element box-sub-home elementor-absolute elementor-widget elementor-widget-icon-box"
      data-id={dataId}
      style={{
        display: active ? "block" : "none",
        position: "absolute",
        zIndex: 99,
        ...positionStyle,
      }}
    >
      <div className="elementor-icon-box-content">
        {/* Per-pillar accent Header Title inside Popup */}
        <h3 className="elementor-icon-box-title font-archivo font-bold text-lg mb-4 text-left" style={{ color }}>
          <span>
            <span className="font-extrabold">Le</span>
            {title.replace("Le", "")}
          </span>
        </h3>

        {/* Bullet List */}
        <ul className="space-y-2.5 list-none p-0 m-0 text-left pb-4">
          {tags.map((tag, tIdx) => (
            <li
              key={tIdx}
              className="text-white font-archivo font-light text-sm transition-colors py-0.5 border-b border-white/5 last:border-0 flex items-start gap-2.5"
            >
              <span className="text-zinc-400 text-xs mt-1">•</span>
              <span>{tag}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
