"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});
  const [activeMegaMenu, setActiveMegaMenu] = useState<"company" | "product" | null>(null);

  const toggleSubMenu = (menuKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    setOpenSubMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };
  return (
    <header
      className="elementor elementor-29 elementor-location-header"
      data-elementor-id="29"
      data-elementor-post-type="elementor_library"
      data-elementor-type="header"
      onMouseLeave={() => setActiveMegaMenu(null)}
    >
      <div className="elementor-element elementor-element-d5b0006 e-flex e-con-boxed e-con e-parent" data-e-type="container" data-element_type="container" data-id="d5b0006" data-settings='{"position":"fixed"}'>
        <div className="e-con-inner">
          <div className="elementor-element elementor-element-44bd4a8 e-con-full e-flex e-con e-child" data-e-type="container" data-element_type="container" data-id="44bd4a8" data-settings='{"background_background":"classic"}'>
            
            {/* Logo */}
            <div className="elementor-element elementor-element-60f6e20 elementor-widget__width-initial elementor-widget elementor-widget-theme-site-logo elementor-widget-image" data-e-type="widget" data-element_type="widget" data-id="60f6e20" data-widget_type="theme-site-logo.default">
              <Link href="/">
                <img alt="LETRON Logo" className="attachment-full size-full wp-image-2648" height="57" src="/wp-content/uploads/2026/05/logo-letron-2-1.svg" width="100" />
              </Link>
            </div>

            {/* Navigation Menu */}
            <div className="elementor-element elementor-element-044b89b elementor-nav-menu__align-center elementor-widget__width-initial elementor-hidden-tablet elementor-hidden-mobile header-mega-wrap elementor-nav-menu--dropdown-tablet elementor-nav-menu__text-align-aside elementor-nav-menu--toggle elementor-nav-menu--burger elementor-widget elementor-widget-nav-menu" data-e-type="widget" data-element_type="widget" data-id="044b89b" data-settings='{"submenu_icon":{"value":"&lt;svg aria-hidden=\"true\" class=\"fa-svg-chevron-down e-font-icon-svg e-fas-chevron-down\" viewBox=\"0 0 448 512\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\"&gt;&lt;path d=\"M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z\"&gt;&lt;\/path&gt;&lt;\/svg&gt;","library":"fa-solid"},"layout":"horizontal","toggle":"burger"}' data-widget_type="nav-menu.default">
              <nav aria-label="Menu" className="elementor-nav-menu--main elementor-nav-menu__container elementor-nav-menu--layout-horizontal e--pointer-underline e--animation-fade">
                <ul className="elementor-nav-menu" id="menu-1-044b89b">
                  
                  <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-725">
                    <Link className="elementor-item" href="/gioi-thieu">
                      Giới thiệu
                    </Link>
                  </li>

                  <li
                    className="menu-company menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-260"
                    onMouseEnter={() => setActiveMegaMenu("company")}
                  >
                    <Link className="elementor-item" href="/cong-ty-thanh-vien">
                      Công ty thành viên
                    </Link>
                    <ul className="sub-menu elementor-nav-menu--dropdown">
                      <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-2718">
                        <a className="elementor-sub-item elementor-item-anchor" href="#">
                          Danh sách công ty thành viên
                        </a>
                      </li>
                    </ul>
                  </li>

                  <li
                    className="menu-product menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-425"
                    onMouseEnter={() => setActiveMegaMenu("product")}
                  >
                    <Link className="elementor-item" href="/san-pham">
                      Sản phẩm
                    </Link>
                    <ul className="sub-menu elementor-nav-menu--dropdown">
                      <li className="menu-item menu-item-type-post_type menu-item-object-san-pham menu-item-2786">
                        <Link className="elementor-sub-item" href="/san-pham/ledb-bo-nao-so-4">
                          LeDB — BỘ NÃO SỐ
                        </Link>
                      </li>
                      <li className="menu-item menu-item-type-post_type menu-item-object-san-pham menu-item-2787">
                        <Link className="elementor-sub-item" href="/san-pham/lesb-xay-dung-thong-minh">
                          LeSB — XÂY DỰNG THÔNG MINH
                        </Link>
                      </li>
                      <li className="menu-item menu-item-type-post_type menu-item-object-san-pham menu-item-2788">
                        <Link className="elementor-sub-item" href="/san-pham/lesm-di-chuyen-thong-minh-2">
                          LeSE — NĂNG LƯỢNG THÔNG MINH
                        </Link>
                      </li>
                      <li className="menu-item menu-item-type-post_type menu-item-object-san-pham menu-item-2789">
                        <Link className="elementor-sub-item" href="/san-pham/legm-vat-lieu-xanh">
                          LeGM — VẬT LIỆU XANH
                        </Link>
                      </li>
                      <li className="menu-item menu-item-type-post_type menu-item-object-san-pham menu-item-2790">
                        <Link className="elementor-sub-item" href="/san-pham/lesc-do-thi-thong-minh">
                          LeSC — ĐÔ THỊ THÔNG MINH
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li className="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-526">
                    <Link className="elementor-item" href="/blog">
                      Tin tức – Sự kiện
                    </Link>
                  </li>

                  <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-41">
                    <Link className="elementor-item" href="/tuyen-dung">
                      Tuyển dụng
                    </Link>
                  </li>

                  <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-39">
                    <Link className="elementor-item" href="/lien-he">
                      Liên hệ
                    </Link>
                  </li>

                </ul>
              </nav>
              
              {/* Mobile menu toggle */}
              <div 
                aria-expanded={isMobileMenuOpen} 
                aria-label="Menu Toggle" 
                className={`elementor-menu-toggle ${isMobileMenuOpen ? 'elementor-active' : ''}`} 
                role="button" 
                tabIndex={0}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg aria-hidden="true" className="elementor-menu-toggle__icon--open e-font-icon-svg e-eicon-menu-bar" role="presentation" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                  <path d="M104 333H896C929 333 958 304 958 271S929 208 896 208H104C71 208 42 237 42 271S71 333 104 333ZM104 583H896C929 583 958 554 958 521S929 458 896 458H104C71 458 42 487 42 521S71 583 104 583ZM104 833H896C929 833 958 804 958 771S929 708 896 708H104C71 708 42 737 42 771S71 833 104 833Z"></path>
                </svg>
                <svg aria-hidden="true" className="elementor-menu-toggle__icon--close e-font-icon-svg e-eicon-close" role="presentation" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                  <path d="M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z"></path>
                </svg>
              </div>

              {/* Mobile menu dropdown */}
              <nav 
                aria-hidden={!isMobileMenuOpen} 
                className={`elementor-nav-menu--dropdown elementor-nav-menu__container ${isMobileMenuOpen ? 'elementor-active' : ''}`}
                style={{ display: isMobileMenuOpen ? 'block' : 'none' }}
              >
                <ul className="elementor-nav-menu" id="menu-2-044b89b">
                  <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-725">
                    <Link className="elementor-item" href="/gioi-thieu" tabIndex={-1}>
                      Giới thiệu
                    </Link>
                  </li>
                  <li className={`menu-company menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-260 ${openSubMenus['company'] ? 'elementor-active' : ''}`}>
                    <div className="elementor-menu-item-wrapper">
                      <Link className="elementor-item" href="/cong-ty-thanh-vien" tabIndex={-1}>
                        Công ty thành viên
                      </Link>
                      <span className="sub-arrow" onClick={(e) => toggleSubMenu('company', e)} style={{ cursor: 'pointer' }}>
                        <svg aria-hidden="true" className="fa-svg-chevron-down e-font-icon-svg e-fas-chevron-down" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                          <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
                        </svg>
                      </span>
                    </div>
                    <ul className={`sub-menu elementor-nav-menu--dropdown ${openSubMenus['company'] ? 'elementor-active' : ''}`} style={{ display: openSubMenus['company'] ? 'block' : 'none' }}>
                      <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-2718">
                        <a className="elementor-sub-item elementor-item-anchor" href="#" tabIndex={-1}>
                          Danh sách công ty thành viên
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className={`menu-product menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-425 ${openSubMenus['product'] ? 'elementor-active' : ''}`}>
                    <div className="elementor-menu-item-wrapper">
                      <Link className="elementor-item" href="/san-pham" tabIndex={-1}>
                        Sản phẩm
                      </Link>
                      <span className="sub-arrow" onClick={(e) => toggleSubMenu('product', e)} style={{ cursor: 'pointer' }}>
                        <svg aria-hidden="true" className="fa-svg-chevron-down e-font-icon-svg e-fas-chevron-down" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                          <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
                        </svg>
                      </span>
                    </div>
                    <ul className={`sub-menu elementor-nav-menu--dropdown ${openSubMenus['product'] ? 'elementor-active' : ''}`} style={{ display: openSubMenus['product'] ? 'block' : 'none' }}>
                      <li className="menu-item menu-item-type-post_type menu-item-object-san-pham menu-item-2786">
                        <Link className="elementor-sub-item" href="/san-pham/ledb-bo-nao-so-4" tabIndex={-1}>
                          LeDB — BỘ NÃO SỐ
                        </Link>
                      </li>
                      <li className="menu-item menu-item-type-post_type menu-item-object-san-pham menu-item-2787">
                        <Link className="elementor-sub-item" href="/san-pham/lesb-xay-dung-thong-minh" tabIndex={-1}>
                          LeSB — XÂY DỰNG THÔNG MINH
                        </Link>
                      </li>
                      <li className="menu-item menu-item-type-post_type menu-item-object-san-pham menu-item-2788">
                        <Link className="elementor-sub-item" href="/san-pham/lesm-di-chuyen-thong-minh-2" tabIndex={-1}>
                          LeSE — NĂNG LƯỢNG THÔNG MINH
                        </Link>
                      </li>
                      <li className="menu-item menu-item-type-post_type menu-item-object-san-pham menu-item-2789">
                        <Link className="elementor-sub-item" href="/san-pham/legm-vat-lieu-xanh" tabIndex={-1}>
                          LeGM — VẬT LIỆU XANH
                        </Link>
                      </li>
                      <li className="menu-item menu-item-type-post_type menu-item-object-san-pham menu-item-2790">
                        <Link className="elementor-sub-item" href="/san-pham/lesc-do-thi-thong-minh" tabIndex={-1}>
                          LeSC — ĐÔ THỊ THÔNG MINH
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-526">
                    <Link className="elementor-item" href="/blog" tabIndex={-1}>
                      Tin tức – Sự kiện
                    </Link>
                  </li>
                  <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-41">
                    <Link className="elementor-item" href="/tuyen-dung" tabIndex={-1}>
                      Tuyển dụng
                    </Link>
                  </li>
                  <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-39">
                    <Link className="elementor-item" href="/lien-he" tabIndex={-1}>
                      Liên hệ
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Search Box / Bar */}
            <div className="elementor-element elementor-element-b600278 e-con-full e-flex e-con e-child" data-e-type="container" data-element_type="container" data-id="b600278">
              <div className="elementor-element elementor-element-3e7e8dd elementor-hidden-mobile elementor-widget elementor-widget-search" data-e-type="widget" data-element_type="widget" data-id="3e7e8dd" data-settings='{"submit_trigger":"click_submit","pagination_type_options":"none"}' data-widget_type="search.default">
                <search className="e-search" role="search">
                  <form 
                    action="/" 
                    className="e-search-form" 
                    method="get"
                    onSubmit={(e) => {
                      if (!searchQuery.trim()) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <label className="e-search-label" htmlFor="search-3e7e8dd">
                      <span className="elementor-screen-only">Tìm kiếm</span>
                    </label>
                    <div className="e-search-input-wrapper">
                      <input 
                        aria-autocomplete="list" 
                        aria-controls="results-3e7e8dd" 
                        aria-expanded="false" 
                        aria-haspopup="listbox" 
                        autoComplete="off" 
                        className="e-search-input" 
                        id="search-3e7e8dd" 
                        name="s" 
                        placeholder="Tìm kiếm ..." 
                        role="combobox" 
                        type="search" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          paddingLeft: '21px',
                          paddingRight: searchQuery ? '37px' : '21px',
                          outline: 'none',
                        }}
                      />
                      <svg 
                        aria-hidden="true" 
                        className="e-font-icon-svg e-fas-times" 
                        viewBox="0 0 352 512" 
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => {
                          setSearchQuery("");
                        }}
                        style={{ 
                          cursor: "pointer",
                          display: searchQuery ? "block" : "none"
                        }}
                      >
                        <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
                      </svg>
                      <output 
                        aria-atomic="true" 
                        aria-label="Results for search" 
                        aria-live="polite" 
                        className="e-search-results-container hide-loader" 
                        id="results-3e7e8dd" 
                        tabIndex={0}
                        style={{ display: searchQuery ? 'block' : 'none' }}
                      >
                        <div className="e-search-results"></div>
                      </output>
                    </div>
                    <button aria-label="Tìm kiếm" className="e-search-submit" type="submit">
                      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 15.7661L19.5373 17.3034C20.1542 17.9203 20.1542 18.9204 19.5373 19.5373C18.9204 20.1542 17.9203 20.1542 17.3034 19.5373L15.766 18M4 10.8C4 7.04446 7.04446 4 10.8 4C14.5555 4 17.6 7.04446 17.6 10.8C17.6 14.5555 14.5555 17.6 10.8 17.6C7.04446 17.6 4 14.5555 4 10.8Z" stroke="white" strokeLinecap="round" strokeWidth="1.5"></path>
                      </svg>
                    </button>
                    <input name="e_search_props" type="hidden" defaultValue="3e7e8dd-29" />
                  </form>
                </search>
              </div>
            </div>
              <div className="elementor-element elementor-element-e1fe479 elementor-hidden-desktop elementor-hidden-laptop elementor-widget-mobile__width-inherit elementor-view-default elementor-widget elementor-widget-icon" data-e-type="widget" data-element_type="widget" data-id="e1fe479" data-widget_type="icon.default">
                <div className="elementor-icon-wrapper">
                  <a className="elementor-icon" href="#elementor-action%3Aaction%3Dpopup%3Aopen%26settings%3DeyJpZCI6IjIzNzciLCJ0b2dnbGUiOmZhbHNlfQ%3D%3D">
                    <svg aria-hidden="true" className="e-font-icon-svg e-fas-bars" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

        {/* Mega Menu Cat Content */}
        <div
          className={`elementor-element elementor-element-485d712 e-con-full mega-menu-cat-content elementor-hidden-tablet elementor-hidden-mobile e-flex e-con e-child ${activeMegaMenu === "company" ? "active" : ""}`}
          data-e-type="container"
          data-element_type="container"
          data-id="485d712"
          data-settings='{"background_background":"classic"}'
          onMouseEnter={() => setActiveMegaMenu("company")}
        >
          
          <div className="elementor-element elementor-element-e939a3d menu-item-cty elementor-view-default elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-e-type="widget" data-element_type="widget" data-id="e939a3d" data-widget_type="icon-box.default">
            <div className="elementor-icon-box-wrapper">
              <div className="elementor-icon-box-icon">
                <span className="elementor-icon elementor-animation-rotate">
                  <svg fill="none" height="111" viewBox="0 0 420 111" width="420" xmlns="http://www.w3.org/2000/svg">
                    <path d="M294.388 6.03697L299.133 10.7322C302.444 14.0139 304.312 18.4784 304.312 23.1448V88.4964C304.312 93.0979 302.494 97.5119 299.263 100.779L294.727 105.366C291.445 108.684 286.98 110.545 282.314 110.545H203.36V0.988281H282.105C286.706 0.988281 291.12 2.7986 294.388 6.03697ZM226.367 87.3857H278.333L280.684 85.0345V26.1884L278.65 24.1545H226.367V87.3857Z" fill="#6FCBDC"></path>
                    <path d="M111.764 77.129H174.209C177.252 77.129 180.108 75.9606 182.272 73.7969C184.414 71.6548 185.604 68.7987 185.604 65.7334L185.583 35.9317C185.583 29.6497 180.469 24.5361 174.187 24.5361H103.477C97.1946 24.5361 92.0811 29.6497 92.0811 35.9317V98.6652C92.0811 104.947 97.1946 110.061 103.477 110.061H174.209C180.491 110.061 185.604 104.947 185.604 98.6652V90.2195H111.764V77.129ZM111.764 44.3775H165.871V57.3093H111.764V44.3775Z" fill="#FAAF4D"></path>
                    <path d="M78.9109 91.5687V110.494L27.7461 110.545C21.4785 110.545 15.3264 108.395 10.4363 104.472C3.88027 99.1923 0.0937648 91.3523 0.0937648 82.9427L0 0H20.952L21.0746 83.0653C21.0746 85.669 22.2286 88.1068 24.2337 89.7224C25.7555 90.9485 27.6812 91.6481 29.6574 91.6481L78.9109 91.5687Z" fill="#FAAF4D"></path>
                    <path d="M408.374 8.14983L408.612 8.38785C413.199 12.9749 415.774 19.1921 415.774 25.676V33.9053C415.774 40.3893 413.199 46.6064 408.612 51.1935L408.417 51.3882L412.838 55.8094C417.425 60.3965 420 66.6136 420 73.0976V86.1015C420 92.6288 417.389 98.8892 412.745 103.483C408.165 108.013 401.991 110.552 395.55 110.552H319.358V0.995132H391.086C397.57 0.98792 403.787 3.56274 408.374 8.14983ZM342.366 44.0244H390.256L392.608 41.6731V26.491L390.256 24.1398H342.366V44.0244ZM342.366 87.3854H394.331L396.683 85.0341V69.5347L394.649 67.5008H342.373V87.3854H342.366Z" fill="#6FCBDC"></path>
                  </svg>
                </span>
              </div>
              <div className="elementor-icon-box-content">
                <p className="elementor-icon-box-description">Bộ não Số</p>
              </div>
            </div>
          </div>

          <div className="elementor-element elementor-element-03fe06e menu-item-cty elementor-view-default elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-e-type="widget" data-element_type="widget" data-id="03fe06e" data-widget_type="icon-box.default">
            <div className="elementor-icon-box-wrapper">
              <div className="elementor-icon-box-icon">
                <span className="elementor-icon elementor-animation-rotate">
                  <svg fill="none" height="109" viewBox="0 0 420 109" width="420" xmlns="http://www.w3.org/2000/svg">
                    <path d="M276.158 86.224L278.78 83.4462V68.7971L276.464 66.3319H227.032C220.489 66.3319 214.216 63.6962 209.641 59.0216L209.257 58.6309C204.803 54.0841 202.309 47.9673 202.309 41.5947V25.3045C202.309 18.8964 204.838 12.7441 209.349 8.18313C213.925 3.55822 220.155 0.958008 226.656 0.958008H303.446L292.037 23.6208H227.593L225.277 26.086V41.0406L227.593 43.5058H277.174C283.632 43.5058 289.827 46.0704 294.388 50.6385L294.615 50.8658C299.184 55.4339 301.748 61.6218 301.748 68.0796V84.3698C301.748 90.8702 299.148 97.1007 294.523 101.676L294.367 101.832C289.806 106.343 283.653 108.873 277.245 108.873H200.306L211.715 86.2098H276.158V86.224Z" fill="#F78E20"></path>
                    <path d="M419.843 0.96582L408.739 23.6286H341.525V43.5207H384.073V66.3397H341.525V86.2318H408.895L420 108.895H330.727C324.177 108.895 318.87 103.588 318.87 97.0375V12.83C318.87 6.27986 324.177 0.972932 330.727 0.972932H419.843V0.96582Z" fill="#F78E20"></path>
                    <path d="M110.089 75.9746H171.598C174.596 75.9746 177.409 74.8237 179.541 72.6924C181.651 70.5824 182.823 67.7691 182.823 64.7498L182.801 35.3947C182.801 29.2069 177.765 24.1699 171.577 24.1699H101.926C95.7381 24.1699 90.7012 29.2069 90.7012 35.3947V97.188C90.7012 103.376 95.7381 108.413 101.926 108.413H171.598C177.786 108.413 182.823 103.376 182.823 97.188V88.8618H110.089V75.9746ZM110.089 43.7068H163.385V56.4448H110.089V43.7068Z" fill="#FAAF4D"></path>
                    <path d="M77.7283 90.1964V108.838L27.3303 108.888C21.1567 108.888 15.0967 106.771 10.2799 102.906C3.82212 97.7056 0.0923596 89.9832 0.0923596 81.6996L0 0H20.638L20.7588 81.8204C20.7588 84.385 21.8955 86.7863 23.8705 88.3777C25.3695 89.5854 27.2664 90.2745 29.2129 90.2745L77.7283 90.1964Z" fill="#FAAF4D"></path>
                  </svg>
                </span>
              </div>
              <div className="elementor-icon-box-content">
                <p className="elementor-icon-box-description">Năng lượng Thông minh</p>
              </div>
            </div>
          </div>

          <div className="elementor-element elementor-element-c69c303 menu-item-cty elementor-view-default elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-e-type="widget" data-element_type="widget" data-id="c69c303" data-widget_type="icon-box.default">
            <div className="elementor-icon-box-wrapper">
              <div className="elementor-icon-box-icon">
                <span className="elementor-icon elementor-animation-rotate">
                  <svg fill="none" height="102" viewBox="0 0 420 102" width="420" xmlns="http://www.w3.org/2000/svg">
                    <path d="M193.756 7.60324C198.041 3.31746 203.853 0.90918 209.917 0.90918H281.216L270.847 22.0727H210.527L208.225 24.3748V78.2191L210.527 80.3819H256.019L258.321 78.2191V61.9517H225.355L225.766 40.7882H269.719C275.351 40.7882 279.916 45.3526 279.916 50.9852V78.6105C279.916 84.6278 277.541 90.4064 273.308 94.6855L273.096 94.9044C268.803 99.2433 262.952 101.685 256.848 101.685H210.063C203.919 101.685 198.028 99.2101 193.729 94.8182L193.583 94.6722C189.403 90.3997 187.062 84.661 187.062 78.6835V23.7645C187.055 17.7007 189.463 11.889 193.756 7.60324Z" fill="#298C43"></path>
                    <path d="M318.415 0.90918H337.914C343.838 0.90918 349.524 3.21794 353.77 7.35113L357.803 11.2786L361.837 7.35113C366.083 3.22458 371.769 0.90918 377.693 0.90918H397.264C403.335 0.90918 409.153 3.33738 413.426 7.65633C417.638 11.9156 420 17.6609 420 23.6451V101.691H398.837V24.3748L396.535 22.2121H374.94L368.604 28.5478V101.685H347.295V28.4085C346.24 27.3536 345.251 26.3187 344.342 25.3103C343.427 24.3019 342.398 23.2736 341.244 22.2121H319.072L316.77 24.3748V101.685H295.606V23.7114C295.606 17.6808 298.001 11.9023 302.267 7.6364L302.34 7.56344C306.606 3.30419 312.385 0.90918 318.415 0.90918Z" fill="#298C43"></path>
                    <path d="M102.805 70.9469H160.239C163.038 70.9469 165.665 69.8721 167.656 67.8818C169.626 65.9114 170.721 63.2842 170.721 60.4646L170.701 33.0516C170.701 27.2731 165.997 22.5693 160.219 22.5693H95.1756C89.3971 22.5693 84.6934 27.2731 84.6934 33.0516V90.757C84.6934 96.5355 89.3971 101.239 95.1756 101.239H160.239C166.017 101.239 170.721 96.5355 170.721 90.757V82.9882H102.805V70.9469ZM102.805 40.8204H152.576V52.7158H102.805V40.8204Z" fill="#FAAF4D"></path>
                    <path d="M72.5863 84.2295V101.638L25.5223 101.684C19.757 101.684 14.098 99.7074 9.59988 96.0984C3.56927 91.242 0.0862496 84.0305 0.0862496 76.2948L0 0H19.2727L19.3855 76.4076C19.3855 78.8026 20.447 81.045 22.2914 82.5311C23.6912 83.659 25.4626 84.3025 27.2804 84.3025L72.5863 84.2295Z" fill="#FAAF4D"></path>
                  </svg>
                </span>
              </div>
              <div className="elementor-icon-box-content">
                <p className="elementor-icon-box-description">Vật liệu Xanh</p>
              </div>
            </div>
          </div>

          <div className="elementor-element elementor-element-869607c menu-item-cty elementor-view-default elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-e-type="widget" data-element_type="widget" data-id="869607c" data-widget_type="icon-box.default">
            <div className="elementor-icon-box-wrapper">
              <div className="elementor-icon-box-icon">
                <span className="elementor-icon elementor-animation-rotate">
                  <svg fill="none" height="112" viewBox="0 0 420 112" width="420" xmlns="http://www.w3.org/2000/svg">
                    <path d="M112.743 77.8048H175.735C178.806 77.8048 181.687 76.6262 183.869 74.4435C186.03 72.2826 187.231 69.4015 187.231 66.3093L187.209 36.2465C187.209 29.9094 182.05 24.751 175.713 24.751H104.383C98.0461 24.751 92.8877 29.9094 92.8877 36.2465V99.5298C92.8877 105.867 98.0461 111.025 104.383 111.025H175.735C182.072 111.025 187.231 105.867 187.231 99.5298V91.01H112.743V77.8048ZM112.743 44.7662H167.325V57.8114H112.743V44.7662Z" fill="#FAAF4D"></path>
                    <path d="M79.6026 92.3713V111.463L27.9893 111.514C21.6668 111.514 15.4607 109.345 10.5278 105.387C3.91429 100.062 0.0945867 92.1531 0.0945867 83.6697L0 0H21.1357L21.2594 83.7934C21.2594 86.4199 22.4235 88.879 24.4461 90.5088C25.9813 91.7456 27.9239 92.4514 29.9174 92.4514L79.6026 92.3713Z" fill="#FAAF4D"></path>
                    <path d="M275.957 88.3045L278.642 85.4597V70.4574L276.27 67.9327H225.646C218.945 67.9327 212.521 65.2335 207.836 60.4461L207.443 60.0459C202.881 55.3895 200.327 49.1252 200.327 42.599V25.916C200.327 19.3534 202.917 13.0527 207.537 8.38176C212.223 3.64533 218.603 0.982422 225.261 0.982422H303.903L292.218 24.199H226.221L223.849 26.7236V42.0388L226.221 44.5634H276.998C283.611 44.5634 289.956 47.1899 294.626 51.8681L294.859 52.101C299.538 56.7792 302.164 63.1163 302.164 69.7298V86.4128C302.164 93.07 299.501 99.4508 294.765 104.136L294.605 104.296C289.934 108.916 283.633 111.506 277.07 111.506H198.275L209.96 88.2972H275.957V88.3045Z" fill="#038181"></path>
                    <path d="M321.568 10.3899L325.671 6.28646C329.054 2.89602 333.653 0.99707 338.44 0.99707H419.847L408.322 24.2063H342.325L339.8 26.7309V85.7799L342.325 88.3046H408.635L420 111.514H338.76C333.973 111.514 329.374 109.608 325.991 106.224L321.568 101.801C318.185 98.4177 316.278 93.8195 316.278 89.0321V23.1586C316.278 18.3713 318.185 13.773 321.568 10.3899Z" fill="#038181"></path>
                  </svg>
                </span>
              </div>
              <div className="elementor-icon-box-content">
                <p className="elementor-icon-box-description">Đô thị Thông minh</p>
              </div>
            </div>
          </div>

          <div className="elementor-element elementor-element-cbdd47e menu-item-cty elementor-view-default elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-e-type="widget" data-element_type="widget" data-id="cbdd47e" data-widget_type="icon-box.default">
            <div className="elementor-icon-box-wrapper">
              <div className="elementor-icon-box-icon">
                <span className="elementor-icon elementor-animation-rotate">
                  <svg fill="none" height="102" viewBox="0 0 420 102" width="420" xmlns="http://www.w3.org/2000/svg">
                    <path d="M256.573 80.1097L259.008 77.5289V63.9188L256.857 61.6284H206.535C203.268 61.6284 200.139 60.3149 197.849 57.9784L191.426 51.4241C189.202 49.1536 187.955 46.0976 187.955 42.9227V19.2205C187.955 16.0193 189.215 12.9501 191.466 10.673L197.565 4.50816C199.849 2.198 202.957 0.904297 206.205 0.904297H281.919L271.318 21.9597H211.446L209.294 24.2501V38.144L211.446 40.4344H261.84C265.061 40.4344 268.157 41.7149 270.434 43.992L276.777 50.3351C279.054 52.6122 280.334 55.7078 280.334 58.9288V82.7697C280.334 86.0171 279.034 89.1259 276.731 91.4097L270.427 97.6471C268.15 99.8978 265.081 101.159 261.88 101.159H186.106L196.707 80.1031H256.573V80.1031Z" fill="#7DC35A"></path>
                    <path d="M314.439 0.448242H342.748C345.811 0.448242 348.748 1.64291 350.946 3.77485L358.12 10.7581L365.295 3.77485C367.486 1.64291 370.43 0.448242 373.493 0.448242H401.914C405.056 0.448242 408.066 1.70235 410.271 3.9333L416.6 10.3291C418.779 12.5271 420 15.5039 420 18.5995V100.709H398.944V23.794L396.654 21.6423H375.169L368.866 27.9457V100.709H347.665V27.8071C346.616 26.7576 345.632 25.728 344.728 24.7247C343.817 23.7214 342.794 22.6983 341.646 21.6423H319.587L317.297 23.794V100.709H296.241V18.6391C296.241 15.5237 297.482 12.5337 299.687 10.3291L306.122 3.8937C308.333 1.68915 311.323 0.448242 314.439 0.448242Z" fill="#7DC35A"></path>
                    <path d="M102.281 70.5855H159.428C162.213 70.5855 164.827 69.5163 166.807 67.5361C168.767 65.5758 169.856 62.962 169.856 60.1568L169.837 32.8838C169.837 27.1348 165.157 22.4551 159.408 22.4551H94.6904C88.9414 22.4551 84.2617 27.1348 84.2617 32.8838V90.2945C84.2617 96.0435 88.9414 100.723 94.6904 100.723H159.421C165.17 100.723 169.85 96.0435 169.85 90.2945V82.5653H102.281V70.5855ZM102.281 40.6129H151.798V52.4475H102.281V40.6129Z" fill="#FAAF4D"></path>
                    <path d="M72.2155 83.7993V101.119L25.3919 101.165C19.6561 101.165 14.026 99.1981 9.55085 95.6075C3.55104 90.776 0.0858091 83.6013 0.0858091 75.9052L0 0H19.1743L19.2865 76.0174C19.2865 78.4001 20.3426 80.6311 22.1775 82.1096C23.5702 83.2317 25.3325 83.8719 27.141 83.8719L72.2155 83.7993Z" fill="#FAAF4D"></path>
                  </svg>
                </span>
              </div>
              <div className="elementor-icon-box-content">
                <p className="elementor-icon-box-description">Di chuyển Thông minh</p>
              </div>
            </div>
          </div>

          <div className="elementor-element elementor-element-1926ead menu-item-cty elementor-view-default elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-e-type="widget" data-element_type="widget" data-id="1926ead" data-widget_type="icon-box.default">
            <div className="elementor-icon-box-wrapper">
              <div className="elementor-icon-box-icon">
                <span className="elementor-icon elementor-animation-rotate">
                  <svg fill="none" height="110" viewBox="0 0 420 110" width="420" xmlns="http://www.w3.org/2000/svg">
                    <path d="M408.493 8.05976L408.729 8.29534C413.269 12.8353 415.817 18.9886 415.817 25.406V33.5509C415.817 39.9683 413.269 46.1215 408.729 50.6615L408.536 50.8543L412.912 55.2301C417.452 59.7701 420 65.9233 420 72.3407V85.2112C420 91.6714 417.416 97.8675 412.819 102.415C408.286 106.898 402.176 109.41 395.801 109.41H320.392V0.978516H391.383C397.8 0.978516 403.96 3.5269 408.493 8.05976ZM343.163 43.5731H390.562L392.889 41.246V26.2198L390.562 23.8926H343.163V43.5731ZM343.163 86.4818H394.595L396.922 84.1547V68.8144L394.909 66.8013H343.17V86.4818H343.163Z" fill="#6E6F6F"></path>
                    <path d="M277.483 86.6376L280.117 83.8464V69.1271L277.79 66.6501H228.128C221.554 66.6501 215.25 64.0018 210.653 59.3047L210.268 58.9121C205.792 54.3436 203.286 48.1975 203.286 41.7943V25.4261C203.286 18.9873 205.828 12.8054 210.361 8.2226C214.958 3.57552 221.218 0.962891 227.75 0.962891H304.908L293.444 23.7343H228.692L226.365 26.2113V41.2518L228.692 43.7288H278.511C284.999 43.7288 291.224 46.3058 295.807 50.8958L296.035 51.1242C300.625 55.7142 303.202 61.9317 303.202 68.4204V84.7959C303.202 91.3275 300.59 97.5878 295.942 102.185L295.785 102.342C291.203 106.875 285.021 109.416 278.582 109.416H201.273L212.738 86.6447H277.483V86.6376Z" fill="#6E6F6F"></path>
                    <path d="M110.616 76.3372H172.42C175.433 76.3372 178.259 75.1808 180.401 73.0392C182.521 70.9192 183.699 68.0923 183.699 65.0585L183.678 35.5628C183.678 29.3453 178.616 24.2842 172.399 24.2842H102.414C96.1968 24.2842 91.1357 29.3453 91.1357 35.5628V97.6523C91.1357 103.87 96.1968 108.931 102.414 108.931H172.42C178.638 108.931 183.699 103.87 183.699 97.6523V89.2933H110.616V76.3372ZM110.616 43.9218H164.168V56.7209H110.616V43.9218Z" fill="#FAAF4D"></path>
                    <path d="M78.1009 90.6286V109.36L27.4613 109.41C21.2581 109.41 15.169 107.282 10.3292 103.399C3.84044 98.1739 0.0928022 90.4145 0.0928022 82.0912L0 0H20.7369L20.8583 82.2125C20.8583 84.7895 22.0004 87.2022 23.9849 88.8012C25.4911 90.0147 27.397 90.7072 29.353 90.7072L78.1009 90.6286Z" fill="#FAAF4D"></path>
                  </svg>
                </span>
              </div>
              <div className="elementor-icon-box-content">
                <p className="elementor-icon-box-description">Xây dựng Thông Minh</p>
              </div>
            </div>
          </div>

        </div>

        {/* Mega Menu Product Content */}
        <div
          className={`elementor-element elementor-element-b865789 e-con-full elementor-hidden-tablet elementor-hidden-mobile mega-menu-product-content e-flex e-con e-child ${activeMegaMenu === "product" ? "active" : ""}`}
          data-e-type="container"
          data-element_type="container"
          data-id="b865789"
          data-settings='{"background_background":"classic"}'
          onMouseEnter={() => setActiveMegaMenu("product")}
        >
          <div className="elementor-element elementor-element-36a7743 e-con-full elementor-hidden-tablet elementor-hidden-mobile e-flex e-con e-child" data-e-type="container" data-element_type="container" data-id="36a7743">
            
            <div className="elementor-element elementor-element-94ced1f header-box-product elementor-widget__width-initial elementor-position-top elementor-widget elementor-widget-image-box" data-e-type="widget" data-element_type="widget" data-id="94ced1f" data-widget_type="image-box.default">
              <div className="elementor-image-box-wrapper">
                <figure className="elementor-image-box-img">
                  <Link href="/san-pham/lesc-do-thi-thong-minh" tabIndex={-1}>
                    <img alt="" className="attachment-full size-full wp-image-2749" fetchPriority="high" height="190" src="/wp-content/uploads/2026/04/img-11.jpg" width="304" />
                  </Link>
                </figure>
                <div className="elementor-image-box-content">
                  <h3 className="elementor-image-box-title">
                    <Link href="/san-pham/lesc-do-thi-thong-minh">
                      <span>Le</span>SC<span className="text">Đô thị Thông minh</span>
                    </Link>
                  </h3>
                  <ul>
                    <li>Le-ESCity ( Đô thị Sinh thái Thông minh)</li>
                    <li>Le-EIParks (Khu Công nghiệp Sinh thái Net Zero)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="elementor-element elementor-element-3d72257 header-box-product elementor-widget__width-initial elementor-position-top elementor-widget elementor-widget-image-box" data-e-type="widget" data-element_type="widget" data-id="3d72257" data-widget_type="image-box.default">
              <div className="elementor-image-box-wrapper">
                <figure className="elementor-image-box-img">
                  <Link href="/san-pham/lesm-di-chuyen-thong-minh" tabIndex={-1}>
                    <img alt="" className="attachment-full size-full wp-image-2766" height="190" src="/wp-content/uploads/2026/04/img-13.jpg" width="304" />
                  </Link>
                </figure>
                <div className="elementor-image-box-content">
                  <h3 className="elementor-image-box-title">
                    <Link href="/san-pham/lesm-di-chuyen-thong-minh">
                      <span>Le</span>SM<span className="text">Di chuyển Thông minh</span>
                    </Link>
                  </h3>
                  <ul>
                    <li>Le-GreenMobility (Vận tải xanh)</li>
                    <li>Le-GreenLogistics (Logistics Xanh)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="elementor-element elementor-element-754c09a header-box-product elementor-widget__width-initial elementor-position-top elementor-widget elementor-widget-image-box" data-e-type="widget" data-element_type="widget" data-id="754c09a" data-widget_type="image-box.default">
              <div className="elementor-image-box-wrapper">
                <figure className="elementor-image-box-img">
                  <Link href="/san-pham/ledb-bo-nao-so" tabIndex={-1}>
                    <img alt="" className="attachment-full size-full wp-image-2767" height="190" loading="lazy" src="/wp-content/uploads/2026/04/img-14.jpg" width="304" />
                  </Link>
                </figure>
                <div className="elementor-image-box-content">
                  <h3 className="elementor-image-box-title">
                    <Link href="/san-pham/ledb-bo-nao-so">
                      <span>Le</span>DB<span className="text">Bộ não Số</span>
                    </Link>
                  </h3>
                  <ul>
                    <li>LeTRON (Hệ điều hành ALL IN ONE)</li>
                    <li>LeLe AGI (Trợ lý ảo)</li>
                    <li>Le-CarbonRegistry (Tín chỉ Carbon)</li>
                    <li>Le-BatteryPassport (Hộ chiếu Pin)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="elementor-element elementor-element-2c89331 header-box-product elementor-widget__width-initial elementor-position-top elementor-widget elementor-widget-image-box" data-e-type="widget" data-element_type="widget" data-id="2c89331" data-widget_type="image-box.default">
              <div className="elementor-image-box-wrapper">
                <figure className="elementor-image-box-img">
                  <Link href="/san-pham/lese-nang-luong-thong-minh" tabIndex={-1}>
                    <img alt="" className="attachment-full size-full wp-image-2768" height="190" loading="lazy" src="/wp-content/uploads/2026/04/img-15.jpg" width="304" />
                  </Link>
                </figure>
                <div className="elementor-image-box-content">
                  <h3 className="elementor-image-box-title">
                    <Link href="/san-pham/lese-nang-luong-thong-minh">
                      <span>Le</span>SE<span className="text">Năng lượng Thông minh</span>
                    </Link>
                  </h3>
                  <ul>
                    <li>Le-SwapStation (Hạ tầng Trạm sạc)</li>
                    <li>Le-ChargeHub (Trạm thay Pin tự động)</li>
                    <li>Le-SolarFarm (Hạ tầng điện mặt trời Solar)</li>
                    <li>Le-BESS (Hệ thống lưu trữ BESS)</li>
                    <li>Le-WindFarm (Điện gió)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="elementor-element elementor-element-600fd0e header-box-product elementor-widget__width-initial elementor-position-top elementor-widget elementor-widget-image-box" data-e-type="widget" data-element_type="widget" data-id="600fd0e" data-widget_type="image-box.default">
              <div className="elementor-image-box-wrapper">
                <figure className="elementor-image-box-img">
                  <Link href="/san-pham/lesb-xay-dung-thong-minh" tabIndex={-1}>
                    <img alt="" className="attachment-full size-full wp-image-2771" height="190" loading="lazy" src="/wp-content/uploads/2026/04/img-16.jpg" width="304" />
                  </Link>
                </figure>
                <div className="elementor-image-box-content">
                  <h3 className="elementor-image-box-title">
                    <Link href="/san-pham/lesb-xay-dung-thong-minh">
                      <span>Le</span>SB<span className="text">Xây dựng Thông Minh</span>
                    </Link>
                  </h3>
                  <ul>
                    <li>Le-SmartRoads (Hạ tầng Giao thông)</li>
                    <li>Le-SmartMarine (Hạ tầng Cảng biển)</li>
                    <li>Le-SmartIndustrial (Hạ tầng Công nghiệp)</li>
                    <li>Le-SmartModular (Nhà lắp ghép Thông minh)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="elementor-element elementor-element-3b2983a header-box-product elementor-widget__width-initial elementor-position-top elementor-widget elementor-widget-image-box" data-e-type="widget" data-element_type="widget" data-id="3b2983a" data-widget_type="image-box.default">
              <div className="elementor-image-box-wrapper">
                <figure className="elementor-image-box-img">
                  <Link href="/san-pham/legm-vat-lieu-xanh" tabIndex={-1}>
                    <img alt="" className="attachment-full size-full wp-image-2770" height="190" loading="lazy" src="/wp-content/uploads/2026/04/img-17.jpg" width="304" />
                  </Link>
                </figure>
                <div className="elementor-image-box-content">
                  <h3 className="elementor-image-box-title">
                    <Link href="/san-pham/legm-vat-lieu-xanh">
                      <span>Le</span>GM<span className="text">Vật liệu Xanh</span>
                    </Link>
                  </h3>
                  <ul>
                    <li>Le-GreenBrick (gạch không nung)</li>
                    <li>Le-GreenMix (bê tông tươi)</li>
                    <li>Le-GreenPrecast (cấu kiện đúc sẵn)</li>
                    <li>Le-GreenSteel (thép xanh)</li>
                    <li>Le-GreenCement (xi măng xanh)</li>
                    <li>Le-GreenAsphalt (nhựa đường tái chế)</li>
                    <li>Le-GreenMarine (Bê tông chống xâm thực nước biển)</li>
                    <li>Le-UHPC (bê tông siêu tính năng)</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </header>
  );
}
