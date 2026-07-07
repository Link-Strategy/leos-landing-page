import * as React from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const tabs = [
    { label: "Tất cả", active: true },
    { label: "Công nghệ", active: false },
    { label: "ESG / Net Zero", active: false },
    { label: "Sự kiện", active: false },
    { label: "Nội bộ", active: false },
];

const newsItems = [
    { image: "/figmaAssets/b-i-tin-1.png", title: "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.", day: "25", month: "tháng 3" },
    { image: "/figmaAssets/b-i-tin-1-1.png", title: "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.", day: "25", month: "tháng 3" },
    { image: "/figmaAssets/b-i-tin-1-2.png", title: "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.", day: "25", month: "tháng 3" },
    { image: "/figmaAssets/b-i-tin-1.png", title: "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.", day: "25", month: "tháng 3" },
    { image: "/figmaAssets/b-i-tin-1-1.png", title: "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.", day: "25", month: "tháng 3" },
    { image: "/figmaAssets/b-i-tin-1-2.png", title: "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.", day: "25", month: "tháng 3" },
    { image: "/figmaAssets/b-i-tin-1.png", title: "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.", day: "25", month: "tháng 3" },
    { image: "/figmaAssets/b-i-tin-1-1.png", title: "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.", day: "25", month: "tháng 3" },
    { image: "/figmaAssets/b-i-tin-1-2.png", title: "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.", day: "25", month: "tháng 3" },
];

const pagination = [1, 2, 3, "...", 8];

