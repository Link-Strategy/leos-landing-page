import { Metadata } from "next";
import Link from "next/link";
import { getCachedPublicBlogArticles, getCachedAvailableBlogCategories } from "@/lib/blog/queries";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Tin tức - Sự kiện - Blog",
  description: "Cập nhật tin tức mới của LeTRON - Công nghệ xanh, chuyển đổi số và phát triển bền vững",
};

export default async function BlogPage() {
  let articles: Awaited<ReturnType<typeof getCachedPublicBlogArticles>> = [];
  let categories: Awaited<ReturnType<typeof getCachedAvailableBlogCategories>> = [];
  try {
    articles = await getCachedPublicBlogArticles();
    categories = (await getCachedAvailableBlogCategories()).filter(c => c.count > 0);
  } catch {}

  return (
    <div>
      {/* ====== HERO ====== */}
      <div className="flex flex-col bg-cover bg-center bg-no-repeat min-h-[720px] relative"
        style={{ backgroundImage: "url('/wp-content/uploads/2026/05/image-6-1.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 w-full flex flex-col flex-1 mx-auto px-20 max-[1550px]:px-[60px] max-lg:px-[25px] max-md:px-4 pb-[60px]" style={{ justifyContent: "flex-end" }}>
          <nav className="rank-math-breadcrumb text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.6)" }}>Home</Link>
            <span className="separator" style={{ color: "rgba(255,255,255,0.3)", margin: "0 8px" }}>/</span>
            <span className="last" style={{ color: "white" }}>Tin tức - Sự kiện</span>
          </nav>
          <h1 className="elementor-heading-title elementor-size-default" style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 64, lineHeight: "1.3em", color: "#FFFFFF" }}>
            Cập nhật tin tức mới của <span style={{ color: "#2A9FFF" }}>LeTRON</span>
          </h1>
          <p style={{ marginTop: 24, color: "rgb(255, 255, 255)", fontSize: 16, lineHeight: 1.5 }}>
            Những câu chuyện, dữ liệu và chuyển động mới nhất từ hành trình kiến tạo công nghiệp xanh và tương lai Net Zero.
          </p>
        </div>
      </div>

      <BlogClient articles={articles} categories={categories} />
    </div>
  );
}
