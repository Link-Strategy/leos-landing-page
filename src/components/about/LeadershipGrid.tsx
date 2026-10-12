import Image from "next/image";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { getSiteUrl } from "@/lib/blog/seo";

type LeadershipMemberMeta = {
  id: string;
  messageKey: string;
  photo: string;
};

// Descriptive filenames (name + title + brand) matter for Google Images ranking,
// not just alt text.
const LEADERSHIP_MEMBERS_META: LeadershipMemberMeta[] = [
  { id: "815", messageKey: "cfo", photo: "/about/nguyen-van-cong-cfo-letron.png" },
  { id: "816", messageKey: "HR", photo: "/about/nguyen-thi-mai-lien-hr-ga-letron.png" },
  { id: "813", messageKey: "chairman", photo: "/about/le-minh-tien-chu-tich-hdqt-letron.png" },
  { id: "811", messageKey: "ceo", photo: "/about/hoang-le-thuy-ceo-letron.png" },
  { id: "809", messageKey: "lear", photo: "/about/le-duc-anh-lear-letron.png" }
];

type LeadershipGridProps = {
  onClose?: () => void;
};

export function LeadershipGrid({ onClose }: LeadershipGridProps) {
  const t = useTranslations("leadership");
  const siteUrl = getSiteUrl();
  const LEADERSHIP_MEMBERS = LEADERSHIP_MEMBERS_META.map((meta) => ({
    id: meta.id,
    photo: meta.photo,
    name: t(`members.${meta.messageKey}.name`),
    title: t(`members.${meta.messageKey}.title`),
  }));

  // Person schema helps Google associate each photo with a name/title so it can
  // surface the photos directly in Google Images / knowledge results.
  const peopleJsonLd = LEADERSHIP_MEMBERS.map((member) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.title,
    image: `${siteUrl}${member.photo}`,
    worksFor: {
      "@type": "Organization",
      name: "LeTRON Group",
      url: siteUrl,
    },
  }));

  return (
    <div className="relative grid grid-cols-2 gap-x-3 gap-y-5 px-4 py-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-4 lg:gap-y-8 lg:px-10 lg:py-15 bg-white/20 rounded-2xl lg:rounded-[20px] shadow-[0_6px_8px_0_rgba(0,0,0,0.4)] backdrop-blur-[35px]">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(peopleJsonLd) }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] p-px"
        style={{
          background:
            "linear-gradient(132.4deg, rgba(255,255,255,0) 2.52%, rgba(255,255,255,0) 19.76%, #FFFFFF 35.32%, rgba(255,255,255,0) 62.27%, #FFFFFF 73.1%, rgba(255,255,255,0) 93.41%)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label={t("closeLabel")}
          className="absolute right-3 top-3 z-10 grid size-7 place-items-center rounded-full bg-white/20 text-white lg:hidden"
        >
          <X className="size-4" />
        </button>
      )}

      {LEADERSHIP_MEMBERS.map((member) => (
        <div key={member.id} className="flex flex-col">
          <div className="relative aspect-[304/308] w-full overflow-hidden rounded-2xl">
            <Image
              alt={`${member.name} – ${member.title} | LeTRON Group`}
              src={member.photo}
              fill
              sizes="(max-width: 767px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover"
            />
          </div>
          <div className="mt-2 flex flex-col items-center text-center rounded-lg p-2 bg-white/25 lg:mt-3 lg:rounded-[8px] lg:p-2.5">
            <h3 className="font-archivo font-semibold leading-[1.3] text-white text-sm! whitespace-nowrap lg:whitespace-normal lg:text-base!">
              {member.name}
            </h3>
            <p className="mt-1 font-archivo text-xs! font-normal leading-[1.3] text-white lg:text-sm!">
              {member.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
