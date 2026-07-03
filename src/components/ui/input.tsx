import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "h-full w-full min-w-0 border py-2 text-sm font-sans transition-all outline-none disabled:pointer-events-none disabled:opacity-50 [color-scheme:dark] placeholder:text-text-muted/50 aria-invalid:border-red-500/50 aria-invalid:bg-red-500/10 aria-invalid:focus-visible:border-red-500 aria-invalid:focus-visible:ring-red-500/20",
  {
    variants: {
      variant: {
        default: "rounded-lg border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20",
        glass: "rounded-full border-white/10 bg-white/[0.03] text-text-primary backdrop-blur-xl hover:border-white/20 hover:bg-white/[0.06] focus-visible:border-brand-primary focus-visible:ring-4 focus-visible:ring-brand-primary/20 focus-visible:shadow-[0_0_20px_rgba(42,159,255,0.15)]",
        search: "border-transparent bg-transparent text-text-primary outline-none focus-visible:ring-0 focus-visible:shadow-none placeholder:text-[#6897B9] text-base font-normal leading-[1.4]",
        pill: "rounded-full border-white/15 bg-white/[0.04] text-text-primary backdrop-blur-xl focus-visible:border-brand-primary focus-visible:ring-4 focus-visible:ring-brand-primary/20",
      },
      size: {
        sm: "h-9 text-xs",
        default: "h-11 text-sm",
        lg: "h-13 text-base",
      },
    },
    defaultVariants: {
      variant: "glass",
      size: "default",
    },
  }
)

interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
  VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  containerClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      type = "text",
      leftIcon,
      rightIcon,
      variant,
      size,
      ...props
    },
    ref
  ) => {
    const isSearch = variant === "search";
    const uniqueId = React.useId().replace(/:/g, "");

    return (
      <div
        id={isSearch ? `search-container-${uniqueId}` : undefined}
        className={cn(
          "relative group w-full flex items-center",
          size === "sm" ? "h-9" : size === "lg" ? "h-13" : "h-11",
          isSearch ? "rounded-full" : "",
          containerClassName
        )}
        style={
          isSearch
            ? {
              background: "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(235, 247, 255, 0.05) 100%)",
              boxShadow: "inset 0 2px 16px 0 rgba(0, 149, 255, 0.26)",
              backdropFilter: "blur(13px)",
            }
            : undefined
        }
      >
        {isSearch && (
          <style>{`
            #search-container-${uniqueId}::before {
              content: '';
              position: absolute;
              inset: 0;
              padding: 1px;
              border-radius: inherit;
              background: linear-gradient(
                90deg,
                rgba(255, 255, 255, 0.16) 0%,
                rgba(255, 255, 255, 0.36) 50%,
                rgba(255, 255, 255, 0.16) 100%
              );
              -webkit-mask:
                linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
              pointer-events: none;
              z-index: 1;
            }
            #search-input-${uniqueId}::placeholder {
              color: #6897B9 !important;
            }
              /* FIX LỖI NỀN TRẮNG KHI XUẤT HIỆN AUTOCOMPLETE/AUTOFILL */
            #search-input-${uniqueId}:-webkit-autofill,
            #search-input-${uniqueId}:-webkit-autofill:hover, 
            #search-input-${uniqueId}:-webkit-autofill:focus, 
            #search-input-${uniqueId}:-webkit-autofill:active {
              -webkit-background-clip: text;
              -webkit-text-fill-color: #ffffff !important; /* Thay đổi màu chữ phù hợp với UI của bạn */
              transition: background-color 5000s ease-in-out 0s;
              box-shadow: inset 0 0 0px 9999px transparent !important;
            }
          `}</style>
        )}
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-text-muted/50 transition-all duration-300 group-focus-within:text-brand-primary group-focus-within:scale-110 pointer-events-none z-20">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={isSearch ? `search-input-${uniqueId}` : undefined}
          type={type}
          className={cn(
            inputVariants({ variant, size }),
            "[[type=number]::-webkit-inner-spin-button]:opacity-10",
            "[[type=number]::-webkit-inner-spin-button]:hover:opacity-10",
            "[[type=number]::-webkit-inner-spin-button]:cursor-pointer",
            "[[type=number]::-webkit-inner-spin-button]:transition-opacity",
            "[[type=date]::-webkit-calendar-picker-indicator]:invert",
            "[[type=date]::-webkit-calendar-picker-indicator]:opacity-50",
            "[[type=date]::-webkit-calendar-picker-indicator]:hover:opacity-100",
            "[[type=date]::-webkit-calendar-picker-indicator]:cursor-pointer",
            "[[type=date]::-webkit-calendar-picker-indicator]:transition-opacity",
            className
          )}
          style={
            isSearch
              ? {
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                fontFamily: '"Archivo", Sans-serif',
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "1.4em",
                paddingTop: "6px",
                paddingBottom: "6px",
                paddingLeft: leftIcon ? "44px" : "18px",
                paddingRight: rightIcon ? "44px" : "18px",
                zIndex: 2,
              }
              : {
                paddingLeft: leftIcon ? "44px" : "10px",
                paddingRight: rightIcon ? "44px" : "10px",
              }
          }
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-text-muted/50 transition-all duration-300 group-focus-within:text-brand-primary group-focus-within:scale-110 pointer-events-none z-20">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants }
