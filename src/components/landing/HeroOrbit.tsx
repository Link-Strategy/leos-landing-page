"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

// Perceptive Edge Orbit, built from the Figma frame (620 x 620): LeOS core in the middle, six product hexagons on one
// ring. Geometry below is the Figma geometry as fractions of the frame. Hexagon shells, tiles, logos, core and rings are
// the exported Figma assets in public/images/orbit.
type OrbitNode = { id: string; name: string; angle: number; logo: string; shell: string };

const INNER: OrbitNode[] = [];
const OUTER: OrbitNode[] = [
  { id: "leaso", name: "LeASO", angle: -90, logo: "lele", shell: "a" },
  { id: "nodefactory", name: "Le-NodeFactory", angle: -30, logo: "orange", shell: "d" },
  { id: "nodemobility", name: "Le-NodeMobility", angle: 30, logo: "teal", shell: "d" },
  { id: "nodeair", name: "Le-NodeAir", angle: 90, logo: "lime", shell: "a" },
  { id: "orion", name: "Le-ORION", angle: 150, logo: "green", shell: "b" },
  { id: "lecapm", name: "LeCAP-M", angle: 210, logo: "grey", shell: "c" },
];

const OUTER_RADIUS = 0.44;
const HEX_W = (124 / 620) * 100; // percent of the frame
const HEX_RATIO = 124 / 108.17;

