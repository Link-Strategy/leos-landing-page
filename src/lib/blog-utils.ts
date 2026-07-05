export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  body: string;
  excerpt: string;
  cta?: string;
  category?: string;
  tags: string[];
  author: string;
  coverImage?: string;
  publishedAt: string;
  createdAt: string;
}

export interface BlogAsset {
  _id: Record<string, unknown>;
  title?: string;
  body?: string;
  excerpt?: string;
  cta?: string;
  status: string;
  platform: string;
  publish_at?: Date;
  created_at?: Date;
  platform_metadata?: {
    slug?: string;
    category?: string;
    tags?: string[];
    authorName?: string;
    coverImage?: string;
    excerpt?: string;
    seoTitle?: string;
    seoDescription?: string;
    noindex?: boolean;
  };
  media?: Array<{ type: string; url: string; alt?: string }>;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function extractExcerpt(body: string, maxLen = 180): string {
  const clean = body.replace(/[#*`_\[\]]/g, "").trim();
  const firstLine = clean.split("\n")[0];
  return firstLine.length > maxLen ? firstLine.slice(0, maxLen) + "..." : firstLine;
}

export function formatBlogDate(dateStr: string | Date): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function blogAssetToPost(asset: BlogAsset): BlogPost {
  const meta = asset.platform_metadata || {};
  const title = asset.title || "";
  const body = asset.body || "";
  const slug = meta.slug || generateSlug(title);
  const id = typeof asset._id === "object" && asset._id !== null
    ? String(asset._id)
    : String(asset._id || "");

  return {
    id,
    title,
    slug,
    body,
    excerpt: meta.excerpt || extractExcerpt(body),
    cta: asset.cta,
    category: meta.category || "General",
    tags: meta.tags || [],
    author: meta.authorName || "LeTRON Team",
    coverImage: meta.coverImage || (asset.media?.[0]?.url),
    publishedAt: (asset.publish_at || asset.created_at)?.toISOString() || new Date().toISOString(),
    createdAt: asset.created_at?.toISOString() || new Date().toISOString(),
  };
}
