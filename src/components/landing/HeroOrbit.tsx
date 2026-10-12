"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Bot, Brain, Cpu, LayoutGrid, Layers, Plane, Server, Truck } from "lucide-react";
import { useTranslations } from "next-intl";

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

const INNER_RADIUS = 0.225;
const OUTER_RADIUS = 0.415;

// V2 timings: sun 90s, outer orbit 180s, inner orbit counter-rotating at 0.55x the outer speed (180 / 0.55).
const SUN_SECONDS = 90;
const OUTER_SECONDS = 180;
const INNER_SECONDS = 327;

const HEX = "polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0% 50%)";

type OrbitText = { role: string; status?: string; description?: string };

function Satellite({
  node,
  radius,
  seconds,
  reverse,
  selected,
  onSelect,
}: {
  node: OrbitNode;
  radius: number;
  seconds: number;
  /** true when the orbit turns counter-clockwise (the node then counter-rotates clockwise to stay upright). */
  reverse: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const rad = (node.angle * Math.PI) / 180;
  // Rounded: raw floats differ in the last digits between server and client and trigger a hydration mismatch.
  const left = Number((50 + Math.cos(rad) * radius * 100).toFixed(2));
  const top = Number((50 + Math.sin(rad) * radius * 100).toFixed(2));
  const { Icon } = node;

  return (
    <span className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${left}%`, top: `${top}%` }}>
      <button
        type="button"
        aria-pressed={selected}
        onClick={onSelect}
        className="group flex cursor-pointer flex-col items-center gap-1 border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#63D9FF]"
        style={{ animation: `orbit-spin ${seconds}s linear infinite ${reverse ? "normal" : "reverse"}` }}
      >
        <span
          className="relative flex size-[46px] items-center justify-center transition-transform duration-300 group-hover:scale-110 sm:size-[58px]"
          style={{
            clipPath: HEX,
            background: selected ? "#63D9FF" : "#2A9FFF",
            filter: "drop-shadow(0 0 10px rgba(42,159,255,0.45))",
          }}
        >
          <span
            className="absolute inset-[1.5px] flex items-center justify-center"
            style={{
              clipPath: HEX,
              background: selected
                ? "linear-gradient(180deg, #0f3a82 0%, #0a2a63 100%)"
                : "linear-gradient(180deg, #0b2a63 0%, #061a40 100%)",
            }}
          >
            <Icon className={selected ? "size-5 text-[#63D9FF] sm:size-6" : "size-5 text-[#9fd8ff] sm:size-6"} strokeWidth={1.6} />
          </span>
        </span>
        <span className="font-inter text-[9px] font-bold leading-none tracking-[0.2px] text-white whitespace-nowrap sm:text-[11px]">
          {node.name}
        </span>
      </button>
    </span>
  );
}

export default function HeroOrbit({ sunAlt }: { sunAlt: string }) {
  const t = useTranslations("hero");
  const items = t.raw("orbit") as Record<string, OrbitText>;
  const [selected, setSelected] = useState<string | null>(null);
  const toggle = (id: string) => setSelected((cur) => (cur === id ? null : id));

  const all = [...INNER, ...OUTER];
  const current = all.find((n) => n.id === selected);
  const info = current ? items[current.id] : undefined;

  return (
    <div className="relative w-[300px] shrink-0 sm:w-[380px] lg:w-full lg:max-w-[500px] lg:justify-self-end">
      <div className="relative aspect-square w-full">
        {/* Orbit guide lines */}
        <span
          aria-hidden
          className="absolute rounded-full border border-dashed border-[#2A9FFF]/35"
          style={{ inset: `${(0.5 - INNER_RADIUS) * 100}%` }}
        />
        <span
          aria-hidden
          className="absolute rounded-full border border-[#2A9FFF]/55"
          style={{ inset: `${(0.5 - OUTER_RADIUS) * 100}%` }}
        />

        {/* Sun: glowing ring turns against the core, as before; the core turns at the V2 sun speed */}
        <div className="absolute left-1/2 top-1/2 size-[34%] -translate-x-1/2 -translate-y-1/2">
          <img
            src="/wp-content/uploads/2026/05/Property-1Variant3-1.webp"
            alt=""
            className="absolute inset-0 h-full! w-full object-contain opacity-60 drop-shadow-[0_0_20px_rgba(42,159,255,0.15)]"
            style={{ animation: `orbit-spin ${SUN_SECONDS * 1.5}s linear infinite reverse` }}
          />
          <img
            src="/wp-content/uploads/2026/05/Group-11.png"
            alt={sunAlt}
            className="absolute left-1/2 top-1/2 h-[50%]! w-[50%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_0_15px_rgba(42,159,255,0.2)]"
            style={{ animation: `orbit-spin ${SUN_SECONDS}s linear infinite` }}
          />
        </div>

        {/* Inner orbit (applications): turns counter-clockwise, slower than the outer one */}
        <div className="absolute inset-0" style={{ animation: `orbit-spin ${INNER_SECONDS}s linear infinite reverse` }}>
          {INNER.map((n) => (
            <Satellite
              key={n.id}
              node={n}
              radius={INNER_RADIUS}
              seconds={INNER_SECONDS}
              reverse
              selected={selected === n.id}
              onSelect={() => toggle(n.id)}
            />
          ))}
        </div>

        {/* Outer orbit (devices) */}
        <div className="absolute inset-0" style={{ animation: `orbit-spin ${OUTER_SECONDS}s linear infinite` }}>
          {OUTER.map((n) => (
            <Satellite
              key={n.id}
              node={n}
              radius={OUTER_RADIUS}
              seconds={OUTER_SECONDS}
              reverse={false}
              selected={selected === n.id}
              onSelect={() => toggle(n.id)}
            />
          ))}
        </div>
      </div>

      {/* Selected satellite details (V2: click a satellite to read about it) */}
      <div className="mt-3 min-h-[92px] text-center lg:min-h-[104px]" aria-live="polite">
        {current && info && (
          <div className="mx-auto max-w-[420px] rounded-[14px] border border-[#2A9FFF]/45 bg-[#061a40]/90 px-4 py-3 text-left">
            <p className="m-0 font-inter text-[14px] font-bold leading-[20px] text-white">
              {current.name}
              <span className="font-normal text-[#63D9FF]"> · {info.role}</span>
              {info.status && (
                <span className="ml-2 rounded-full border border-[#FAB81F]/60 px-2 py-[1px] align-middle text-[10px] font-semibold uppercase tracking-[0.6px] text-[#FAB81F]">
                  {info.status}
                </span>
              )}
            </p>
            {info.description && (
              <p className="mb-0 mt-1.5 font-inter text-[12px] leading-[18px] text-white/80">{info.description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