// Orbit periods and the sun's spin keep the timings the page already had.
const OUTER_SECONDS = 60;
const SUN_SECONDS = 45;
const RING_SECONDS = 70;

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
  const long = node.name.length > 12;

  return (
    <span
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${left}%`, top: `${top}%`, width: `${HEX_W}%`, aspectRatio: `${HEX_RATIO}`, containerType: "inline-size" }}
    >
      <button
        ref={(el) => registerRef(node.id, el)}
        type="button"
        aria-pressed={active}
        aria-label={node.name}
        onClick={onToggle}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        // Only keyboard focus opens the tooltip: after a mouse click the button keeps focus, which would freeze the orbit.
        onFocus={(e) => {
          if (e.currentTarget.matches(":focus-visible")) onEnter();
        }}
        onBlur={onLeave}
        className="group pointer-events-auto relative block size-full cursor-pointer border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#63D9FF]"
        style={{
          animation: `orbit-spin ${seconds}s linear infinite ${reverse ? "normal" : "reverse"}`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        <span
          className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
          style={{ filter: active ? "drop-shadow(0 0 10px rgba(99,217,255,0.9))" : undefined }}
        >
          {/* Figma "Hex shell": 124 x 108 hexagon with its border and glow */}
          <img
            src={`/images/orbit/shell-${node.shell}.svg`}
            alt=""
            className="absolute block max-w-none"
            style={{ left: "-9.73%", right: "-9.73%", top: "-10.98%", bottom: "-10.98%", width: "119.46%", height: "121.96%" }}
          />
          {/* Figma "DS Interface Icon": navy tile, 1px electric-blue border, product logo */}
          <span
            className="absolute"
            style={{
              left: "35.6%",
              top: "15.54%",
              width: "28.81%",
              aspectRatio: "1",
              background: "#0d1b4b",
              border: "0.85cqw solid #2a9fff",
              borderRadius: "8.47cqw",
            }}
          >
            <img src={`/images/orbit/logo-${node.logo}.svg`} alt="" className="absolute block max-w-none" style={{ inset: "15.04% 17.65%", width: "64.7%", height: "69.9%" }} />
          </span>
          <span
            className="absolute left-0 right-0 text-center font-inter font-semibold leading-none text-white"
            style={{ top: "58%", fontSize: long ? "9.4cqw" : "11.3cqw", textShadow: active ? "0 0 8px rgba(99,217,255,0.9)" : undefined }}
          >
            {node.name}
          </span>
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
        {/* Figma rings and glow, behind the satellites */}
        <img src="/images/orbit/glow.svg" alt="" aria-hidden className="pointer-events-none absolute max-w-none" style={{ left: "8.871%", top: "8.871%", width: "82.258%", height: "82.258%", margin: "-2.09%", boxSizing: "content-box" }} />
        <img src="/images/orbit/ring4.svg" alt="" aria-hidden className="pointer-events-none absolute max-w-none" style={{ left: "3.226%", top: "3.226%", width: "93.548%", height: "93.548%" }} />
        <img src="/images/orbit/ring19.png" alt="" aria-hidden className="pointer-events-none absolute max-w-none" style={{ left: "12.097%", top: "12.097%", width: "75.806%", height: "75.806%" }} />
        <img src="/images/orbit/ring34.svg" alt="" aria-hidden className="pointer-events-none absolute max-w-none" style={{ left: "21.613%", top: "21.613%", width: "56.774%", height: "56.774%" }} />
        <img src="/images/orbit/ring11.svg" alt="" aria-hidden className="pointer-events-none absolute max-w-none" style={{ left: "5.645%", top: "5.484%", width: "88.710%", height: "88.710%" }} />
        <img src="/images/orbit/ring27.png" alt="" aria-hidden className="pointer-events-none absolute max-w-none" style={{ left: "16.935%", top: "16.935%", width: "66.129%", height: "66.129%" }} />
        {[
          [28, 307, 5, "a"],
          [587, 307, 5, "a"],
          [307, 28, 5, "a"],
          [369, 581, 5, "b"],
          [104, 108, 3, "c"],
          [513, 108, 3, "c"],
          [104, 509, 3, "c"],
          [513, 509, 3, "c"],
        ].map(([x, y, sz, v]) => (
          <span key={`${x}-${y}`} aria-hidden className="pointer-events-none absolute" style={{ left: `${(Number(x) / 620) * 100}%`, top: `${(Number(y) / 620) * 100}%`, width: `${(Number(sz) / 620) * 100}%`, height: `${(Number(sz) / 620) * 100}%` }}>
            <img src={`/images/orbit/beacon-${v}.svg`} alt="" className="absolute block max-w-none" style={{ inset: sz === 5 ? "-160%" : "-266.67%", width: sz === 5 ? "420%" : "633%", height: sz === 5 ? "420%" : "633%" }} />
          </span>
        ))}

        {/* LeOS core (Figma "LeOS core"): gradient disc with a turning gear ring and a turning LeTRON mark */}
        <div
          className="pointer-events-none absolute overflow-hidden rounded-full"
          style={{
            left: "23.387%",
            top: "23.387%",
            width: "53.226%",
            height: "53.226%",
            border: "2px solid #2a9fff",
            background: "radial-gradient(circle at 50% 50%, #1c4d88 0%, #133874 46%, #0c275e 78%, #071a49 100%)",
            boxShadow: "0 12.6px 31.6px -9.5px rgba(6,21,62,0.34), 0 0 34.8px rgba(42,159,255,0.26)",
          }}
        >
          <div className="absolute" style={{ inset: "2.27%" }} role="img" aria-label={sunAlt}>
            <div className="absolute aspect-square" style={{ left: "50%", top: "50%", width: "119.2%", marginLeft: "-59.6%", marginTop: "-59.6%", animation: `orbit-spin ${RING_SECONDS}s linear infinite reverse`, animationPlayState: play }}>
              <div className="absolute left-1/2 top-1/2 aspect-square overflow-hidden" style={{ width: "83.9%", transform: "translate(-50%, -50%) rotate(-12.45deg)" }}>
                <img src="/images/orbit/core-gear.webp" alt="" className="absolute max-w-none" style={{ height: "115.65%", left: "-3.89%", top: "-7.82%", width: "109.01%" }} />
              </div>
            </div>
            <img src="/images/orbit/core-disc.svg" alt="" className="absolute block max-w-none" style={{ left: "22.62%", top: "22.44%", width: "53.89%", height: "53.89%" }} />
            <div className="absolute inset-0" style={{ animation: `orbit-spin ${SUN_SECONDS}s linear infinite`, animationPlayState: play }}>
              <div className="absolute" style={{ left: "23.2%", right: "22.1%", top: "22.27%", bottom: "22.36%" }}>
                <img src="/images/orbit/core-arms.svg" alt="" className="absolute left-1/2 top-1/2 block max-w-none" style={{ width: "69.2%", height: "73.9%", transform: "translate(-50%, -50%) rotate(36.19deg)" }} />
              </div>
              <div className="absolute" style={{ left: "40.49%", right: "39.67%", top: "40.36%", bottom: "40.2%" }}>
                <img src="/images/orbit/core-hex.svg" alt="" className="absolute left-1/2 top-1/2 block max-w-none" style={{ width: "75.5%", height: "67.5%", transform: "translate(-50%, -50%) rotate(36.19deg)" }} />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 rounded-full" style={{ boxShadow: "inset 0 0 38px rgba(118,198,255,0.2)" }} />
        </div>

        {/* Orbit of the six products. The layer ignores the pointer; only the buttons take clicks. */}
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
