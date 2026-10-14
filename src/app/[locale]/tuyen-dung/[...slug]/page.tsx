import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCachedJobListingBySlug, getCachedPublishedJobListings } from "@/lib/recruitment/queries";
import { renderMarkdownToHtml } from "@/lib/blog/markdown";
import { getSiteUrl } from "@/lib/blog/seo";
import type { JobListing } from "@/lib/recruitment/types";
import { JobApplyForm } from "@/components/recruitment/JobApplyForm";
import JsonLd from "@/components/seo/JsonLd";
import { buildJobPostingJsonLd } from "@/lib/jsonld";
import { JobListingCard } from "@/components/recruitment/JobListingCard";

const JOB_TYPE_LABELS: Record<string, string> = {
  "full-time": "Toàn thời gian",
  "part-time": "Bán thời gian",
  contract: "Hợp đồng",
  internship: "Thực tập",
};

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  try {
    const jobs = await getCachedPublishedJobListings();
    return jobs.map((j: JobListing) => ({ slug: [j.slug] }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const jobSlug = slug[0];
  if (!jobSlug) return { title: "Vị trí tuyển dụng không tìm thấy" };

  const job = await getCachedJobListingBySlug(jobSlug);
  if (!job) return { title: "Vị trí tuyển dụng không tìm thấy" };

  const url = `${getSiteUrl()}/tuyen-dung/${job.slug}`;

  return {
    title: `${job.title} - Tuyển dụng`,
    description: `${job.department} · ${job.location} · ${JOB_TYPE_LABELS[job.jobType] ?? job.jobType}. Xem mô tả và ứng tuyển tại LeTRON.`,
    alternates: { canonical: url },
    openGraph: {
      title: job.title,
      description: `${job.department} tại ${job.location}`,
      url,
      siteName: "LeTRON",
      type: "website",
      images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "LeTRON" }],
    },
  };
}

