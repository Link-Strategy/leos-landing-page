import Link from "next/link";
import { MapPin, Briefcase, Clock, DollarSign, ArrowRight } from "lucide-react";
import type { JobListing } from "@/lib/recruitment/types";

const JOB_TYPE_LABELS: Record<string, string> = {
  "full-time": "Toàn thời gian",
  "part-time": "Bán thời gian",
  contract: "Hợp đồng",
  internship: "Thực tập",
};

interface Props {
  job: JobListing;
}

export function JobListingCard({ job }: Props) {
  return (
    <Link
      href={`/tuyen-dung/${job.slug}`}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#2a9fff]/40 hover:bg-white/[0.07] hover:shadow-[0_4px_30px_rgba(42,159,255,0.12)]"
    >
      {/* Department badge */}
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex items-center rounded-full bg-[#2a9fff]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#2a9fff] border border-[#2a9fff]/20">
          {job.department}
        </span>
        {job.jobType && (
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/60">
            <Clock className="size-3" />
            {JOB_TYPE_LABELS[job.jobType] ?? job.jobType}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-['Archivo',Helvetica] text-[20px] font-bold leading-snug text-white transition-colors group-hover:text-[#2a9fff]">
        {job.title}
      </h3>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-4 shrink-0 text-[#2a9fff]" />
          {job.location}
        </span>
        {job.salary && (
          <span className="flex items-center gap-1.5">
            <DollarSign className="size-4 shrink-0 text-[#2a9fff]" />
            {job.salary}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Briefcase className="size-4 shrink-0 text-[#2a9fff]" />
          {JOB_TYPE_LABELS[job.jobType] ?? job.jobType}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-white/10" />

      {/* CTA */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/50">
          {job.publishedAt
            ? new Date(job.publishedAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            : ""}
        </span>
        <span className="flex items-center gap-1 text-sm font-semibold text-[#2a9fff] transition-all group-hover:gap-2">
          Xem chi tiết
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
