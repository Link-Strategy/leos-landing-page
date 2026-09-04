import Image from "next/image";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { HeartValueCard } from "./HeartValueCard";

type HeartValueMeta = {
  id: string;
  titleColor: string;
};

const VALUES_META: HeartValueMeta[] = [
  { id: "excellence", titleColor: "#C8960C" },
  { id: "action", titleColor: "#FF7E00" },
  { id: "humanity", titleColor: "#1CBBB4" },
  { id: "technology", titleColor: "#1CBBB4" },
  { id: "respect", titleColor: "#228B22" },
];

// Connector line + dot bridging a card to its matching icon on the center diagram.
// Position/size are estimates tuned against the design mockup — expect to need
// visual tweaks once checked live, since layout can't be screenshotted here.
const CONNECTOR_GRADIENT = "linear-gradient(90deg, #2A9FFF 38.39%, #17479C 122.71%)";

type ConnectorProps = {
  orientation: "horizontal" | "vertical";
  dotSide: "start" | "end";
  className: string;
};

function Connector({ orientation, dotSide, className }: ConnectorProps) {
  return (
    <div aria-hidden className={cn("absolute", className)}>
      <div
        className={cn("rounded-full", orientation === "horizontal" ? "h-0.75 w-full" : "h-full w-0.75")}
        style={{ background: CONNECTOR_GRADIENT }}
      />
      <span
        className={cn(
          "absolute size-2 rounded-full bg-[#2A9FFF]",
          orientation === "horizontal"
            ? cn("top-1/2 -translate-y-1/2", dotSide === "start" ? "-left-1" : "-right-1")
            : cn("left-1/2 -translate-x-1/2", dotSide === "start" ? "-top-1" : "-bottom-1"),
        )}
      />
    </div>
  );
}

export function AboutHeartValues() {
  const t = useTranslations("aboutHeartValues");

  const values = VALUES_META.reduce<Record<string, { title: string; titleColor: string; description: string }>>(
    (acc, meta) => {
      acc[meta.id] = {
        titleColor: meta.titleColor,
        title: t(`values.${meta.id}.title`),
        description: t(`values.${meta.id}.description`),
      };
      return acc;
    },
    {},
  );

  const image = (
    <Image
      alt={t("overlayImageAlt")}
      src="/wp-content/uploads/2026/05/noi-dung-1.png"
      width={707}
      height={695}
      className="h-auto w-full object-contain"
    />
  );

  return (
    <div>
      {/* Mobile / tablet: simple vertical stack, no connectors. */}
      <div className="flex flex-col gap-6 lg:hidden">
        <HeartValueCard {...values.excellence} />
        <HeartValueCard {...values.humanity} />
        <HeartValueCard {...values.technology} />
        <div className="mx-auto w-full max-w-[420px]">{image}</div>
        <HeartValueCard {...values.action} />
        <HeartValueCard {...values.respect} />
      </div>

      {/*
        Desktop: cards connected to the circle diagram via lines.
        Every card is the same 320x140 box. Each connector anchors at its
        own card's BOTTOM edge + 25px gap (per design feedback), running
        horizontal (E/A/T/R, dot at the icon end) or vertical (H, straight down).
      */}
      <div className="relative hidden h-175 w-full lg:block">
        <div className="absolute left-1/2 top-47.5 w-115 -translate-x-1/2">{image}</div>

        <HeartValueCard {...values.humanity} className="absolute left-1/2 top-0 h-35 w-80 -translate-x-1/2" />
        <Connector orientation="vertical" dotSide="end" className="left-1/2 top-41.25 h-5 w-0.75 -translate-x-1/2" />

        <HeartValueCard {...values.excellence} className="absolute left-15 top-52 h-35 w-80" />
        <Connector orientation="horizontal" dotSide="end" className="left-15 top-92.25 w-80" />

        <HeartValueCard {...values.action} className="absolute left-22 top-107.5 h-35 w-80" />
        <Connector orientation="horizontal" dotSide="end" className="left-22 top-148.75 w-80" />

        <HeartValueCard {...values.technology} className="absolute right-15 top-52 h-35 w-80" />
        <Connector orientation="horizontal" dotSide="start" className="right-15 top-92.25 w-80" />

        <HeartValueCard {...values.respect} className="absolute right-22 top-107.5 h-35 w-80" />
        <Connector orientation="horizontal" dotSide="start" className="right-22 top-148.75 w-80" />
      </div>
    </div>
  );
}
