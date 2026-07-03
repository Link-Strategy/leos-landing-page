"use client"

import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "./button"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  variant = "default",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
  variant?: "default" | "compactGlass"
}) {
  const defaultClassNames = getDefaultClassNames()
  const isCompactGlass = variant === "compactGlass"

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-transparent p-4 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(9)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        isCompactGlass && "p-1 [--cell-size:1.5rem]",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          isCompactGlass && "gap-0.5",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", isCompactGlass && "relative gap-0.5", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav,
          isCompactGlass && "top-[0px] h-6 px-0"
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-all active:scale-90 flex items-center justify-center rounded-full border border-white/5 hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-brand-primary focus-visible:border-brand-primary outline-none",
          defaultClassNames.button_previous,
          isCompactGlass && "absolute left-0 top-1/2 z-10 h-6 w-6 -translate-y-1/2"
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-all active:scale-90 flex items-center justify-center rounded-full border border-white/5 hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-brand-primary focus-visible:border-brand-primary outline-none",
          defaultClassNames.button_next,
          isCompactGlass && "absolute right-0 top-1/2 z-10 h-6 w-6 -translate-y-1/2"
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size) font-display font-black text-text-primary uppercase tracking-[0.2em] text-[10px] opacity-70",
          isCompactGlass && "h-6 text-[8px] tracking-wider opacity-100",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-(--cell-radius)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-popover opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "font-display font-black select-none text-text-primary tracking-[0.1em] uppercase text-[12px]",
          captionLayout === "label"
            ? ""
            : "flex items-center gap-1 rounded-(--cell-radius) [&>svg]:size-3.5 [&>svg]:text-brand-accent",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex justify-between mt-3 mb-2", isCompactGlass && "mt-1.5 mb-1", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 text-[0.65rem] font-black text-text-muted/40 uppercase tracking-widest select-none text-center",
          isCompactGlass && "flex w-6 items-center justify-center text-[8px] tracking-normal",
          defaultClassNames.weekday
        ),
        week: cn("mt-1 flex w-full justify-between items-center gap-1", isCompactGlass && "mt-0 gap-0.5", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] text-muted-foreground select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-8 w-8 rounded-full p-0 text-center select-none flex items-center justify-center transition-all duration-300",
          isCompactGlass && "h-6 w-6 min-w-6",
          defaultClassNames.day
        ),
        range_start: cn(
          "relative isolate z-0 rounded-l-full bg-brand-primary text-white shadow-glow-sm",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none bg-brand-primary/10 text-brand-accent", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-0 rounded-r-full bg-brand-primary text-white shadow-glow-sm",
          defaultClassNames.range_end
        ),
        today: cn(
          "text-brand-primary font-bold after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-brand-primary after:rounded-full after:shadow-glow",
          defaultClassNames.today
        ),
        outside: cn(
          "text-text-muted/10 opacity-20 cursor-default grayscale",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-text-muted/10 opacity-10",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon className={cn("size-4", className)} {...props} />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: ({ className, ...props }) => (
          <CalendarDayButton
            locale={locale}
            className={cn(
              isCompactGlass && "h-6 w-6 min-w-6 text-[10px]! [&>span]:text-[8px]!",
              className
            )}
            {...props}
          />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-8 flex-col gap-1 border-0 leading-none font-normal transition-all duration-300 active:scale-90 select-none group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-brand-primary/50 data-[range-end=true]:rounded-full data-[range-end=true]:bg-brand-primary data-[range-end=true]:text-white data-[range-end=true]:shadow-glow-sm data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-brand-primary/10 data-[range-middle=true]:text-brand-accent data-[range-start=true]:rounded-full data-[range-start=true]:bg-brand-primary data-[range-start=true]:text-white data-[range-start=true]:shadow-glow-sm data-[selected-single=true]:bg-brand-primary data-[selected-single=true]:text-white data-[selected-single=true]:rounded-full data-[selected-single=true]:shadow-glow dark:hover:bg-white/10 dark:hover:text-text-primary [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
