import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type SubpageHeroProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  image: string;
  align?: "left" | "center";
};

export function SubpageHero({
  title,
  eyebrow,
  description,
  image,
  align = "left",
}: SubpageHeroProps) {
  const centered = align === "center";

  return (
    <section className="relative isolate flex min-h-[720px] items-end overflow-hidden px-6 pb-[60px] pt-32 sm:px-10 lg:px-20">
      <Image
        alt={title}
        className="absolute inset-0 -z-20 object-cover"
        fill
        priority
        sizes="100vw"
        src={image}
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#0D1B4B_6.73%,rgba(13,27,75,0.36)_36.06%,rgba(13,27,75,0)_72%,#0D1B4B_100%)]" />
      <div className={cn("w-full max-w-[980px] animate-fade-in-up", centered && "mx-auto text-center")}>
        {eyebrow ? (
          <p className="mb-4 text-[18px] font-normal leading-[1.3] text-white/85">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-[40px] font-extrabold leading-[1.15] text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-[56px] lg:text-[64px]">
          {title}
        </h1>
        {description ? (
          <p className={cn("mt-5 max-w-3xl text-[18px] leading-[1.45] text-white/78", centered && "mx-auto")}>
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
}) {
  const centered = align === "center";

  return (
    <div className={cn("space-y-4", centered && "mx-auto max-w-3xl text-center")}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-[32px] font-extrabold leading-[1.3] text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-[40px]">
        {title}
      </h2>
      {description ? (
        <p className={cn("text-[18px] font-normal leading-[1.45] text-white/70", centered && "mx-auto max-w-2xl")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function GlassPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-white/10 bg-[#132563]/45 p-6 shadow-[0_2px_20px_rgba(12,178,255,0.12)] backdrop-blur-md transition duration-300 hover:border-emerald-400/35 hover:bg-[#132563]/65",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function FeatureGrid({
  items,
  columns = "lg:grid-cols-3",
}: {
  items: Array<{ title: string; description: string; icon?: ReactNode; tone?: string }>;
  columns?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-6 md:grid-cols-2", columns)}>
      {items.map((item) => (
        <GlassPanel className="group min-h-[190px]" key={item.title}>
          <div className="mb-5 flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-2xl">
            {item.icon ?? <span className={item.tone ?? "text-emerald-300"}>●</span>}
          </div>
          <h3 className="text-[22px] font-bold leading-[1.3] text-white transition group-hover:text-emerald-300">
            {item.title}
          </h3>
          <p className="mt-3 text-[16px] font-normal leading-[1.45] text-white/68">
            {item.description}
          </p>
        </GlassPanel>
      ))}
    </div>
  );
}

export function ImageTextSection({
  image,
  imageAlt,
  eyebrow,
  title,
  description,
  children,
  reverse = false,
  imageClassName,
}: {
  image: string;
  imageAlt: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  reverse?: boolean;
  imageClassName?: string;
}) {
  return (
    <section className="bg-[#0D1B4B] px-6 py-[60px] sm:px-10 lg:px-20">
      <div className={cn("mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-2 lg:gap-[126px]", reverse && "lg:[&>*:first-child]:order-2")}>
        <div className="space-y-8">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          {children}
        </div>
        <div className="relative overflow-hidden rounded-[20px] border border-white/10 shadow-[0_2px_20px_rgba(12,178,255,0.12)]">
          <Image
            alt={imageAlt}
            className={cn("h-auto w-full object-cover transition duration-500 hover:scale-[1.03]", imageClassName)}
            height={720}
            src={image}
            width={960}
          />
        </div>
      </div>
    </section>
  );
}

export function CTASection({
  title,
  description,
  href,
  label,
  backgroundImage,
}: {
  title: ReactNode;
  description?: ReactNode;
  href: string;
  label: string;
  backgroundImage?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[#0D1B4B] px-6 py-[90px] sm:px-10 lg:px-20">
      {backgroundImage ? (
        <Image alt="" className="absolute inset-0 -z-10 object-cover opacity-45" fill sizes="100vw" src={backgroundImage} />
      ) : null}
      <div className="mx-auto max-w-[980px] text-center">
        <SectionHeading align="center" title={title} description={description} />
        <Link
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-[18px] font-semibold leading-[1.3] text-white shadow-[0_2px_20px_rgba(12,178,255,0.26)] transition hover:bg-emerald-400"
          href={href}
        >
          {label}
          <ArrowRight aria-hidden className="size-5" />
        </Link>
      </div>
    </section>
  );
}
