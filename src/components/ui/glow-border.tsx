import { useId } from "react";

/**
 * 1px gradient ring around a rounded card (white fade at the top, cyan glow at the bottom).
 *
 * Drawn as an SVG stroke instead of a CSS `mask-composite: exclude` ring: a masked layer stacked on a
 * `backdrop-filter` card makes Chrome re-composite the border and it visibly flickers on some GPUs.
 * Place it as the first child of a `relative` card whose corner radius equals `radius`.
 */
export default function GlowBorder({ radius = 20 }: { radius?: number }) {
  const gradientId = `glow-border-${useId().replace(/:/g, "")}`;

  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" fill="none">
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.75" stopColor="#7de5ff" stopOpacity="0.4" />
          <stop offset="1" stopColor="#abc7ff" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect
        x="0.5"
        y="0.5"
        rx={radius - 0.5}
        ry={radius - 0.5}
        stroke={`url(#${gradientId})`}
        strokeWidth="1"
        style={{ width: "calc(100% - 1px)", height: "calc(100% - 1px)" }}
      />
    </svg>
  );
}
