import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonCss = `
.letron-button-glass {
  overflow: hidden;
  border: 0;
  border-radius: 100px;
  background: linear-gradient(180deg, #76C6FF 0%, #2A75F3 100%);
  box-shadow:
    0 1px 10px 0 rgba(0, 0, 0, 0.15),
    0 -3px 0 0 rgba(30, 154, 255, 0.18) inset,
    0 -2px 6px 0 rgba(255, 255, 255, 0.75) inset,
    0 -4px 16px 0 rgba(0, 106, 255, 0.30) inset;
  color: #FFFFFF;
  fill: #FFFFFF;
  text-decoration: none;
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
}

.letron-button-glass::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: 100px;
  background: linear-gradient(180deg, #31B0FF 0%, #81AEF2 100%);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.letron-button-glass:hover {
  transform: translateY(-3px);
  background: linear-gradient(180deg, #8FD4FF 0%, #3A86FF 100%);
  color: #FFFFFF;
  fill: #FFFFFF;
  box-shadow:
    0 6px 20px rgba(0, 106, 255, 0.35),
    0 -3px 0 0 rgba(30, 154, 255, 0.25) inset,
    0 -2px 8px 0 rgba(255, 255, 255, 0.9) inset,
    0 -6px 20px 0 rgba(0, 106, 255, 0.4) inset;
}

.letron-button-glass:hover::before {
  background: linear-gradient(180deg, #5CC8FF 0%, #A9C9FF 100%);
}

.letron-button-glass:hover *:not(svg):not(path),
.letron-button-glass:focus *:not(svg):not(path),
.letron-button-glass:active *:not(svg):not(path) {
  color: inherit;
  fill: inherit;
}
`;

const buttonVariants = cva(
  "font-semibold leading-[1.3em] group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        brand: "rounded-full bg-brand-primary text-white font-display font-semibold shadow-[0_4px_14px_rgba(42,159,255,0.4)] hover:bg-brand-primary/90 hover:shadow-[0_6px_20px_rgba(42,159,255,0.5)] active:scale-95",
        secondary: "rounded-full border-white/20 bg-white/10 text-white font-display font-semibold hover:bg-white/20 hover:border-white/30 active:bg-white/5 active:scale-95",
        glass: "letron-button-glass relative translate-y-0",
        accent: "bg-brand-orange text-white hover:bg-brand-orange/90 hover:shadow-[0_0_20px_rgba(255,126,0,0.3)] active:scale-[0.98]",
        pill: "rounded-full border-white/20 bg-white/[0.05] text-white font-display font-semibold backdrop-blur-xl hover:bg-white/10 hover:text-white active:scale-[0.98]",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
        cta: "h-9 gap-2 rounded-xl bg-brand-primary px-4 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(42,159,255,0.3)] hover:bg-brand-primary/90 hover:shadow-[0_6px_20px_rgba(42,159,255,0.45)] active:scale-[0.98] transition-all",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        landing: "h-11 gap-1 px-[21px] text-base font-semibold",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <>
      {variant === "glass" && <style>{buttonCss}</style>}
      <Comp
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    </>
  )
}

export { Button, buttonVariants }
