type SectionEdgeFadeProps = {
  position: "top" | "bottom";
  className?: string;
};

// Softens the hard seam where two stacked sections meet. Both variants share the
// exact same gradient (solid navy fading to transparent) — "bottom" is just "top"
// rotated 180deg, so the solid edge always lands on the actual section boundary
// while the transparent edge blends into that section's own background/content.
export default function SectionEdgeFade({ position, className = "" }: SectionEdgeFadeProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 z-20 h-24 ${position === "top" ? "top-0" : "bottom-0"} ${className}`}
      style={{
        background: "linear-gradient(180deg, #010B28 15.62%, rgba(2, 14, 48, 0.6) 50.74%, rgba(13, 27, 75, 0) 100%)",
        transform: position === "bottom" ? "rotate(180deg)" : undefined,
      }}
    />
  );
}
