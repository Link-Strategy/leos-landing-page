import Image from "next/image";
import Link from "next/link";

interface NewsItem {
  id: number;
  title: string;
  date: string;
  image: string;
  link: string;
  category: string;
}

export default function News() {
  const newsList: NewsItem[] = [
    {
      id: 1,
      title: "LETRON chuyển hóa 1 triệu tấn xỉ thải nhiệt điện thành vật liệu xây dựng xanh",
      date: "06 Tháng 5",
      image: "/wp-content/uploads/2026/05/1-10.jpg",
      link: "/letron-chuyen-hoa-1-trieu-tan-xi-thai-thanh-vat-lieu-xay-dung-xanh-8/",
      category: "Công nghệ xanh",
    },
    {
      id: 2,
      title: "Ứng dụng trí tuệ nhân tạo LeLe AI trong việc tối ưu hóa cấp phối bê tông hiệu năng cao",
      date: "04 Tháng 5",
      image: "/wp-content/uploads/2026/05/5.jpg",
      link: "/letron-chuyen-hoa-1-trieu-tan-xi-thai-thanh-vat-lieu-xay-dung-xanh-7/",
      category: "Trí tuệ nhân tạo",
    },
    {
      id: 3,
      title: "Phát triển hạ tầng trạm đổi pin tự động Le-ChargeHub kết hợp lưới điện Solar",
      date: "30 Tháng 4",
      image: "/wp-content/uploads/2026/05/1-9.jpg",
      link: "/letron-chuyen-hoa-1-trieu-tan-xi-thai-thanh-vat-lieu-xay-dung-xanh-6/",
      category: "Năng lượng",
    },
    {
      id: 4,
      title: "Hệ điều hành công nghiệp LeOS tối ưu hóa 25% chu trình chuỗi cung ứng tuần hoàn",
      date: "25 Tháng 4",
      image: "/wp-content/uploads/2026/05/4.jpg",
      link: "/letron-chuyen-hoa-1-trieu-tan-xi-thai-thanh-vat-lieu-xay-dung-xanh-5/",
      category: "Số hóa",
    },
    {
      id: 5,
      title: "Tín chỉ Carbon số: Minh bạch hóa lộ trình giảm phát thải hướng tới Net Zero",
      date: "18 Tháng 4",
      image: "/wp-content/uploads/2026/05/2-4.jpg",
      link: "/letron-chuyen-hoa-1-trieu-tan-xi-thai-thanh-vat-lieu-xay-dung-xanh-4/",
      category: "Carbon Ledger",
    },
    {
      id: 6,
      title: "Hợp tác chiến lược phát triển mô hình khu công nghiệp sinh thái tuần hoàn đầu tiên",
      date: "12 Tháng 4",
      image: "/wp-content/uploads/2026/05/2-5.jpg",
      link: "/letron-chuyen-hoa-1-trieu-tan-xi-thai-thanh-vat-lieu-xay-dung-xanh-3/",
      category: "Đô thị xanh",
    },
  ];

  return (
    <section className="relative py-24 bg-transparent overflow-hidden">
      {/* Lights */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl space-y-4">
            <div className="text-emerald-400 text-xs tracking-widest uppercase font-semibold">
              Kênh truyền thông
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Tin tức – Sự kiện
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Những câu chuyện, dữ liệu và chuyển động mới nhất từ hành trình kiến tạo công nghiệp xanh và tương lai Net Zero của LeTRON.
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <Link href="/category/tin-tuc-su-kien">
              <button className="px-6 py-3 rounded-full border border-white/10 text-zinc-300 font-semibold hover:bg-[#132563] hover:text-white transition-all duration-300 flex items-center gap-2">
                Xem tất cả bài tin
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </Link>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map((news) => (
            <article
              key={news.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#132563]/40 border border-white/10 hover:border-emerald-500/20 hover:bg-[#132563]/60 transition-all duration-300"
            >
              
              {/* Image & Date Badge */}
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Category Badge top-left */}
                <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded bg-[#0D1B4B]/80 border border-white/10 backdrop-blur-sm text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                  {news.category}
                </div>


                {/* Glassmorphic Date Badge bottom-right */}
                <div className="absolute bottom-0 right-0 z-10 px-4 py-2 border-t border-l border-white/20 bg-white/10 backdrop-blur-md text-white rounded-tl-xl text-xs font-bold tracking-wide">
                  {news.date}
                </div>
              </div>

              {/* Text Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-zinc-100 leading-snug group-hover:text-emerald-300 transition-colors duration-200">
                  <Link href={news.link}>
                    {news.title}
                  </Link>
                </h3>
                
                <div className="pt-2">
                  <Link href={news.link} className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 group-hover:text-emerald-400 transition-colors">
                    Đọc tiếp
                    <svg
                      className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
