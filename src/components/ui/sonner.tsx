"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const toastCss = `
.letron-toast-glass {
  background: rgba(13, 27, 75, 0.75) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  background-image: linear-gradient(0deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
  transition: all 0.3s ease-in-out !important;
}

.letron-toast-glass:hover {
  background: rgba(13, 27, 75, 0.8) !important;
  border-color: rgba(42, 159, 255, 0.4) !important;
  box-shadow: 0 8px 32px rgba(42, 159, 255, 0.15) !important;
}

.letron-toast-glass.toast-success {
  border-color: rgba(16, 185, 129, 0.35) !important;
}
.letron-toast-glass.toast-success:hover {
  border-color: rgba(16, 185, 129, 0.55) !important;
}

.letron-toast-glass.toast-error {
  border-color: rgba(244, 63, 94, 0.35) !important;
}
.letron-toast-glass.toast-error:hover {
  border-color: rgba(244, 63, 94, 0.55) !important;
}

.letron-toast-glass.toast-warning {
  border-color: rgba(245, 158, 11, 0.35) !important;
}
.letron-toast-glass.toast-warning:hover {
  border-color: rgba(245, 158, 11, 0.55) !important;
}

.letron-toast-glass.toast-info {
  border-color: rgba(59, 130, 246, 0.35) !important;
}
.letron-toast-glass.toast-info:hover {
  border-color: rgba(59, 130, 246, 0.55) !important;
}
`;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <>
      <style>{toastCss}</style>
      <Sonner
        theme={theme as ToasterProps["theme"]}
        className="toaster group"
        toastOptions={{
          classNames: {
            toast:
              "group toast letron-toast-glass group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-white group-[.toaster]:shadow-[0_8px_32px_rgba(0,0,0,0.5)] group-[.toaster]:rounded-xl font-sans",
            description: "group-[.toast]:text-white/60 text-xs",
            actionButton:
              "group-[.toast]:bg-brand-primary group-[.toast]:text-white",
            cancelButton:
              "group-[.toast]:bg-white/10 group-[.toast]:text-white/80",
            success: "toast-success group-[.toast]:bg-emerald-500/[0.03]",
            error: "toast-error group-[.toast]:bg-rose-500/[0.03]",
            warning: "toast-warning group-[.toast]:bg-amber-500/[0.03]",
            info: "toast-info group-[.toast]:bg-blue-500/[0.03]",
          },
        }}
        style={
          { "--z-index": "9999" } as React.CSSProperties
        }
        {...props}
      />
    </>
  )
}

export { Toaster }
