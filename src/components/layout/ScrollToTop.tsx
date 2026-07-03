"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollPos > 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // Initial check
    toggleVisibility();

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      variant="glass"
      onClick={scrollToTop}
      className={`fixed right-[30px] bottom-[30px] z-50 transition-all duration-500 ease-in-out
        ${isVisible ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-[20px]"} h-[42px] w-[42px] rounded-full p-0 flex items-center justify-center outline-none`}
      aria-label="Cuộn lên đầu trang"
    >
      <svg
        fill="none"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        className="transition-all duration-300 group-hover:-translate-y-0.5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 3L12 21M18 9L12 3L6 9"
          className="stroke-white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </Button>
  );
}
