import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatBlogDate } from "@/lib/blog-utils";
import { getCachedPublicBlogArticles } from "@/lib/blog/queries";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} | Blog`,
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
    <div className="w-full bg-[#0d1b4b] px-20 max-[1550px]:px-[60px] max-lg:px-[25px] max-md:px-4 py-[60px] min-h-screen text-white">
      <div className="mx-auto flex w-full max-w-full flex-col gap-10">
        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#2a9fff]">Chủ đề</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {posts[0].category || slug.replace(/-/g, " ")}
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-white/70">
            {posts.length} bài viết về chủ đề này
          </p>
          <Link href="/blog" className="text-sm text-[#2a9fff] hover:underline">← Quay lại Blog</Link>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="group rounded-xl border border-white/10 p-6 transition hover:border-[#2a9fff]/30 hover:shadow-sm">
              {post.coverImage && (
                <img src={post.coverImage} alt="" className="mb-4 h-40 w-full rounded-lg object-cover" />
              )}
              <p className="text-xs uppercase tracking-[0.3em] text-[#2a9fff]">{post.category}</p>
              <h2 className="mt-2 text-xl font-semibold group-hover:text-[#2a9fff]">{post.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-white/70">{post.excerpt}</p>
              <p className="mt-3 text-xs text-white/40">{formatBlogDate(post.publishedAt!)}</p>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