export const NewsList = (): React.JSX.Element => {
    const [activeTab, setActiveTab] = React.useState("Tất cả");
    const [activePage, setActivePage] = React.useState(1);

    return (
        <section className="w-full bg-[#0d1b4b] px-4 py-[60px] sm:px-6 lg:px-10">
            <div className="mx-auto flex w-full max-w-[1704px] flex-col items-center gap-[60px]">
                {/* Tabs */}
                <div className="relative flex w-full max-w-[637px] flex-wrap items-center justify-center gap-[6px] rounded-[100px] border border-[#76c6ff] p-[6px] py-[4px] shadow-[inset_0px_2px_16px_0px_rgba(0,149,255,0.26)]">
                    <div className="absolute inset-0 rounded-[100px] bg-linear-to-b from-white/16 to-white/[0.14]" />
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.label;
                        return (
                            <button
                                key={tab.label}
                                type="button"
                                onClick={() => setActiveTab(tab.label)}
                                className={`relative z-10 flex h-[52px] items-center rounded-[100px] border px-[13px] py-[4px] transition ${isActive
                                    ? "border-white bg-linear-to-b from-[#e2f3ff] to-white text-[#2a9fff]"
                                    : "border-[#31b0ff] bg-linear-to-b from-[rgba(118,198,255,0)] to-[rgba(42,117,243,0)] text-white"
                                    }`}
                            >
                                <span className="font-['Archivo',Helvetica] px-[8px] text-center text-[16px] font-semibold leading-[32px] sm:text-[20px]">
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Title */}
                <h1 className="bg-linear-to-r from-[#76c6ff] via-[#2a9fff] to-white bg-clip-text text-center font-['Archivo',Helvetica] text-[28px] font-bold leading-[32px] text-transparent sm:text-[32px]">
                    Tất cả các bài tin
                </h1>

                {/* Featured article */}
                <div className="flex w-full flex-col-reverse items-stretch gap-6 overflow-hidden rounded-[20px] border border-white/36white/[0.06] p-6 shadow-[0px_2px_20px_0px_rgba(12,178,255,0.12)] backdrop-blur-[18px] lg:flex-row lg:items-center lg:gap-16 lg:p-[36px]">
                    <div className="flex w-full flex-col gap-[34px] lg:max-w-[751px]">
                        <h2 className="font-['Archivo',Helvetica] text-[24px] font-bold leading-normal text-white lg:text-[32px]">
                            Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.
                        </h2>
                        <p className="font-['Archivo',Helvetica] text-[16px] font-normal leading-normal text-white lg:text-[24px]">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <Link
                            href="/tin-tuc/letron-chuyen-hoa-1-trieu-tan-xi-thai-1"
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
                                01 - 05
                            </span>
                            <div className="relative h-[8px] flex-1 max-w-[535px] rounded-[36px] bg-white/16 shadow-[0px_4px_36px_0px_rgba(42,159,255,0.08)] backdrop-blur-[18px]">
                                <div className="absolute left-0 top-0 h-[8px] w-[20%] rounded-[36px] bg-[rgba(80,106,151,0.66)] shadow-[0px_4px_26px_0px_rgba(42,159,255,0.08)] backdrop-blur-[18px]" />
                            </div>
                            <div className="flex items-center gap-2">
                                <button type="button" aria-label="Tin trước" className="flex size-[42px] items-center justify-center rounded-[100px] border border-white bg-linear-to-b from-[rgba(42,159,255,0.8)] to-[rgba(118,198,255,0.8)] opacity-66 shadow-[0px_4px_36px_0px_rgba(42,159,255,0.08)] backdrop-blur-[13px]">
                                    <ChevronLeft className="size-5 text-white" />
                                </button>
                                <button type="button" aria-label="Tin sau" className="flex size-[42px] items-center justify-center rounded-[100px] border border-white bg-linear-to-b from-white/16 to-white/11 opacity-66 shadow-[0px_4px_36px_0px_rgba(42,159,255,0.08)] backdrop-blur-[2px]">
                                    <ChevronRight className="size-5 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="relative aspect-789/522 w-full overflow-hidden rounded-[26px] lg:h-[522px] lg:w-[789px]">
                        <img
                            alt="Featured news"
                            className="absolute inset-0 size-full object-cover"
                            src="/figmaAssets/b-i-tin-1.png"
                        />
                        <div className="absolute bottom-0 right-0 flex h-[157px] w-[156px] flex-col items-center justify-center rounded-br-[20px] border border-[#f4f4f4] bg-linear-to-b from-white/20 to-[rgba(244,244,244,0.2)] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.15)] backdrop-blur-sm">
                            <span className="font-['Archivo',Helvetica] -mb-3 text-[48px] font-bold leading-none text-white sm:text-[60px]">
                                25
                            </span>
                            <span className="font-['Archivo',Helvetica] text-[18px] font-normal uppercase leading-none text-white sm:text-[24px]">
                                tháng 3
                            </span>
                        </div>
                    </div>
                </div>

                {/* News grid */}
                <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {newsItems.map((item, index) => (
                        <Link
                            key={`news-list-item-${index}`}
                            href={`/tin-tuc/letron-chuyen-hoa-1-trieu-tan-xi-thai-${index + 1}`}
                            className="w-full"
                        >
                            <Card className="border-0 bg-transparent shadow-none transition duration-300 hover:opacity-95">
                                <CardContent className="flex flex-col items-start gap-[26px] p-0">
                                    <div
                                        className="relative flex h-[360px] w-full items-start justify-end overflow-hidden rounded-[26px] bg-cover bg-center bg-no-repeat pt-[247px]"
                                        style={{ backgroundImage: `url(${item.image})` }}
                                    >
                                        <div className="flex h-[113px] w-28 items-center justify-center gap-2.5 rounded-[0px_0px_20px_0px] px-[27px] py-6 shadow-[0px_1px_10px_#00000026,inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] backdrop-blur-[2.0px] backdrop-brightness-110 [-webkit-backdrop-filter:blur(2.0px)_brightness(110%)] bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(244,244,244,0.2)_100%)]">
                                            <div className="flex w-[70px] flex-col items-center">
                                                <div className="relative font-['Archivo',Helvetica] text-center text-[30px] font-bold leading-[44px] text-white sm:text-[36px]">
                                                    {item.day}
                                                </div>
                                                <div className="relative font-['Archivo',Helvetica]enter text-[14px] font-normal uppercase leading-6 text-white">
                                                    {item.month}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-px w-full bg-white/20" />
                                    <h3 className="relative self-stretch font-['Archivo',Helvetica] text-[18px] font-bold leading-normal text-white sm:text-[20px]">
                                        {item.title}
                                    </h3>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center gap-[15px]">
                    {pagination.map((page, index) => {
                        const isActive = page === activePage;
                        return (
                            <button
                                key={`page-${index}-${page}`}
                                type="button"
                                aria-label={typeof page === "number" ? `Trang ${page}` : "Các trang khác"}
                                onClick={() => typeof page === "number" && setActivePage(page)}
                                className={`flex size-[42px] items-center justify-center rounded-[100px] border text-[16px] font-normal text-white font-['Archivo',Helvetica] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2a9fff] ${isActive
                                    ? "border-[#2a9fff] bg-[#1d63df] opacity-100 shadow-[0px_4px_13px_rgba(42,159,255,0.08)]"
                                    : "border-[#f4f4f4] bg-white/8 opacity-66 shadow-[0px_4px_26px_0px_rgba(42,159,255,0.08)] backdrop-blur-[18px]"
                                    }`}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
