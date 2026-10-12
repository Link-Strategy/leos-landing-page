import Image from "next/image";

// Mirrors the image hosts allowed in next.config.ts. Other hosts fall back to a plain lazy <img>
// so a cover from an unexpected origin can never break the page render.
function canOptimize(src: string): boolean {
  if (src.startsWith("/")) return true;
  try {
    const host = new URL(src).hostname;
    if (host === "images.unsplash.com" || host === "letron-blog-content-dev.s3.ap-southeast-1.amazonaws.com") return true;
    const bucket = process.env.S3_BUCKET_NAME;
    return !!bucket && host === `${bucket}.s3.${process.env.S3_REGION || "ap-southeast-1"}.amazonaws.com`;
  } catch {
    return false;
  }
}

/** Server-side cover image: resized WebP via next/image, lazy by default. Parent must be `relative` and sized. */
export default function CoverImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  if (!canOptimize(src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" className={className} />;
  }
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />;
}
