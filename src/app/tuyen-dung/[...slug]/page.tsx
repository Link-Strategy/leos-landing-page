import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Home, MapPin, Briefcase, Clock, DollarSign, ChevronRight, ArrowLeft } from "lucide-react";
import { getCachedJobListingBySlug, getCachedPublishedJobListings } from "@/lib/recruitment/queries";
import { renderMarkdownToHtml } from "@/lib/blog/markdown";
import { getSiteUrl } from "@/lib/blog/seo";
import type { JobListing } from "@/lib/recruitment/types";

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
    title: `${job.title} | LeTRON Tuyển dụng`,
    description: `${job.department} · ${job.location} · ${JOB_TYPE_LABELS[job.jobType] ?? job.jobType}. Xem mô tả và ứng tuyển tại LeTRON.`,
    alternates: { canonical: url },
    openGraph: {
      title: job.title,
      description: `${job.department} tại ${job.location}`,
      url,
      siteName: "LeTRON",
      type: "website",
    },
  };
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

  return (
    <main className="w-full min-h-screen bg-[#0d1b4b] px-20 max-[1550px]:px-[60px] max-lg:px-[25px] max-md:px-4 py-[60px] text-white">
      <div className="mx-auto flex w-full max-w-full flex-col gap-10">

        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-[#459be2]">
          <Link href="/" aria-label="Trang chủ" className="flex items-center gap-1 hover:opacity-80 transition">
            <Home className="size-4" />
          </Link>
          <ChevronRight className="size-3.5 text-[#459be2]" />
          <Link href="/tuyen-dung" className="hover:opacity-80 transition">Tuyển dụng</Link>
          <ChevronRight className="size-3.5 text-[#459be2]" />
          <span className="truncate text-white max-w-[320px]">{job.title}</span>
        </nav>

        {/* Two-column layout */}
        <div className="flex flex-col gap-10 xl:flex-row xl:items-start xl:gap-10">

          {/* ── Main content ─────────────────────────────────────── */}
          <article className="flex min-w-0 flex-1 flex-col gap-8">

            {/* Header */}
            <div className="flex flex-col gap-4">
              <span className="inline-flex w-fit items-center rounded-full bg-[#2a9fff]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#2a9fff] border border-[#2a9fff]/20">
                {job.department}
              </span>
              <h1 className="font-['Archivo',Helvetica] text-[32px] font-bold leading-tight text-white lg:text-[44px]">
                {job.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/60">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-[#2a9fff]" />{job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4 text-[#2a9fff]" />{JOB_TYPE_LABELS[job.jobType] ?? job.jobType}
                </span>
                {job.salary && (
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="size-4 text-[#2a9fff]" />{job.salary}
                  </span>
                )}
                {job.publishedAt && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="size-4 text-[#2a9fff]" />
                    Đăng ngày {new Date(job.publishedAt).toLocaleDateString("vi-VN")}
                  </span>
                )}
              </div>
            </div>

            <div className="h-px w-full bg-white/10" />

            {/* Description */}
            <section>
              <h2 className="mb-4 font-['Archivo',Helvetica] text-xl font-bold text-white">Mô tả công việc</h2>
              <div
                className="prose prose-recruitment"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            </section>

            {/* Requirements */}
            <section>
              <h2 className="mb-4 font-['Archivo',Helvetica] text-xl font-bold text-white">Yêu cầu ứng viên</h2>
              <div
                className="prose prose-recruitment"
                dangerouslySetInnerHTML={{ __html: requirementsHtml }}
              />
            </section>

            {/* Benefits */}
            {benefitsHtml && (
              <section>
                <h2 className="mb-4 font-['Archivo',Helvetica] text-xl font-bold text-white">Phúc lợi</h2>
                <div
                  className="prose prose-recruitment"
                  dangerouslySetInnerHTML={{ __html: benefitsHtml }}
                />
              </section>
            )}
          </article>

          {/* ── Sidebar ──────────────────────────────────────────── */}
          <aside className="flex w-full flex-col gap-6 xl:w-[340px] xl:shrink-0">

            {/* Apply card */}
            <div className="rounded-2xl border border-white/10 bg-white/4 p-6 flex flex-col gap-5">
              <h3 className="font-['Archivo',Helvetica] text-lg font-bold text-white">Ứng tuyển ngay</h3>
              {job.externalApplyUrl ? (
                <a
                  href={job.externalApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-[52px] items-center justify-center rounded-[100px] border border-[#31b0ff] transition hover:opacity-95 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-b from-[#76c6ff] to-[#2a75f3]" />
                  <span className="relative z-10 font-['Archivo',Helvetica] text-[18px] font-semibold text-white">
                    Ứng tuyển →
                  </span>
                </a>
              ) : (
                <a
                  href="mailto:hr@letrongroup.com"
                  className="group relative flex h-[52px] items-center justify-center rounded-[100px] border border-[#31b0ff] transition hover:opacity-95 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-b from-[#76c6ff] to-[#2a75f3]" />
                  <span className="relative z-10 font-['Archivo',Helvetica] text-[18px] font-semibold text-white">
                    Gửi CV qua email →
                  </span>
                </a>
              )}
              <p className="text-xs text-white/40 text-center">
                Hoặc gửi CV đến <span className="text-[#2a9fff]">hr@letrongroup.com</span>
              </p>
            </div>

            {/* Job summary card */}
            <div className="rounded-2xl border border-white/10 bg-white/4 p-6 flex flex-col gap-4">
              <h3 className="font-['Archivo',Helvetica] text-base font-bold text-white">Thông tin vị trí</h3>
              <dl className="flex flex-col gap-3 text-sm">
                {[
                  { label: "Bộ phận", value: job.department },
                  { label: "Địa điểm", value: job.location },
                  { label: "Hình thức", value: JOB_TYPE_LABELS[job.jobType] ?? job.jobType },
                  { label: "Mức lương", value: job.salary ?? "Thỏa thuận" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className="text-white/50">{label}</dt>
                    <dd className="font-medium text-white text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Back link */}
            <Link
              href="/tuyen-dung#open-positions"
              className="flex items-center gap-2 text-sm text-[#2a9fff] hover:opacity-80 transition"
            >
              <ArrowLeft className="size-4" />
              Xem tất cả vị trí tuyển dụng
            </Link>
          </aside>
        </div>
      </div>

      {/* Prose styles for markdown content */}
      <style>{`
        .prose.prose-recruitment {
          color: rgba(255,255,255,0.75);
          font-family: 'Archivo', Helvetica, sans-serif;
          font-size: 16px;
          line-height: 1.75;
          max-width: none;
        }
        .prose.prose-recruitment h1,
        .prose.prose-recruitment h2,
        .prose.prose-recruitment h3,
        .prose.prose-recruitment h4 {
          color: #fff;
          font-weight: 700;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        .prose.prose-recruitment h2 { font-size: 1.25rem; }
        .prose.prose-recruitment h3 { font-size: 1.1rem; }
        .prose.prose-recruitment ul,
        .prose.prose-recruitment ol {
          padding-left: 1.5rem;
          margin: 0.75rem 0;
        }
        .prose.prose-recruitment ul { list-style-type: disc; }
        .prose.prose-recruitment ol { list-style-type: decimal; }
        .prose.prose-recruitment li { margin: 0.35rem 0; }
        .prose.prose-recruitment p { margin: 0.75rem 0; }
        .prose.prose-recruitment strong { color: #fff; }
        .prose.prose-recruitment a { color: #2a9fff; text-decoration: underline; }
        .prose.prose-recruitment hr { border-color: rgba(255,255,255,0.1); margin: 1.5rem 0; }
      `}</style>
    </main>
  );
}
