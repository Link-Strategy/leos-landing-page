import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        brand: "rounded-full font-display font-bold text-[10px] uppercase tracking-wider bg-brand-primary/10 border border-brand-primary/30 text-brand-primary shadow-[0_2px_10px_rgba(42,159,255,0.15)]",
        accent: "rounded-full font-display font-bold text-[10px] uppercase tracking-wider bg-brand-accent/10 border border-brand-accent/30 text-brand-accent",
        cyan: "rounded-full font-display font-bold text-[10px] uppercase tracking-wider bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan",
        turquoise: "rounded-full font-display font-bold text-[10px] uppercase tracking-wider bg-brand-turquoise/10 border border-brand-turquoise/30 text-brand-turquoise",
        amber: "rounded-full font-display font-bold text-[10px] uppercase tracking-wider bg-brand-amber/10 border border-brand-amber/30 text-brand-amber",
        orange: "rounded-full font-display font-bold text-[10px] uppercase tracking-wider bg-brand-orange/10 border border-brand-orange/30 text-brand-orange",
        success: "rounded-full font-display font-bold text-[10px] uppercase tracking-wider bg-brand-forest/10 border border-brand-forest/30 text-brand-forest",
        glass: "rounded-full font-display font-bold text-[10px] uppercase tracking-wider bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10",
        muted: "rounded-full font-display font-bold text-[10px] uppercase tracking-wider bg-white/5 text-text-muted border border-white/10",
        secondary: "rounded-full font-display font-bold text-[10px] uppercase tracking-wider bg-white/10 text-text-muted border border-white/10",
        outline: "border-white/20 text-text-muted hover:bg-white/5",
        destructive: "bg-destructive/10 text-destructive border border-destructive/20 rounded-full font-display font-bold text-[10px] uppercase tracking-wider",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
