import React from "react";

interface HoverProps {
  title: string;
  tags: string[];
  active: boolean;
  dataId: string;
}

export default function Hover({ title, tags, active, dataId }: HoverProps) {
  return (
    <div
      className="elementor-element box-sub-home elementor-absolute elementor-widget elementor-widget-icon-box"
      data-id={dataId}
      style={{
        display: active ? "block" : "none",
        position: "absolute",
        top: "100%",
        left: "0",
        zIndex: 99,
        marginTop: "8px",
      }}
    >
      <div className="elementor-icon-box-content">
        {/* Orange Header Title inside Popup */}
        <h3 className="elementor-icon-box-title text-[#faaf4d] font-archivo font-bold text-lg mb-4 text-left">
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
              className="text-white font-archivo font-light text-sm hover:text-emerald-400 transition-colors py-0.5 border-b border-white/5 last:border-0 flex items-start gap-2.5"
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
