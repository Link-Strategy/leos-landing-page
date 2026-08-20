export default function BlogDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative py-20">
        <div className="container relative mx-auto px-4 z-10 max-w-[800px]">
          {/* Back link */}
          <div className="mb-8 h-5 w-32 animate-pulse rounded bg-muted" />

          {/* Meta row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
            <div className="h-5 w-28 animate-pulse rounded bg-muted" />
            <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          </div>

          {/* Title */}
          <div className="mb-4 space-y-3">
            <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
            <div className="h-10 w-3/4 animate-pulse rounded-lg bg-muted" />
          </div>

          {/* Author + tags */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-5 w-32 animate-pulse rounded bg-muted" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
          </div>

          {/* Cover image */}
          <div className="mb-10 h-[400px] w-full animate-pulse rounded-2xl bg-muted" />

          {/* Content lines */}
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`h-4 animate-pulse rounded bg-muted ${
                  i % 3 === 0 ? "w-full" : i % 3 === 1 ? "w-5/6" : "w-4/6"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
