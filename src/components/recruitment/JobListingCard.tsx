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
  return (
    <div className="elementor elementor-541 e-loop-item e-loop-item-576 post-576 tuyen-dung type-tuyen-dung status-publish hentry" data-custom-edit-handle={1} data-elementor-id={541} data-elementor-post-type="elementor_library" data-elementor-type="loop-item">
      <div className="elementor-element elementor-element-7353a18 e-con-full e-flex e-con e-parent" data-e-type="container" data-element_type="container" data-id="7353a18" data-settings='{"background_background":"classic"}'>
        <div className="elementor-element elementor-element-c9e6667 e-con-full e-flex e-con e-child" data-e-type="container" data-element_type="container" data-id="c9e6667">
          <div className="elementor-element elementor-element-65a7e4e max_line_1 elementor-widget elementor-widget-theme-post-title elementor-page-title elementor-widget-heading" data-e-type="widget" data-element_type="widget" data-id="65a7e4e" data-widget_type="theme-post-title.default">
            <h3 className="elementor-heading-title elementor-size-default">
              <Link href={`/tuyen-dung/${job.slug}`}>
                {job.title}
              </Link>
            </h3>
          </div>
          <div className="elementor-element elementor-element-fb12818 elementor-icon-list--layout-inline elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-e-type="widget" data-element_type="widget" data-id="fb12818" data-widget_type="icon-list.default">
            <ul className="elementor-icon-list-items elementor-inline-items" style={{ display: 'flex', flexWrap: 'wrap', width: '100%', marginInline: 0 }}>
              <li className="elementor-icon-list-item elementor-inline-item" style={{ flex: '1 1 33.333%', marginInline: 0 }}>
                <span className="elementor-icon-list-icon">
                  <img src="/assets/images/recruitment/recruitment-icon-1.svg" alt="icon" style={{ width: '2em', height: '2em', display: 'inline-block', verticalAlign: 'middle' }} />
                </span>
                <span className="elementor-icon-list-text">
                  {job.department}
                </span>
              </li>
              <li className="elementor-icon-list-item elementor-inline-item" style={{ flex: '1 1 33.333%', marginInline: 0, paddingLeft: '24px' }}>
                <span className="elementor-icon-list-icon">
                  <img src="/assets/images/recruitment/recruitment-icon-2.svg" alt="icon" style={{ width: '2em', height: '2em', display: 'inline-block', verticalAlign: 'middle' }} />
                </span>
                <span className="elementor-icon-list-text">
                  {job.location} • {JOB_TYPE_LABELS[job.jobType] ?? job.jobType}
                </span>
              </li>
              <li className="elementor-icon-list-item elementor-inline-item" style={{ flex: '1 1 33.333%', marginInline: 0, paddingLeft: '24px' }}>
                <span className="elementor-icon-list-icon">
                  <img src="/assets/images/recruitment/recruitment-icon-3.svg" alt="icon" style={{ width: '2em', height: '2em', display: 'inline-block', verticalAlign: 'middle' }} />
                </span>
                <span className="elementor-icon-list-text">
                  {job.salary || "Thỏa thuận"}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="elementor-element elementor-element-8a40958 e-con-full e-flex e-con e-child" data-e-type="container" data-element_type="container" data-id="8a40958">
          <div className="elementor-element elementor-element-21c1c23 btn elementor-widget elementor-widget-button" data-e-type="widget" data-element_type="widget" data-id="21c1c23" data-widget_type="button.default">
            <Link className="elementor-button elementor-button-link elementor-size-sm" href={`/tuyen-dung/${job.slug}`}>
              <span className="elementor-button-content-wrapper">
                <span className="elementor-button-icon">
                  <svg fill="none" height={24} viewBox="0 0 24 24" width={24} xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" d="M18.5303 12.5303C18.8232 12.2374 18.8232 11.7626 18.5303 11.4697L14.5303 7.46967C14.2374 7.17678 13.7626 7.17678 13.4697 7.46967C13.1768 7.76256 13.1768 8.23744 13.4697 8.53033L16.1893 11.25H6C5.58579 11.25 5.25 11.5858 5.25 12C5.25 12.4142 5.58579 12.75 6 12.75H16.1893L13.4697 15.4697C13.1768 15.7626 13.1768 16.2374 13.4697 16.5303C13.7626 16.8232 14.2374 16.8232 14.5303 16.5303L18.5303 12.5303Z" fill="white" fillRule="evenodd">
                    </path>
                  </svg>
                </span>
                <span className="elementor-button-text">
                  Xem chi tiết
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
