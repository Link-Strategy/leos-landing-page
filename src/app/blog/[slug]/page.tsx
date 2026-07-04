import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogDb } from "@/lib/mongodb";
import { blogAssetToPost, formatBlogDate, type BlogAsset, type BlogPost } from "@/lib/blog-utils";
import { renderMarkdownToHtml } from "@/lib/blog/markdown";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const db = await getBlogDb();
    const allAssets = await db.collection<BlogAsset>("assets")
      .find({ platform: "blog", status: "published" })
      .toArray();
    for (const asset of allAssets) {
      const post = blogAssetToPost(asset);
      if (post.slug === slug) return post;
    }
  } catch {
    // DB not available
  }
  return null;
}

function estimateReadingTime(body: string): number {
  const wordsPerMinute = 300;
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Bai viet khong tim thay - LeOS" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://linkstrategy.io.vn";

  return {
    title: post.title + " - LeOS",
    description: post.excerpt,
    alternates: { canonical: `${siteUrl}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      tags: post.tags,
      url: `${siteUrl}/blog/${post.slug}`,
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const bodyHtml = await renderMarkdownToHtml(post.body);
  const readingTime = estimateReadingTime(post.body);

  return (
    <div className="min-h-screen bg-background">
      <article className="relative py-20">
        <div className="absolute inset-0 opacity-[0.15]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--muted-foreground) / 0.15) 1px, transparent 0)", backgroundSize: "24px 24px" }}
        />
        <div className="container relative mx-auto px-4 z-10 max-w-[800px]">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            &larr; Quay lai Blog
          </Link>

          <div className="flex items-center gap-3 mb-4">
            {post.category && <Badge variant="secondary">{post.category}</Badge>}
            <span className="text-sm text-muted-foreground">{formatBlogDate(post.publishedAt)}</span>
            <span className="text-sm text-muted-foreground">{readingTime} phut doc</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">{post.title}</h1>

          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8">
            <span>Tac gia: {post.author}</span>
            {post.tags.length > 0 && post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] px-2 py-0.5">{tag}</Badge>
            ))}
          </div>

          {post.coverImage && (
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-10">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose prose-invert max-w-none text-base leading-relaxed text-foreground/90 prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-img:rounded-xl prose-pre:bg-muted prose-code:text-primary"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          {post.cta && (
            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 text-center">
              <p className="text-lg font-semibold text-foreground mb-4">{post.cta}</p>
              <button onClick={async () => {
                try { await fetch("/api/blog/track-click", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ articleId: post.id, ctaId: "article_cta_primary", destinationUrl: "/lien-he" }) }); } catch {}
                window.location.href = "/lien-he";
              }} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors cursor-pointer">
                Lien he tu van &rarr;
              </button>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <Link href="/blog" className="text-primary hover:underline">&larr; Xem tat ca bai viet</Link>
          </div>
        </div>
      </article>
    </div>
  );
}
