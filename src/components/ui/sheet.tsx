"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetCss = `
.letron-sheet-glass-border {
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(180deg, rgb(255 255 255 / 60%) 0%, var(--card-glass-hover-border, var(--card-glass-hover-bg, rgba(42, 159, 255, 0.36))) 12%, var(--card-glass-hover-border, var(--card-glass-hover-bg, rgba(42, 159, 255, 0.36))) 50%, var(--card-glass-hover-border, var(--card-glass-hover-bg, rgba(42, 159, 255, 0.36))) 88%, rgb(255 255 255 / 60%) 100%);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.letron-card-glass {
  border: none !important;
  background-color: rgba(13, 27, 75, 0.85) !important;
  background-image: linear-gradient(var(--card-glass-hover-angle,360deg), var(--card-glass-hover-bg,rgba(42,159,255,0.2)) 0%, transparent 100%) !important;
  box-shadow: var(--card-glass-hover-shadow, var(--card-glass-shadow, 0 4px 26px 0 rgba(0, 161, 219, 0.08), inset 0 2px 8px 0 rgba(255, 255, 255, 0.08))) !important;
  backdrop-filter: blur(var(--card-glass-blur,20px)) !important;
  -webkit-backdrop-filter: blur(var(--card-glass-blur,20px)) !important;
  color: white !important;
}

.letron-card-glass [data-slot="sheet-header"] {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.letron-card-glass [data-slot="sheet-title"] {
  color: #ffffff !important;
}
.letron-card-glass [data-slot="sheet-description"] {
  color: rgba(255, 255, 255, 0.6) !important;
}
.letron-card-glass [data-slot="sheet-footer"] {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
`;

const sheetVariants = cva(
  "fixed z-50 gap-4 p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-[var(--sheet-close)] data-[state=open]:duration-[var(--sheet-open)] data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        right:
          "inset-y-0 right-0 h-full w-3/4 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
      },
      variant: {
        default: "bg-background text-foreground border-l border-border",
        glass: "letron-card-glass",
        surface: "bg-canvas/95 text-text-primary border-l border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.18)]",
      }
    },
    defaultVariants: {
      side: "right",
      variant: "default",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
  VariantProps<typeof sheetVariants> {
  /** Set to false to remove the backdrop overlay (e.g. side-by-side map+panel). */
  overlay?: boolean;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", variant = "default", overlay = true, className, children, ...props }, ref) => (
  <SheetPortal>
    {overlay && <SheetOverlay />}
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side, variant }), className)}
      {...props}
    >
      {variant === "glass" && <style>{sheetCss}</style>}
      {variant === "glass" && <div className="letron-sheet-glass-border" />}

      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary text-white">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="sheet-header"
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="sheet-footer"
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    data-slot="sheet-title"
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    data-slot="sheet-description"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
