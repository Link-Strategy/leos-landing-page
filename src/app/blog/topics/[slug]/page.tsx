import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatBlogDate } from "@/lib/blog-utils";
import { getCachedPublicBlogArticles } from "@/lib/blog/queries";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} | LeOS Blog`,
    description: `Articles about ${slug.replace(/-/g, " ")}`,
  };
}

async function getPostsByCategory(slug: string) {
  try {
    const articles = await getCachedPublicBlogArticles(slug);
    return articles;
  } catch {
    return [];
  }
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getPostsByCategory(slug);

  if (posts.length === 0) notFound();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 py-12">
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary/80">Chủ đề</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {posts[0].category || slug.replace(/-/g, " ")}
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
          {posts.length} bài viết về chủ đề này
        </p>
        <Link href="/blog" className="text-sm text-primary hover:underline">← Quay lại Blog</Link>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}
            className="group rounded-xl border border-border/70 p-6 transition hover:border-primary/30 hover:shadow-sm">
            {post.coverImage && (
              <img src={post.coverImage} alt="" className="mb-4 h-40 w-full rounded-lg object-cover" />
            )}
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{post.category}</p>
            <h2 className="mt-2 text-xl font-semibold group-hover:text-primary">{post.title}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
            <p className="mt-3 text-xs text-muted-foreground">{formatBlogDate(post.publishedAt!)}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
