export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 overflow-hidden">
        <div className="container relative mx-auto px-4 z-10 max-w-[1400px]">
          {/* Title skeleton */}
          <div className="text-center mb-12">
            <div className="mx-auto mb-4 h-6 w-16 animate-pulse rounded-full bg-muted" />
            <div className="mx-auto mb-4 h-10 w-96 max-w-full animate-pulse rounded-lg bg-muted" />
            <div className="mx-auto h-6 w-72 max-w-full animate-pulse rounded bg-muted" />
          </div>

          {/* Category pills skeleton */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 w-20 animate-pulse rounded-full bg-muted" />
            ))}
          </div>

          {/* Cards grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[380px] animate-pulse rounded-xl bg-muted/50" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
