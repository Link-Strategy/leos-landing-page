import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import SectionEdgeFade from "@/components/ui/section-edge-fade";
import MobileCardCarousel from "@/components/landing/MobileCardCarousel";

const ROADMAP_BG = "/landing/RoadMap/roadmap_bg.png";

type Phase = { color: string; borderColor: string; glowColor: string };

// Cyan -> blue -> violet, matching each roadmap phase's accent color in Figma.
const PHASES: Phase[] = [
  { color: "#30D1FF", borderColor: "rgba(48,209,255,0.75)", glowColor: "rgba(48,209,255,0.22)" },
  { color: "#4A8FFF", borderColor: "rgba(74,143,255,0.75)", glowColor: "rgba(74,143,255,0.22)" },
  { color: "#8761FF", borderColor: "rgba(135,97,255,0.75)", glowColor: "rgba(135,97,255,0.22)" },
];
const MILESTONE_COLOR = "#8761FF";

type Step = { phaseLabel: string; title: string; description: string };
type Milestone = { label: string; year: string; heading: string; description: string };

// Desktop-only: percentage positions on the design's 1440x960 canvas, estimated against
// roadmap_bg.png's ascending trajectory line. The background art here is cropped
// differently than the Figma frame it was exported from, so these are a starting
// estimate — check in-browser and nudge left/top if a dot drifts off the visible line.
const DESKTOP_CARDS = [
  { left: 5.07, top: 39.9, width: 18.06, height: 22.5 },
  { left: 32.99, top: 73.13, width: 18.06, height: 22.5 },
  { left: 49.93, top: 17.08, width: 18.06, height: 22.5 },
];
// Nudged slightly down-left from the raw Figma conversion per visual feedback against the
// actual roadmap_bg.png crop — all 4 dots sat a touch above-right of the visible line.
const DESKTOP_NODES = [
  { left: 12.63, top: 83.7 },
  { left: 40.96, top: 61.2 },
  { left: 57.35, top: 48.72 },
];
const MILESTONE_NODE = { left: 88.74, top: 32.57 };
const MILESTONE_BOX = { left: 72.92, top: 47.08, width: 22.92, height: 40.2 };

function pct(n: number) {
  return `${n}%`;
}

function TrajectoryDot({ left, top, color }: { left: number; top: number; color: string }) {
  return (
    <div
      className="absolute z-10 size-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{ left: pct(left), top: pct(top), background: color, boxShadow: `0 0 10px 3px ${color}` }}
    />
  );
}

function Connector({ left, top, height, color }: { left: number; top: number; height: number; color: string }) {
  if (height <= 0) return null;
  return (
    <div
      className="absolute w-[2px]"
      style={{
        left: pct(left),
        top: pct(top),
        height: pct(height),
        backgroundImage: `repeating-linear-gradient(to bottom, ${color} 0 4px, transparent 4px 9px)`,
      }}
    />
  );
}

function PhaseBadge({ number, color }: { number: string; color: string }) {
  return (
    <div
      className="absolute -top-5 -left-5 z-10 flex size-10 items-center justify-center rounded-full bg-[#050F2E] lg:-top-6 lg:-left-3 lg:size-[46px]"
      style={{ border: `2px solid ${color}`, boxShadow: `0 0 16px 2px ${color}66` }}
    >
      <span className="font-inter text-[12px] font-bold text-white lg:text-[14px]">{number}</span>
    </div>
  );
}

