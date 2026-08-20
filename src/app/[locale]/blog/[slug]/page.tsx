import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bookmark, Clock, Home } from "lucide-react";
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

  const displayRelatedArticles =
    fallbackRelatedArticles.length > 0
      ? fallbackRelatedArticles
      : mockRelatedArticles;

  const categoryLabel = article.category || "Tin tức - Sự kiện";

  return (
    <section className="w-full bg-[#0d1b4b] px-20 max-[1550px]:px-[60px] max-lg:px-[25px] max-md:px-4 pb-5 lg:pb-8 pt-[calc(var(--header-height-mobile)+20px)] lg:pt-[calc(var(--header-height)+32px)]">
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
                {article.title}
              </span>
            </nav>

            {/* Header */}
            <div className="flex w-full flex-col gap-3">
              <h1 className="relative font-display text-[24px] font-extrabold leading-[1.2] text-white drop-shadow-[0px_4px_20px_rgba(0,140,255,0.2)] sm:text-[28px] lg:text-[30px]">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-[35px]">
                <div className="flex items-center gap-[10px]">
                  <Bookmark className="h-4 w-4 text-[#2a9fff]" />
                  <span className="font-display text-[16px] font-normal leading-[32px] text-[#2a9fff]">
                    {categoryLabel}
                  </span>
                </div>
                <div className="flex items-center gap-[10px]">
                  <Clock className="h-4 w-4 text-white" />
                  <span className="font-display text-[16px] font-normal leading-[32px] text-white">
                    Ngày đăng: {formatCompactDate(article.publishedAt!)}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-white/20" />

            {/* Lead / Excerpt */}
            {article.excerpt && (
              <p className="font-display text-[18px] font-bold leading-normal text-white lg:text-[20px]">
                {article.excerpt}
              </p>
            )}

            {/* Hero image */}
            {article.coverImage && (
              <div className="flex w-full flex-col gap-4">
                <div className="relative aspect-789/522 w-full overflow-hidden rounded-[26px]">
                  <img
                    alt={article.title}
                    className="absolute inset-0 size-full object-cover"
                    src={article.coverImage}
                  />
                </div>
                {article.authorName && (
                  <p className="font-sans text-[14px] font-normal italic leading-normal text-white/70">
                    Tác giả: {article.authorName}
                  </p>
                )}
              </div>
            )}

            {/* Body */}
            <div className="flex w-full flex-col gap-4 text-white">
              <div
                className="prose prose-invert max-w-none text-white/90 prose-headings:font-display prose-headings:font-bold prose-headings:text-white prose-p:text-[14px] sm:prose-p:text-[16px] prose-p:leading-[1.5] prose-p:font-sans prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-white/20" />

            {/* Share */}
            <ShareButtons url={`/blog/${article.slug}`} title={article.title} />
          </article>

          {/* Related news */}
          <aside className="flex w-full xl:w-[28%] shrink-0 flex-col gap-[23px] xl:pt-[84px]">
            <div className="flex w-full flex-col gap-[17px]">
              <h2 className="font-display text-[20px] font-bold leading-[1.3] text-white lg:text-[24px]">
                Tin tức liên quan
              </h2>
              <div className="h-px w-full bg-white/20" />
            </div>
            {displayRelatedArticles.length > 0 ? (
              <div className="flex flex-col gap-6">
                {displayRelatedArticles.map((related) => {
                  const publishDate = related.publishedAt ? new Date(related.publishedAt) : new Date();
                  const day = String(publishDate.getDate()).padStart(2, "0");
                  const month = `tháng ${publishDate.getMonth() + 1}`;

                  return (
                    <Link
                      key={related.slug}
                      href={`/blog/${related.slug}`}
                      className="group flex gap-4"
                    >
                      <div className="relative h-[154px] w-[232px] shrink-0 overflow-hidden rounded-[12px]">
                        <img
                          alt={related.title}
                          className="absolute inset-0 size-full object-cover transition duration-300 group-hover:scale-105"
                          src={related.coverImage || "/figmaAssets/b-i-tin-1.png"}
                        />
                        <div className="absolute right-0 top-[104px] flex h-[50px] w-[66px] flex-col items-center justify-center bg-linear-to-b from-white/20 to-[rgba(244,244,244,0.2)] text-center text-white shadow-[0px_1px_10px_0px_rgba(0,0,0,0.15)] backdrop-blur-[2px]">
                          <span className="font-display text-[16px] font-bold leading-none">
                            {day}
                          </span>
                          <span className="font-display text-[10px] font-normal uppercase leading-none mt-1">
                            {month}
                          </span>
                        </div>
                      </div>
                      <p className="font-display h-[99px] overflow-hidden text-[14px] font-bold leading-normal text-white line-clamp-5 sm:text-[16px] transition-colors group-hover:text-[#2a9fff]">
                        {related.title}
                      </p>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-white/50 italic">
                Hiện chưa có bài viết liên quan.
              </p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
