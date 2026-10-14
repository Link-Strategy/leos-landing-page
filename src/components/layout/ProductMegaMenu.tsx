"use client";

import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Bot, Cpu, LayoutGrid, Plane, Server, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { v2Href } from "@/lib/v2-routes";

// Product mega menu: one featured platform card with an illustration, then the rest grouped by layer (edge devices,
// robot & authentication). Each product keeps the accent colour it has on the hero orbit so the two read as one system.
export type MenuProduct = { id: string; eyebrow: string; title: string; body: string; route: string };

export const PRODUCT_ACCENT: Record<string, string> = {
  leaso: "#63D9FF",
  nodefactory: "#FF7E00",
  nodemobility: "#1CBBB4",
  nodeair: "#7CFC9A",
  orion: "#FF5C8A",
  lecapm: "#FAB81F",
};

export const PRODUCT_ICON: Record<string, LucideIcon> = {
  leaso: LayoutGrid,
  nodefactory: Server,
  nodemobility: Truck,
  nodeair: Plane,
  orion: Bot,
  lecapm: Cpu,
};

/** Rounded-hexagon tile in the product's colour, used by the menu cards and the mobile list. */
export function ProductTile({ id, size = 44 }: { id: string; size?: number }) {
  const c = PRODUCT_ACCENT[id] ?? "#63D9FF";
  const Icon = PRODUCT_ICON[id] ?? LayoutGrid;
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-[14px] border"
      style={{
        width: size,
        height: size,
        color: c,
        borderColor: `${c}66`,
        background: `linear-gradient(145deg, ${c}38 0%, ${c}0d 100%)`,
        boxShadow: `0 0 22px ${c}2e, inset 0 1px 0 ${c}40`,
      }}
    >
      <Icon className="size-[48%]" strokeWidth={1.8} />
    </span>
  );
}

// Network illustration for the featured card: a core with six nodes in the product colours.
function PlatformArt() {
  const nodes = [
    { x: 60, y: 46, c: PRODUCT_ACCENT.nodefactory },
    { x: 300, y: 46, c: PRODUCT_ACCENT.orion },
    { x: 28, y: 126, c: PRODUCT_ACCENT.nodemobility },
    { x: 332, y: 126, c: PRODUCT_ACCENT.lecapm },
    { x: 96, y: 186, c: PRODUCT_ACCENT.nodeair },
    { x: 264, y: 186, c: "#B388FF" },
  ];
  return (
    <svg viewBox="0 0 360 220" className="h-auto w-full" role="img" aria-label="LeASO + LeLe" fill="none">
      <defs>
        <radialGradient id="pm-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#63D9FF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#63D9FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="180" cy="116" r="92" fill="url(#pm-core)" />
      {[56, 80].map((r) => (
        <circle key={r} cx="180" cy="116" r={r} stroke="#63D9FF" strokeOpacity={r === 56 ? 0.35 : 0.18} strokeDasharray="3 6" />
      ))}
      {nodes.map((n) => (
        <g key={`${n.x}-${n.y}`}>
          <line x1="180" y1="116" x2={n.x} y2={n.y} stroke={n.c} strokeOpacity="0.45" strokeWidth="1.2" />
          <circle cx={n.x} cy={n.y} r="14" fill={n.c} fillOpacity="0.16" stroke={n.c} strokeOpacity="0.8" />
          <circle cx={n.x} cy={n.y} r="4" fill={n.c} />
        </g>
      ))}
      <polygon points="180,86 206,101 206,131 180,146 154,131 154,101" fill="#0a2a63" stroke="#63D9FF" strokeWidth="1.6" />
      <polygon points="180,98 196,107 196,125 180,134 164,125 164,107" fill="#63D9FF" fillOpacity="0.9" />
    </svg>
  );
}

function ProductCard({ p }: { p: MenuProduct }) {
  const c = PRODUCT_ACCENT[p.id] ?? "#63D9FF";
  return (
    <Link
      href={v2Href(p.route)}
      style={{ "--c": c } as CSSProperties}
      className="group relative flex min-w-0 items-start gap-3.5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-(--c)/60 hover:bg-white/[0.08]"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${c}, transparent)` }}
      />
      <ProductTile id={p.id} />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-center justify-between gap-2 font-sans text-[14px] font-bold normal-case leading-[18px] text-white">
          {p.title}
          <ArrowRight
            aria-hidden
            className="size-4 shrink-0 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            style={{ color: c }}
            strokeWidth={2}
          />
        </span>
        <span className="line-clamp-3 font-sans text-[12px] font-normal normal-case leading-[17px] text-white/70">{p.body}</span>
      </span>
    </Link>
  );
}

function GroupLabel({ children }: { children: string }) {
  return (
    <p className="m-0 mb-2.5 flex items-center gap-3 font-sans text-[11px] font-bold uppercase tracking-[2px] text-[#63D9FF]">
      {children}
      <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
    </p>
  );
}

export default function ProductMegaMenu({ products }: { products: MenuProduct[] }) {
  const t = useTranslations("header.productMenu");
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  const feature = byId.leaso;
  const edge = ["nodefactory", "nodemobility", "nodeair"].map((id) => byId[id]).filter(Boolean);
  const robot = ["orion", "lecapm"].map((id) => byId[id]).filter(Boolean);

  return (
    <div className="header-dropdown-glass products-dropdown">
      <div className="relative z-6 grid w-full grid-cols-[minmax(300px,380px)_1fr] gap-5 rounded-[28px] border border-white/15 bg-[#061a40]/95 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        {feature && (
          <Link
            href={v2Href(feature.route)}
            className="group relative flex flex-col justify-between gap-4 overflow-hidden rounded-[20px] border border-[#63D9FF]/35 bg-[linear-gradient(160deg,#0f3a82_0%,#0a2159_55%,#061a40_100%)] p-5 no-underline transition-colors duration-300 hover:border-[#63D9FF]/70"
          >
            <PlatformArt />
            <span className="flex flex-col gap-1.5">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[2px] text-[#63D9FF]">{t("platform")}</span>
              <span className="font-sans text-[20px] font-bold normal-case leading-[26px] text-white">{feature.title}</span>
              <span className="font-sans text-[13px] font-normal normal-case leading-[19px] text-white/75">{feature.body}</span>
            </span>
            <span className="inline-flex items-center gap-2 font-sans text-[13px] font-semibold normal-case text-[#63D9FF] transition-colors group-hover:text-white">
              {t("platformLink")}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
            </span>
          </Link>
        )}

        <div className="flex min-w-0 flex-col justify-between gap-5 py-1">
          <div>
            <GroupLabel>{t("edge")}</GroupLabel>
            <div className="grid grid-cols-3 gap-3">
              {edge.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </div>
          <div>
            <GroupLabel>{t("robot")}</GroupLabel>
            <div className="grid grid-cols-2 gap-3">
              {robot.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </div>
          <Link
            href="/san-pham"
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-sans text-[13px] font-semibold normal-case text-white no-underline transition-colors duration-300 hover:border-[#63D9FF]/50 hover:bg-white/[0.07]"
          >
            {t("viewAll")}
            <ArrowRight className="size-4 text-[#63D9FF] transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
