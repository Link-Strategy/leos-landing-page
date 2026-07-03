import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardCss = `
.letron-card-glass-border {
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: var(--card-glass-border-background, linear-gradient(180deg, #2a9fff33 36%, rgba(119, 194, 255, 0.16) 100%));
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  transition: background 0.35s ease;
}

.letron-card-glass:hover > .letron-card-glass-border {
  background: linear-gradient(180deg, rgb(255 255 255 / 60%) 0%, var(--card-glass-hover-border, var(--card-glass-hover-bg, rgba(42, 159, 255, 0.36))) 12%, var(--card-glass-hover-border, var(--card-glass-hover-bg, rgba(42, 159, 255, 0.36))) 50%, var(--card-glass-hover-border, var(--card-glass-hover-bg, rgba(42, 159, 255, 0.36))) 88%, rgb(255 255 255 / 60%) 100%);
}

`;

const cardVariants = cva(
  "relative group/card flex flex-col gap-4 overflow-hidden text-sm text-card-foreground ring-1 ring-foreground/10 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "rounded-xl bg-card py-4 ring-foreground/10 shadow-sm",
        glass: "w-full max-w-full mb-[calc(var(--kit-widget-spacing,0px)+0px)] px-[25px] py-[15px] border-none rounded-card-glass gap-0 text-white ring-0 bg-transparent bg-[linear-gradient(var(--card-glass-normal-angle,0deg),var(--card-glass-bg-start,#FFFFFF1F)_0%,var(--card-glass-bg-end,#FFFFFF00)_100%)] shadow-[var(--card-glass-shadow,0_4px_26px_0_rgba(42,159,255,0.08),inset_0_2px_8px_0_rgba(255,255,255,0.08))] transition-all duration-300 ease-in-out hover:bg-[linear-gradient(var(--card-glass-hover-angle,360deg),var(--card-glass-hover-bg,rgba(42,159,255,0.36))_0%,transparent_100%)] hover:shadow-[var(--card-glass-hover-shadow,var(--card-glass-shadow,0_4px_26px_0_rgba(0,161,219,0.08),inset_0_2px_8px_0_rgba(255,255,255,0.08)))] letron-card-glass",
        surface: "rounded-[var(--radius-landing,46px)] bg-canvas/95 text-text-primary ring-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.18)]",
        media: "rounded-2xl bg-white/[0.03] p-0 ring-white/10 shadow-soft",
        metric: "rounded-2xl bg-white/[0.03] ring-white/10 shadow-[inset_0_2px_16px_rgba(0,149,255,0.12)]",
        accent: "rounded-xl ring-brand-primary/20 bg-brand-primary/5",
      },
      hover: {
        none: "",
        lift: "hover:-translate-y-2 hover:shadow-2xl",
        glow: "hover:shadow-[0_0_40px_rgba(var(--card-accent-rgb),0.15)]",
      },
      size: {
        default: "gap-6 p-8",
        sm: "gap-4 p-6",
        mini: "gap-2 p-4",
      }
    },
    defaultVariants: {
      variant: "default",
      hover: "none",
      size: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cardVariants> {
  showGlow?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover, size, showGlow, style, ...props }, ref) => {
    const resolvedSize = variant === "glass" && size === undefined ? null : size;

    return (
      <div
        ref={ref}
        data-slot="card"
        data-size={resolvedSize || undefined}
        className={cn(cardVariants({ variant, hover, size: resolvedSize, className }))}
        style={style}
        {...props}
      >
        {variant === "glass" && <style>{cardCss}</style>}

        {/* Premium Glass Tier: Inner rim light */}
        {(variant === "surface" || variant === "metric") && (
          <div className="absolute inset-0 rounded-[inherit] border border-white/10 pointer-events-none" />
        )}

        {variant === "glass" && (
          <div className="letron-card-glass-border" />
        )}

        {/* Visual Identity: Glow Layer */}
        {(showGlow || variant === "metric") && (
          <div
            className={cn(
              "absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-700",
              "bg-[radial-gradient(circle_at_50%_0%,rgba(var(--card-accent-rgb,42,159,255),0.14),transparent_70%)]",
              variant === "metric" ? "opacity-0 group-hover:opacity-100" : "opacity-0",
              showGlow && "opacity-100"
            )}
          />
        )}

        {/* Top Edge Highlight */}
        {(variant === "surface" || variant === "metric") && (
          <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        )}

        <div className="relative z-10 flex flex-col h-full gap-[inherit] w-full">
          {props.children}
        </div>
      </div>
    )
  }
)
Card.displayName = "Card"

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1.5",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="card-title"
      className={cn(
        "font-display leading-tight tracking-normal",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="card-description"
      className={cn("leading-relaxed", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "absolute top-8 right-8",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("flex-1", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center pt-4 border-t border-white/5 mt-auto",
        className
      )}
      {...props}
    />
  )
}


export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
