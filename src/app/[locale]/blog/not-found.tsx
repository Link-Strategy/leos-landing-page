import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="text-6xl mb-6">📝</div>
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Trang blog không tìm thấy
        </h1>
        <p className="text-muted-foreground mb-6">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xoá.
        </p>
        <Link
          href="/blog"
          className="inline-flex px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
        >
          Quay lại Blog
        </Link>
      </div>
    </div>
  );
}
