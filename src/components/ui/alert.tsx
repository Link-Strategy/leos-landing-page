import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "group/alert relative flex w-full flex-col gap-1 rounded-2xl border px-8 py-6 text-left transition-all backdrop-blur-2xl bg-white/[0.03]",
  {
    variants: {
      variant: {
        default: "border-white/10 text-white/90",
        info: "border-white/5 border-l-brand-primary bg-brand-primary/[0.02] text-brand-primary shadow-[inset_1px_0_0_rgba(250,175,76,0.3)]",
        success: "border-white/5 border-l-brand-forest bg-brand-forest/[0.02] text-brand-forest shadow-[inset_1px_0_0_rgba(34,139,34,0.3)]",
        warning: "border-white/5 border-l-brand-orange bg-brand-orange/[0.02] text-brand-orange shadow-[inset_1px_0_0_rgba(255,126,0,0.3)]",
        destructive: "border-white/5 border-l-red-500 bg-red-500/[0.02] text-red-400 shadow-[inset_1px_0_0_rgba(239,68,68,0.3)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2 right-2", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
