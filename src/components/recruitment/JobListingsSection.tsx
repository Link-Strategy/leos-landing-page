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
    <div className="flex flex-col gap-10">
      {/* Department filter tabs */}
      {departments.length > 2 && (
        <div className="flex flex-wrap items-center gap-2">
          {departments.map((dept) => {
            const isActive = activeDept === dept;
            return (
              <button
                key={dept}
                type="button"
                onClick={() => setActiveDept(dept)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${isActive
                    ? "border-[#2a9fff] bg-[#2a9fff]/10 text-[#2a9fff]"
                    : "border-white/10 bg-white/4 text-white/60 hover:border-white/30 hover:text-white"
                  }`}
              >
                {dept}
                {dept !== "Tất cả" && (
                  <span className="ml-1.5 opacity-60">
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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((job) => (
            <JobListingCard key={job.slug} job={job} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-white/50">Không có vị trí nào trong bộ phận này.</p>
        </div>
      )}

      {/* Count */}
      <p className="text-center text-sm text-white/40">
        Hiển thị {filtered.length} / {jobs.length} vị trí tuyển dụng
      </p>
    </div>
  );
}
