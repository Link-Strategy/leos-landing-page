import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const navigationMenuListVariants = cva(
  "group flex flex-1 list-none items-center justify-center",
  {
    variants: {
      variant: {
        default: "space-x-1",
        glass: "gap-1 rounded-full border border-white/15 bg-white/[0.05] p-1.5 backdrop-blur-xl shadow-[inset_0_2px_16px_rgba(0,149,255,0.12)]",
        pill: "gap-1 rounded-full border border-white/20 bg-canvas/70 p-1.5 backdrop-blur-2xl shadow-glow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List> &
    VariantProps<typeof navigationMenuListVariants>
>(({ className, variant, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(navigationMenuListVariants({ variant, className }))}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  "group inline-flex w-max items-center justify-center bg-transparent font-display font-medium transition-all hover:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:text-brand-accent data-[state=open]:text-brand-accent text-white/80",
  {
    variants: {
      variant: {
        default: "h-12 px-4 py-2 text-[18px]",
        glass: "h-10 rounded-full px-4 py-2 text-base hover:bg-white/5 data-[state=open]:bg-white/10",
        pill: "h-10 rounded-full px-5 py-2 text-base hover:bg-white/10 data-[active]:bg-white/10 data-[state=open]:bg-white/10",
        brandNav: "h-auto px-0 py-2.5 text-[18px] max-[1550px]:text-base font-sans font-medium text-white hover:text-primary focus:text-primary transition-colors duration-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger> & {
    active?: boolean
    showChevron?: boolean
  } & VariantProps<typeof navigationMenuTriggerStyle>
>(({ className, children, active, variant, showChevron = true, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(
      navigationMenuTriggerStyle({ variant }), 
      "group relative flex flex-col gap-px", 
      active && "text-brand-accent font-bold",
      className
    )}
    {...props}
  >
    <div className="flex items-center gap-[3px]">
      {children}{" "}
      {showChevron && (
        <ChevronDown
          className="relative top-[1px] ml-1 h-4 w-4 transition duration-200 group-data-[state=open]:rotate-180 opacity-50"
          aria-hidden="true"
        />
      )}
    </div>
    {variant !== "brandNav" && (
      <div className={cn(
        "absolute bottom-0 left-4 right-4 h-px transition-all duration-300",
        active ? "bg-brand-accent opacity-100 shadow-[0_0_8px_rgba(111,203,220,0.5)]" : "bg-transparent opacity-0"
      )} />
    )}
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Link>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link> &
    VariantProps<typeof navigationMenuTriggerStyle>
>(({ className, children, active, variant, ...props }, ref) => (
  <NavigationMenuPrimitive.Link
    ref={ref}
    className={cn(
      navigationMenuTriggerStyle({ variant }),
      "group relative flex flex-col gap-px",
      active && "text-brand-accent font-bold",
      className
    )}
    active={active}
    {...props}
  >
    {children}
    {variant !== "brandNav" && (
      <div className={cn(
        "absolute bottom-0 left-4 right-4 h-px transition-all duration-300",
        active ? "bg-brand-accent opacity-100 shadow-[0_0_8px_rgba(111,203,220,0.5)]" : "bg-transparent opacity-0"
      )} />
    )}
  </NavigationMenuPrimitive.Link>
))
NavigationMenuLink.displayName = NavigationMenuPrimitive.Link.displayName

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border border-white/10 bg-white/[0.03] backdrop-blur-xl text-popover-foreground shadow-glow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=visible]:fade-in data-[state=hidden]:fade-out",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}
