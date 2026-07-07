"use client";

import * as React from "react";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import type { BlogArticle } from "@/lib/blog/types";

interface Category {
  slug: string;
  label: string;
  count: number;
}

interface Props {
  articles: BlogArticle[];
  categories: Category[];
}

function getDayAndMonth(dateStr?: string | Date | null) {
  if (!dateStr) return { day: "01", month: "Tháng 1" };
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleDateString("vi-VN", { month: "long" }).toLowerCase();
  return { day, month };
}

export default function BlogClient({ articles, categories }: Props) {
  // Tabs: 'Tất cả' + available categories
  const tabs = [
    { slug: "all", label: "Tất cả" },
    ...categories.map((c) => ({ slug: c.slug, label: c.label })),
  ];

  const [activeTab, setActiveTab] = useState("all");
  const [activePage, setActivePage] = useState(1);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Filter articles based on active tab
  const filteredArticles =
    activeTab === "all"
      ? articles
      : articles.filter((a) => a.categorySlug === activeTab);

  // Reset page and featured index when tab changes
  React.useEffect(() => {
    setActivePage(1);
    setFeaturedIndex(0);
  }, [activeTab]);

  // Featured articles (up to 3 latest in filteredArticles)
  const featuredArticles = filteredArticles.slice(0, 3);
  const featuredArticle = featuredArticles[featuredIndex];

  // Grid articles (remaining articles after the active featured one)
  const gridArticles = featuredArticle
    ? filteredArticles.filter((a) => a.slug !== featuredArticle.slug)
    : filteredArticles;

  // Pagination details
  const itemsPerPage = 6;
  const totalPages = Math.ceil(gridArticles.length / itemsPerPage);
  const pagedArticles = gridArticles.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  // Generate pagination pages array
  const paginationPages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Chevron click handlers for featured slider
  const handlePrevFeatured = () => {
    if (featuredArticles.length <= 1) return;
    setFeaturedIndex((prev) => (prev === 0 ? featuredArticles.length - 1 : prev - 1));
  };

  const handleNextFeatured = () => {
    if (featuredArticles.length <= 1) return;
    setFeaturedIndex((prev) => (prev === featuredArticles.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="w-full bg-[#0d1b4b] px-20 max-[1550px]:px-[60px] max-lg:px-[25px] max-md:px-4 py-[60px]">
      <div className="mx-auto flex w-full max-w-full flex-col items-center gap-[60px]">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex justify-center">
          <TabsList
            variant="elementor"
            className="relative flex w-fit max-w-full mx-auto flex-nowrap items-center justify-start md:justify-center gap-[6px] rounded-[100px] border border-[#76c6ff] p-[5px] shadow-[inset_0px_2px_16px_0px_rgba(0,149,255,0.26)] overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            <div className="absolute inset-0 rounded-[100px] bg-linear-to-brfrom-white/16o-white/[0.14]" />
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.slug}
                variant="elementor"
                value={tab.slug}
                className="relative z-10 flex h-[38px] shrink-0 items-center rounded-[100px] border px-[16px] transition cursor-pointer border-[#31b0ff] bg-linear-to-b from-[rgba(118,198,255,0)] to-[rgba(42,117,243,0)] text-white hover:opacity-80 data-[state=active]:border-white data-[state=active]:bg-linear-to-bata-[state=active]:from-[#e2f3ff] data-[state=active]:to-white data-[state=active]:text-[#2a9fff] font-['Archivo',Helvetica] text-[13px] font-semibold leading-none sm:text-[15px]"
              >
                <span className="text-center">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Title */}
        <h1 className="bg-linear-to-r from-[#76c6ff] via-[#2a9fff] to-white bg-clip-text text-center font-['Archivo',Helvetica] text-[28px] font-bold leading-[32px] text-transparent sm:text-[32px]">
          Tất cả các bài tin
        </h1>

        {/* Featured article */}
        {featuredArticle ? (
          <div className="flex w-full flex-col-reverse items-stretch gap-6 overflow-hidden rounded-[20px] border border-white/36 bg-white/6 p-6 shadow-[0px_2px_20px_0px_rgba(12,178,255,0.12)] backdrop-blur-[18px] lg:flex-row lg:items-center lg:gap-16 lg:p-[36px]">
            <div className="flex w-full flex-col gap-[34px] lg:max-w-[751px]">
              <h2 className="font-['Archivo',Helvetica] text-[24px] font-bold leading-normal text-white lg:text-[32px] line-clamp-3">
                {featuredArticle.title}
              </h2>
              {featuredArticle.excerpt && (
                <p className="font-['Archivo',Helvetica] text-[16px] font-normal leading-normal text-white/70 lg:text-[24px] line-clamp-3">
                  {featuredArticle.excerpt}
                </p>
              )}
              <Link
                href={`/blog/${featuredArticle.slug}`}
                className="group relative flex h-[52px] w-fit items-center rounded-[100px] border border-[#31b0ff] px-[13px] py-[4px] transition hover:opacity-95"
              >
                <div className="absolute inset-0 rounded-[100px] bg-linear-to-b from-[#76c6ff] to-[#2a75f3]" />
                <div className="relative z-10 flex items-center gap-1 px-[8px]">
                  <span className="font-['Archivo',Helvetica] text-[18px] font-semibold leading-[32px] text-white sm:text-[20px]">
                    Đọc thêm
                  </span>
                  <ArrowRight className="size-5 text-white transition group-hover:translate-x-0.5" />
                </div>
                <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0px_-3px_0px_0px_rgba(30,154,255,0.18),inset_0px_-2px_6px_0px_rgba(255,255,255,0.75),inset_0px_-4px_16px_0px_rgba(0,106,255,0.3)]" />
              </Link>
              <div className="flex items-center gap-[38px]">
                <span className="font-['Archivo',Helvetica] text-[16px] font-normal leading-normal text-white">
                  {`0${featuredIndex + 1} - 0${featuredArticles.length}`}
                </span>
                <div className="relative h-[8px] flex-1 max-w-[535px] rounded-[36px] bg-white/16 shadow-[0px_4px_36px_0px_rgba(42,159,255,0.08)] backdrop-blur-[18px]">
                  <div
                    className="absolute left-0 top-0 h-[8px] rounded-[36px] bg-[rgba(80,106,151,0.66)] shadow-[0px_4px_26px_0px_rgba(42,159,255,0.08)] backdrop-blur-[18px] transition-all duration-300"
                    style={{ width: `${((featuredIndex + 1) / featuredArticles.length) * 100}%` }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevFeatured}
                    aria-label="Tin trước"
                    className="flex size-[42px] items-center justify-center rounded-[100px] border border-white bg-linear-to-b from-[rgba(42,159,255,0.8)] to-[rgba(118,198,255,0.8)] opacity-66 shadow-[0px_4px_36px_0px_rgba(42,159,255,0.08)] backdrop-blur-[13px] cursor-pointer hover:opacity-90 transition"
                  >
                    <ChevronLeft className="size-5 text-white" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextFeatured}
                    aria-label="Tin sau"
                    className="flex size-[42px] items-center justify-center rounded-[100px] border border-white bg-linear-to-b from-white/16 to-white/11 opacity-66 shadow-[0px_4px_36px_0px_rgba(42,159,255,0.08)] backdrop-blur-[2px] cursor-pointer hover:opacity-90 transition"
                  >
                    <ChevronRight className="size-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
            <div className="relative aspect-789/522 w-full overflow-hidden rounded-[26px] lg:h-[522px] lg:w-[789px]">
              <img
                alt={featuredArticle.title}
                className="absolute inset-0 size-full object-cover"
                src={featuredArticle.coverImage || "/figmaAssets/b-i-tin-1.png"}
              />
              {(() => {
                const { day, month } = getDayAndMonth(featuredArticle.publishedAt);
                return (
                  <div className="absolute bottom-0 right-0 flex h-[157px] w-[156px] flex-col items-center justify-center rounded-br-[20px] border border-[#f4f4f4] bg-linear-to-b from-white/20 to-[rgba(244,244,244,0.2)] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.15)] backdrop-blur-sm">
                    <span className="font-['Archivo',Helvetica] -mb-3 text-[48px] font-bold leading-none text-white sm:text-[60px]">
                      {day}
                    </span>
                    <span className="font-['Archivo',Helvetica] text-[18px] font-normal uppercase leading-none text-white sm:text-[24px]">
                      {month}
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-zinc-400 text-lg">Chưa có bài viết nổi bật nào.</p>
          </div>
        )}

        {/* News grid */}
        {pagedArticles.length > 0 ? (
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pagedArticles.map((item) => {
              const { day, month } = getDayAndMonth(item.publishedAt);
              return (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="w-full group"
                >
                  <Card className="border-0 bg-transparent shadow-none transition duration-300 hover:opacity-95">
                    <CardContent className="flex flex-col items-start gap-[26px] p-0">
                      <div
                        className="relative flex h-[360px] w-full items-start justify-end overflow-hidden rounded-[26px] bg-cover bg-center bg-no-repeat pt-[247px]"
                        style={{ backgroundImage: `url(${item.coverImage || "/figmaAssets/b-i-tin-1.png"})` }}
                      >
                        <div className="flex h-[113px] w-28 items-center justify-center gap-2.5 rounded-[0px_0px_20px_0px] px-[27px] py-6 shadow-[0px_1px_10px_#00000026,inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] backdrop-blur-[2.0px] backdrop-brightness-110 [-webkit-backdrop-filter:blur(2.0px)_brightness(110%)] bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(244,244,244,0.2)_100%)]">
                          <div className="flex w-[70px] flex-col items-center">
                            <div className="relative font-['Archivo',Helvetica] text-center text-[30px] font-bold leading-[44px] text-white sm:text-[36px]">
                              {day}
                            </div>
                            <div className="relative font-['Archivo',Helvetica] text-center text-[14px] font-normal uppercase leading-6 text-white">
                              {month}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="h-px w-full bg-white/20" />
                      <h3 className="relative self-stretch font-['Archivo',Helvetica] text-[18px] font-bold leading-normal text-white sm:text-[20px] line-clamp-3 transition-colors group-hover:text-[#2a9fff]">
                        {item.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-zinc-400 text-lg">Chưa có bài viết nào trong mục này.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-[15px]">
            {paginationPages.map((page) => {
              const isActive = page === activePage;
              return (
                <button
                  key={`page-${page}`}
                  type="button"
                  aria-label={`Trang ${page}`}
                  onClick={() => setActivePage(page)}
                  className={`flex size-[42px] items-center justify-center rounded-[100px] border text-[16px] font-normal text-white font-['Archivo',Helvetica] transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2a9fff] ${isActive
                      ? "border-[#2a9fff] bg-[#1d63df] opacity-100 shadow-[0px_4px_13px_rgba(42,159,255,0.08)]"
                      : "border-[#f4f4f4] bg-white/8 opacity-66 shadow-[0px_4px_26px_0px_rgba(42,159,255,0.08)] backdrop-blur-[18px] hover:bg-white/20"
                    }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
