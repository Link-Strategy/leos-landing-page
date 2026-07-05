import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatBlogDate } from "@/lib/blog-utils";
import {
  getCachedPublicBlogArticleBySlug,
  getCachedRelatedBlogArticles,
} from "@/lib/blog/queries";
import { buildBlogArticleMetadata } from "@/lib/blog/seo";
import { renderMarkdownToHtml } from "@/lib/blog/markdown";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CtaButton from "@/components/blog/CtaButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getCachedPublicBlogArticleBySlug(slug);
  if (!article) return { title: "Bài viết không tìm thấy - LeOS" };

  return buildBlogArticleMetadata(article);
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getCachedPublicBlogArticleBySlug(slug);

  if (!article) notFound();

  const bodyHtml = await renderMarkdownToHtml(article.contentMarkdown);

  const relatedArticles = await getCachedRelatedBlogArticles(
    slug,
    article.category,
    article.tags,
    3,
  );

  return (
    <div className="min-h-screen bg-background">
      <article className="relative py-20">
        <div className="absolute inset-0 opacity-[0.15]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--muted-foreground) / 0.15) 1px, transparent 0)", backgroundSize: "24px 24px" }}
        />
        <div className="container relative mx-auto px-4 z-10 max-w-[800px]">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            &larr; Quay lại Blog
          </Link>

          <div className="flex items-center gap-3 mb-4">
            {article.category && <Badge variant="secondary">{article.category}</Badge>}
            <span className="text-sm text-muted-foreground">{formatBlogDate(article.publishedAt!)}</span>
            <span className="text-sm text-muted-foreground">{article.readingTimeMinutes} phút đọc</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">{article.title}</h1>

          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8">
            <span>Tác giả: {article.authorName || "LeOS Team"}</span>
            {article.tags.length > 0 && article.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] px-2 py-0.5">{tag}</Badge>
            ))}
          </div>

          {article.coverImage && (
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-10">
              <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose prose-invert max-w-none text-base leading-relaxed text-foreground/90 prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-img:rounded-xl prose-pre:bg-muted prose-code:text-primary"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <Link href="/blog" className="text-primary hover:underline">&larr; Xem tất cả bài viết</Link>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="relative pb-20">
          <div className="container relative mx-auto px-4 z-10 max-w-[1200px]">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-foreground mb-2">Bài viết liên quan</h2>
              <p className="text-muted-foreground text-sm">Có thể bạn cũng quan tâm</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link key={related.slug} href={`/blog/${related.slug}`} className="group block">
                  <Card variant="glass" className="h-full flex flex-col">
                    {related.coverImage && (
                      <div className="relative w-full h-40 overflow-hidden rounded-t-card-glass">
                        <img
                          src={related.coverImage}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <CardHeader className={related.coverImage ? "pt-4" : ""}>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {related.category && (
                          <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                            {related.category}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-sm font-bold leading-snug group-hover:text-primary transition-colors">
                        {related.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-xs text-muted-foreground/80 line-clamp-2">{related.excerpt}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
