import Link from "next/link";
import { formatBlogDate } from "@/lib/blog-utils";
import { getCachedLatestPublishedBlogArticles } from "@/lib/blog/queries";

export default async function News() {
  let articles: Awaited<ReturnType<typeof getCachedLatestPublishedBlogArticles>> = [];
  try {
    articles = await getCachedLatestPublishedBlogArticles(6);
  } catch {
    articles = [];
  }

  if (articles.length === 0) return null;

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl space-y-4">
            <p className="text-emerald-400 text-xs tracking-widest uppercase font-semibold">
              Kênh truyền thông
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Tin tức - Sự kiện
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Những câu chuyện, dữ liệu và chuyển động mới nhất từ hành trình kiến tạo công nghiệp xanh và tương lai Net Zero của LeTRON.
            </p>
          </div>

          <Link
            href="/blog"
            className="flex-shrink-0 px-6 py-3 rounded-full border border-white/10 text-zinc-300 font-semibold hover:bg-[#132563] hover:text-white transition-all duration-300 inline-flex items-center gap-2"
          >
            Xem tất cả bài viết
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(0, 6).map((article) => (
            <article
              key={article.externalId}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#132563]/40 border border-white/10 hover:border-emerald-500/20 hover:bg-[#132563]/60 transition-all duration-300"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <img src={article.coverImage || "/wp-content/uploads/2026/05/1-10.jpg"} alt={article.title} className="object-cover group-hover:scale-105 transition-transform duration-500" style={{width:"100%",height:"100%"}} />
                <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded bg-[#0D1B4B]/80 border border-white/10 backdrop-blur-sm text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                  {article.category || "Blog"}
                </div>
                <div className="absolute bottom-0 right-0 z-10 px-4 py-2 border-t border-l border-white/20 bg-white/10 backdrop-blur-md text-white rounded-tl-xl text-xs font-bold tracking-wide">
                  {formatBlogDate(article.publishedAt!)}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-zinc-100 leading-snug group-hover:text-emerald-300 transition-colors duration-200 line-clamp-3">
                  <Link href={`/blog/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>

                <div className="pt-2">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 group-hover:text-emerald-400 transition-colors"
                  >
                    Đọc tiếp
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
