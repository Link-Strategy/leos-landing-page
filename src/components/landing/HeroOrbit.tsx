"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import { Bot, Brain, Cpu, LayoutGrid, Layers, Plane, Server, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

// V2 "Mặt trời và Quỹ đạo" diagram: the LeTRON sun in the middle, an inner orbit of applications and an
// outer orbit of devices. Start angles (degrees from +x, clockwise) and radii (fraction of the box width)
// come from the V2 design (web/content.js, web/app.js). Styling is the Figma "Perceptive Edge Orbit" frame, written
// as Tailwind utilities only (no inline style except the computed positions, no custom CSS).
// Each satellite has its own accent so the two rings read as eight distinct things, not eight copies of one icon.
// Satellite colours are the brand tokens (globals.css --brand-*), the same palette as the Figma product logos:
// emerald #298C43, cyan #6FCBDC, gray #6E6F6F, lime #7DC35A, teal #038181, orange-deep #F78E20, orange #FAAF4D.
type OrbitNode = { id: string; name: string; Icon: LucideIcon; angle: number; icon: string; glow: string };

// Icon tint (brand token) and its drop-shadow, as complete class strings so Tailwind can see them.
const INNER: OrbitNode[] = [
  { id: "leaso", name: "LeASO", Icon: LayoutGrid, angle: 0, icon: "text-brand-emerald", glow: "drop-shadow-[0_0_4px_rgba(41,140,67,0.6)]" },
  { id: "lele", name: "LeLe", Icon: Brain, angle: 120, icon: "text-brand-cyan", glow: "drop-shadow-[0_0_4px_rgba(111,203,220,0.6)]" },
  { id: "lecapm", name: "LeCAP-M", Icon: Cpu, angle: 240, icon: "text-brand-gray", glow: "drop-shadow-[0_0_4px_rgba(110,111,111,0.6)]" },
];
const OUTER: OrbitNode[] = [
  { id: "nodefactory", name: "Le-NodeFactory", Icon: Server, angle: 20, icon: "text-brand-lime", glow: "drop-shadow-[0_0_4px_rgba(125,195,90,0.6)]" },
  { id: "nodemobility", name: "Le-NodeMobility", Icon: Truck, angle: 92, icon: "text-brand-teal", glow: "drop-shadow-[0_0_4px_rgba(3,129,129,0.6)]" },
  { id: "nodeair", name: "Le-NodeAir", Icon: Plane, angle: 164, icon: "text-brand-lime", glow: "drop-shadow-[0_0_4px_rgba(125,195,90,0.6)]" },
  { id: "orion", name: "Le-ORION", Icon: Bot, angle: 236, icon: "text-brand-orange-deep", glow: "drop-shadow-[0_0_4px_rgba(247,142,32,0.6)]" },
  { id: "leos", name: "LeOS", Icon: Layers, angle: 308, icon: "text-brand-orange", glow: "drop-shadow-[0_0_4px_rgba(250,175,77,0.6)]" },
];

const INNER_RADIUS = 0.225;
const OUTER_RADIUS = 0.415;

// Turning speeds: the outer orbit 60 s, the inner orbit (0.55x as fast, opposite way) 109 s, the LeOS mark 45 s and its
// gear ring 70 s. Tailwind's built-in `spin` keyframes do the turning; each satellite counter-rotates to stay upright.
const SPIN = {
  outerLayer: "animate-[spin_60s_linear_infinite]",
  outerNode: "animate-[spin_60s_linear_infinite_reverse]",
  innerLayer: "animate-[spin_109s_linear_infinite_reverse]",
  innerNode: "animate-[spin_109s_linear_infinite]",
  mark: "animate-[spin_45s_linear_infinite]",
  ring: "animate-[spin_70s_linear_infinite_reverse]",
};
const PAUSED = "[animation-play-state:paused]!";