function RoadmapCard({
  index,
  phase,
  step,
  className = "",
  style,
}: {
  index: number;
  phase: Phase;
  step: Step;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={className} style={style}>
      {/* Positioning context for the corner badge, separate from the outer wrapper's own
          position (static in the mobile carousel, absolute when placed on the desktop canvas) —
          combining "relative" and "absolute" on one element lets Tailwind's fixed utility
          order silently pick one, which broke desktop placement. */}
      <div className="relative h-full w-full">
        <PhaseBadge number={String(index).padStart(2, "0")} color={phase.color} />
        <div
          className="flex h-full w-full flex-col gap-2 rounded-[18px] border px-6 pt-6 pb-5"
          style={{
            background: "rgba(5,19,51,0.9)",
            borderColor: phase.borderColor,
            boxShadow: `0px 12px 28px 0px ${phase.glowColor}`,
          }}
        >
          <span
            className="block size-2 shrink-0 rounded-full"
            style={{ background: phase.color, boxShadow: `0 0 6px 2px ${phase.color}` }}
          />
          <p className="font-inter text-[11px] leading-[16px]! font-bold tracking-[1.8px] text-white lg:text-[12px] lg:tracking-[2.2px]">
            {step.phaseLabel}
          </p>
          <p className="font-inter text-[20px] leading-[26px]! font-bold tracking-[-0.3px] text-white lg:leading-[28px]!">
            {step.title}
          </p>
          <p className="font-open-sans text-[13px] leading-[19px]! font-normal text-white lg:text-[14px] lg:leading-[22px]!">
            {step.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function MilestoneCard({
  milestone,
  className = "",
  style,
}: {
  milestone: Milestone;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[22px] border-[1.5px] px-[30px] py-9 ${className}`}
      style={{
        borderColor: "rgba(122,97,255,0.92)",
        background: "rgba(5,13,43,0.88)",
        boxShadow: "0px 0px 32px 0px rgba(51,140,255,0.28)",
        ...style,
      }}
    >
      <p className="font-inter text-[14px] leading-[16px]! font-bold tracking-[2.2px] text-white">{milestone.label}</p>
      <p
        className="font-inter mt-3 bg-clip-text text-[40px] leading-none font-extrabold tracking-[-1px] text-transparent lg:text-[55px] lg:leading-[76px]! lg:tracking-[-2.2px]"
        style={{ backgroundImage: "linear-gradient(90deg, #38D1FF 0%, #A15EFF 100%)" }}
      >
        {milestone.year}
      </p>
      <div
        className="my-5 h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, rgba(56,209,255,0) 0%, rgba(56,209,255,0.8) 50%, rgba(161,94,255,0) 100%)",
        }}
      />
      <p className="font-inter text-[22px] leading-[28px]! font-bold text-white lg:text-[24px] lg:leading-[32px]!">
        {milestone.heading}
      </p>
      <p className="font-open-sans mt-3 text-[14px] leading-[22px]! font-normal text-white lg:text-[16px] lg:leading-[26px]!">
        {milestone.description}
      </p>
    </div>
  );
}

export default async function RoadMap() {
  const t = await getTranslations("roadMap");
  const steps = t.raw("steps") as Step[];
  const milestone = t.raw("milestone") as Milestone;

  const headerBlock = (
    <>
      <p
        className="font-inter text-[14px] leading-[20px]! font-bold tracking-[1.4px] text-[#63D9FF] uppercase lg:tracking-[2.2px]"
        style={{ textShadow: "0px 0px 6px rgba(99,217,255,0.18)" }}
      >
        {t("eyebrow")}
      </p>
      <h2 className="font-inter text-[32px] leading-[38px]! font-bold tracking-[-0.5px] lg:text-[40px] lg:leading-[48px]! lg:tracking-[-1px]">
        <span style={{ color: "#2A9FFF" }}>{t("headingAccent")}</span>
        <span className="text-white">{t("headingWhite")}</span>
      </h2>
    </>
  );

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "linear-gradient(90deg, #020E30 0%, #031B4C 34%, #0D1B4B 68%, #020E30 100%)" }}
    >
      <SectionEdgeFade position="top" />
      <SectionEdgeFade position="bottom" />

      {/* Desktop: absolute zigzag composition tied to the trajectory line baked into roadmap_bg.png */}
      <div
        className="relative hidden aspect-[1440/960] w-full bg-cover bg-center bg-no-repeat lg:block"
        style={{ backgroundImage: `url('${ROADMAP_BG}')` }}
      >
        <div className="absolute top-[6.04%] left-[8.33%] w-[62.5%]">{headerBlock}</div>

        {DESKTOP_NODES.map((node, i) => (
          <TrajectoryDot key={i} left={node.left} top={node.top} color={PHASES[i].color} />
        ))}
        <TrajectoryDot left={MILESTONE_NODE.left} top={MILESTONE_NODE.top} color={MILESTONE_COLOR} />

        {/* Card 1 sits above its node — connector drops down to the line. */}
        <Connector
          left={DESKTOP_NODES[0].left}
          top={DESKTOP_CARDS[0].top + DESKTOP_CARDS[0].height}
          height={DESKTOP_NODES[0].top - (DESKTOP_CARDS[0].top + DESKTOP_CARDS[0].height)}
          color={PHASES[0].color}
        />
        {/* Card 2 sits below its node — connector rises up to the line. */}
        <Connector
          left={DESKTOP_NODES[1].left}
          top={DESKTOP_NODES[1].top}
          height={DESKTOP_CARDS[1].top - DESKTOP_NODES[1].top}
          color={PHASES[1].color}
        />
        {/* Card 3 sits above its node again. */}
        <Connector
          left={DESKTOP_NODES[2].left}
          top={DESKTOP_CARDS[2].top + DESKTOP_CARDS[2].height}
          height={DESKTOP_NODES[2].top - (DESKTOP_CARDS[2].top + DESKTOP_CARDS[2].height)}
          color={PHASES[2].color}
        />
        {/* Milestone panel connects up to the line's end near the spiral node. */}
        <Connector
          left={MILESTONE_NODE.left}
          top={MILESTONE_NODE.top}
          height={MILESTONE_BOX.top - MILESTONE_NODE.top}
          color={MILESTONE_COLOR}
        />

        {DESKTOP_CARDS.map((pos, i) => (
          <RoadmapCard
            key={i}
            index={i + 1}
            phase={PHASES[i]}
            step={steps[i]}
            className="absolute"
            style={{ left: pct(pos.left), top: pct(pos.top), width: pct(pos.width), height: pct(pos.height) }}
          />
        ))}

        <MilestoneCard
          milestone={milestone}
          className="absolute"
          style={{
            left: pct(MILESTONE_BOX.left),
            top: pct(MILESTONE_BOX.top),
            width: pct(MILESTONE_BOX.width),
            height: pct(MILESTONE_BOX.height),
          }}
        />
      </div>

      {/* Mobile: heading + swipe carousel (3 step cards + a milestone slide), same carousel as ServiceModel. */}
      <div className="bg-cover bg-center bg-no-repeat py-12 lg:hidden" style={{ backgroundImage: `url('${ROADMAP_BG}')` }}>
        <div className="container-le mb-8 flex flex-col gap-3">{headerBlock}</div>

        <div className="container-le">
          <MobileCardCarousel
            items={[
              ...steps.map((step, i) => <RoadmapCard key={i} index={i + 1} phase={PHASES[i]} step={step} />),
              <MilestoneCard key="milestone" milestone={milestone} className="aspect-square" />,
            ]}
          />
        </div>
      </div>
    </section>
  );
}
