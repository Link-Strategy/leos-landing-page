"use client";

import Image from "next/image";
import type * as React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type WayCardProps = {
  iconPath: string;
  title: React.ReactNode;
  className?: string;
};

export function WayCard({ iconPath, title, className }: WayCardProps) {
  const style = {
    "--card-glass-border-background": "linear-gradient(0deg, rgb(255 255 255 / 10%) 0%, rgb(255 255 255 / 10%) 100%)",
    "--card-glass-hover-bg": "#2A9FFF5C",
    "--card-glass-hover-border": "#2A9FFF5C",
    "--card-glass-hover-angle": "0deg",
  } as React.CSSProperties;

  return (
    <Card
      variant="glass"
      hover="none"
      size="mini"
      className={cn(
        "box-border w-full items-center justify-center gap-0 rounded-2xl px-[25px] py-[15px]",
        className,
      )}
      style={style}
    >
      <div className="relative z-[1] flex flex-col items-center gap-2.5 text-center max-[1024px]:gap-2 max-[767px]:gap-2 [&_br]:max-[767px]:hidden">
        <div className="inline-block flex-none leading-none">
          <span className="inline-block text-[60px] leading-none text-[var(--e-global-color-primary)] [border-color:var(--e-global-color-primary)] [fill:var(--e-global-color-primary)] max-[1024px]:text-[50px] max-[767px]:text-[50px]">
            <Image
              src={iconPath}
              alt="Letron Way Icon"
              width={60}
              height={60}
              className="block size-[60px] max-[1024px]:size-[50px] max-[767px]:size-[50px]"
            />
          </span>
        </div>
        <CardContent className="w-full flex-grow">
          <CardTitle
            className="mb-0 font-['Archivo',Sans-serif] text-[16px] font-light leading-[1.3em] tracking-normal text-white max-[1024px]:text-[14px] max-[1024px]:leading-[var(--e-global-typography-primary-line-height)] max-[767px]:text-[14px] max-[767px]:leading-[var(--e-global-typography-primary-line-height)]"
          >
            <span>{title}</span>
          </CardTitle>
        </CardContent>
      </div>
    </Card>
  );
}
