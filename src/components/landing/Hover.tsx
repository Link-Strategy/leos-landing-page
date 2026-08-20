import React from "react";
import { createPortal } from "react-dom";

interface HoverProps {
  title: string;
  tags: string[];
  active: boolean;
  dataId: string;
  color: string;
  side?: "left" | "right" | "top" | "bottom";
  mobile?: boolean;
  onClose?: () => void;
}

export default function Hover({
  title,
  tags,
  active,
  dataId,
  color,
  side = "bottom",
  mobile = false,
  onClose,
}: HoverProps) {
  const content = (
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
  );

  // Mobile: render as a centered modal via portal so it always shows in the
  // middle of the viewport, unaffected by transformed ancestors (which break
  // absolute/fixed positioning of a nested popup) and clipping at screen edges.
  // Deliberately avoids the elementor-* / box-sub-home classes used on desktop:
  // a global legacy Elementor/jQuery script on the page auto fades-and-hides
  // any element carrying those classes shortly after it enters the DOM, which
  // caused the "flashes once then disappears" bug.
  if (mobile) {
    if (!active || typeof document === "undefined") return null;

    return createPortal(
      <div
        className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
        onClick={(e) => {
          // A portal's synthetic events still bubble through the React tree
          // (this Hover is a React child of the pillar item), not the DOM
          // tree — without stopping it here, the click would also reach the
          // pillar wrapper's onClick and immediately re-open the modal.
          e.stopPropagation();
          onClose?.();
        }}
      >
        <div
          className="relative w-full max-w-xs rounded-2xl border border-white/10 p-6 bg-linear-to-b from-[rgba(13,27,75,0.92)] to-[rgba(13,27,75,0.85)] shadow-[0_4px_26px_0_rgba(0,161,219,0.15),0_2px_8px_0_rgba(255,255,255,0.08)_inset]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white text-lg leading-none hover:bg-white/20"
          >
            ×
          </button>

          <h3 className="font-archivo font-bold text-lg mb-4 text-left" style={{ color }}>
            <span className="font-extrabold">Le</span>
            {title.replace("Le", "")}
          </h3>

          <ul className="space-y-2.5 list-none p-0 m-0 text-left pb-1">
            {tags.map((tag, tIdx) => (
              <li
                key={tIdx}
                className="text-white font-archivo font-light text-sm py-0.5 border-b border-white/5 last:border-0 flex items-start gap-2.5"
              >
                <span className="text-zinc-400 text-xs mt-1">•</span>
                <span>{tag}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>,
      document.body
    );
  }

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
      {content}
    </div>
  );
}
