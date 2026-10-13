"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Bot, Brain, Cpu, LayoutGrid, Layers, Plane, Server, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { v2Href } from "@/lib/v2-routes";

// V2 "Mặt trời và Quỹ đạo" diagram: the LeTRON sun in the middle, an inner orbit of applications and an
// outer orbit of devices. Start angles (degrees from +x, clockwise) and radii (fraction of the box width)
// come from the V2 design (web/content.js, web/app.js). Styling reuses the site's existing cyan glow look.
type OrbitNode = { id: string; name: string; Icon: LucideIcon; angle: number };

const INNER: OrbitNode[] = [
  { id: "leaso", name: "LeASO", Icon: LayoutGrid, angle: 0 },
  { id: "lele", name: "LeLe", Icon: Brain, angle: 120 },
  { id: "lecapm", name: "LeCAP-M", Icon: Cpu, angle: 240 },
];
const OUTER: OrbitNode[] = [
  { id: "nodefactory", name: "Le-NodeFactory", Icon: Server, angle: 20 },
  { id: "nodemobility", name: "Le-NodeMobility", Icon: Truck, angle: 92 },
  { id: "nodeair", name: "Le-NodeAir", Icon: Plane, angle: 164 },
  { id: "orion", name: "Le-ORION", Icon: Bot, angle: 236 },
  { id: "leos", name: "LeOS", Icon: Layers, angle: 308 },
];

// Page each satellite points to (keys of V2_ROUTES).
const NODE_ROUTES: Record<string, string> = {
  leaso: "platform",
  lele: "platform",
  lecapm: "technology",
  nodefactory: "factory",
  nodemobility: "city",
  nodeair: "city",
  orion: "factory",
  leos: "platform",
};

const INNER_RADIUS = 0.225;
const OUTER_RADIUS = 0.415;

// V2 keeps the same ratios (inner orbit counter-rotates at 0.55x the outer speed) but turns at only 2 degrees
// per second, which is imperceptible on screen, so the periods here are shorter.
const OUTER_SECONDS = 60;
const INNER_SECONDS = Math.round(OUTER_SECONDS / 0.55);
const SUN_SECONDS = 45;
const RING_SECONDS = 70;

const HEX = "polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0% 50%)";
const TIP_WIDTH = 250;

type OrbitText = { role: string; status?: string; description?: string };
// Where the tooltip sits relative to its icon. `x`/`y` are root-relative offsets: for above/below `x` is the
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
        className="group pointer-events-auto flex cursor-pointer flex-col items-center gap-1 border-0 bg-transparent p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#63D9FF]"
        style={{
          animation: `orbit-spin ${seconds}s linear infinite ${reverse ? "normal" : "reverse"}`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        <span
          className="relative flex size-[46px] items-center justify-center transition-transform duration-300 group-hover:scale-110 sm:size-[58px]"
          style={{
            clipPath: HEX,
            background: active ? "#63D9FF" : "#2A9FFF",
            filter: "drop-shadow(0 0 10px rgba(42,159,255,0.45))",
          }}
        >
          <span
            className="absolute inset-[1.5px] flex items-center justify-center"
            style={{
              clipPath: HEX,
              background: active
                ? "linear-gradient(180deg, #0f3a82 0%, #0a2a63 100%)"
                : "linear-gradient(180deg, #0b2a63 0%, #061a40 100%)",
            }}
          >
            <Icon className={active ? "size-5 text-[#63D9FF] sm:size-6" : "size-5 text-[#9fd8ff] sm:size-6"} strokeWidth={1.6} />
          </span>
        </span>
        <span className="font-inter text-[9px] font-bold leading-none tracking-[0.2px] text-white whitespace-nowrap sm:text-[11px]">
          {node.name}
        </span>
      </button>
    </span>
  );
}

