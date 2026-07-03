"use client";

import * as React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  className?: string;
  defaultValue?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({ className, defaultValue = "", onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(defaultValue);
  const uniqueId = React.useId().replace(/:/g, "");

  const handleSubmit = (e: React.FormEvent) => {
    if (!searchQuery.trim()) {
      e.preventDefault();
      return;
    }
    if (onSearch) {
      e.preventDefault();
      onSearch(searchQuery);
    }
  };

  return (
    <search className={className} role="search">
      <form
        action="/"
        method="get"
        onSubmit={handleSubmit}
        className="flex items-center w-full h-full m-0! p-0! border-0! bg-transparent!"
        style={{
          border: "none !important",
          outline: "none !important",
        }}
      >
        <div className="relative w-full max-[1550px]:w-[190px] lg:w-[200px]">
          <Input
            type="text"
            variant="search"
            size="sm"
            name="s"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm ..."
            rightIcon={
              <div className="flex items-center gap-1 pointer-events-auto right-4">
                {searchQuery && (
                  <button
                    id="search-clear-btn-inner"
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="flex items-center justify-center outline-none! shadow-none! focus:outline-none! focus:ring-0! opacity-75 hover:opacity-100 cursor-pointer w-4 h-4"
                    aria-label="Xóa tìm kiếm"
                  >
                    <img
                      src="/assets/search-clear.svg"
                      alt="Clear"
                      className="h-3.5 w-3.5"
                    />
                  </button>
                )}
                <button
                  id="search-submit-btn-inner"
                  type="submit"
                  className="m-0! p-0! border-0! bg-transparent! flex items-center justify-center outline-none! shadow-none! focus:outline-none! focus:ring-0! opacity-95 hover:opacity-100 cursor-pointer w-6 h-6"
                  aria-label="Tìm kiếm"
                >
                  <img
                    src="/assets/search-icon.svg"
                    alt="Search"
                    className="h-5 w-5"
                  />
                </button>
              </div>
            }
          />
        </div>
      </form>
    </search>
  );
}
