import { Metadata } from "next";
import Link from "next/link";
import { getBlogDb } from "@/lib/mongodb";
import { blogAssetToPost, formatBlogDate, type BlogAsset, type BlogPost } from "@/lib/blog-utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Blog - LeOS",
  description: "Cong nghe xanh, van hanh thong minh ? tin tuc va kien thuc tu LeOS",
};

const POSTS_PER_PAGE = 9;

function estimateReadingTime(body: string): number {
  return Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 300));
}

async function getPublishedPosts(): Promise<BlogPost[]> {
  const db = await getBlogDb();
  const assets = await db.collection<BlogAsset>("assets")
    .find({ platform: "blog", status: "published" })
    .sort({ publish_at: -1, created_at: -1 })
    .toArray();
  return assets.map(blogAssetToPost);
}

function getUniqueCategories(posts: BlogPost[]): string[] {
  const cats = new Set<string>(); posts.forEach((p) => { if (p.category) cats.add(p.category); });
  return [...cats];
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; cat?: string }>;
}) {
  const allPosts = await getPublishedPosts();
  const { page, cat } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);
  const selectedCategory = cat || "";

  let filtered = allPosts;
  if (selectedCategory) {
    filtered = allPosts.filter(
      (p) => (p.category ?? "").toLowerCase().replace(/\s+/g, "-") === selectedCategory
    );
  }

  const categories = getUniqueCategories(allPosts);
  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const pagedPosts = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.15]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--muted-foreground) / 0.15) 1px, transparent 0)", backgroundSize: "24px 24px" }}
        />
        <div className="container relative mx-auto px-4 z-10 max-w-[1400px]">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-xs font-semibold">Blog</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Cong nghe xanh ? Van hanh thong minh
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Kien thuc, case study va cap nhat tu doi ngu LeOS ve chuyen doi xanh va van hanh ben vung.
            </p>
          </div>

          {/* Topics Navigation */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              <Link
                href="/blog"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Tat ca
              </Link>
              {categories.map((catName) => {
                const catSlug = catName.toLowerCase().replace(/\s+/g, "-");
                return (
                  <Link
                    key={catSlug}
                    href={`/blog?cat=${catSlug}`}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === catSlug
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {catName}
                  </Link>
                );
              })}
            </div>
          )}

          {pagedPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Chua co bai viet nao. Quay lai sau nhe!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pagedPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <Card variant="glass" className="h-full flex flex-col">
                    {post.coverImage && (
                      <div className="relative w-full h-48 overflow-hidden rounded-t-card-glass">
                        <img src={post.coverImage} alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <CardHeader className={post.coverImage ? "pt-4" : ""}>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {post.category && (
                          <Badge variant="outline" className="text-[10px] px-2 py-0.5">{post.category}</Badge>
                        )}
                        <span className="text-[10px] text-muted-foreground">{formatBlogDate(post.publishedAt)}</span>
                        <span className="text-[10px] text-muted-foreground">{estimateReadingTime(post.body)} phut doc</span>
                      </div>
                      <CardTitle className="text-base font-bold leading-snug group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-muted-foreground/80 line-clamp-3">{post.excerpt}</p>
                    </CardContent>
                    <CardFooter>
                      <span className="text-xs text-primary font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Doc tiep ?
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              {currentPage > 1 && (
                <Link
                  href={`/blog?page=${currentPage - 1}${selectedCategory ? `&cat=${selectedCategory}` : ""}`}
                  className="px-4 py-2 rounded-lg bg-muted text-sm hover:bg-muted/80 transition-colors"
                >
                  ? Trang truoc
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/blog?page=${p}${selectedCategory ? `&cat=${selectedCategory}` : ""}`}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                    p === currentPage
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {p}
                </Link>
              ))}
              {currentPage < totalPages && (
                <Link
                  href={`/blog?page=${currentPage + 1}${selectedCategory ? `&cat=${selectedCategory}` : ""}`}
                  className="px-4 py-2 rounded-lg bg-muted text-sm hover:bg-muted/80 transition-colors"
                >
                  Trang sau ?
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
