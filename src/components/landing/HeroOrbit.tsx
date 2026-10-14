"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import { Bot, Brain, Cpu, LayoutGrid, Layers, Plane, Server, Truck } from "lucide-react";
import { useTranslations } from "next-intl";

// V2 "Mặt trời và Quỹ đạo" diagram: the LeTRON sun in the middle, an inner orbit of applications and an
// outer orbit of devices. Start angles (degrees from +x, clockwise) and radii (fraction of the box width)
// come from the V2 design (web/content.js, web/app.js). Styling reuses the site's existing cyan glow look.
// Each satellite has its own accent so the two rings read as eight distinct things, not eight copies of one icon.
// Satellite colours are the brand tokens (globals.css --brand-*), the same palette as the Figma product logos:
// emerald #298C43, cyan #6FCBDC, gray #6E6F6F, lime #7DC35A, teal #038181, orange-deep #F78E20, orange #FAAF4D.
type OrbitNode = { id: string; name: string; Icon: LucideIcon; angle: number; color: string };

const INNER: OrbitNode[] = [
  { id: "leaso", name: "LeASO", Icon: LayoutGrid, angle: 0, color: "#298C43" },
  { id: "lele", name: "LeLe", Icon: Brain, angle: 120, color: "#6FCBDC" },
  { id: "lecapm", name: "LeCAP-M", Icon: Cpu, angle: 240, color: "#6E6F6F" },
];
const OUTER: OrbitNode[] = [
  { id: "nodefactory", name: "Le-NodeFactory", Icon: Server, angle: 20, color: "#7DC35A" },
  { id: "nodemobility", name: "Le-NodeMobility", Icon: Truck, angle: 92, color: "#038181" },
  { id: "nodeair", name: "Le-NodeAir", Icon: Plane, angle: 164, color: "#7DC35A" },
  { id: "orion", name: "Le-ORION", Icon: Bot, angle: 236, color: "#F78E20" },
  { id: "leos", name: "LeOS", Icon: Layers, angle: 308, color: "#FAAF4D" },
];

const INNER_RADIUS = 0.225;
const OUTER_RADIUS = 0.415;

