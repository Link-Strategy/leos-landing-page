import { cn } from "@/lib/utils";

type HeartValueCardProps = {
  title: string;
  titleColor: string;
  description: string;
  className?: string;
};

export function HeartValueCard({ title, titleColor, description, className }: HeartValueCardProps) {
  return (
    <div className={cn("relative rounded-2xl border border-[#86CDFF]/60", className)}>
      <div className="relative flex h-full flex-col justify-center gap-2.5 rounded-2xl px-6.25 py-3.75 shadow-[0px_2px_8px_0px_#FFFFFF14_inset,0px_4px_26px_0px_#00A1DB14]">
        <h3 className="text-left font-archivo text-lg! font-bold leading-[1.3] lg:text-2xl!" style={{ color: titleColor }}>
          {title}
        </h3>
        <p className="text-left font-archivo text-sm! font-normal leading-[1.3] text-white/90 lg:text-base!">
          {description}
        </p>
      </div>
    </div>
  );
}