export default function HeroOrbit({ sunAlt, caption }: { sunAlt: string; caption?: string }) {
  const t = useTranslations("hero");
  const tc = useTranslations("v2.common");
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
    // Open away from the orbit: along the direction from the sun to the icon.
    const dx = b.left + b.width / 2 - (r.left + r.width / 2);
    const dy = b.top + b.height / 2 - (r.top + r.height / 2);
    const roomRight = window.innerWidth - b.right;
    const roomLeft = b.left;
    const horizontal = Math.abs(dx) >= Math.abs(dy);
    if (horizontal && dx >= 0 && roomRight >= TIP_WIDTH + gap + 8) {
      return { id, side: "right", x: b.right - r.left + gap, y: b.top + b.height / 2 - r.top };
    }
    if (horizontal && dx < 0 && roomLeft >= TIP_WIDTH + gap + 8) {
      return { id, side: "left", x: r.right - b.left + gap, y: b.top + b.height / 2 - r.top };
    }
    const x = Math.min(Math.max(b.left + b.width / 2 - r.left, half), Math.max(r.width - half, half));
    // Vertical fallback: outward when the icon is on that half; flip only if the viewport has no room above.
    const wantAbove = dy < 0 && b.top >= 170;
    return wantAbove
      ? { id, side: "above", x, y: r.bottom - b.top + gap }
      : { id, side: "below", x, y: b.bottom - r.top + gap };
  };

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
        {/* Orbit guide lines */}
        <span
          aria-hidden
          className="pointer-events-none absolute rounded-full border border-dashed border-[#2A9FFF]/35"
          style={{ inset: `${(0.5 - INNER_RADIUS) * 100}%` }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute rounded-full border border-[#2A9FFF]/55"
          style={{ inset: `${(0.5 - OUTER_RADIUS) * 100}%` }}
        />

        {/* Sun: the glowing ring turns against the core */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[34%] -translate-x-1/2 -translate-y-1/2">
          <img
            src="/images/site/sun-ring.webp"
            alt=""
            className="absolute inset-0 h-full! w-full object-contain opacity-60 drop-shadow-[0_0_20px_rgba(42,159,255,0.15)]"
            style={{ animation: `orbit-spin ${RING_SECONDS}s linear infinite reverse`, animationPlayState: play }}
          />
          <img
            src="/images/site/sun-core.webp"
            alt={sunAlt}
            className="absolute left-1/2 top-1/2 h-[50%]! w-[50%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_0_15px_rgba(42,159,255,0.2)]"
            style={{ animation: `orbit-spin ${SUN_SECONDS}s linear infinite`, animationPlayState: play }}
          />
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
        <p className="mb-0 mt-3 text-center font-inter text-[12px] font-semibold uppercase tracking-[1.6px] text-white/60">{caption}</p>
      ) : null}

      {/* Tooltip attached to the active satellite */}
      {tip && activeNode && info && tip.id === activeNode.id && (
        <div
          role="tooltip"
          onMouseEnter={cancelLeave}
          onMouseLeave={scheduleLeave}
          className="pointer-events-auto absolute z-30 max-w-[92vw] rounded-[14px] border border-[#2A9FFF]/55 bg-[#061a40] px-3.5 py-3 text-left shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
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
          {info.status && (
            <span className="mt-1.5 inline-block rounded-full border border-[#FAB81F]/60 px-2 py-[1px] text-[10px] font-semibold uppercase tracking-[0.6px] text-[#FAB81F]">
              {info.status}
            </span>
          )}
          {info.description && (
            <p className="mb-0 mt-1.5 font-inter text-[12px] leading-[17px] text-white/80">{info.description}</p>
          )}
          {NODE_ROUTES[activeNode.id] && (
            <Link
              href={v2Href(NODE_ROUTES[activeNode.id])}
              className="mt-2 inline-flex items-center gap-1 font-inter text-[12px] font-semibold text-[#63D9FF] no-underline hover:text-white"
            >
              {tc("explore")} →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
