"use client";

import Image from "next/image";
import type * as React from "react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type HeartCardProps = {
  iconPath: string;
  title: string;
  titleColor: string;
  hoverBackgroundColor: string;
  hoverBorderColor: string;
  hoverAngle?: "0deg" | "180deg" | "360deg";
  description: React.ReactNode;
  className?: string;
};

export function HeartCard({
  iconPath,
  title,
  titleColor,
  hoverBackgroundColor,
  hoverBorderColor,
  hoverAngle = "360deg",
  description,
  className,
}: HeartCardProps) {
  const style = {
    "--glass-card-title": titleColor,
    "--card-glass-hover-angle": hoverAngle,
    "--card-glass-hover-bg": hoverBackgroundColor,
    "--card-glass-hover-border": hoverBorderColor,
  } as React.CSSProperties;

  return (
    <Card
      variant="glass"
      hover="none"
      size="mini"
      className={cn("h-full gap-0 rounded-2xl p-0", className)}
      style={style}
    >
      <div className="w-full">
        <div className="relative z-1 mb-[calc(var(--kit-widget-spacing,0px)+0px)] w-full rounded-2xl border-0 px-[25px] pb-[80px] pt-[15px] text-center transition-[background] duration-600 hover:border-0 max-[1550px]:px-5 max-[1550px]:pb-[60px] max-[1550px]:pt-3 max-[1024px]:w-full max-[1024px]:max-w-full max-[1024px]:px-3 max-[1024px]:pb-5 max-[1024px]:pt-2.5 max-[767px]:px-2.5 max-[767px]:py-2.5">
          <div className="flex flex-col items-center gap-2 text-center max-[1024px]:gap-0">
            <div className="inline-block flex-none leading-none">
              <span className="inline-block text-[100px] leading-none text-(--e-global-color-primary) border-(--e-global-color-primary) fill-(--e-global-color-primary) max-[1550px]:text-[80px] max-[1024px]:text-[60px] max-[767px]:text-[40px]">
                <Image
                  src={iconPath}
                  alt={title}
                  width={100}
                  height={100}
                  className="size-[100px] max-[1550px]:size-20 max-[1024px]:size-[60px] max-[767px]:size-10"
                />
              </span>
            </div>
            <CardContent className="w-full grow">
              <CardTitle
                className="mb-2 font-sans text-[24px] font-bold leading-[1.3em] tracking-normal text-(--glass-card-title) max-[1550px]:mb-1.5 max-[1550px]:text-[20px] max-[1024px]:text-[18px] max-[767px]:text-[16px]"
              >
                <span>{title}</span>
              </CardTitle>
              <CardDescription
                className="m-0 font-sans text-[16px] font-light leading-[1.3em] text-(--e-global-color-text) max-[1024px]:text-[14px]"
              >
                <span>{description}</span>
              </CardDescription>
            </CardContent>
          </div>
        </div>
      </div>
    </Card>
  );
}
