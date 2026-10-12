import Image from "next/image";
import { useTranslations } from "next-intl";

// Desktop-only reveal layout (per new Figma design, node 40001741:22716) — a
// diamond arrangement instead of LeadershipGrid's row-of-5. Mobile keeps using
// LeadershipGrid unchanged.
type DiamondMemberMeta = {
  id: string;
  messageKey: string;
  photo: string;
  left: number;
  top: number;
};

// left/top are % of the 1212x1110 Figma frame, converted from its absolute px positions.
const DIAMOND_MEMBERS_META: DiamondMemberMeta[] = [
  { id: "816", messageKey: "HR", photo: "/about/nguyen-thi-mai-lien-hr-ga-letron.png", left: 13.2, top: 4.5 },
  { id: "811", messageKey: "ceo", photo: "/about/hoang-le-thuy-ceo-letron.png", left: 63.7, top: 4.5 },
  { id: "813", messageKey: "chairman", photo: "/about/le-minh-tien-chu-tich-hdqt-letron.png", left: 38.45, top: 32.43 },
  { id: "815", messageKey: "cfo", photo: "/about/nguyen-van-cong-cfo-letron.png", left: 13.2, top: 54.05 },
  { id: "809", messageKey: "lear", photo: "/about/le-duc-anh-lear-letron.png", left: 63.7, top: 54.05 },
];

const CARD_WIDTH_PCT = 23.1;

export function LeadershipDiamond() {
  const t = useTranslations("leadership");

  return (
    <div className="relative mx-auto aspect-[1212/1110] w-full max-w-[760px] rounded-2xl border-2 border-white bg-white/25 shadow-[0px_2px_4.6px_0px_rgba(0,0,0,0.25)]">
      {DIAMOND_MEMBERS_META.map((member) => (
        <div
          key={member.id}
          className="absolute flex flex-col items-center gap-2"
          style={{ left: `${member.left}%`, top: `${member.top}%`, width: `${CARD_WIDTH_PCT}%` }}
        >
          {/* The project's leadership photos already bake in the hex-frame + circuit-line
              decoration (see LeadershipGrid), so no extra decorative layer is composited here —
              stacking Figma's separate frame/glow assets on top produced visible ghosting. */}
          <div className="relative aspect-[280/318] w-full">
            <Image
              src={member.photo}
              alt={t(`members.${member.messageKey}.name`)}
              fill
              className="object-contain"
            />
          </div>

          <div className="flex w-full flex-col items-center gap-0.5 rounded-lg bg-white/25 py-2 text-center text-white">
            <p className="font-archivo text-sm leading-[1.4] font-semibold">{t(`members.${member.messageKey}.name`)}</p>
            <p className="font-archivo text-xs leading-[1.4] font-normal">{t(`members.${member.messageKey}.title`)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
