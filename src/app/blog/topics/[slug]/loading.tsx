export default function TopicLoading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 py-12">
      <section className="space-y-4">
        <div className="mb-4 h-5 w-20 animate-pulse rounded bg-muted" />
        <div className="mb-2 h-10 w-72 animate-pulse rounded-lg bg-muted" />
        <div className="h-5 w-48 animate-pulse rounded bg-muted" />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-xl bg-muted/50" />
        ))}
      </section>
    </div>
  );
}
