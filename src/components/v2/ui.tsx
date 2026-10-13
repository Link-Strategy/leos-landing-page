import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import SectionEdgeFade from "@/components/ui/section-edge-fade";
import { v2Href } from "@/lib/v2-routes";
import { ContactCta } from "@/components/contact/ContactDialog";

// Shared building blocks for the V2 sections. They reuse the site's existing look: dark navy backgrounds,
// cyan eyebrows, gradient headings and translucent bordered cards.

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`font-inter text-[12px] font-bold uppercase leading-[18px] tracking-[2.6px] text-[#63D9FF] [text-shadow:0px_0px_6px_rgba(99,217,255,0.18)] lg:text-[14px] lg:leading-[20px] ${className}`}
    >
      {children}
    </span>
  );
}

export function SectionTitle({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <Tag
      className={`font-inter m-0 whitespace-pre-line bg-[linear-gradient(90deg,#6DEBFF_0%,#38CFFF_55%,#F5FCFF_100%)] bg-clip-text text-[30px] font-bold leading-[38px] tracking-[-0.8px] text-transparent lg:text-[44px] lg:leading-[52px] ${className}`}
    >
      {children}
    </Tag>
  );
}

export function Lead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-open-sans m-0 text-[16px] leading-[26px] text-[#E5F0FA] lg:text-[18px] lg:leading-[30px] ${className}`}>
      {children}
    </p>
  );
}

export function Caption({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`font-open-sans m-0 text-[13px] leading-[20px] text-white/65 ${className}`}>{children}</p>;
}

export function V2Section({
  children,
  tone = "dark",
  className = "",
  id,
}: {
  children: ReactNode;
  tone?: "dark" | "mid";
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`relative w-full overflow-hidden py-14 lg:py-20 ${
        tone === "dark" ? "bg-[#020E30]" : "bg-[linear-gradient(180deg,#071a4a_0%,#0a2159_100%)]"
      } ${className}`}
    >
      <SectionEdgeFade position="top" />
      <SectionEdgeFade position="bottom" />
      <div className="container-le relative z-10">{children}</div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  className = "",
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  className?: string;
}) {
  return (
    <div className={`mb-10 flex max-w-[860px] flex-col gap-4 lg:mb-12 ${className}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <SectionTitle>{title}</SectionTitle>
      {lead && <Lead>{lead}</Lead>}
    </div>
  );
}

export function StatusTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block w-fit rounded-full border border-[#FAB81F]/60 px-3 py-[2px] font-inter text-[11px] font-semibold uppercase tracking-[0.6px] text-[#FAB81F]">
      {children}
    </span>
  );
}

export function V2Link({ route, children, className = "" }: { route: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={v2Href(route)}
      className={`group inline-flex w-fit items-center gap-2 font-inter text-[14px] font-semibold text-[#63D9FF] no-underline transition-colors hover:text-white ${className}`}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
    </Link>
  );
}

export function V2Button({
  route,
  children,
  tone = "primary",
}: {
  route: string;
  children: ReactNode;
  tone?: "primary" | "outline";
}) {
  return (
    <Link
      href={v2Href(route)}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-inter text-[15px] font-semibold text-white no-underline transition-transform duration-300 hover:-translate-y-0.5 ${
        tone === "primary"
          ? "bg-gradient-to-b from-[#76c6ff] to-[#2a75f3]"
          : "border border-white/40 bg-transparent hover:border-[#63D9FF]"
      }`}
    >
      {children}
      <ArrowRight className="size-4" strokeWidth={2} />
    </Link>
  );
}

export type V2CardItem = {
  eyebrow: string;
  title: string;
  body: string;
  status?: string;
  route?: string;
};

export function V2Card({ item, linkLabel }: { item: V2CardItem; linkLabel?: string }) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-[20px] border border-white/25 bg-[#FFFFFF14] p-6 transition-colors duration-300 hover:border-[#2A9FFF] lg:p-7">
      <Eyebrow className="!text-[11px] !tracking-[2px] lg:!text-[12px]">{item.eyebrow}</Eyebrow>
      <h3 className="font-inter m-0 text-[22px] font-bold leading-[28px] text-white lg:text-[24px] lg:leading-[30px]">{item.title}</h3>
      <p className="font-open-sans m-0 text-[15px] leading-[24px] text-[#E5F0FA]">{item.body}</p>
      {item.route && linkLabel && (
        <ContactCta variant="link" topic={item.title} className="mt-auto pt-2">
          {linkLabel.replace("{name}", item.title)}
        </ContactCta>
      )}
    </article>
  );
}

export function V2CardGrid({
  items,
  linkLabel,
  columns = 3,
}: {
  items: V2CardItem[];
  linkLabel?: string;
  columns?: 2 | 3;
}) {
  return (
    <div className={`grid gap-5 md:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}>
      {items.map((item) => (
        <V2Card key={item.title} item={item} linkLabel={linkLabel} />
      ))}
    </div>
  );
}

export function V2Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[20px] border border-[#2A9FFF]/55 bg-[#061a40] p-6 lg:p-8">
      <h3 className="font-inter m-0 text-[20px] font-bold text-white">{title}</h3>
      <p className="font-open-sans mb-0 mt-3 text-[15px] leading-[24px] text-[#E5F0FA]">{body}</p>
    </div>
  );
}

/** Hero for the V2 inner pages. Padded for the fixed site header. */
export function V2PageHero({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <section className="relative w-full overflow-hidden bg-[linear-gradient(180deg,#010B28_0%,#071a4a_100%)] pb-14 pt-[calc(var(--header-height-mobile)+48px)] lg:pb-20 lg:pt-[calc(var(--header-height)+72px)]">
      <div className="container-le relative z-10 flex max-w-[1100px] flex-col gap-5">
        <Eyebrow>{eyebrow}</Eyebrow>
        <SectionTitle as="h1" className="lg:!text-[56px] lg:!leading-[64px]">
          {title}
        </SectionTitle>
        <Lead className="max-w-[760px]">{body}</Lead>
      </div>
    </section>
  );
}
