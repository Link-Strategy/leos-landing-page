"use client";

import { useEffect, useRef, useState } from "react";
import {
  autoUpdate,
  offset,
  shift,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface ComboboxProps<T> {
  query: string;
  selectedValue: string;
  open: boolean;
  placeholder: string;
  leftIcon?: React.ReactNode;
  hasError?: boolean;
  loading?: boolean;
  loadingPlaceholder?: string;
  dropdownHeader?: React.ReactNode;
  suggestions: T[];
  renderSuggestion: (item: T, isSelected: boolean) => React.ReactNode;
  getSuggestionKey: (item: T, index: number) => string | number;
  getSuggestionValue: (item: T) => string;
  emptyPlaceholder?: string;
  customNewAction?: {
    label: string;
    onClick: () => void;
  } | null;
  onQueryChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onCommit: (value: string) => void;
  onSelect: (item: T) => void;
  allowCustomValue?: boolean;
}

export function Combobox<T>({
  query,
  selectedValue,
  open,
  placeholder,
  leftIcon,
  hasError,
  loading,
  loadingPlaceholder = "Đang tải gợi ý...",
  dropdownHeader,
  suggestions,
  renderSuggestion,
  getSuggestionKey,
  getSuggestionValue,
  emptyPlaceholder = "Nhập từ khóa để tìm kiếm...",
  customNewAction,
  onQueryChange,
  onOpenChange,
  onCommit,
  onSelect,
  allowCustomValue = true,
}: ComboboxProps<T>) {
  const wasOpenRef = useRef(open);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange,
    placement: "bottom-start",
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(2),
      shift({ padding: 12 }),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: "180px",
          });
        },
      }),
    ],
  });

  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "listbox" });
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, role]);

  const keyword = query.trim();

  // Auto commit when dropdown closes
  useEffect(() => {
    if (wasOpenRef.current && !open) {
      const trimmed = query.trim();
      if (trimmed) {
        const exactMatch = suggestions.find(
          (item) => getSuggestionValue(item).toLowerCase() === trimmed.toLowerCase()
        );
        if (exactMatch) {
          onSelect(exactMatch);
        } else {
          onCommit(trimmed);
        }
      }
    }
    wasOpenRef.current = open;
  }, [open, query, suggestions, onSelect, onCommit, getSuggestionValue]);

  const commitCurrentValue = () => {
    onCommit(query.trim());
    onOpenChange(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          // eslint-disable-next-line react-hooks/refs
          ref={refs.setReference}
          value={query}
          variant="glass"
          leftIcon={leftIcon}
          placeholder={placeholder}
          onFocus={() => onOpenChange(true)}
          onChange={(event) => {
            onQueryChange(event.target.value);
            onOpenChange(true);
          }}
          className={cn(
            "h-11 w-full rounded-xs! outline-none transition",
            hasError && "border-red-500/50 bg-red-500/10 focus-visible:border-red-500 focus-visible:ring-red-500/20",
          )}
          {...getReferenceProps()}
        />
      </div>

      {open ? (
        <div
          // eslint-disable-next-line react-hooks/refs
          ref={refs.setFloating}
          style={{ ...floatingStyles, zIndex: 9999, scrollbarGutter: "stable" }}
          className="overflow-y-auto max-h-[180px] rounded-xs! border border-white/10 bg-[#0d1b4b]/95 backdrop-blur-2xl text-white shadow-2xl scrollbar-none"
          onMouseDown={(event) => event.preventDefault()}
          {...getFloatingProps()}
        >
          {dropdownHeader}
          {loading ? (
            <div className="space-y-2 px-3 py-2">
              <div className="flex items-center gap-2 px-1 py-2 text-xs font-medium uppercase tracking-(0.18em) text-text-secondary">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {loadingPlaceholder}
              </div>
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`combobox-skeleton-${index}`}
                  className="rounded-xl border border-white/5 bg-white/2 px-3 py-3"
                >
                  <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
                  <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-white/5" />
                </div>
              ))}
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((item, index) => {
              const value = getSuggestionValue(item);
              const isSelected = selectedValue.toLowerCase() === value.toLowerCase();
              return (
                <div key={getSuggestionKey(item, index)} className="w-full">
                  <button
                    type="button"
                    className={cn(
                      "block w-full px-3 py-2 text-left hover:bg-white/10 text-white",
                      isSelected && "bg-white/10"
                    )}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      onSelect(item);
                      onOpenChange(false);
                    }}
                  >
                    <div className="flex w-full items-start justify-between">
                      {renderSuggestion(item, isSelected)}
                    </div>
                  </button>
                </div>
              );
            })
          ) : customNewAction && keyword ? (
            <button
              type="button"
              className="block w-full px-3 py-2 text-left text-sm text-brand-primary hover:bg-white/10"
              onMouseDown={(event) => event.preventDefault()}
              onClick={customNewAction.onClick}
            >
              {customNewAction.label}
            </button>
          ) : keyword && allowCustomValue ? (
            <button
              type="button"
              className="block w-full px-3 py-2 text-left text-sm text-brand-primary hover:bg-white/10"
              onMouseDown={(event) => event.preventDefault()}
              onClick={commitCurrentValue}
            >
              Dùng: "{keyword}"
            </button>
          ) : (
            <div className="px-3 py-3 text-xs text-text-secondary">{emptyPlaceholder}</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
