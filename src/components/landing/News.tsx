import Image from "next/image";
import Link from "next/link";
import { getBlogDb } from "@/lib/mongodb";
import { generateSlug, formatBlogDate, type BlogAsset } from "@/lib/blog-utils";

interface NewsItem {
  id: string;
  title: string;
  date: string;
  image: string;
  link: string;
  category: string;
}

function assetId(a: BlogAsset): string {
  try { return String(a._id); } catch { return ""; }
}

function assetMeta(a: BlogAsset) { return a.platform_metadata || {}; }

async function getNews(): Promise<NewsItem[]> {
  try {
    const db = await getBlogDb();
    const assets = await db.collection<BlogAsset>("assets")
      .find({ platform: "blog", status: "published" })
      .sort({ publish_at: -1, created_at: -1 })
      .limit(6)
      .toArray();

    if (assets.length > 0) {
      return assets.map((a) => {
        const meta = assetMeta(a);
        const title = a.title || "";
        const slug = meta.slug || generateSlug(title);
        const date = a.publish_at || a.created_at || new Date();
        return {
          id: assetId(a),
          title,
          date: formatBlogDate(date),
          image: meta.coverImage || (a.media?.[0]?.url) || "/wp-content/uploads/2026/05/1-10.jpg",
          link: "/blog/" + slug,
          category: meta.category || "Blog",
        };
      });
    }
  } catch {
    // DB not available, use fallback
  }

  return [
    { id: "1", title: "LETRON chuyen hoa 1 trieu tan xi thai nhiet dien thanh vat lieu xay dung xanh", date: "06 Thang 5", image: "/wp-content/uploads/2026/05/1-10.jpg", link: "/letron-chuyen-hoa-1-trieu-tan-xi-thai-thanh-vat-lieu-xay-dung-xanh-8/", category: "Cong nghe xanh" },
    { id: "2", title: "Ung dung tri tue nhan tao LeLe AI trong viec toi uu hoa cap phoi be tong hieu nang cao", date: "04 Thang 5", image: "/wp-content/uploads/2026/05/5.jpg", link: "/letron-chuyen-hoa-1-trieu-tan-xi-thai-thanh-vat-lieu-xay-dung-xanh-7/", category: "Tri tue nhan tao" },
    { id: "3", title: "Phat trien ha tang tram doi pin tu dong Le-ChargeHub ket hop luoi dien Solar", date: "30 Thang 4", image: "/wp-content/uploads/2026/05/1-9.jpg", link: "/letron-chuyen-hoa-1-trieu-tan-xi-thai-thanh-vat-lieu-xay-dung-xanh-6/", category: "Nang luong" },
    { id: "4", title: "He dieu hanh cong nghiep LeOS toi uu hoa 25% chu trinh chuoi cung ung tuan hoan", date: "25 Thang 4", image: "/wp-content/uploads/2026/05/4.jpg", link: "/letron-chuyen-hoa-1-trieu-tan-xi-thai-thanh-vat-lieu-xay-dung-xanh-5/", category: "So hoa" },
    { id: "5", title: "Tin chi Carbon so: Minh bach hoa lo trinh giam phat thai huong toi Net Zero", date: "18 Thang 4", image: "/wp-content/uploads/2026/05/2-4.jpg", link: "/letron-chuyen-hoa-1-trieu-tan-xi-thai-thanh-vat-lieu-xay-dung-xanh-4/", category: "Carbon Ledger" },
    { id: "6", title: "Hop tac chien luoc phat trien mo hinh khu cong nghiep sinh thai tuan hoan dau tien", date: "12 Thang 4", image: "/wp-content/uploads/2026/05/2-5.jpg", link: "/letron-chuyen-hoa-1-trieu-tan-xi-thai-thanh-vat-lieu-xay-dung-xanh-3/", category: "Do thi xanh" },
  ];
}

export default async function News() {
  const newsList = await getNews();

  return (
    <section className="relative py-24 bg-transparent overflow-hidden">
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl space-y-4">
            <div className="text-emerald-400 text-xs tracking-widest uppercase font-semibold">
              Kenh truyen thong
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Tin tuc - Su kien
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Nhung cau chuyen, du lieu va chuyen dong moi nhat tu hanh trinh kien tao cong nghiep xanh va tuong lai Net Zero cua LeTRON.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link href="/blog">
              <button className="px-6 py-3 rounded-full border border-white/10 text-zinc-300 font-semibold hover:bg-[#132563] hover:text-white transition-all duration-300 flex items-center gap-2">
                Xem tat ca bai viet
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.slice(0, 6).map((news) => (
            <article
              key={news.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#132563]/40 border border-white/10 hover:border-emerald-500/20 hover:bg-[#132563]/60 transition-all duration-300"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded bg-[#0D1B4B]/80 border border-white/10 backdrop-blur-sm text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                  {news.category}
                </div>
                <div className="absolute bottom-0 right-0 z-10 px-4 py-2 border-t border-l border-white/20 bg-white/10 backdrop-blur-md text-white rounded-tl-xl text-xs font-bold tracking-wide">
                  {news.date}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-zinc-100 leading-snug group-hover:text-emerald-300 transition-colors duration-200">
                  <Link href={news.link}>
                    {news.title}
                  </Link>
                </h3>

                <div className="pt-2">
                  <Link href={news.link} className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 group-hover:text-emerald-400 transition-colors">
                    Doc tiep
                    <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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
