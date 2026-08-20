import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

function FooterBullet() {
  return (
    <svg fill="none" height="6" viewBox="0 0 6 6" width="6" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#76C6FF" height="6" rx="3" width="6" />
    </svg>
  );
}

type FooterLink = { href: string; label: string };

function FooterLinkItems({ items }: { items: FooterLink[] }) {
  return (
    <ul className="elementor-icon-list-items">
      {items.map((item) => (
        <li key={item.href} className="elementor-icon-list-item">
          <Link href={item.href}>
            <span className="elementor-icon-list-icon">
              <FooterBullet />
            </span>
            <span className="elementor-icon-list-text">{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  const t = useTranslations("footer");

  const quickLinks: FooterLink[] = [
    { href: "/", label: t("quickLinks.home") },
    { href: "/gioi-thieu", label: t("quickLinks.aboutUs") },
    { href: "/cong-ty-thanh-vien", label: t("quickLinks.memberCompanies") },
    { href: "/blog", label: t("quickLinks.newsEvents") },
    { href: "/tuyen-dung", label: t("quickLinks.careers") },
    { href: "/lien-he", label: t("quickLinks.contact") },
  ];

  const productLinks: FooterLink[] = [
    { href: "/san-pham/ledb-bo-nao-so", label: t("products.ledb") },
    { href: "/san-pham/lesm-di-chuyen-thong-minh", label: t("products.lesm") },
    { href: "/san-pham/lese-nang-luong-thong-minh", label: t("products.lese") },
    { href: "/san-pham/legm-vat-lieu-xanh", label: t("products.legm") },
    { href: "/san-pham/lesb-xay-dung-thong-minh", label: t("products.lesb") },
    { href: "/san-pham/lesc-do-thi-thong-minh", label: t("products.lesc") },
  ];

  return (
    <footer
      className="elementor elementor-63 elementor-location-footer"
      data-elementor-id="63"
      data-elementor-post-type="elementor_library"
      data-elementor-type="footer"
    >
      <div className="elementor-element elementor-element-01510ee e-flex e-con-boxed e-con e-parent">
        <div className="e-con-inner">
          <div className="elementor-element elementor-element-a79de43 e-con-full e-flex e-con e-child">
            {/* Column 1: logo, company name, socials, copyright */}
            <div className="elementor-element elementor-element-2be8b2c e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-85c9849 elementor-widget-mobile__width-initial elementor-widget elementor-widget-image">
                <img
                  alt=""
                  className="attachment-large size-large wp-image-68"
                  height={100}
                  src="/wp-content/uploads/2026/05/logo-2.png"
                  width={163}
                />
              </div>
              <div className="elementor-element elementor-element-4e909ba elementor-widget elementor-widget-heading">
                <h3 className="elementor-heading-title elementor-size-default">{t("companyName")}</h3>
              </div>
              <div className="elementor-element elementor-element-599af47 e-con-full e-flex e-con e-child">
                <div className="elementor-element elementor-element-203f045 elementor-widget elementor-widget-image">
                  <a href="#!">
                    <img
                      alt=""
                      className="attachment-large size-large wp-image-2689"
                      height={240}
                      sizes="(max-width: 240px) 100vw, 240px"
                      src="/wp-content/uploads/2026/05/ICON-SOCIAL-4.png"
                      srcSet="/wp-content/uploads/2026/05/ICON-SOCIAL-4.png 240w, /wp-content/uploads/2026/05/ICON-SOCIAL-4-150x150.png 150w"
                      width={240}
                    />
                  </a>
                </div>
                <div className="elementor-element elementor-element-dc57bfc elementor-widget elementor-widget-image">
                  <a href="#!">
                    <img
                      alt=""
                      className="attachment-large size-large wp-image-2690"
                      height={240}
                      sizes="(max-width: 240px) 100vw, 240px"
                      src="/wp-content/uploads/2026/05/ICON-SOCIAL-3.png"
                      srcSet="/wp-content/uploads/2026/05/ICON-SOCIAL-3.png 240w, /wp-content/uploads/2026/05/ICON-SOCIAL-3-150x150.png 150w"
                      width={240}
                    />
                  </a>
                </div>
                <div className="elementor-element elementor-element-963d6be elementor-widget elementor-widget-image">
                  <a href="#!">
                    <img
                      alt=""
                      className="attachment-large size-large wp-image-2691"
                      height={240}
                      sizes="(max-width: 240px) 100vw, 240px"
                      src="/wp-content/uploads/2026/05/ICON-SOCIAL-1.png"
                      srcSet="/wp-content/uploads/2026/05/ICON-SOCIAL-1.png 240w, /wp-content/uploads/2026/05/ICON-SOCIAL-1-150x150.png 150w"
                      width={240}
                    />
                  </a>
                </div>
              </div>
              <div className="elementor-element elementor-element-b01f294 elementor-widget elementor-widget-heading">
                <p className="elementor-heading-title elementor-size-default">{t("copyright")}</p>
              </div>
            </div>

            <div className="elementor-element elementor-element-5fd7e0a e-con-full e-flex e-con e-child">
              {/* Desktop: quick links + products columns */}
              <div className="elementor-element elementor-element-64465b7 e-con-full elementor-hidden-mobile e-flex e-con e-child">
                <div className="elementor-element elementor-element-3e5a03e elementor-widget elementor-widget-heading">
                  <h3 className="elementor-heading-title elementor-size-default">{t("quickLinksHeading")}</h3>
                </div>
                <div className="elementor-element elementor-element-68d114c elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list">
                  <FooterLinkItems items={quickLinks} />
                </div>
              </div>
              <div className="elementor-element elementor-element-a047a3e e-con-full elementor-hidden-mobile e-flex e-con e-child">
                <div className="elementor-element elementor-element-73f1bdf elementor-widget elementor-widget-heading">
                  <h3 className="elementor-heading-title elementor-size-default">{t("productsHeading")}</h3>
                </div>
                <div className="elementor-element elementor-element-b55326e elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list">
                  <FooterLinkItems items={productLinks} />
                </div>
              </div>

              {/* Mobile: same two columns collapsed into an accordion */}
              <div className="elementor-element elementor-element-ec53d24 elementor-hidden-desktop elementor-hidden-laptop elementor-hidden-tablet elementor-widget elementor-widget-n-accordion">
                <div aria-label={t("accordionAriaLabel")} className="e-n-accordion">
                  <details className="e-n-accordion-item" open>
                    <summary aria-expanded="true" className="e-n-accordion-item-title" tabIndex={0}>
                      <span className="e-n-accordion-item-title-header">
                        <div className="e-n-accordion-item-title-text">{t("quickLinksHeading")}</div>
                      </span>
                      <span className="e-n-accordion-item-title-icon">
                        <span className="e-opened">
                          <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 12L6 12" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          </svg>
                        </span>
                        <span className="e-closed">
                          <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 6V18M18 12L6 12" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          </svg>
                        </span>
                      </span>
                    </summary>
                    <div className="elementor-element elementor-element-abaf0ac e-con-full e-flex e-con e-child" role="region">
                      <div className="elementor-element elementor-element-04eb21f elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list">
                        <FooterLinkItems items={quickLinks} />
                      </div>
                    </div>
                  </details>
                  <details className="e-n-accordion-item">
                    <summary aria-expanded="false" className="e-n-accordion-item-title" tabIndex={-1}>
                      <span className="e-n-accordion-item-title-header">
                        <div className="e-n-accordion-item-title-text">{t("productsHeading")}</div>
                      </span>
                      <span className="e-n-accordion-item-title-icon">
                        <span className="e-opened">
                          <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 12L6 12" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          </svg>
                        </span>
                        <span className="e-closed">
                          <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 6V18M18 12L6 12" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          </svg>
                        </span>
                      </span>
                    </summary>
                    <div className="elementor-element elementor-element-ca8d1fe e-con-full e-flex e-con e-child" role="region">
                      <div className="elementor-element elementor-element-999f567 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list">
                        <FooterLinkItems items={productLinks} />
                      </div>
                    </div>
                  </details>
                </div>
              </div>

              {/* Contact column — always visible on both mobile and desktop */}
              <div className="elementor-element elementor-element-ce70443 e-con-full e-flex e-con e-child">
                <div className="elementor-element elementor-element-3a74427 elementor-widget elementor-widget-heading">
                  <h3 className="elementor-heading-title elementor-size-default">{t("contactHeading")}</h3>
                </div>
                <div className="elementor-element elementor-element-5ce5e28 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list">
                  <ul className="elementor-icon-list-items">
                    <li className="elementor-icon-list-item">
                      <span className="elementor-icon-list-icon">
                        <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                          <path clipRule="evenodd" d="M12 5.25C9.30761 5.25 7.125 7.43261 7.125 10.125C7.125 12.8174 9.30761 15 12 15C14.6924 15 16.875 12.8174 16.875 10.125C16.875 7.43261 14.6924 5.25 12 5.25ZM8.625 10.125C8.625 8.26102 10.136 6.75 12 6.75C13.864 6.75 15.375 8.26102 15.375 10.125C15.375 11.989 13.864 13.5 12 13.5C10.136 13.5 8.625 11.989 8.625 10.125Z" fill="white" fillRule="evenodd" />
                          <path clipRule="evenodd" d="M18.6314 3.51965C14.9697 -0.173217 9.0303 -0.173217 5.36862 3.51965C1.71046 7.209 1.71046 13.188 5.36862 16.8773L11.4674 23.0281C11.6082 23.1701 11.8 23.25 12 23.25C12.2 23.25 12.3918 23.1701 12.5326 23.0281L18.6314 16.8773C22.2896 13.188 22.2896 7.209 18.6314 3.51965ZM6.43377 4.57579C9.50865 1.47473 14.4914 1.47473 17.5662 4.57579C20.6446 7.68041 20.6446 12.7165 17.5662 15.8212L12 21.4348L6.43377 15.8212C3.35541 12.7165 3.35541 7.68041 6.43377 4.57579Z" fill="white" fillRule="evenodd" />
                        </svg>
                      </span>
                      <span className="elementor-icon-list-text">{t("address")}</span>
                    </li>
                  </ul>
                </div>
                <div className="elementor-element elementor-element-dfdc8a4 elementor-icon-list--layout-inline elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list">
                  <ul className="elementor-icon-list-items elementor-inline-items">
                    <li className="elementor-icon-list-item elementor-inline-item">
                      <span className="elementor-icon-list-icon">
                        <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.2752 12.9901L18.2702 12.3826C17.8396 12.1233 17.3346 12.0157 16.8358 12.0769C16.3369 12.1381 15.8729 12.3645 15.5177 12.7201L14.9852 13.2601C14.8723 13.3731 14.7264 13.4471 14.5686 13.4714C14.4107 13.4957 14.2493 13.4689 14.1077 13.3951C12.6336 12.5808 11.4195 11.3667 10.6052 9.8926C10.5277 9.74935 10.499 9.58478 10.5234 9.42377C10.5477 9.26275 10.6238 9.11404 10.7402 9.0001L11.2802 8.4676C11.6358 8.11241 11.8622 7.64839 11.9234 7.14952C11.9846 6.65066 11.8769 6.14568 11.6177 5.7151L11.0102 4.7251C10.7193 4.23388 10.3189 3.81652 9.84014 3.50558C9.36137 3.19465 8.81724 2.99855 8.25019 2.9326C7.68518 2.86402 7.11197 2.92494 6.574 3.11076C6.03603 3.29658 5.54742 3.60242 5.14519 4.0051L4.87519 4.2751C3.73327 5.43776 3.04507 6.97066 2.93502 8.59659C2.82497 10.2225 3.30035 11.8342 4.27519 13.1401C6.14588 15.6371 8.36322 17.8544 10.8602 19.7251C12.1655 20.7014 13.7775 21.1777 15.4039 21.0676C17.0302 20.9576 18.5633 20.2684 19.7252 19.1251L19.9952 18.8551C20.3965 18.4502 20.7002 17.9592 20.8832 17.4193C21.0663 16.8795 21.1238 16.305 21.0515 15.7396C20.9792 15.1741 20.7789 14.6326 20.4659 14.1562C20.1529 13.6798 19.7354 13.281 19.2452 12.9901H19.2752ZM18.9377 17.7901L18.6677 18.0601C17.7623 18.951 16.5675 19.4878 15.3001 19.5731C14.0328 19.6584 12.7768 19.2866 11.7602 18.5251C9.37592 16.7409 7.25943 14.6244 5.47519 12.2401C4.71371 11.2234 4.34189 9.9675 4.42721 8.70015C4.51252 7.4328 5.04932 6.23802 5.94019 5.3326L6.20269 5.0626C6.62547 4.64327 7.19723 4.40863 7.79269 4.4101C7.88504 4.40265 7.97784 4.40265 8.07019 4.4101C8.41514 4.44946 8.7463 4.56812 9.03776 4.75678C9.32921 4.94545 9.57305 5.199 9.75019 5.4976L10.3502 6.5026C10.436 6.64587 10.4715 6.81368 10.4511 6.97942C10.4307 7.14517 10.3556 7.29938 10.2377 7.4176L9.70519 7.9501C9.36028 8.29317 9.13585 8.73878 9.06553 9.22015C8.99522 9.70152 9.08282 10.1927 9.31519 10.6201C10.2598 12.3447 11.6781 13.763 13.4027 14.7076C13.8301 14.94 14.3213 15.0276 14.8026 14.9573C15.284 14.8869 15.7296 14.6625 16.0727 14.3176L16.6052 13.7851C16.7234 13.6672 16.8776 13.592 17.0434 13.5717C17.2091 13.5513 17.3769 13.5868 17.5202 13.6726L18.5252 14.2726C18.818 14.4485 19.067 14.6887 19.2531 14.975C19.4393 15.2614 19.5579 15.5864 19.5998 15.9254C19.6417 16.2643 19.6059 16.6084 19.4951 16.9315C19.3843 17.2546 19.2014 17.5482 18.9602 17.7901H18.9377ZM15.0002 7.5001C15.398 7.5001 15.7795 7.65813 16.0609 7.93944C16.3422 8.22074 16.5002 8.60227 16.5002 9.0001C16.5002 9.19901 16.5792 9.38978 16.7199 9.53043C16.8605 9.67108 17.0513 9.7501 17.2502 9.7501C17.4491 9.7501 17.6399 9.67108 17.7805 9.53043C17.9212 9.38978 18.0002 9.19901 18.0002 9.0001C18.0002 8.20445 17.6841 7.44139 17.1215 6.87878C16.5589 6.31617 15.7958 6.0001 15.0002 6.0001C14.8013 6.0001 14.6105 6.07912 14.4699 6.21977C14.3292 6.36042 14.2502 6.55119 14.2502 6.7501C14.2502 6.94901 14.3292 7.13978 14.4699 7.28043C14.6105 7.42108 14.8013 7.5001 15.0002 7.5001Z" fill="white" />
                          <path d="M15 4.5C16.1935 4.5 17.3381 4.97411 18.182 5.81802C19.0259 6.66193 19.5 7.80653 19.5 9C19.5 9.19891 19.579 9.38968 19.7197 9.53033C19.8603 9.67098 20.0511 9.75 20.25 9.75C20.4489 9.75 20.6397 9.67098 20.7803 9.53033C20.921 9.38968 21 9.19891 21 9C21 7.4087 20.3679 5.88258 19.2426 4.75736C18.1174 3.63214 16.5913 3 15 3C14.8011 3 14.6103 3.07902 14.4697 3.21967C14.329 3.36032 14.25 3.55109 14.25 3.75C14.25 3.94891 14.329 4.13968 14.4697 4.28033C14.6103 4.42098 14.8011 4.5 15 4.5Z" fill="white" />
                        </svg>
                      </span>
                      <span className="elementor-icon-list-text">02033.668.838</span>
                    </li>
                    <li className="elementor-icon-list-item elementor-inline-item">
                      <span className="elementor-icon-list-icon">
                        <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.5552 17.2498C12.9541 17.2498 13.2775 16.9265 13.2775 16.5276C13.2775 16.1287 12.9541 15.8054 12.5552 15.8054C12.1563 15.8054 11.833 16.1287 11.833 16.5276C11.833 16.9265 12.1563 17.2498 12.5552 17.2498ZM15.4441 17.2498C15.843 17.2498 16.1663 16.9265 16.1663 16.5276C16.1663 16.1287 15.843 15.8054 15.4441 15.8054C15.0452 15.8054 14.7219 16.1287 14.7219 16.5276C14.7219 16.9265 15.0452 17.2498 15.4441 17.2498ZM19.0552 16.5276C19.0552 16.9265 18.7319 17.2498 18.333 17.2498C17.9341 17.2498 17.6108 16.9265 17.6108 16.5276C17.6108 16.1287 17.9341 15.8054 18.333 15.8054C18.7319 15.8054 19.0552 16.1287 19.0552 16.5276ZM13.2775 13.6387C13.2775 14.0376 12.9541 14.3609 12.5552 14.3609C12.1563 14.3609 11.833 14.0376 11.833 13.6387C11.833 13.2398 12.1563 12.9165 12.5552 12.9165C12.9541 12.9165 13.2775 13.2398 13.2775 13.6387ZM16.1663 13.6387C16.1663 14.0376 15.843 14.3609 15.4441 14.3609C15.0452 14.3609 14.7219 14.0376 14.7219 13.6387C14.7219 13.2398 15.0452 12.9165 15.4441 12.9165C15.843 12.9165 16.1663 13.2398 16.1663 13.6387ZM18.333 14.3609C18.7319 14.3609 19.0552 14.0376 19.0552 13.6387C19.0552 13.2398 18.7319 12.9165 18.333 12.9165C17.9341 12.9165 17.6108 13.2398 17.6108 13.6387C17.6108 14.0376 17.9341 14.3609 18.333 14.3609ZM12.5552 11.4721C12.9541 11.4721 13.2775 11.1487 13.2775 10.7498C13.2775 10.351 12.9541 10.0276 12.5552 10.0276C12.1563 10.0276 11.833 10.351 11.833 10.7498C11.833 11.1487 12.1563 11.4721 12.5552 11.4721ZM15.4441 11.4721C15.843 11.4721 16.1663 11.1487 16.1663 10.7498C16.1663 10.351 15.843 10.0276 15.4441 10.0276C15.0452 10.0276 14.7219 10.351 14.7219 10.7498C14.7219 11.1487 15.0452 11.4721 15.4441 11.4721ZM19.0552 10.7498C19.0552 11.1487 18.7319 11.4721 18.333 11.4721C17.9341 11.4721 17.6108 11.1487 17.6108 10.7498C17.6108 10.351 17.9341 10.0276 18.333 10.0276C18.7319 10.0276 19.0552 10.351 19.0552 10.7498ZM12.5552 6.4165C12.1563 6.4165 11.833 6.73984 11.833 7.13873C11.833 7.53761 12.1563 7.86095 12.5552 7.86095H18.333C18.7319 7.86095 19.0552 7.53761 19.0552 7.13873C19.0552 6.73984 18.7319 6.4165 18.333 6.4165H12.5552Z" fill="white" />
                        </svg>
                      </span>
                      <span className="elementor-icon-list-text">02033.669.966</span>
                    </li>
                  </ul>
                </div>
                <div className="elementor-element elementor-element-5eb8847 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list">
                  <ul className="elementor-icon-list-items">
                    <li className="elementor-icon-list-item">
                      <span className="elementor-icon-list-icon">
                        <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.75 21H17.25C18.2446 21 19.1984 20.6049 19.9016 19.9017C20.6049 19.1984 21 18.2446 21 17.25V9.75C21 8.75544 20.6049 7.80161 19.9016 7.09835C19.1984 6.39509 18.2446 6 17.25 6H6.75C5.75544 6 4.80161 6.39509 4.09835 7.09835C3.39509 7.80161 3 8.75544 3 9.75V17.25C3 18.2446 3.39509 19.1984 4.09835 19.9017C4.80161 20.6049 5.75544 21 6.75 21ZM19.5 17.25C19.5 17.8467 19.2629 18.419 18.841 18.841C18.419 19.2629 17.8467 19.5 17.25 19.5H6.75C6.15326 19.5 5.58097 19.2629 5.15901 18.841C4.73705 18.419 4.5 17.8467 4.5 17.25V9.75C4.5 9.705 4.5 9.66 4.5 9.615L10.38 14.4225C10.8359 14.7985 11.4091 15.0028 12 15C12.5837 15.0007 13.1492 14.7963 13.5975 14.4225L19.5 9.615C19.5 9.66 19.5 9.705 19.5 9.75V17.25ZM17.25 7.5C17.4325 7.50177 17.614 7.52697 17.79 7.575L17.94 7.62C18.0657 7.66476 18.1884 7.71736 18.3075 7.7775L18.4425 7.8525C18.5937 7.94745 18.7345 8.05806 18.8625 8.1825L12.645 13.2675C12.4617 13.4167 12.2326 13.4982 11.9963 13.4982C11.7599 13.4982 11.5308 13.4167 11.3475 13.2675L5.1375 8.1825C5.26553 8.05806 5.4063 7.94745 5.5575 7.8525L5.6925 7.7775C5.81158 7.71736 5.93432 7.66476 6.06 7.62L6.21 7.575C6.38604 7.52697 6.56753 7.50177 6.75 7.5H17.25Z" fill="white" />
                          <path d="M17.25 16.5H15.75C15.5511 16.5 15.3603 16.579 15.2197 16.7197C15.079 16.8603 15 17.0511 15 17.25C15 17.4489 15.079 17.6397 15.2197 17.7803C15.3603 17.921 15.5511 18 15.75 18H17.25C17.4489 18 17.6397 17.921 17.7803 17.7803C17.921 17.6397 18 17.4489 18 17.25C18 17.0511 17.921 16.8603 17.7803 16.7197C17.6397 16.579 17.4489 16.5 17.25 16.5Z" fill="white" />
                        </svg>
                      </span>
                      <span className="elementor-icon-list-text">office@letrongroup.com</span>
                    </li>
                    <li className="elementor-icon-list-item">
                      <span className="elementor-icon-list-icon">
                        <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.8827 12.3359L12.4644 16.87L8.04395 12.3359" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.30573" />
                          <path d="M12.4652 16.8703L12.4648 3.8418" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.30573" />
                          <path d="M9.59732 10.1187H6.53556C5.26164 10.1187 4.229 11.2892 4.229 12.7327V16.8406C4.229 18.2844 5.26164 19.4547 6.53556 19.4547H17.4648C18.7388 19.4547 19.7714 18.2844 19.7714 16.8406V12.7327C19.7714 11.2892 18.7388 10.1187 17.4648 10.1187H15.332" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.30573" />
                        </svg>
                      </span>
                      <span className="elementor-icon-list-text">{t("downloadProfile")}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
