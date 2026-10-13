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
        "px-2.5 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5 2xl:px-[25px]",
        className,
      )}
      style={style}
    >
      <div className="flex flex-col items-stretch gap-2.5 text-center">
        <div className="mx-auto flex-none">
          <span className="block size-[50px] text-[#2A9FFF] sm:size-[60px] lg:size-[72px] 2xl:size-[88px] [&_img]:size-full [&_svg]:size-full">
            {icon}
          </span>
        </div>
        <CardContent className="w-full grow">
          <CardTitle
            asChild
            className="mb-1 font-sans text-base! font-bold leading-[1.3] tracking-normal text-[#2A9FFF]! sm:text-lg! lg:mb-2 lg:text-xl! 2xl:text-2xl!"
          >
            <h3>
              <span>{title}</span>
            </h3>
          </CardTitle>
          <CardDescription
            asChild
            className="m-0 font-sans text-xs font-normal leading-[1.3] text-white/90 sm:text-sm lg:text-base"
          >
            <p>{description}</p>
          </CardDescription>
        </CardContent>
      </div>
    </Card>
  );
}
