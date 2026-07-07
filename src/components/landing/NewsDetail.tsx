import Link from "next/link";
import { useParams } from "next/navigation";
import { Bookmark, Clock, Home } from "lucide-react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";

const relatedNews = [
    {
        image: "/figmaAssets/b-i-tin-1.png",
        title:
            "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.",
        day: "25",
        month: "tháng 3",
    },
    {
        image: "/figmaAssets/b-i-tin-1-1.png",
        title:
            "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.",
        day: "25",
        month: "tháng 3",
    },
    {
        image: "/figmaAssets/b-i-tin-1-2.png",
        title:
            "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.",
        day: "25",
        month: "tháng 3",
    },
    {
        image: "/figmaAssets/b-i-tin-1.png",
        title:
            "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.",
        day: "25",
        month: "tháng 3",
    },
    {
        image: "/figmaAssets/b-i-tin-1-1.png",
        title:
            "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.",
        day: "25",
        month: "tháng 3",
    },
];

const socialButtons = [
    { icon: FaFacebookF, color: "#287eff" },
    { icon: FaLinkedinIn, color: "#0d89fc" },
    { icon: SiGmail, color: "#eb4a3c" },
    { icon: FaXTwitter, color: "#0deefc" },
];

export const NewsDetail = (): React.JSX.Element => {
    const params = useParams();
    const slug = typeof params?.slug === "string" ? params.slug : undefined;
    const articleSlug = slug ?? "letron-chuyen-hoa-1-trieu-tan-xi-thai";

    return (
        <section className="w-full bg-[#0d1b4b] px-10 max-[1550px]:px-[30px] max-lg:px-3 max-md:px-2 pb-5 lg:pb-8 pt-[calc(var(--header-height-mobile)+20px)] lg:pt-[calc(var(--header-height)+32px)]">
            <div className="mx-auto flex w-full flex-col items-center">
                <div className="flex w-full flex-col gap-10 xl:flex-row xl:justify-between xl:gap-[4%]">
                    {/* Main article */}
                    <article className="flex w-full xl:w-[68%] min-w-0 flex-col gap-3">
                        {/* Breadcrumb */}
                        <nav className="flex w-full min-w-0 flex-wrap items-center gap-2 text-[16px] font-medium leading-normal font-['Archivo',Helvetica] mb-2">
                            <Link
                                href="/"
                                aria-label="Trang chủ"
                                className="flex shrink-0 items-center gap-2 text-[#459be2] transition hover:opacity-80"
                            >
                                <Home className="size-4" />
                            </Link>
                            <span className="shrink-0 text-[#459be2]">/</span>
                            <Link href="/blog" className="shrink-0 text-[#459be2] transition hover:opacity-80">
                                Tin tức
                            </Link>
                            <span className="shrink-0 text-[#459be2]">/</span>
                            <span className="min-w-0 flex-1 truncate text-white">
                                LETRON chuyển hóa 1 triệu tấn xỉ thải thành vật liệu xây dựng xanh
                            </span>
                        </nav>

                        {/* Header */}
                        <div className="flex w-full flex-col gap-3">
                            <h1 className="relative font-['Archivo',Helvetica]24px] font-extrabold leading-[1.2] text-white drop-shadow-[0px_4px_20px_rgba(0,140,255,0.2)] sm:text-[28px] lg:text-[30px]">
                                LETRON chuyển hóa 1 triệu tấn xỉ thải thành vật liệu xây dựng xanh
                            </h1>
                            <div className="flex flex-wrap items-center gap-[35px]">
                                <div className="flex items-center gap-[10px]">
                                    <Bookmark className="h-4 w-4 text-[#2a9fff]" />
                                    <span className="font-['Archivo',Helvetica] text-[16px] font-normal leading-[32px] text-[#2a9fff]">
                                        ESG / Net Zero
                                    </span>
                                </div>
                                <div className="flex items-center gap-[10px]">
                                    <Clock className="h-4 w-4 text-white" />
                                    <span className="font-['Archivo',Helvetica] text-[16px] font-normal leading-[32px] text-white">
                                        Ngày đăng: 06.04.2026
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-white/20" />

                        {/* Lead */}
                        <p className="font-['Archivo',Helvetica] text-[18px] font-bold leading-normal text-white lg:text-[20px]">
                            Ứng dụng LeOS và LeLe AI, LETRON mở ra hướng tiếp cận mới trong xử
                            lý tài nguyên công nghiệp và giảm phát thải CO₂.
                        </p>

                        {/* Hero image */}
                        <div className="flex w-full flex-col gap-4">
                            <div className="relative aspect-789/522 w-full overflow-hidden rounded-[26px]">
                                <img
                                    alt="LETRON xử lý xỉ thải"
                                    className="absolute inset-0 size-full object-cover"
                                    src="/figmaAssets/b-i-tin-1.png"
                                />
                            </div>
                            <p className="font-['Archivo',Helvetica] text-[14px] font-normal italic leading-normal text-white sm:text-[16px]">
                                Xây dựng là một trong những lĩnh vực tiêu thụ năng lượng và tài nguyên lớn,
                            </p>
                        </div>

                        {/* Body */}
                        <div className="flex w-full flex-col gap-4 text-white">
                            <h2 className="font-['Archivo',Helvetica] text-[18px] font-bold leading-normal lg:text-[20px]">
                                Vật liệu xanh - yêu cầu tất yếu
                            </h2>
                            <div className="font-['Archivo',Helvetica] space-y-4 text-[14px] font-normal leading-normal sm:text-[16px]">
                                <p>
                                    Trong bối cảnh ngành Xây dựng là một trong những lĩnh vực tiêu thụ năng lượng và tài nguyên lớn, việc tối ưu hóa sử dụng năng lượng và vật liệu không chỉ giúp giảm phát thải khí nhà kính, mà còn thúc đẩy đổi mới công nghệ, nâng cao năng suất, chất lượng công trình và sức cạnh tranh của nền kinh tế. Cụ thể, việc đẩy mạnh phát triển công trình xanh sẽ góp phần thúc đẩy sản xuất và sử dụng vật liệu xanh, vật liệu tái chế, giảm tiêu thụ năng lượng, nước, vật liệu và giảm phát thải CO2.
                                </p>
                                <p>
                                    Bên cạnh đó, các chương trình truyền thông, đào tạo và tăng cường năng lực đã góp phần mở rộng mạng lưới công trình xanh trên toàn quốc. Tính đến nay, Việt Nam đã có hơn 600 công trình xanh, với tổng diện tích sàn gần 17 triệu m2, thể hiện nỗ lực mạnh mẽ của các cơ quan, doanh nghiệp và cộng đồng trong tiến trình chuyển đổi xanh, hướng tới phát triển bền vững ngành Xây dựng.
                                </p>
                                <p>
                                    Trong bối cảnh toàn cầu đối mặt với biến đổi khí hậu và cạn kiệt tài nguyên, ngành Xây dựng - lĩnh vực tiêu thụ hơn 40% tài nguyên thiên nhiên và phát thải khoảng 37% lượng khí CO2 toàn cầu - đang đứng trước yêu cầu cấp thiết phải chuyển đổi mô hình phát triển theo hướng bền vững.
                                </p>
                                <p>
                                    Vật liệu tuần hoàn không chỉ góp phần giảm khai thác tài nguyên, giảm phát thải khí nhà kính mà còn tạo giá trị mới thông qua tái sử dụng, tái chế, kéo dài vòng đời vật liệu và giảm chất thải xây dựng. Việc áp dụng các tiêu chuẩn quốc tế như LEED, LOTUS, EDGE đã thúc đẩy quá trình này, trong đó tiêu chí về vật liệu chiếm tới 12-20% tổng điểm đánh giá công trình xanh.
                                </p>
                                <p>
                                    Một số hướng đi nổi bật như sử dụng vật liệu phản xạ năng lượng mặt trời giúp giảm hiệu ứng đảo nhiệt đô thị; vật liệu cách nhiệt, cửa sổ tiết kiệm năng lượng nhằm tối ưu hiệu suất nhiệt công trình; và sản phẩm có nhãn môi trường (EPD), hàm lượng tái chế, hoặc thành phần hóa học minh bạch để đảm bảo an toàn sức khỏe và môi trường.
                                </p>
                            </div>

                            <h2 className="font-['Archivo',Helvetica] text-[18px] font-bold leading-normal lg:text-[20px]">
                                Hiệu quả năng lượng - đầu tư thông minh cho tương lai
                            </h2>
                            <div className="font-['Archivo',Helvetica] space-y-4 text-[14px] font-normal leading-normal sm:text-[16px]">
                                <p>
                                    Theo thống kê, hơn 85% lượng CO2 trong sản xuất xi măng phát sinh từ quá trình nung luyện clinker và đốt nhiên liệu hóa thạch. LeTRON đã triển khai đồng bộ các giải pháp: tối ưu hiệu suất năng lượng, tái sử dụng nhiệt thải, thay thế nguyên - nhiên liệu truyền thống bằng tro bay, xỉ và phụ gia khoáng, đồng thời ứng dụng chuyển đổi số và tự động hóa trong sản xuất.
                                </p>
                                <p>
                                    Cùng với đó, LeTRON còn tiên phong đồng xử lý rác công nghiệp, rác nguy hại và bao bì thuốc bảo vệ thực vật, với tổng khối lượng xử lý năm 2024 đạt gần 40.000 tấn, đồng thời tận dụng hơn 360.000 tấn tro bay và xỉ làm nguyên liệu sản xuất. Nhờ vậy, lượng phát thải ròng của LeTRON đã giảm xuống 452 kg CO₂/tấn xi măng, thấp hơn đáng kể so với trung bình ngành.
                                </p>
                                <p>
                                    "Để thúc đẩy sản xuất xanh, cần sớm ban hành tiêu chuẩn công trình xanh quốc gia bắt buộc, đồng thời yêu cầu báo cáo phát thải hàng năm đối với các ngành VLXD trọng điểm như xi măng và thép" - ông Nguyễn Công Bảo nhấn mạnh.
                                </p>
                                <p>
                                    Ông Nguyễn Công Bảo đề xuất cần sớm ban hành Tiêu chuẩn Công trình Xanh quốc gia và cơ chế quản lý phát thải trong ngành VLXD. Trước hết, việc ban hành Tiêu chuẩn Công trình Xanh quốc gia cần được triển khai sớm, coi đây là lộ trình bắt buộc trong tiến trình chuyển đổi xanh của ngành Xây dựng, đặc biệt với các công trình sử dụng vốn ngân sách nhà nước và nhà ở dân dụng.
                                </p>
                                <p>
                                    Bên cạnh đó, doanh nghiệp kiến nghị cơ quan quản lý thiết lập cơ chế báo cáo phát thải khí nhà kính hằng năm, đồng thời phân bổ hạn ngạch phát thải cho các ngành VLXD trọng yếu như xi măng, thép, nhằm bảo đảm tính minh bạch và hiệu quả trong kiểm soát phát thải. Đại diện LeTRON cũng nhấn mạnh cần quy hoạch và cân đối cung - cầu xi măng trên phạm vi toàn quốc, hướng đến cơ cấu ngành phát triển bền vững, tránh tình trạng dư thừa công suất, bảo đảm mục tiêu giảm phát thải và phát triển xanh cho toàn ngành.
                                </p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-white/20" />

                        {/* Share */}
                        <div className="flex flex-wrap items-end gap-[14px]">
                            <span className="font-['Archivo',Helvetica] text-[16px] font-normal leading-normal text-white">
                                Chia sẻ:
                            </span>
                            <div className="flex items-center gap-2">
                                {socialButtons.map(({ icon: Icon, color }, idx) => (
                                    <button
                                        key={`social-${idx}`}
                                        type="button"
                                        className="relative flex size-[30px] items-center justify-center overflow-hidden rounded-[6px] border border-white/5 bg-white/5 shadow-[8px_4px_16px_0px_rgba(0,0,0,0.08)] transition hover:opacity-90"
                                    >
                                        <div
                                            className="absolute inset-0 rounded-[6px] opacity-20"
                                            style={{
                                                backgroundImage: `linear-gradient(135deg, rgba(248, 251, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%)`,
                                            }}
                                        />
                                        <Icon
                                            className="relative z-10 size-4 text-white"
                                            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </article>

                    {/* Related news */}
                    <aside className="flex w-full xl:w-[28%] shrink-0 flex-col gap-[23px] xl:pt-[84px]">
                        <div className="flex w-full flex-col gap-[17px]">
                            <h2 className="font-['Archivo',Helvetica] text-[20px] font-bold leading-[1.3] text-white lg:text-[24px]">
                                Tin tức liên quan
                            </h2>
                            <div className="h-px w-full bg-white/20" />
                        </div>
                        <div className="flex flex-col gap-6">
                            {relatedNews.map((item, index) => (
                                <Link
                                    key={`related-${index}`}
                                    href={`/tin-tuc/${articleSlug}-${index + 1}`}
                                    className="group flex gap-4"
                                >
                                    <div className="relative h-[154px] w-[232px] shrink-0 overflow-hidden rounded-[12px]">
                                        <img
                                            alt={item.title}
                                            className="absolute inset-0 size-full object-cover transition duration-300 group-hover:scale-105"
                                            src={item.image}
                                        />
                                        <div className="absolute right-0 top-[104px] flex h-[50px] w-[66px] flex-col items-center justify-center bg-linear-to-b from-white/20 to-[rgba(244,244,244,0.2)] text-center text-white shadow-[0px_1px_10px_0px_rgba(0,0,0,0.15)] backdrop-blur-[2px]">
                                            <span className="font-['Archivo',Helvetica] text-[16px] font-bold leading-none">
                                                {item.day}
                                            </span>
                                            <span className="font-['Archivo',Helvetica] text-[12px] font-normal uppercase leading-none">
                                                {item.month}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="font-['Archivo',Helvetica] h-[99px] overflow-hidden text-[14px] font-bold leading-normal text-white line-clamp-5 sm:text-[16px]">
                                        {item.title}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
};