// V2 keeps the same ratios (inner orbit counter-rotates at 0.55x the outer speed) but turns at only 2 degrees
// per second, which is imperceptible on screen, so the periods here are shorter.
const OUTER_SECONDS = 60;
const INNER_SECONDS = Math.round(OUTER_SECONDS / 0.55);
const SUN_SECONDS = 45;
const RING_SECONDS = 70;

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
  seconds,
  reverse,
  active,
  paused,
  registerRef,
  onEnter,
  onLeave,
  onToggle,
}: {
  node: OrbitNode;
  radius: number;
  seconds: number;
  /** true when the orbit turns counter-clockwise (the node then counter-rotates clockwise to stay upright). */
  reverse: boolean;
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
  const { Icon, color } = node;

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
        className="group pointer-events-auto relative flex cursor-pointer flex-col items-center border-0 bg-transparent p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#63D9FF]"
        style={{
          animation: `orbit-spin ${seconds}s linear infinite ${reverse ? "normal" : "reverse"}`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {/* Hexagon border: the exported Figma shell. Same 46px / 58px footprint, same icon and name as before. */}
        <span className="relative block size-[46px] transition-transform duration-300 group-hover:scale-110 sm:size-[58px]">
          <span
            className="absolute inset-x-0 flex items-center justify-center"
            style={{ top: "6.385%", height: "87.23%", filter: active ? "drop-shadow(0 0 8px rgba(99,217,255,0.9))" : undefined }}
          >
            <img
              src={`/images/orbit/shell-${FIGMA_SHELL[node.id]}.svg`}
              alt=""
              className="absolute block max-w-none"
              style={{ left: "-9.73%", top: "-10.98%", width: "119.46%", height: "121.96%", maxWidth: "none" }}
            />
            {/* Figma "DS Interface Icon" tile (navy, 1px electric-blue border, rounded corners, glow) holding the original function icon */}
            <span
              className="relative block"
              style={{
                width: "44%",
                aspectRatio: "1",
                background: "#0d1b4b",
                border: "1px solid #2a9fff",
                borderRadius: "29.4%",
                boxShadow: "0 0 10px rgba(42,159,255,0.45), inset 0 0 6px rgba(42,159,255,0.25)",
              }}
            >
              <Icon
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ width: "62%", height: "62%", color, filter: `drop-shadow(0 0 4px ${color}99)` }}
                strokeWidth={1.9}
              />
            </span>
          </span>
        </span>
        <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 text-center font-inter text-[9px] font-extrabold leading-[1.15] tracking-[0.2px] whitespace-nowrap sm:text-[11px]" style={{ color: active ? "#8FE3FF" : "#FFFFFF", textShadow: "0 0 8px rgba(42,159,255,0.8), 0 1px 2px rgba(0,0,0,0.6)" }}>
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

  const play = paused ? "paused" : "running";

  return (
    <div ref={rootRef} className="relative w-[300px] shrink-0 sm:w-[380px] lg:w-full lg:max-w-[500px] lg:justify-self-end">
      <style>{"@keyframes orbit-spin{to{transform:rotate(360deg)}}"}</style>
      <div className="relative aspect-square w-full">
        {/* Figma "Orbit glow": soft blue halo behind the whole diagram */}
        <img
          src="/images/orbit/glow.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute block"
          style={{ left: "7.15%", top: "7.15%", width: "85.7%", height: "85.7%", maxWidth: "none" }}
        />
        {/* Orbit guide lines: solid, thin solid, dashed and dotted rings with a few glowing dots, as in the original art.
            They only decorate the existing radii; they take no space and ignore the pointer. */}
        <span aria-hidden className="pointer-events-none absolute rounded-full border border-[#2A9FFF]/60 shadow-[0_0_14px_rgba(42,159,255,0.25)]" style={{ inset: `${(0.5 - OUTER_RADIUS) * 100}%` }} />
        <span aria-hidden className="pointer-events-none absolute rounded-full border border-[#63D9FF]/25" style={{ inset: `${(0.5 - OUTER_RADIUS - 0.03) * 100}%` }} />
        <span aria-hidden className="pointer-events-none absolute rounded-full border border-dashed border-[#2A9FFF]/45" style={{ inset: `${(0.5 - INNER_RADIUS) * 100}%` }} />
        <span aria-hidden className="pointer-events-none absolute rounded-full border border-dotted border-[#63D9FF]/30" style={{ inset: `${(0.5 - INNER_RADIUS + 0.04) * 100}%` }} />
        {[
          { r: OUTER_RADIUS, a: 55 },
          { r: OUTER_RADIUS, a: 200 },
          { r: OUTER_RADIUS + 0.03, a: 330 },
          { r: INNER_RADIUS, a: 95 },
        ].map((d) => (
          <span
            key={`${d.r}-${d.a}`}
            aria-hidden
            className="pointer-events-none absolute size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#63D9FF] shadow-[0_0_8px_2px_rgba(99,217,255,0.8)]"
            style={{
              left: `${50 + Math.cos((d.a * Math.PI) / 180) * d.r * 100}%`,
              top: `${50 + Math.sin((d.a * Math.PI) / 180) * d.r * 100}%`,
            }}
          />
        ))}

        {/* Sun: Figma LeOS core; the gear ring and the mark keep their turning speeds */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[34%] -translate-x-1/2 -translate-y-1/2">
        {/* LeOS core from Figma. Its diameter (65.6% of this box) equals the visible ring it replaces, so the size is unchanged. */}
        <div
          className="pointer-events-none absolute overflow-hidden rounded-full"
          style={{
            left: "17.2%",
            top: "17.2%",
            width: "65.6%",
            height: "65.6%",
            border: "2px solid #2a9fff",
            background: "radial-gradient(circle at 50% 50%, #1c4d88 0%, #133874 46%, #0c275e 78%, #071a49 100%)",
            boxShadow: "0 12.6px 31.6px -9.5px rgba(6,21,62,0.34), 0 0 34.8px rgba(42,159,255,0.26)",
          }}
        >
          <div className="absolute" style={{ inset: "2.27%" }} role="img" aria-label={sunAlt}>
            <div className="absolute aspect-square" style={{ left: "50%", top: "50%", width: "119.2%", marginLeft: "-59.6%", marginTop: "-59.6%", animation: `orbit-spin ${RING_SECONDS}s linear infinite reverse`, animationPlayState: play }}>
              <div className="absolute left-1/2 top-1/2 aspect-square overflow-hidden" style={{ width: "83.9%", transform: "translate(-50%, -50%) rotate(-12.45deg)" }}>
                <img src="/images/orbit/core-gear.webp" alt="" className="absolute max-w-none" style={{ height: "115.65%", left: "-3.711%", top: "-7.375%", width: "109.01%", maxWidth: "none" }} />
              </div>
            </div>
            <img src="/images/orbit/core-disc.svg" alt="" className="absolute block max-w-none" style={{ left: "23.055%", top: "23.055%", width: "53.89%", height: "53.89%", maxWidth: "none", opacity: 0.85 }} />
            <div className="absolute inset-0" style={{ animation: `orbit-spin ${SUN_SECONDS}s linear infinite`, animationPlayState: play }}>
              <div className="absolute" style={{ left: "22.65%", right: "22.65%", top: "22.315%", bottom: "22.315%" }}>
                <img src="/images/orbit/core-arms.svg" alt="" className="absolute left-1/2 top-1/2 block max-w-none" style={{ width: "69.2%", height: "73.9%", maxWidth: "none", transform: "translate(-50%, -50%) rotate(36.19deg)" }} />
              </div>
              <div className="absolute" style={{ left: "40.08%", right: "40.08%", top: "40.28%", bottom: "40.28%" }}>
                <img src="/images/orbit/core-hex.svg" alt="" className="absolute left-1/2 top-1/2 block max-w-none" style={{ width: "75.5%", height: "67.5%", maxWidth: "none", transform: "translate(-50%, -50%) rotate(36.19deg)" }} />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 rounded-full" style={{ boxShadow: "inset 0 0 38px rgba(118,198,255,0.2)" }} />
        </div>

        </div>

        {/* Inner orbit (applications): counter-clockwise and slower. The layers ignore the pointer so they
            never cover each other's satellites; only the buttons take clicks. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ animation: `orbit-spin ${INNER_SECONDS}s linear infinite reverse`, animationPlayState: play }}
        >
          {INNER.map((n) => (
            <Satellite key={n.id} node={n} radius={INNER_RADIUS} seconds={INNER_SECONDS} reverse {...common(n)} />
          ))}
        </div>

        {/* Outer orbit (devices) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ animation: `orbit-spin ${OUTER_SECONDS}s linear infinite`, animationPlayState: play }}
        >
          {OUTER.map((n) => (
            <Satellite key={n.id} node={n} radius={OUTER_RADIUS} seconds={OUTER_SECONDS} reverse={false} {...common(n)} />
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
            className="pointer-events-auto fixed z-[1000] max-w-[92vw] rounded-[14px] border border-[#2A9FFF]/55 bg-[#061a40] px-3.5 py-3 text-left shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
            style={{
              width: TIP_WIDTH,
              ...(tip.side === "above" && { left: tip.x, bottom: tip.y, transform: "translateX(-50%)" }),
              ...(tip.side === "below" && { left: tip.x, top: tip.y, transform: "translateX(-50%)" }),
              ...(tip.side === "right" && { left: tip.x, top: tip.y, transform: "translateY(-50%)" }),
              ...(tip.side === "left" && { right: tip.x, top: tip.y, transform: "translateY(-50%)" }),
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
