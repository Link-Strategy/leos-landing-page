"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const tabsListVariants = cva(
  "inline-flex items-center justify-center p-1 text-muted-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default: "h-11 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-inner",
        pill: "relative w-fit mx-auto h-13 rounded-full bg-gradient-to-b from-white/12 to-white/5 border border-white/20 shadow-[inset_0px_2px_18px_rgba(42,159,255,0.1)] p-1.5 gap-1.5",
        glass: "h-11 rounded-full border border-white/15 bg-white/[0.05] backdrop-blur-xl shadow-[inset_0_2px_16px_rgba(0,149,255,0.16)]",
        segmented: "h-11 rounded-xl border border-white/10 bg-canvas/70 backdrop-blur-xl",
        scrollable: "w-full justify-start gap-2 overflow-x-auto rounded-none border-0 bg-transparent p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        elementor: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, className }))}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 font-display font-bold text-sm",
  {
    variants: {
      variant: {
        default: "h-9 px-4 rounded-lg text-white/60 hover:text-white hover:bg-white/5 data-[state=active]:bg-brand-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-brand-primary/20",
        pill: "h-10 px-8 rounded-full text-white/50 hover:text-white/80 data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#e7f5ff] data-[state=active]:to-white data-[state=active]:shadow-xl data-[state=active]:text-brand-primary data-[state=active]:scale-[1.02]",
        glass: "h-9 rounded-full px-5 text-white/60 hover:bg-white/5 hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-[inset_0_2px_16px_rgba(0,149,255,0.18)]",
        segmented: "h-9 rounded-lg px-4 text-white/60 hover:bg-white/5 hover:text-white data-[state=active]:bg-brand-primary data-[state=active]:text-white",
        scrollable: "h-10 shrink-0 rounded-full border border-white/10 px-5 text-white/60 hover:bg-white/5 hover:text-white data-[state=active]:border-brand-primary/40 data-[state=active]:bg-brand-primary/10 data-[state=active]:text-brand-primary",
        elementor: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
  VariantProps<typeof tabsTriggerVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, className }))}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
