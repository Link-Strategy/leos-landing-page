"use client";

import type * as React from "react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type RecruitmentBenefitCardProps = {
  icon: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  hoverBackgroundColor?: string;
  hoverBorderColor?: string;
  hoverAngle?: "0deg" | "180deg" | "360deg";
  className?: string;
};

export function RecruitmentBenefitCard({
  icon,
  title,
  description,
  hoverBackgroundColor = "#2A9FFF5C",
  hoverBorderColor = "#2A9FFF5C",
  hoverAngle = "0deg",
  className,
}: RecruitmentBenefitCardProps) {
  const style = {
    "--card-glass-hover-angle": hoverAngle,
    "--card-glass-hover-bg": hoverBackgroundColor,
    "--card-glass-hover-border": hoverBorderColor,
  } as React.CSSProperties;

  return (
    <Card
      variant="glass"
      hover="none"
      size={null}
      className={cn(
        "px-[25px] py-[15px] max-[1550px]:px-5 max-[1550px]:py-2.5 max-[1024px]:px-4 max-[1024px]:py-2.5 max-[767px]:w-1/2 max-[767px]:max-w-1/2 max-[767px]:px-2.5 max-[767px]:py-1.5",
        className,
      )}
      style={style}
    >
      <div className="flex flex-col items-stretch gap-2.5 text-center max-[1024px]:gap-0">
        <div className="inline-block flex-none leading-none">
          <span className="inline-block text-[100px] leading-none text-[var(--e-global-color-primary)] [border-color:var(--e-global-color-primary)] [fill:var(--e-global-color-primary)] max-[1550px]:text-[80px] max-[1024px]:text-[60px] max-[767px]:text-[50px] [&_svg]:size-[1em]">
            {icon}
          </span>
        </div>
        <CardContent className="w-full flex-grow">
          <CardTitle
            asChild
            className="mb-2 font-['Archivo',Sans-serif] !text-2xl font-bold leading-[1.3em] tracking-normal !text-[var(--e-global-color-primary)] max-[1550px]:text-xl max-[1550px]:leading-[var(--e-global-typography-primary-line-height)] max-[1024px]:mb-1 max-[1024px]:text-lg max-[767px]:text-base"
          >
            <h3>
              <span>{title}</span>
            </h3>
          </CardTitle>
          <CardDescription
            asChild
            className="m-0 font-['Archivo',Sans-serif] text-base font-normal leading-[1.3em] text-[var(--e-global-color-text)] max-[1550px]:text-base max-[1550px]:leading-[var(--e-global-typography-text-line-height)] max-[1024px]:text-sm max-[767px]:text-xs"
          >
            <p>{description}</p>
          </CardDescription>
        </CardContent>
      </div>
    </Card>
  );
}
