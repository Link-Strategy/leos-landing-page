import { cn } from "@/lib/utils"

function Skeleton({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "glass" | "brand"
}) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md",
        variant === "default" && "bg-white/5",
        variant === "glass" && "border border-white/10 bg-white/[0.04] shadow-[inset_0_2px_16px_rgba(0,149,255,0.12)] backdrop-blur-xl",
        variant === "brand" && "bg-brand-primary/15 shadow-[0_0_20px_rgba(42,159,255,0.14)]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
