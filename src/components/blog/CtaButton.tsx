"use client";

interface CtaButtonProps {
  articleId: string;
  destinationUrl?: string;
  label?: string;
}

export default function CtaButton({
  articleId,
  destinationUrl = "/lien-he",
  label = "Lien he tu van",
}: CtaButtonProps) {
  const handleClick = async () => {
    try {
      await fetch("/api/blog/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId,
          ctaId: "article_cta_primary",
          destinationUrl,
        }),
      });
    } catch {
      // silently fail tracking
    }
    window.location.href = destinationUrl;
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
    >
      {label} &rarr;
    </button>
  );
}
