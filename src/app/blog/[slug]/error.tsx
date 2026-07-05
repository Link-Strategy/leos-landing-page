"use client";

export default function BlogDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Không thể tải bài viết
        </h1>
        <p className="text-muted-foreground mb-6">
          Đã có lỗi xảy ra khi tải nội dung bài viết. Vui lòng thử lại sau.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
