import Link from "next/link";
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
  const href = `/tuyen-dung/${job.slug}`;
  const meta = [
    { icon: "/assets/images/recruitment/recruitment-icon-1.svg", text: job.department },
    {
      icon: "/assets/images/recruitment/recruitment-icon-2.svg",
      text: `${job.location} • ${JOB_TYPE_LABELS[job.jobType] ?? job.jobType}`,
    },
    { icon: "/assets/images/recruitment/recruitment-icon-3.svg", text: job.salary || "Thỏa thuận" },
  ];

  return (
    <article className="relative flex flex-col gap-4 overflow-hidden rounded-[20px] border border-white/20 bg-white/[0.08] px-5 py-4 shadow-[inset_0_2px_16px_rgba(0,149,255,0.26)] backdrop-blur-[13px] transition-colors duration-300 hover:border-[#2A9FFF]/60 md:px-7 md:py-[22px] lg:flex-row lg:items-center lg:justify-between lg:gap-10 2xl:px-[31px] 2xl:py-[26px]">
      <div className="flex min-w-0 flex-col gap-2.5 lg:w-[70%] 2xl:gap-4">
        <h3 className="m-0 truncate font-archivo text-base font-bold leading-[1.3] text-white md:text-lg 2xl:text-[24px]">
          <Link href={href} className="text-white no-underline hover:text-white">
            {job.title}
          </Link>
        </h3>
        <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 text-xs text-white sm:grid-cols-3 sm:gap-6 md:text-sm 2xl:text-[16px]">
          {meta.map((item) => (
            <li key={item.icon} className="flex min-w-0 items-center gap-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.icon} alt="" className="size-6 shrink-0 2xl:size-8" />
              <span className="min-w-0 truncate">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex lg:justify-end">
        <Link
          href={href}
          className="inline-flex items-center gap-1 rounded-full bg-[linear-gradient(180deg,#4DB1FF_0%,#2A9FFF_100%)] px-4 py-1.5 font-archivo text-sm font-semibold leading-[1.3] text-white no-underline shadow-[0_4px_16px_rgba(42,159,255,0.3)] transition-all duration-300 hover:brightness-110 hover:text-white md:px-[21px] md:py-2.5 md:text-base"
        >
          <span>Xem chi tiết</span>
          <svg aria-hidden fill="none" height={24} viewBox="0 0 24 24" width={24} xmlns="http://www.w3.org/2000/svg" className="size-5 md:size-6">
            <path
              clipRule="evenodd"
              d="M18.5303 12.5303C18.8232 12.2374 18.8232 11.7626 18.5303 11.4697L14.5303 7.46967C14.2374 7.17678 13.7626 7.17678 13.4697 7.46967C13.1768 7.76256 13.1768 8.23744 13.4697 8.53033L16.1893 11.25H6C5.58579 11.25 5.25 11.5858 5.25 12C5.25 12.4142 5.58579 12.75 6 12.75H16.1893L13.4697 15.4697C13.1768 15.7626 13.1768 16.2374 13.4697 16.5303C13.7626 16.8232 14.2374 16.8232 14.5303 16.5303L18.5303 12.5303Z"
              fill="white"
              fillRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}
