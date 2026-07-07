"use client";

import { useState, useEffect } from "react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";

interface ShareButtonsProps {
  url: string;
  title: string;
}

const NETWORKS = [
  {
    id: "Facebook",
    label: "Facebook",
    color: "#287eff",
    shareUrl: (u: string, t: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
    Icon: FaFacebookF,
  },
  {
    id: "LinkedIn",
    label: "LinkedIn",
    color: "#0d89fc",
    shareUrl: (u: string, t: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`,
    Icon: FaLinkedinIn,
  },
  {
    id: "Gmail",
    label: "Gmail",
    color: "#eb4a3c",
    shareUrl: (u: string, t: string) =>
      `https://mail.google.com/mail/?view=cm&to=&su=${encodeURIComponent(t)}&body=${encodeURIComponent(u)}`,
    Icon: SiGmail,
  },
  {
    id: "X",
    label: "X (Twitter)",
    color: "#0deefc",
    shareUrl: (u: string, t: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`,
    Icon: FaXTwitter,
  },
];

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [absoluteUrl, setAbsoluteUrl] = useState(url);

  useEffect(() => {
    setAbsoluteUrl(window.location.origin + url);
  }, [url]);

  return (
    <div className="flex flex-wrap items-center gap-[14px]">
      <span className="font-sans text-[16px] font-normal leading-normal text-white">
        Chia sẻ:
      </span>
      <div className="flex items-center gap-2">
        {NETWORKS.map(({ id, label, color, shareUrl, Icon }) => (
          <a
            key={id}
            href={shareUrl(absoluteUrl, title)}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex size-[30px] items-center justify-center overflow-hidden rounded-[6px] border border-white/5 bg-white/5 shadow-[8px_4px_16px_0px_rgba(0,0,0,0.08)] transition hover:opacity-90 hover:scale-105"
            aria-label={label}
          >
            <div
              className="absolute inset-0 rounded-[6px] opacity-20"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(248, 251, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%)`,
              }}
            />
            <Icon
              className="relative z-10 size-4 text-white"
              style={{ filter: `drop-shadow(0 0 4px ${color})` }}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
