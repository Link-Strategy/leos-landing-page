import Link from "next/link";
import LandingElementorHooks from "@/components/landing/LandingElementorHooks";
import { RecruitmentBenefitCard } from "./RecruitmentBenefitCard";
import { RecruitmentOpenPositionsButton } from "./RecruitmentOpenPositionsButton";
import { JobListingsSection } from "./JobListingsSection";
import type { JobListing } from "@/lib/recruitment/types";

interface Props {
  jobs: JobListing[];
}

export default function RecruitmentPage({ jobs }: Props) {
  return (
    <div className="site-main archive post-type-archive post-type-archive-tuyen-dung elementor-page-221 elementor-default elementor-template-full-width elementor-kit-6">
      <div className="elementor elementor-221 elementor-location-archive" data-elementor-id={221} data-elementor-post-type="elementor_library" data-elementor-type="archive">
        <div className="elementor-element elementor-element-00a505f e-flex e-con-boxed e-con e-parent" data-e-type="container" data-element_type="container" data-id="00a505f" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
          <div className="e-con-inner">
            <div className="elementor-element elementor-element-839d381 elementor-widget elementor-widget-shortcode" data-e-type="widget" data-element_type="widget" data-id="839d381" data-widget_type="shortcode.default">
              <div className="elementor-shortcode">
                <nav aria-label="breadcrumbs" className="rank-math-breadcrumb">
                  <p>
                    <Link href="/">
                      Home
                    </Link>
                    <span className="separator">
                      /
                    </span>
                    <span className="last">
                      Tuyển dụng
                    </span>
                  </p>
                </nav>
              </div>
            </div>
            <div className="elementor-element elementor-element-d443478 elementor-widget elementor-widget-heading" data-e-type="widget" data-element_type="widget" data-id="d443478" data-widget_type="heading.default">
              <h1 className="elementor-heading-title elementor-size-default">
                Gia nhập đội ngũ
                <span>
                  LeTRON
                </span>
              </h1>
            </div>
            <div className="elementor-element elementor-element-e96aabb elementor-widget elementor-widget-text-editor" data-e-type="widget" data-element_type="widget" data-id="e96aabb" data-widget_type="text-editor.default">
              <p>
                Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.
              </p>
            </div>
          </div>
        </div>
        <div className="elementor-element elementor-element-a760b4f e-flex e-con-boxed e-con e-parent" data-e-type="container" data-element_type="container" data-id="a760b4f" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
          <div className="e-con-inner">
            <div className="elementor-element elementor-element-05033d3 e-con-full e-flex elementor-invisible e-con e-child" data-e-type="container" data-element_type="container" data-id="05033d3" data-settings="{&quot;animation&quot;:&quot;fadeInLeft&quot;}">
              <div className="elementor-element elementor-element-931cae0 sub-title elementor-widget elementor-widget-heading" data-e-type="widget" data-element_type="widget" data-id="931cae0" data-widget_type="heading.default">
                <h3 className="elementor-heading-title elementor-size-default">
                  Môi trường làm việc
                </h3>
              </div>
              <div className="elementor-element elementor-element-ff8530c elementor-widget elementor-widget-heading" data-e-type="widget" data-element_type="widget" data-id="ff8530c" data-widget_type="heading.default">
                <h2 className="elementor-heading-title elementor-size-default">
                  Môi trường kiến tạo
                  <br />
                  vận hành như
                  <span>
                    một hệ thống
                  </span>
                </h2>
              </div>
              <div className="elementor-element elementor-element-21c0b5a elementor-widget elementor-widget-text-editor" data-e-type="widget" data-element_type="widget" data-id="21c0b5a" data-widget_type="text-editor.default">
                <p>
                  LETRON xây dựng môi trường nơi con người, công nghệ và dữ liệu phối hợp để giải quyết những bài toán công nghiệp quy mô lớn.
                </p>
              </div>
              <div className="elementor-element elementor-element-219515f elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-e-type="widget" data-element_type="widget" data-id="219515f" data-widget_type="icon-list.default">
                <ul className="elementor-icon-list-items">
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <img src="/assets/images/recruitment/recruitment-icon-4.svg" alt="recruitment-icon-1" className="inline-block" style={{ width: '1em', height: '1em', display: 'inline-block', verticalAlign: 'middle' }} />
                    </span>
                    <span className="elementor-icon-list-text">
                      Làm việc trên các dự án thực, tác động trực tiếp đến môi trường và xã hội
                    </span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <img src="/assets/images/recruitment/recruitment-icon-4.svg" alt="recruitment-icon-2" className="inline-block" style={{ width: '1em', height: '1em', display: 'inline-block', verticalAlign: 'middle' }} />
                    </span>
                    <span className="elementor-icon-list-text">
                      Văn hóa tốc độ cao – ưu tiên hành động và kết quả
                    </span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <img src="/assets/images/recruitment/recruitment-icon-4.svg" alt="recruitment-icon-3" className="inline-block" style={{ width: '1em', height: '1em', display: 'inline-block', verticalAlign: 'middle' }} />
                    </span>
                    <span className="elementor-icon-list-text">
                      Minh bạch bằng dữ liệu – mọi quyết định có cơ sở rõ ràng
                    </span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <img src="/assets/images/recruitment/recruitment-icon-4.svg" alt="recruitment-icon-4" className="inline-block" style={{ width: '1em', height: '1em', display: 'inline-block', verticalAlign: 'middle' }} />
                    </span>
                    <span className="elementor-icon-list-text">
                      Khuyến khích đổi mới và thử nghiệm liên tục
                    </span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <img src="/assets/images/recruitment/recruitment-icon-4.svg" alt="recruitment-icon-5" className="inline-block" style={{ width: '1em', height: '1em', display: 'inline-block', verticalAlign: 'middle' }} />
                    </span>
                    <span className="elementor-icon-list-text">
                      Cộng tác đa lĩnh vực: công nghệ – công nghiệp – tài chính
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="elementor-element elementor-element-f167902 e-con-full e-flex elementor-invisible e-con e-child" data-e-type="container" data-element_type="container" data-id="f167902" data-settings="{&quot;animation&quot;:&quot;fadeInRight&quot;}">
              <div className="elementor-element elementor-element-8c324e8 elementor-widget elementor-widget-image" data-e-type="widget" data-element_type="widget" data-id="8c324e8" data-widget_type="image.default">
                <img alt="" className="attachment-large size-large wp-image-972" height={450} loading="lazy" sizes="(max-width: 800px) 100vw, 800px" src="/wp-content/uploads/2026/05/img-tuyen-dung.jpg" srcSet="/wp-content/uploads/2026/05/img-tuyen-dung.jpg 1000w, /wp-content/uploads/2026/05/img-tuyen-dung-300x169.jpg 300w, /wp-content/uploads/2026/05/img-tuyen-dung-768x432.jpg 768w" width={800} />
              </div>
              <div className="elementor-element elementor-element-bd9d9fc elementor-absolute elementor-widget elementor-widget-image" data-e-type="widget" data-element_type="widget" data-id="bd9d9fc" data-settings="{&quot;_position&quot;:&quot;absolute&quot;}" data-widget_type="image.default">
                <img alt="" className="attachment-full size-full wp-image-963" height={606} loading="lazy" sizes="(max-width: 853px) 100vw, 853px" src="/wp-content/uploads/2026/05/img-2-2-1.png" srcSet="/wp-content/uploads/2026/05/img-2-2-1.png 853w, /wp-content/uploads/2026/05/img-2-2-1-300x213.png 300w, /wp-content/uploads/2026/05/img-2-2-1-768x546.png 768w" width={853} />
              </div>
            </div>
          </div>
        </div>
        <div className="elementor-element elementor-element-a6413b8 e-flex e-con-boxed e-con e-parent" data-e-type="container" data-element_type="container" data-id="a6413b8" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
          <div className="e-con-inner">
            <div className="elementor-element elementor-element-87425c0 e-con-full e-flex elementor-invisible e-con e-child" data-e-type="container" data-element_type="container" data-id="87425c0" data-settings="{&quot;animation&quot;:&quot;fadeInLeft&quot;}">
              <div className="elementor-element elementor-element-a40b4ae e-con-full e-flex e-con e-child" data-e-type="container" data-element_type="container" data-id="a40b4ae">
                <RecruitmentBenefitCard
                  icon={<img src="/assets/images/recruitment/recruitment-icon-6.svg" alt="recruitment-icon-6" className="inline-block" style={{ width: '1em', height: '1em', display: 'inline-block', verticalAlign: 'middle' }} />}
                  title="Cơ hội phát triển nhanh"
                  description={<>Lộ trình rõ ràng, trao quyền theo năng lực</>}
                  hoverBackgroundColor="#1CBBB466"
                  hoverBorderColor="#1CBBB4"
                />
                <RecruitmentBenefitCard
                  icon={<img src="/assets/images/recruitment/recruitment-icon-7.svg" alt="recruitment-icon-7" className="inline-block" style={{ width: '1em', height: '1em', display: 'inline-block', verticalAlign: 'middle' }} />}
                  title="Phúc lợi đầy đủ"
                  description={<>Bảo hiểm, nghỉ phép, chế độ theo quy định và mở rộng</>}
                  hoverBackgroundColor="#C8960C66"
                  hoverBorderColor="#C8960C"
                />
              </div>
              <div className="elementor-element elementor-element-41dd0b9 e-con-full e-flex e-con e-child" data-e-type="container" data-element_type="container" data-id="41dd0b9">
                <RecruitmentBenefitCard
                  icon={<img src="/assets/images/recruitment/recruitment-icon-8.svg" alt="recruitment-icon-8" className="inline-block" style={{ width: '1em', height: '1em', display: 'inline-block', verticalAlign: 'middle' }} />}
                  title="Thu nhập cạnh tranh"
                  description={<>Lương, thưởng gắn với hiệu quả và kết quả công việc</>}
                  hoverBackgroundColor="#228B2266"
                  hoverBorderColor="#228B22"
                />
                <RecruitmentBenefitCard
                  icon={<img src="/assets/images/recruitment/recruitment-icon-9.svg" alt="recruitment-icon-9" className="inline-block" style={{ width: '1em', height: '1em', display: 'inline-block', verticalAlign: 'middle' }} />}
                  title="Cơ hội phát triển nhanh"
                  description={<>Lộ trình rõ ràng, trao quyền theo năng lực</>}
                  hoverBackgroundColor="#FF800066"
                  hoverBorderColor="#FF7E00"
                />
              </div>
            </div>
            <div className="elementor-element elementor-element-f12fd4a e-con-full e-flex elementor-invisible e-con e-child" data-e-type="container" data-element_type="container" data-id="f12fd4a" data-settings="{&quot;animation&quot;:&quot;fadeInRight&quot;}">
              <div className="elementor-element elementor-element-bfeb365 sub-title elementor-widget elementor-widget-heading" data-e-type="widget" data-element_type="widget" data-id="bfeb365" data-widget_type="heading.default">
                <h3 className="elementor-heading-title elementor-size-default">
                  Chính sách nhân sự
                </h3>
              </div>
              <div className="elementor-element elementor-element-c60da56 elementor-widget elementor-widget-heading" data-e-type="widget" data-element_type="widget" data-id="c60da56" data-widget_type="heading.default">
                <h2 className="elementor-heading-title elementor-size-default">
                  Đãi ngộ xứng đáng
                  <br />
                  <span>
                    với giá trị tạo ra
                  </span>
                </h2>
              </div>
              <div className="elementor-element elementor-element-ebdf6b7 elementor-widget elementor-widget-text-editor" data-e-type="widget" data-element_type="widget" data-id="ebdf6b7" data-widget_type="text-editor.default">
                <p>
                  Chính sách được thiết kế để thu hút, phát triển và giữ chân những nhân sự có năng lực tạo tác động thực
                </p>
              </div>
              <div className="elementor-element elementor-element-266335b btn elementor-widget elementor-widget-button" data-e-type="widget" data-element_type="widget" data-id="266335b" data-widget_type="button.default">
                <RecruitmentOpenPositionsButton />
              </div>
            </div>
          </div>
        </div>
        <div className="elementor-element elementor-element-53eb7fa e-flex e-con-boxed e-con e-parent" data-e-type="container" data-element_type="container" data-id="53eb7fa" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" id="open-positions">
          <div className="e-con-inner">
            <div className="elementor-element elementor-element-2585f3d sub-title elementor-widget elementor-widget-heading" data-e-type="widget" data-element_type="widget" data-id="2585f3d" data-widget_type="heading.default" id="cac-vi-tri-dang-tuyen">
              <h3 className="elementor-heading-title elementor-size-default">
                Các vị trí đang tuyển
              </h3>
            </div>
            <div className="elementor-element elementor-element-c0df6da elementor-widget elementor-widget-heading" data-e-type="widget" data-element_type="widget" data-id="c0df6da" data-widget_type="heading.default">
              <h2 className="elementor-heading-title elementor-size-default">
                Tìm kiếm công việc mơ ước
                <span>
                  tại LeTRON
                </span>
              </h2>
            </div>
            <div className="elementor-element elementor-element-cd04d4f elementor-widget elementor-widget-text-editor" data-e-type="widget" data-element_type="widget" data-id="cd04d4f" data-widget_type="text-editor.default">
              <p>
                Phát triển bản thân và tỏa sáng tại môi trường làm việc hạnh phúc.
              </p>
            </div>
            <JobListingsSection jobs={jobs} />
          </div>
        </div>
      </div>
      <LandingElementorHooks />
    </div>
  );
}

