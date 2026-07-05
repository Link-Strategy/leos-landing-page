import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCachedLatestPublishedBlogArticles, getCachedPublicBlogArticleBySlug, getCachedRelatedBlogArticles } from "@/lib/blog/queries";
import { buildBlogArticleMetadata } from "@/lib/blog/seo";
import { renderMarkdownToHtml } from "@/lib/blog/markdown";
import ShareButtons from "@/components/blog/ShareButtons";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatCompactDate(date: string | Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function formatMonthBadge(date: string | Date) {
  const d = new Date(date);
  const month = d
    .toLocaleDateString("vi-VN", { month: "long" })
    .replace(/^tháng\s+/i, "Tháng ");

  return {
    day: String(d.getDate()),
    month,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getCachedPublicBlogArticleBySlug(slug);
  if (!article) return { title: "Bài viết không tìm thấy" };

  return buildBlogArticleMetadata(article);
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getCachedPublicBlogArticleBySlug(slug);

  if (!article) notFound();

  const bodyHtml = await renderMarkdownToHtml(article.contentMarkdown);

  // TODO: replace mock data with real queries once more articles are in DB
  const mockRelatedArticles = [
    {
      slug: "mock-related-1",
      title: "LeOS ra mắt công nghệ xử lý chất thải không cần đốt",
      coverImage: "/wp-content/uploads/2026/05/1-10.jpg",
      publishedAt: "2026-06-15T00:00:00Z",
    },
    {
      slug: "mock-related-2",
      title: "Chuyển đổi số trong quản lý rác thải đô thị tại Việt Nam",
      coverImage: "/wp-content/uploads/2026/05/1-10.jpg",
      publishedAt: "2026-06-10T00:00:00Z",
    },
    {
      slug: "mock-related-3",
      title: "Kinh tế tuần hoàn: Từ phế thải thành nguyên liệu sản xuất",
      coverImage: "/wp-content/uploads/2026/05/1-10.jpg",
      publishedAt: "2026-06-05T00:00:00Z",
    },
    {
      slug: "mock-related-4",
      title: "AI và IoT trong phân loại rác thải thông minh",
      coverImage: "/wp-content/uploads/2026/05/1-10.jpg",
      publishedAt: "2026-05-28T00:00:00Z",
    },
    {
      slug: "mock-related-5",
      title: "Hành trình xanh hóa doanh nghiệp sản xuất với giải pháp LeOS",
      coverImage: "/wp-content/uploads/2026/05/1-10.jpg",
      publishedAt: "2026-05-20T00:00:00Z",
    },
  ];
  const relatedArticles = await getCachedRelatedBlogArticles(
    slug,
    article.category,
    article.tags,
    3,
  );
  const fallbackRelatedArticles =
    relatedArticles.length > 0
      ? relatedArticles
      : (await getCachedLatestPublishedBlogArticles(4))
        .filter((item) => item.slug !== slug)
        .slice(0, 3);

  // Use mock data when no real related articles available
  const displayRelatedArticles =
    fallbackRelatedArticles.length > 0
      ? fallbackRelatedArticles
      : mockRelatedArticles;

  const categoryLabel = article.category || "Tin tức - Sự kiện";

  return (
    <div className="min-h-screen bg-[#0D1B4B]">
      <div className="mx-auto max-w-7xl pt-36 pb-16">
        <div className="flex flex-col gap-0 lg:flex-row lg:gap-16">
          {/* Main Content */}
          <article className="min-w-0 flex-1">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6 text-sm">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <li>
                  <Link href="/" className="text-white/70 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-white/40">/</li>
                <li>
                  <Link href="/blog" className="text-white/70 hover:text-white transition-colors">
                    Tin tức - Sự kiện
                  </Link>
                </li>
                <li aria-hidden="true" className="text-white/40">/</li>
                <li className="text-white/70">{article.title}</li>
              </ol>
            </nav>

            {/* Title */}
            <h1 className="mb-4 text-[30px] font-extrabold leading-tight tracking-tight text-white">
              {article.title}
            </h1>

            {/* Meta row */}
            <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">
                  {categoryLabel}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Ngày đăng: {formatCompactDate(article.publishedAt!)}</span>
              </span>
            </div>

            {/* Author */}
            <p className="mb-8 text-sm text-white/60">
              Tác giả: <span className="font-semibold text-white">{article.authorName || "LeTRON Team"}</span>
            </p>

            {/* Cover image */}
            {article.coverImage && (
              <div className="mb-10 overflow-hidden rounded-[12px] border border-white/10 bg-[#0D1B4B] shadow-[0_1px_10px_rgba(0,0,0,0.15)]">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="aspect-[826/547] w-full object-cover"
                />
              </div>
            )}

            {/* Body content */}
            <div
              className="prose prose-invert max-w-none text-white/90 prose-headings:mb-5 prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tight prose-h2:text-[28px] prose-h2:leading-tight prose-p:mb-6 prose-p:leading-8 prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-img:rounded-xl prose-blockquote:border-emerald-500 prose-blockquote:text-white/80 prose-code:text-emerald-300 prose-pre:border prose-pre:border-white/10 prose-pre:bg-[#0D1B4B]"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />

            {/* Share row */}
            <div className="mt-10 border-t border-white/10 pt-8">
              <ShareButtons url={`/blog/${article.slug}`} title={article.title} />
            </div>
          </article>

          {/* Sidebar — Related Articles */}
          <aside className="w-full shrink-0 lg:w-[280px]">
            <div className="pt-[50px]">
              <div className="mb-4">
                <h2 className="text-sm font-bold text-white">Tin tức liên quan</h2>
                <div className="mt-1 h-[2px] w-8 rounded-full bg-emerald-400" />
              </div>

              {displayRelatedArticles.length > 0 ? (
                <div className="space-y-3">
                  {displayRelatedArticles.map((related) => {
                    const badge = related.publishedAt
                      ? formatMonthBadge(related.publishedAt)
                      : null;

                    return (
                      <Link
                        key={related.slug}
                        href={`/blog/${related.slug}`}
                        className="group flex gap-3 overflow-hidden rounded-[8px] border border-white/10 bg-[#132563]/40 transition-all duration-300 hover:border-white/20 hover:bg-[#132563]/55"
                      >
                        <div className="relative w-20 shrink-0">
                          <img
                            src={related.coverImage || article.coverImage || "/wp-content/uploads/2026/05/1-10.jpg"}
                            alt={related.title}
                            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {badge && (
                            <div className="absolute bottom-0 right-0 rounded-tl-[6px] bg-white/15 px-1.5 py-0.5 text-white backdrop-blur-sm">
                              <div className="text-[11px] font-bold leading-none">{badge.day}</div>
                            </div>
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 items-center py-2 pr-3">
                          <p className="text-[12px] font-medium leading-[1.45] text-white/90 transition-colors group-hover:text-emerald-300 line-clamp-2">
                            {related.title}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-white/50 italic">
                  Hiện chưa có bài viết liên quan.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
