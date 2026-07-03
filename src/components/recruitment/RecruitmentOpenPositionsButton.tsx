"use client";

import { Button } from "@/components/ui/button";

export function RecruitmentOpenPositionsButton() {
  return (
    <Button
      asChild
      variant="glass"
      size={null}
      className="px-[21px] py-2.5 text-[20px] max-[1550px]:text-[16px] max-[1024px]:px-[18px] max-[1024px]:py-2 max-[1024px]:text-[14px] max-[767px]:px-3.5 max-[767px]:py-1.5 max-[767px]:text-[14px]"
    >
      <a href="#cac-vi-tri-dang-tuyen">
        <span className="relative z-10 flex flex-row-reverse items-center gap-1">
          <span className="[&_svg]:size-6">
            <svg fill="none" height={24} viewBox="0 0 24 24" width={24} xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="M18.5303 12.5303C18.8232 12.2374 18.8232 11.7626 18.5303 11.4697L14.5303 7.46967C14.2374 7.17678 13.7626 7.17678 13.4697 7.46967C13.1768 7.76256 13.1768 8.23744 13.4697 8.53033L16.1893 11.25H6C5.58579 11.25 5.25 11.5858 5.25 12C5.25 12.4142 5.58579 12.75 6 12.75H16.1893L13.4697 15.4697C13.1768 15.7626 13.1768 16.2374 13.4697 16.5303C13.7626 16.8232 14.2374 16.8232 14.5303 16.5303L18.5303 12.5303Z"
                fill="white"
                fillRule="evenodd"
              />
            </svg>
          </span>
          <span>Xem các vị trí đang tuyển</span>
        </span>
      </a>
    </Button>
  );
}
