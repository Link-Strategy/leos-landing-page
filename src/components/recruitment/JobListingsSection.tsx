"use client";

import { useState } from "react";
import { JobListingCard } from "./JobListingCard";
import type { JobListing } from "@/lib/recruitment/types";

interface Props {
  jobs: JobListing[];
}

export function JobListingsSection({ jobs }: Props) {
  const departments = ["Tất cả", ...Array.from(new Set(jobs.map((j) => j.department)))];
  const [activeDept, setActiveDept] = useState("Tất cả");

  const filtered =
    activeDept === "Tất cả" ? jobs : jobs.filter((j) => j.department === activeDept);

  if (jobs.length === 0) {
    return (
      <div className="w-full py-20 text-center">
        <p className="font-['Archivo',Helvetica] text-lg text-white/50">
          Hiện chưa có vị trí tuyển dụng nào. Vui lòng quay lại sau.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 w-full">
      {/* Department filter tabs */}
      {departments.length > 1 && (
        <div className="relative mx-auto flex w-fit items-center justify-center gap-1.5 overflow-hidden rounded-full bg-linear-to-b from-white/16 to-white/14 px-1.5 py-1 shadow-[inset_0_2px_16px_rgba(0,149,255,0.26)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-[#76c6ff66] max-[767px]:mx-0 max-[767px]:w-full max-[767px]:justify-start max-[767px]:overflow-x-auto max-[767px]:scrollbar-none max-[767px]:[&::-webkit-scrollbar]:hidden">
          {departments.map((dept) => {
            const isActive = activeDept === dept;
            return (
              <button
                key={dept}
                type="button"
                onClick={() => setActiveDept(dept)}
                className={`relative z-[1] flex h-auto items-center justify-center rounded-full border-0 px-[21px] py-2 font-sans text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 cursor-pointer shrink-0 ${isActive
                    ? "bg-gradient-to-b from-[#E2F3FF] to-white text-[#2a9fff] shadow-md"
                    : "bg-transparent text-white hover:text-[#2a9fff]"
                  }`}
              >
                {dept}
                {dept !== "Tất cả" && (
                  <span className={`ml-1.5 ${isActive ? "text-[#2a9fff]/70" : "text-white/60"}`}>
                    ({jobs.filter((j) => j.department === dept).length})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Job grid */}
      {filtered.length > 0 ? (
        <div className="grid w-full grid-cols-1 gap-3.5 md:gap-[18px] 2xl:gap-[26px]" role="list">
          {filtered.map((job) => (
            <div key={job.slug} role="listitem">
              <JobListingCard job={job} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-white/50">Không có vị trí nào trong bộ phận này.</p>
        </div>
      )}
    </div>
  );
}
