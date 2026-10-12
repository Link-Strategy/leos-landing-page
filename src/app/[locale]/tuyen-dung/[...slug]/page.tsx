import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Home, MapPin, Briefcase, Clock, DollarSign, ChevronRight, ArrowLeft } from "lucide-react";
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
    title: `${job.title} | LeTRON Tuyển dụng`,
    description: `${job.department} · ${job.location} · ${JOB_TYPE_LABELS[job.jobType] ?? job.jobType}. Xem mô tả và ứng tuyển tại LeTRON.`,
    alternates: { canonical: url },
    openGraph: {
      title: job.title,
      description: `${job.department} tại ${job.location}`,
      url,
      siteName: "LeTRON",
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "LeTRON" }],
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

  return (
    <div className="site-main archive post-type-archive post-type-archive-tuyen-dung elementor-page-604 elementor-default elementor-template-full-width elementor-kit-6">
      <JsonLd data={buildJobPostingJsonLd(job, `${getSiteUrl()}/tuyen-dung/${job.slug}`, getSiteUrl())} />
      <div className="elementor elementor-604 elementor-location-single post-575 tuyen-dung type-tuyen-dung status-publish hentry" data-elementor-id="604" data-elementor-post-type="elementor_library" data-elementor-type="single-post">
        <div className="elementor-element elementor-element-51999a2 e-flex e-con-boxed e-con e-parent" data-e-type="container" data-element_type="container" data-id="51999a2" data-settings='{"background_background":"classic"}'>
          <div className="e-con-inner">
            <div className="elementor-element elementor-element-263abe8 elementor-widget elementor-widget-shortcode" data-e-type="widget" data-element_type="widget" data-id="263abe8" data-widget_type="shortcode.default">
              <div className="elementor-shortcode">
                <nav aria-label="breadcrumbs" className="rank-math-breadcrumb">
                  <p>
                    <Link href="/">Home</Link>
                    <span className="separator">/</span>
                    <Link href="/tuyen-dung">Tuyển dụng</Link>
                    <span className="separator">/</span>
                    <span className="last">{job.title}</span>
                  </p>
                </nav>
              </div>
            </div>
            <div className="elementor-element elementor-element-e59ff5c e-con-full e-flex e-con e-child" data-e-type="container" data-element_type="container" data-id="e59ff5c" data-settings='{"background_background":"classic"}'>
              <div className="elementor-element elementor-element-d13e9f2 e-con-full e-flex e-con e-child" data-e-type="container" data-element_type="container" data-id="d13e9f2">
                <div className="elementor-element elementor-element-0b47443 elementor-widget elementor-widget-theme-post-title elementor-page-title elementor-widget-heading" data-e-type="widget" data-element_type="widget" data-id="0b47443" data-widget_type="theme-post-title.default">
                  <h1 className="elementor-heading-title elementor-size-default">
                    {job.title}
                  </h1>
                </div>
                <div className="elementor-element elementor-element-bc16879 elementor-widget elementor-widget-heading" data-e-type="widget" data-element_type="widget" data-id="bc16879" data-widget_type="heading.default">
                  <h3 className="elementor-heading-title elementor-size-default">
                    Chi tiết công việc
                  </h3>
                </div>
                <div className="elementor-element elementor-element-9d06f8b elementor-widget elementor-widget-shortcode" data-e-type="widget" data-element_type="widget" data-id="9d06f8b" data-widget_type="shortcode.default">
                  <div className="elementor-shortcode">
                    <div className="td-job-table">
                      {jobRows.map((row) => (
                        <div className="td-job-row" key={row.label}>
                          <div className="td-job-title">{row.label}</div>
                          <div className="td-job-desc">{row.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {(benefitTags.length > 0 || benefitsHtml) && (
                  <div className="elementor-element elementor-element-95c7f71 elementor-widget elementor-widget-heading" data-e-type="widget" data-element_type="widget" data-id="95c7f71" data-widget_type="heading.default">
                    <h3 className="elementor-heading-title elementor-size-default">
                      Phúc lợi
                    </h3>
                  </div>
                )}
                {benefitTags.length > 0 && (
                  <div className="elementor-element elementor-element-1263618 elementor-widget elementor-widget-shortcode" data-e-type="widget" data-element_type="widget" data-id="1263618" data-widget_type="shortcode.default">
                    <div className="elementor-shortcode">
                      <div className="td-job-table">
                        {benefitTagRows.map((pair) => (
                          <div className="td-job-row" key={pair.join("|")}>
                            {pair.map((tag) => (
                              <div className="title-phuc-loi" key={tag}>{tag}</div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {benefitsHtml && (
                  <div className="elementor-element elementor-element-ba01060 elementor-widget elementor-widget-text-editor" data-e-type="widget" data-element_type="widget" data-id="ba01060" data-widget_type="text-editor.default">
                    <div className="elementor-widget-container prose prose-recruitment">
                      <div dangerouslySetInnerHTML={{ __html: benefitsHtml }} />
                    </div>
                  </div>
                )}

                <div className="elementor-element elementor-element-6309bf9 elementor-widget elementor-widget-heading" data-e-type="widget" data-element_type="widget" data-id="6309bf9" data-widget_type="heading.default">
                  <h3 className="elementor-heading-title elementor-size-default">
                    Mô tả công việc
                  </h3>
                </div>
                <div className="elementor-element elementor-element-ba01060 elementor-widget elementor-widget-text-editor" data-e-type="widget" data-element_type="widget" data-id="ba01060" data-widget_type="text-editor.default">
                  <div className="elementor-widget-container prose prose-recruitment animate-fade-in">
                    <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                  </div>
                </div>
                <div className="elementor-element elementor-element-892855a elementor-widget elementor-widget-heading" data-e-type="widget" data-element_type="widget" data-id="892855a" data-widget_type="heading.default">
                  <h3 className="elementor-heading-title elementor-size-default">
                    Yêu cầu
                  </h3>
                </div>
                <div className="elementor-element elementor-element-a0778de elementor-widget elementor-widget-text-editor" data-e-type="widget" data-element_type="widget" data-id="a0778de" data-widget_type="text-editor.default">
                  <div className="elementor-widget-container prose prose-recruitment animate-fade-in">
                    <div dangerouslySetInnerHTML={{ __html: requirementsHtml }} />
                  </div>
                </div>
              </div>
              <div className="elementor-element elementor-element-ed3e70a e-con-full e-flex e-con e-child" data-e-type="container" data-element_type="container" data-id="ed3e70a">
                <div className="elementor-element elementor-element-fa73e82 elementor-widget elementor-widget-heading" data-e-type="widget" data-element_type="widget" data-id="fa73e82" data-widget_type="heading.default">
                  <h2 className="elementor-heading-title elementor-size-default">
                    Đơn ứng tuyển vị trí
                  </h2>
                </div>
                <div className="elementor-element elementor-element-fab0c68 elementor-widget elementor-widget-text-editor" data-e-type="widget" data-element_type="widget" data-id="fab0c68" data-widget_type="text-editor.default">
                  <p>Hướng dẫn ứng tuyển</p>
                  <ul>
                    <li>Điền file thông tin ứng viên</li>
                    <li>Chọn nút “nộp đơn ứng tuyển” để gửi đơn</li>
                  </ul>
                </div>
                {job.externalApplyUrl ? (
                  <a className="elementor-button elementor-size-sm" href={job.externalApplyUrl} target="_blank" rel="noopener noreferrer">
                    <span className="elementor-button-text">Ứng tuyển qua trang tuyển dụng</span>
                  </a>
                ) : (
                  <JobApplyForm jobTitle={job.title} jobSlug={job.slug} />
                )}
              </div>
            </div>
          </div>
        </div>

        {otherJobs.length > 0 && (
          <div className="elementor-element elementor-element-d4915cf e-flex e-con-boxed e-con e-parent" data-e-type="container" data-element_type="container" data-id="d4915cf" data-settings='{"background_background":"classic"}'>
            <div className="e-con-inner">
              <div className="elementor-element elementor-element-ae613c6 sub-title elementor-widget elementor-widget-heading" data-e-type="widget" data-element_type="widget" data-id="ae613c6" data-widget_type="heading.default">
                <h3 className="elementor-heading-title elementor-size-default">
                  Các vị trí đang tuyển
                </h3>
              </div>
              <div className="elementor-element elementor-element-2fc67b5 elementor-widget elementor-widget-heading" data-e-type="widget" data-element_type="widget" data-id="2fc67b5" data-widget_type="heading.default">
                <h2 className="elementor-heading-title elementor-size-default">
                  Tìm kiếm công việc mơ ước{" "}
                  <span>tại LeTRON</span>
                </h2>
              </div>
              <div className="elementor-element elementor-element-ac7e226 elementor-widget elementor-widget-text-editor" data-e-type="widget" data-element_type="widget" data-id="ac7e226" data-widget_type="text-editor.default">
                <p>
                  Phát triển bản thân và tỏa sáng tại môi trường làm việc hạnh phúc.
                </p>
              </div>
              <div className="elementor-element elementor-element-443f9b7 elementor-grid-1 elementor-widget__width-inherit grid-list-post elementor-grid-tablet-2 elementor-grid-mobile-1 elementor-invisible elementor-widget elementor-widget-loop-grid w-full animate-fade-in" data-e-type="widget" data-element_type="widget" data-id="443f9b7">
                <div className="elementor-widget-container">
                  <div className="elementor-loop-container elementor-grid" role="list">
                    {otherJobs.slice(0, 3).map((otherJob) => (
                      <JobListingCard key={otherJob.slug} job={otherJob} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .elementor-page-title,
        .elementor-widget-theme-post-title,
        .elementor-element-0b47443 {
          display: block !important;
        }
        .prose-recruitment ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin: 1rem 0 !important;
        }
        .prose-recruitment ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin: 1rem 0 !important;
        }
        .prose-recruitment li {
          margin: 0.5rem 0 !important;
        }
        .prose-recruitment p {
          margin: 1rem 0 !important;
        }
      `}</style>
    </div>
  );
}
