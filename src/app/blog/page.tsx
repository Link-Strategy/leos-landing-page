import { Metadata } from "next";
import Link from "next/link";
import { getBlogDb } from "@/lib/mongodb";
import { blogAssetToPost, formatBlogDate, generateSlug, type BlogAsset, type BlogPost } from "@/lib/blog-utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Blog - LeOS",
  description: "Công nghệ xanh, vận hành thông minh — tin tức và kiến thức từ LeOS",
};

async function getPublishedPosts(): Promise<BlogPost[]> {
  const db = await getBlogDb();
  const assets = await db.collection<BlogAsset>("assets")
    .find({ platform: "blog", status: "published" })
    .sort({ publish_at: -1, created_at: -1 })
    .toArray();

  return assets.map(blogAssetToPost);
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.15]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--muted-foreground) / 0.15) 1px, transparent 0)", backgroundSize: "24px 24px" }}
        />
        <div className="container relative mx-auto px-4 z-10 max-w-[1400px]">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-xs font-semibold">
              Blog
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Công nghệ xanh — Vận hành thông minh
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Kiến thức, case study và cập nhật từ đội ngũ LeOS về chuyển đổi xanh và vận hành bền vững.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Chưa có bài viết nào. Quay lại sau nhé!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <Card variant="glass" className="h-full flex flex-col">
                    {post.coverImage && (
                      <div className="relative w-full h-48 overflow-hidden rounded-t-card-glass">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <CardHeader className={post.coverImage ? "pt-4" : ""}>
                      <div className="flex items-center gap-2 mb-2">
                        {post.category && (
                          <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                            {post.category}
                          </Badge>
                        )}
                        <span className="text-[10px] text-muted-foreground">
                          {formatBlogDate(post.publishedAt)}
                        </span>
                      </div>
                      <CardTitle className="text-base font-bold leading-snug group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-muted-foreground/80 line-clamp-3">
                        {post.excerpt}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <span className="text-xs text-primary font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Đọc tiếp →
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
