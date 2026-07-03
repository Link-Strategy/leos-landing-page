"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

function Accordion({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root> & { variant?: "default" | "glass" }) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn(
        "flex w-full flex-col",
        variant === "glass" && "bg-white/[0.03] p-1 rounded-[32px] border border-white/10 backdrop-blur-sm shadow-xl",
        className
      )}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-white/5 last:border-0", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger flex flex-1 items-center justify-between py-5 text-left text-[14px] font-bold tracking-tight text-white/90 transition-all hover:text-brand-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary/30 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <div className="flex size-7 items-center justify-center rounded-full bg-white/5 border border-white/5 transition-all group-hover/accordion-trigger:bg-brand-primary/10 group-hover/accordion-trigger:border-brand-primary/30 group-data-[state=open]/accordion-trigger:bg-brand-primary/20 group-data-[state=open]/accordion-trigger:border-brand-primary/50 group-data-[state=open]/accordion-trigger:shadow-[0_0_15px_rgba(250,175,76,0.2)]">
            <ChevronDownIcon
            data-slot="accordion-trigger-icon"
            className="size-3.5 shrink-0 text-text-muted transition-transform duration-500 group-hover/accordion-trigger:text-brand-primary group-data-[state=open]/accordion-trigger:rotate-180 group-data-[state=open]/accordion-trigger:text-brand-primary"
            />
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div
        className={cn(
          "pb-6 pt-1 text-[13px] text-text-secondary leading-relaxed opacity-80",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
