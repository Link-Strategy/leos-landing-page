import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-32 w-full rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-6 py-4 text-sm font-sans text-text-primary transition-all outline-none placeholder:text-text-muted/40 focus-visible:border-brand-primary focus-visible:ring-4 focus-visible:ring-brand-primary/20 focus-visible:shadow-[0_0_20px_rgba(16,126,255,0.15)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
