export function formatBlogDate(dateStr: string | Date): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
