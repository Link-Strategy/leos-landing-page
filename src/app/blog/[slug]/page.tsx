import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogDb } from "@/lib/mongodb";
import { blogAssetToPost, formatBlogDate, type BlogAsset, type BlogPost } from "@/lib/blog-utils";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const db = await getBlogDb();
  const allAssets = await db.collection<BlogAsset>("assets")
    .find({ platform: "blog", status: "published" })
    .toArray();

  for (const asset of allAssets) {
    const post = blogAssetToPost(asset);
    if (post.slug === slug) return post;
  }
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Bai viet khong tim thay - LeOS" };

  return {
    title: post.title + " - LeOS",
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const bodyHtml = post.body
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br />");

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

          <div className="prose prose-invert max-w-none text-base leading-relaxed text-foreground/90 prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          {post.cta && (
            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 text-center">
              <p className="text-lg font-semibold text-foreground mb-4">{post.cta}</p>
              <Link href="/lien-he" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                Lien he tu van &rarr;
              </Link>
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
