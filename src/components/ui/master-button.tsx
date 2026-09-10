"use client";

import type { ReactNode } from "react";

type MasterButtonType = "full-fill" | "out-line";

// Shared pill-shaped button styling for the whole site. The gradient ring border on
// full-fill uses the same mask/xor ::before trick as Heart/ServiceModel's card borders —
// border-image ignores border-radius on its corner tiles, which breaks on a pill shape.
const MASTER_BUTTON_CSS = `
.master-button {
  position: relative;
  overflow: hidden;
}

.master-button--full-fill {
  border: 1px solid transparent;
  background: linear-gradient(180deg, #76C6FF 0%, #2A75F3 100%);
  box-shadow:
    0 1px 10px 0 rgba(0, 0, 0, 0.15),
    0 -3px 0 0 rgba(30, 154, 255, 0.18) inset,
    0 -2px 6px 0 rgba(255, 255, 255, 0.75) inset,
    0 -4px 16px 0 rgba(0, 106, 255, 0.30) inset;
}

.master-button--full-fill::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  background: linear-gradient(180deg, #31B0FF 0%, #81AEF2 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.master-button--out-line {
  background: transparent;
  border: 1px solid #2A9FFF;
  box-shadow:
    0 1px 10px 0 rgba(0, 0, 0, 0.15),
    0 -3px 0 0 rgba(30, 154, 255, 0.18) inset,
    0 -2px 6px 0 rgba(255, 255, 255, 0.75) inset,
    0 -4px 16px 0 rgba(0, 106, 255, 0.30) inset;
}
`;

function DefaultArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MasterButton({
  onClick,
  content,
  icon,
  isShowIcon = false,
  type = "full-fill",
  className = "",
}: {
  onClick: () => void;
  content: ReactNode;
  icon?: ReactNode;
  isShowIcon?: boolean;
  type?: MasterButtonType;
  className?: string;
}) {
  const showIcon = Boolean(icon) || isShowIcon;

  return (
    <>
      <style>{MASTER_BUTTON_CSS}</style>
      <button
        type="button"
        onClick={onClick}
        className={`master-button master-button--${type} font-inter inline-flex h-[50px] w-full shrink-0 items-center justify-center gap-[10px] whitespace-nowrap rounded-full px-[13px] py-1 text-[14px] font-bold leading-[20px] text-white transition-all duration-300 hover:-translate-y-1 hover:opacity-80 lg:w-auto lg:min-w-[268px] ${className}`}
      >
        {content}
        {showIcon && (icon ?? <DefaultArrowIcon />)}
      </button>
    </>
  );
}