// Figma hexagon shell variant per satellite (public/images/orbit/shell-*.svg).
const FIGMA_SHELL: Record<string, string> = {"leaso": "a", "lele": "a", "lecapm": "c", "nodefactory": "a", "nodemobility": "d", "nodeair": "a", "orion": "d", "leos": "b"};
const TIP_WIDTH = 250;

type OrbitText = { role: string; status?: string; description?: string };
// Where the tooltip sits relative to its icon, in viewport coordinates (it renders position:fixed in a portal, so the
// hero's overflow:hidden cannot clip it). For above/below `x` is the
// (clamped) horizontal center and `y` the distance from the root's bottom/top edge; for left/right `x` is the
// distance from the root's right/left edge and `y` the vertical center.
type Tip = { id: string; side: "above" | "below" | "left" | "right"; x: number; y: number };

function Satellite({
  node,
  radius,
  spin,
  active,
  paused,
  registerRef,
  onEnter,
  onLeave,
  onToggle,
}: {
  node: OrbitNode;
  radius: number;
  /** Counter-rotation class that keeps the node upright while its orbit turns. */
  spin: string;
  active: boolean;
  paused: boolean;
  registerRef: (id: string, el: HTMLButtonElement | null) => void;
  onEnter: () => void;
  onLeave: () => void;
  onToggle: () => void;
}) {
  const rad = (node.angle * Math.PI) / 180;
  // Rounded: raw floats differ in the last digits between server and client and trigger a hydration mismatch.
  const left = Number((50 + Math.cos(rad) * radius * 100).toFixed(2));
  const top = Number((50 + Math.sin(rad) * radius * 100).toFixed(2));
  const { Icon } = node;

  return (
    <span className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${left}%`, top: `${top}%` }}>
      <button
        ref={(el) => registerRef(node.id, el)}
        type="button"
        aria-pressed={active}
        onClick={onToggle}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        // Only keyboard focus opens the tooltip: after a mouse click the button keeps focus, which would freeze the orbit.
        onFocus={(e) => {
          if (e.currentTarget.matches(":focus-visible")) onEnter();
        }}
        onBlur={onLeave}
        className={cn(
          "group pointer-events-auto relative flex cursor-pointer flex-col items-center border-0 bg-transparent p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#63D9FF]",
          spin,
          paused && PAUSED,
        )}
      >
        {/* Hexagon: the exported Figma shell over an opaque navy body, the Figma icon tile and the original function icon */}
        <span className="relative block size-[46px] transition-transform duration-300 group-hover:scale-110 sm:size-[58px]">
          <span className={cn("absolute inset-x-0 top-[6.385%] flex h-[87.23%] items-center justify-center", active && "drop-shadow-[0_0_8px_rgba(99,217,255,0.9)]")}>
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,#071a45_0%,#040f2b_100%)] [clip-path:polygon(25.6%_1.2%,74.5%_1.2%,98.9%_50%,74.5%_98.4%,25.6%_98.4%,1.2%_50%)]"
            />
            <img
              src={`/images/orbit/shell-${FIGMA_SHELL[node.id]}.svg`}
              alt=""
              className="absolute -left-[9.73%] -top-[10.98%] block h-[121.96%]! w-[119.46%] max-w-none!"
            />
            <span className="relative block aspect-square w-[44%] rounded-[29.4%] border-[0.85px] border-solid border-[#2a9fff] bg-[#0d1b4b]">
              <Icon className={cn("absolute left-1/2 top-1/2 size-[62%] -translate-1/2", node.icon, node.glow)} strokeWidth={1.9} />
            </span>
          </span>
        </span>
        <span
          className={cn(
            "absolute left-1/2 top-full -mt-0.5 -translate-x-1/2 text-center font-inter text-[9px] font-extrabold leading-[1.15] tracking-[0.2px] whitespace-nowrap [text-shadow:0_0_8px_rgba(42,159,255,0.8),0_1px_2px_rgba(0,0,0,0.6)] sm:text-[11px]",
            active ? "text-[#8FE3FF]" : "text-white",
          )}
        >
          {(() => {
            const m = node.name.match(/^(Le-Node)(Factory|Mobility)$/);
            return m ? (<>{m[1]}<br />{m[2]}</>) : node.name;
          })()}
        </span>
      </button>
    </span>
  );
}

export default function HeroOrbit({ sunAlt, caption }: { sunAlt: string; caption?: string }) {
  const t = useTranslations("hero");
  const items = t.raw("orbit") as Record<string, OrbitText>;

  const rootRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [tip, setTip] = useState<Tip | null>(null);
  const hoveredRef = useRef<string | null>(null);
  const selectedRef = useRef<string | null>(null);
  const leaveTimer = useRef<number | null>(null);

  const cancelLeave = () => {
    if (leaveTimer.current !== null) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };
  // Short grace period so the pointer can travel from the icon to the tooltip (which holds a link) without it closing.
  const scheduleLeave = () => {
    cancelLeave();
    leaveTimer.current = window.setTimeout(() => {
      hoveredRef.current = null;
      setHovered(null);
      setTip(selectedRef.current ? measure(selectedRef.current) : null);
    }, 160);
  };

  // Hover shows the tooltip; a click keeps it open (touch screens have no hover). The orbits stand still while
  // a tooltip is open so it stays attached to its icon.
  const activeId = hovered ?? selected;
  const paused = activeId !== null;
  const activeNode = [...INNER, ...OUTER].find((n) => n.id === activeId);
  const info = activeNode ? items[activeNode.id] : undefined;

  // Measured when a tooltip opens (event time, not in an effect): the orbits stop at that moment, so the
  // position stays valid for as long as the tooltip is open.
  const measure = (id: string): Tip | null => {
    const root = rootRef.current;
    const btn = nodeRefs.current[id];
    if (!root || !btn) return null;
    const r = root.getBoundingClientRect();
    const b = btn.getBoundingClientRect();
    const half = TIP_WIDTH / 2;
    const gap = 8;
    const cx = b.left + b.width / 2;
    const cy = b.top + b.height / 2;
    // Open away from the orbit: along the direction from the sun to the icon.
    const dx = cx - (r.left + r.width / 2);
    const dy = cy - (r.top + r.height / 2);
    const roomRight = window.innerWidth - b.right;
    const roomLeft = b.left;
    const horizontal = Math.abs(dx) >= Math.abs(dy);
    if (horizontal && dx >= 0 && roomRight >= TIP_WIDTH + gap + 8) {
      return { id, side: "right", x: b.right + gap, y: cy };
    }
    if (horizontal && dx < 0 && roomLeft >= TIP_WIDTH + gap + 8) {
      return { id, side: "left", x: window.innerWidth - b.left + gap, y: cy };
    }
    // Keep the box inside the viewport horizontally.
    const x = Math.min(Math.max(cx, half + 8), window.innerWidth - half - 8);
    // Vertical fallback: outward when the icon is on that half; flip only if the viewport has no room on that side.
    const wantAbove = dy < 0 ? b.top >= 170 : b.bottom > window.innerHeight - 170;
    return wantAbove
      ? { id, side: "above", x, y: window.innerHeight - b.top + gap }
      : { id, side: "below", x, y: b.bottom + gap };
  };

  // Fixed coordinates go stale when the page scrolls or resizes: close the tooltip instead of letting it drift.
  useEffect(() => {
    if (!tip) return;
    const close = () => {
      hoveredRef.current = null;
      selectedRef.current = null;
      setHovered(null);
      setSelected(null);
      setTip(null);
    };
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, [tip]);

  // A tooltip opened by click (touch) closes by itself so the orbit never stays frozen.
  useEffect(() => {
    if (!selected) return;
    const timer = window.setTimeout(() => {
      selectedRef.current = null;
      setSelected(null);
      if (!hoveredRef.current) setTip(null);
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [selected]);

  const common = (n: OrbitNode) => ({
    active: activeId === n.id,
    paused,
    registerRef: (id: string, el: HTMLButtonElement | null) => {
      nodeRefs.current[id] = el;
    },
    onEnter: () => {
      cancelLeave();
      hoveredRef.current = n.id;
      setHovered(n.id);
      setTip(measure(n.id));
    },
    onLeave: scheduleLeave,
    onToggle: () => {
      const next = selected === n.id ? null : n.id;
      selectedRef.current = next;
      setSelected(next);
      setTip(next ? measure(next) : hovered ? measure(hovered) : null);
    },
  });

  return (
    <div ref={rootRef} className="relative w-[300px] shrink-0 sm:w-[380px] lg:w-full lg:max-w-[500px] lg:justify-self-end">
      <div className="relative aspect-square w-full">
        {/* Figma "Orbit glow": soft blue halo behind the whole diagram */}
        <img src="/images/orbit/glow.svg" alt="" aria-hidden className="pointer-events-none absolute left-[7.15%] top-[7.15%] block h-[85.7%]! w-[85.7%] max-w-none!" />

        {/* Orbit guide lines in Figma's stroke colours (ring 4 #2A9FFF, ring 11 #49B9FF 42%, ring 19 #6FCBDC dashed,
            ring 27 #49BBFF 25% dotted, ring 34 #76C6FF), drawn on the Figma 620 grid at this diagram's radii. */}
        <svg aria-hidden viewBox="0 0 620 620" className="pointer-events-none absolute inset-0 size-full fill-none">
          <circle cx="310" cy="310" r={OUTER_RADIUS * 620} className="stroke-[#2A9FFF] [vector-effect:non-scaling-stroke]" />
          <circle cx="310" cy="310" r={(OUTER_RADIUS + 0.03) * 620} className="stroke-[#49B9FF]/42 [vector-effect:non-scaling-stroke]" />
          <circle cx="310" cy="310" r={INNER_RADIUS * 620} className="stroke-[#6FCBDC] [stroke-dasharray:3.6_6] [vector-effect:non-scaling-stroke]" />
          <circle cx="310" cy="310" r={(INNER_RADIUS + 0.04) * 620} className="stroke-[#49BBFF]/25 [stroke-dasharray:1.6_8] [vector-effect:non-scaling-stroke]" />
          <circle cx="310" cy="310" r="73.7" className="stroke-[#76C6FF] [vector-effect:non-scaling-stroke]" />
        </svg>
        {[
          { r: OUTER_RADIUS, a: 55 },
          { r: OUTER_RADIUS, a: 200 },
          { r: OUTER_RADIUS + 0.03, a: 330 },
          { r: INNER_RADIUS, a: 95 },
        ].map((d) => (
          <span
            key={`${d.r}-${d.a}`}
            aria-hidden
            className="pointer-events-none absolute size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#49B9FF] shadow-[0_0_8px_rgba(42,159,255,0.7)]"
            style={{
              left: `${50 + Math.cos((d.a * Math.PI) / 180) * d.r * 100}%`,
              top: `${50 + Math.sin((d.a * Math.PI) / 180) * d.r * 100}%`,
            }}
          />
        ))}

        {/* Sun: Figma LeOS core. Pixel values of the 330px core are converted to cqw so they scale with it; the core is
            65.6% of this box. The gear ring and the mark keep their turning speeds. */}
        <div className="@container pointer-events-none absolute left-1/2 top-1/2 size-[34%] -translate-1/2">
          <div className="pointer-events-none absolute left-[17.2%] top-[17.2%] size-[65.6%] overflow-hidden rounded-full border-[0.4719cqw] border-solid border-[#2a9fff] bg-[radial-gradient(ellipse_64.103%_64.103%_at_51.282%_51.282%,#1c4d88_0%,#133874_46%,#0c275e_78%,#071a49_100%)] shadow-[0_2.5173cqw_6.2932cqw_-1.8879cqw_rgba(6,21,62,0.34),0_0_6.9224cqw_rgba(42,159,255,0.26)]">
            <div className="absolute left-[1.575%] top-[1.575%] aspect-square w-[96.85%]" role="img" aria-label={sunAlt}>
              <div className={cn("absolute left-1/2 top-1/2 -ml-[59.6%] -mt-[59.6%] aspect-square w-[119.2%]", SPIN.ring, paused && PAUSED)}>
                <div className="absolute left-1/2 top-1/2 aspect-square w-[83.89%] -translate-1/2 rotate-[-12.45deg] overflow-hidden">
                  <img src="/images/orbit/core-gear.webp" alt="" className="absolute -left-[3.89%] -top-[7.82%] h-[115.65%]! w-[109.01%] max-w-none!" />
                </div>
              </div>
              <img src="/images/orbit/core-disc.svg" alt="" className="absolute left-[22.616%] top-[22.438%] block h-[53.887%]! w-[53.887%] max-w-none!" />
              <div className={cn("absolute inset-0", SPIN.mark, paused && PAUSED)}>
                <div className="absolute inset-x-[22.65%] inset-y-[22.315%]">
                  <img src="/images/orbit/core-arms.svg" alt="" className="absolute left-1/2 top-1/2 block h-[73.87%]! w-[69.2%] max-w-none! -translate-1/2 rotate-[36.19deg]" />
                </div>
                <div className="absolute inset-x-[40.08%] inset-y-[40.28%]">
                  <img src="/images/orbit/core-hex.svg" alt="" className="absolute left-1/2 top-1/2 block h-[67.45%]! w-[75.57%] max-w-none! -translate-1/2 rotate-[36.19deg]" />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_7.5518cqw_rgba(118,198,255,0.2)]" />
          </div>
        </div>

        {/* Inner orbit (applications): counter-clockwise and slower. The layers ignore the pointer so they
            never cover each other's satellites; only the buttons take clicks. */}
        <div className={cn("pointer-events-none absolute inset-0", SPIN.innerLayer, paused && PAUSED)}>
          {INNER.map((n) => (
            <Satellite key={n.id} node={n} radius={INNER_RADIUS} spin={SPIN.innerNode} {...common(n)} />
          ))}
        </div>

        {/* Outer orbit (devices) */}
        <div className={cn("pointer-events-none absolute inset-0", SPIN.outerLayer, paused && PAUSED)}>
          {OUTER.map((n) => (
            <Satellite key={n.id} node={n} radius={OUTER_RADIUS} spin={SPIN.outerNode} {...common(n)} />
          ))}
        </div>
      </div>

      {caption ? (
        <p className="pt-8 text-center font-inter text-[12px] lg:pt-6 font-semibold uppercase tracking-[1.6px] text-white/60">{caption}</p>
      ) : null}

      {/* Tooltip attached to the active satellite, rendered at the body so no ancestor can clip it */}
      {tip && activeNode && info && tip.id === activeNode.id && typeof document !== "undefined" &&
        createPortal(
          <div
            role="tooltip"
            onMouseEnter={cancelLeave}
            onMouseLeave={scheduleLeave}
            className={cn(
              "pointer-events-auto fixed z-[1000] w-[250px] max-w-[92vw] rounded-[14px] border border-[#2A9FFF]/55 bg-[#061a40] px-3.5 py-3 text-left shadow-[0_8px_24px_rgba(0,0,0,0.45)]",
              (tip.side === "above" || tip.side === "below") && "-translate-x-1/2",
              (tip.side === "left" || tip.side === "right") && "-translate-y-1/2",
            )}
            style={{
              ...(tip.side === "above" && { left: tip.x, bottom: tip.y }),
              ...(tip.side === "below" && { left: tip.x, top: tip.y }),
              ...(tip.side === "right" && { left: tip.x, top: tip.y }),
              ...(tip.side === "left" && { right: tip.x, top: tip.y }),
            }}
          >
            <p className="m-0 font-inter text-[13px] font-bold leading-[18px] text-white">
              {activeNode.name}
              <span className="font-normal text-[#63D9FF]"> · {info.role}</span>
            </p>
            {info.description && (
              <p className="mb-0 mt-1.5 font-inter text-[12px] leading-[17px] text-white/80">{info.description}</p>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