function formatDeadline(deadline?: string) {
  if (!deadline) return "Tuyển liên tục";
  const isoDate = /^\d{4}-\d{2}-\d{2}/.test(deadline) ? new Date(deadline) : null;
  return isoDate && !Number.isNaN(isoDate.getTime())
    ? isoDate.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
    : deadline;
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const jobSlug = slug[0];
  if (!jobSlug) notFound();

  const job = await getCachedJobListingBySlug(jobSlug!);
  if (!job || job.status !== "published") notFound();

  const [requirementsHtml, descriptionHtml, benefitsHtml] = await Promise.all([
    renderMarkdownToHtml(job.requirements),
    renderMarkdownToHtml(job.description),
    job.benefits ? renderMarkdownToHtml(job.benefits) : Promise.resolve(""),
  ]);

  const otherJobs = (await getCachedPublishedJobListings()).filter((j) => j.slug !== job.slug);

  // Only facts stored on the job are shown; nothing is guessed from the title.
  const jobRows = [
    { label: "Nơi làm việc", value: job.location },
    { label: "Cấp bậc", value: job.level },
    { label: "Hình thức", value: JOB_TYPE_LABELS[job.jobType] ?? job.jobType },
    { label: "Kinh nghiệm", value: job.experience },
    { label: "Mức lương", value: job.salary || "Lương thỏa thuận" },
    { label: "Ngành nghề", value: job.department },
    { label: "Hạn chót nhận hồ sơ", value: formatDeadline(job.deadline) },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));

  const benefitTags = job.benefitTags ?? [];
  const benefitTagRows = Array.from({ length: Math.ceil(benefitTags.length / 2) }, (_, i) =>
    benefitTags.slice(i * 2, i * 2 + 2),
  );

  const proseClass =
    "text-base leading-relaxed text-zinc-200 [&_a]:text-[#63D9FF] [&_h1]:mt-4 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold [&_h4]:mt-4 [&_h4]:font-semibold [&_li]:my-2 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_strong]:text-white [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6";

  return (
    <div className="w-full bg-[#0D1B4B] text-white">
      <JsonLd data={buildJobPostingJsonLd(job, `${getSiteUrl()}/tuyen-dung/${job.slug}`, getSiteUrl())} />

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#091437_0%,#0D1B4B_100%)] pb-12 pt-[calc(var(--header-height-mobile)+24px)] lg:pb-20 lg:pt-[calc(var(--header-height)+40px)]">
        <div className="container-le">
          <nav aria-label="breadcrumbs" className="breadcrumb-home text-sm text-zinc-400">
            <p className="m-0">
              <Link href="/">Home</Link>
              <span className="separator"> / </span>
              <Link href="/tuyen-dung">Tuyển dụng</Link>
              <span className="separator"> / </span>
              <span className="last">{job.title}</span>
            </p>
          </nav>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-10">
            <div className="flex min-w-0 flex-col gap-4 rounded-[20px] border border-white/15 bg-white/[0.06] p-5 shadow-[inset_0_2px_16px_rgba(0,149,255,0.18)] backdrop-blur-[13px] sm:p-8">
              <h1 className="m-0 font-archivo text-2xl font-extrabold leading-[1.3] text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-3xl lg:text-4xl">
                {job.title}
              </h1>

              <h3 className="m-0 mt-2 font-archivo text-xl font-bold text-[#2A9FFF]">Chi tiết công việc</h3>
              <div className="overflow-hidden rounded-xl border border-white/15">
                {jobRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-1 gap-1 border-b border-white/10 px-4 py-3 last:border-b-0 sm:grid-cols-[200px_1fr] sm:gap-4"
                  >
                    <div className="text-sm font-semibold text-white/60">{row.label}</div>
                    <div className="text-sm text-white">{row.value}</div>
                  </div>
                ))}
              </div>

              {(benefitTags.length > 0 || benefitsHtml) && (
                <h3 className="m-0 mt-2 font-archivo text-xl font-bold text-[#2A9FFF]">Phúc lợi</h3>
              )}
              {benefitTags.length > 0 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {benefitTagRows.flat().map((tag) => (
                    <div
                      key={tag}
                      className="rounded-xl border border-white/15 bg-white/[0.08] px-4 py-3 text-sm text-white"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
              {benefitsHtml && (
                <div className={proseClass}>
                  <div dangerouslySetInnerHTML={{ __html: benefitsHtml }} />
                </div>
              )}

              <h3 className="m-0 mt-2 font-archivo text-xl font-bold text-[#2A9FFF]">Mô tả công việc</h3>
              <div className={proseClass}>
                <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
              </div>

              <h3 className="m-0 mt-2 font-archivo text-xl font-bold text-[#2A9FFF]">Yêu cầu</h3>
              <div className={proseClass}>
                <div dangerouslySetInnerHTML={{ __html: requirementsHtml }} />
              </div>
            </div>

            <aside className="flex min-w-0 flex-col gap-4 self-start rounded-[20px] border border-white/15 bg-white/[0.06] p-5 shadow-[inset_0_2px_16px_rgba(0,149,255,0.18)] backdrop-blur-[13px] sm:p-8 lg:sticky lg:top-28">
              <h2 className="m-0 font-archivo text-2xl font-extrabold leading-[1.3] text-white">Đơn ứng tuyển vị trí</h2>
              <div className="text-sm leading-relaxed text-zinc-300">
                <p className="m-0 mb-2 font-semibold text-white">Hướng dẫn ứng tuyển</p>
                <ul className="m-0 list-disc pl-5">
                  <li>Điền file thông tin ứng viên</li>
                  <li>Chọn nút “nộp đơn ứng tuyển” để gửi đơn</li>
                </ul>
              </div>
              {job.externalApplyUrl ? (
                <a
                  className="inline-flex w-fit items-center justify-center rounded-full bg-[linear-gradient(180deg,#4DB1FF_0%,#2A9FFF_100%)] px-6 py-2.5 font-archivo text-base font-semibold text-white no-underline shadow-[0_4px_16px_rgba(42,159,255,0.3)] transition-all duration-300 hover:brightness-110 hover:text-white"
                  href={job.externalApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ứng tuyển qua trang tuyển dụng
                </a>
              ) : (
                <JobApplyForm jobTitle={job.title} jobSlug={job.slug} />
              )}
            </aside>
          </div>
        </div>
      </section>

      {otherJobs.length > 0 && (
        <section className="relative overflow-hidden bg-[#091437] py-12 lg:py-20">
          <div className="container-le flex flex-col items-center gap-4 text-center">
            <h3 className="m-0 font-archivo text-sm font-bold uppercase tracking-[0.16em] text-[#63D9FF] [text-shadow:0_0_6px_rgba(99,217,255,0.18)] lg:text-base">
              Các vị trí đang tuyển
            </h3>
            <h2 className="m-0 font-archivo text-3xl font-extrabold leading-[1.3] text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-4xl lg:text-[44px]">
              Tìm kiếm công việc mơ ước <span className="text-[#2A9FFF]">tại LeTRON</span>
            </h2>
            <p className="m-0 mb-6 text-base leading-relaxed text-zinc-300">
              Phát triển bản thân và tỏa sáng tại môi trường làm việc hạnh phúc.
            </p>
            <div className="grid w-full grid-cols-1 gap-3.5 text-left md:gap-[18px] 2xl:gap-[26px]" role="list">
              {otherJobs.slice(0, 3).map((otherJob) => (
                <div key={otherJob.slug} role="listitem">
                  <JobListingCard job={otherJob} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
