import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SectionEdgeFade from "@/components/ui/section-edge-fade";

const LOGO = "/wp-content/uploads/2026/05/logo-2.png";
const WATERMARK_DESKTOP = "/landing/Footer/watermark-desktop.svg";
const WATERMARK_MOBILE = "/landing/Footer/watermark-mobile.svg";
const ICON_HIGHLIGHT = "/landing/Footer/icon-highlight.svg";

const SOCIALS = [
  { id: "facebook", glow: "/landing/Footer/facebook-bg.svg", glyph: "/landing/Footer/facebook-glyph.svg", ring: "rgba(40,126,255,0.32)" },
  { id: "linkedin", glow: "/landing/Footer/linkedin-bg.svg", glyph: "/landing/Footer/linkedin-glyph.svg", ring: "rgba(13,137,252,0.32)" },
  { id: "instagram", glow: "/landing/Footer/instagram-bg.svg", glyph: "/landing/Footer/instagram-glyph.svg", ring: "rgba(190,13,252,0.32)" },
] as const;

type FooterLink = { href: string; label: string };

function GlassIconShell({ children, ring }: { children: ReactNode; ring: string }) {
  return (
    <span
      className="relative flex size-11 items-center justify-center overflow-hidden rounded-xl border-[0.8px]"
      style={{ borderColor: "rgba(216,216,216,0.05)" }}
    >
      <span
        aria-hidden
        className="absolute inset-0 backdrop-blur-[10px]"
        style={{ backgroundImage: "linear-gradient(135deg, rgba(248,251,255,0.04) 0%, rgba(255,255,255,0) 100%)" }}
      />
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[-0.4px] rounded-[inherit]"
        style={{ boxShadow: `inset 0px 0px 8px 0px ${ring}` }}
      />
    </span>
  );
}

function SocialIcon({ glow, glyph, ring, alt }: { glow: string; glyph: string; ring: string; alt: string }) {
  return (
    <a href="#" className="relative block size-11 shrink-0 cursor-pointer transition-transform duration-300 hover:-translate-y-1">
      <GlassIconShell ring={ring}>
        <img src={glow} alt="" aria-hidden className="pointer-events-none absolute size-[52px] mix-blend-plus-lighter" />
        <img src={glyph} alt={alt} className="relative size-8" />
      </GlassIconShell>
      <img
        src={ICON_HIGHLIGHT}
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-2 left-2 size-[18px] mix-blend-screen"
      />
    </a>
  );
}

function ZaloIcon({ alt }: { alt: string }) {
  return (
    <a href="#" className="relative block size-11 shrink-0 cursor-pointer transition-transform duration-300 hover:-translate-y-1">
      <GlassIconShell ring="rgba(0,107,255,0.32)">
        <span
          role="img"
          aria-label={alt}
          className="relative flex size-8 items-center justify-center rounded-[10px]"
          style={{ background: "#0068FF", boxShadow: "0px 1px 3px 0px rgba(0,107,255,0.16)" }}
        >
          <span className="font-inter flex h-4 w-6 items-center justify-center rounded-[5px] bg-white text-[8.5px] leading-[12px]! font-bold text-[#0068FF]">
            Zalo
          </span>
        </span>
      </GlassIconShell>
      <img
        src={ICON_HIGHLIGHT}
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-2 left-2 size-[18px] mix-blend-screen"
      />
    </a>
  );
}

function SocialRow({ zaloAlt }: { zaloAlt: string }) {
  return (
    <div className="flex items-center gap-2">
      <SocialIcon {...SOCIALS[0]} alt="Facebook" />
      <SocialIcon {...SOCIALS[1]} alt="LinkedIn" />
      <ZaloIcon alt={zaloAlt} />
      <SocialIcon {...SOCIALS[2]} alt="Instagram" />
    </div>
  );
}

function FooterLinkList({ items }: { items: FooterLink[] }) {
  return (
    <ul className="flex flex-col gap-[10px]">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="font-open-sans flex items-center gap-2 text-[14px] leading-[22px]! text-white opacity-78 transition-opacity hover:opacity-100"
          >
            <span className="size-[6px] shrink-0 rounded-full bg-[#76C6FF]" />
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ColumnHeading({ children }: { children: ReactNode }) {
  return (
    <p className="font-inter text-[14px] leading-[16px]! font-bold tracking-[2.2px] text-white uppercase">{children}</p>
  );
}

function LocationIcon() {
  return (
    <svg fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
      <path clipRule="evenodd" d="M12 5.25C9.30761 5.25 7.125 7.43261 7.125 10.125C7.125 12.8174 9.30761 15 12 15C14.6924 15 16.875 12.8174 16.875 10.125C16.875 7.43261 14.6924 5.25 12 5.25ZM8.625 10.125C8.625 8.26102 10.136 6.75 12 6.75C13.864 6.75 15.375 8.26102 15.375 10.125C15.375 11.989 13.864 13.5 12 13.5C10.136 13.5 8.625 11.989 8.625 10.125Z" fill="white" fillRule="evenodd" />
      <path clipRule="evenodd" d="M18.6314 3.51965C14.9697 -0.173217 9.0303 -0.173217 5.36862 3.51965C1.71046 7.209 1.71046 13.188 5.36862 16.8773L11.4674 23.0281C11.6082 23.1701 11.8 23.25 12 23.25C12.2 23.25 12.3918 23.1701 12.5326 23.0281L18.6314 16.8773C22.2896 13.188 22.2896 7.209 18.6314 3.51965ZM6.43377 4.57579C9.50865 1.47473 14.4914 1.47473 17.5662 4.57579C20.6446 7.68041 20.6446 12.7165 17.5662 15.8212L12 21.4348L6.43377 15.8212C3.35541 12.7165 3.35541 7.68041 6.43377 4.57579Z" fill="white" fillRule="evenodd" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.2752 12.9901L18.2702 12.3826C17.8396 12.1233 17.3346 12.0157 16.8358 12.0769C16.3369 12.1381 15.8729 12.3645 15.5177 12.7201L14.9852 13.2601C14.8723 13.3731 14.7264 13.4471 14.5686 13.4714C14.4107 13.4957 14.2493 13.4689 14.1077 13.3951C12.6336 12.5808 11.4195 11.3667 10.6052 9.8926C10.5277 9.74935 10.499 9.58478 10.5234 9.42377C10.5477 9.26275 10.6238 9.11404 10.7402 9.0001L11.2802 8.4676C11.6358 8.11241 11.8622 7.64839 11.9234 7.14952C11.9846 6.65066 11.8769 6.14568 11.6177 5.7151L11.0102 4.7251C10.7193 4.23388 10.3189 3.81652 9.84014 3.50558C9.36137 3.19465 8.81724 2.99855 8.25019 2.9326C7.68518 2.86402 7.11197 2.92494 6.574 3.11076C6.03603 3.29658 5.54742 3.60242 5.14519 4.0051L4.87519 4.2751C3.73327 5.43776 3.04507 6.97066 2.93502 8.59659C2.82497 10.2225 3.30035 11.8342 4.27519 13.1401C6.14588 15.6371 8.36322 17.8544 10.8602 19.7251C12.1655 20.7014 13.7775 21.1777 15.4039 21.0676C17.0302 20.9576 18.5633 20.2684 19.7252 19.1251L19.9952 18.8551C20.3965 18.4502 20.7002 17.9592 20.8832 17.4193C21.0663 16.8795 21.1238 16.305 21.0515 15.7396C20.9792 15.1741 20.7789 14.6326 20.4659 14.1562C20.1529 13.6798 19.7354 13.281 19.2452 12.9901H19.2752Z" fill="white" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.75 21H17.25C18.2446 21 19.1984 20.6049 19.9016 19.9017C20.6049 19.1984 21 18.2446 21 17.25V9.75C21 8.75544 20.6049 7.80161 19.9016 7.09835C19.1984 6.39509 18.2446 6 17.25 6H6.75C5.75544 6 4.80161 6.39509 4.09835 7.09835C3.39509 7.80161 3 8.75544 3 9.75V17.25C3 18.2446 3.39509 19.1984 4.09835 19.9017C4.80161 20.6049 5.75544 21 6.75 21ZM19.5 17.25C19.5 17.8467 19.2629 18.419 18.841 18.841C18.419 19.2629 17.8467 19.5 17.25 19.5H6.75C6.15326 19.5 5.58097 19.2629 5.15901 18.841C4.73705 18.419 4.5 17.8467 4.5 17.25V9.75C4.5 9.705 4.5 9.66 4.5 9.615L10.38 14.4225C10.8359 14.7985 11.4091 15.0028 12 15C12.5837 15.0007 13.1492 14.7963 13.5975 14.4225L19.5 9.615C19.5 9.66 19.5 9.705 19.5 9.75V17.25ZM17.25 7.5C17.4325 7.50177 17.614 7.52697 17.79 7.575L17.94 7.62C18.0657 7.66476 18.1884 7.71736 18.3075 7.7775L18.4425 7.8525C18.5937 7.94745 18.7345 8.05806 18.8625 8.1825L12.645 13.2675C12.4617 13.4167 12.2326 13.4982 11.9963 13.4982C11.7599 13.4982 11.5308 13.4167 11.3475 13.2675L5.1375 8.1825C5.26553 8.05806 5.4063 7.94745 5.5575 7.8525L5.6925 7.7775C5.81158 7.71736 5.93432 7.66476 6.06 7.62L6.21 7.575C6.38604 7.52697 6.56753 7.50177 6.75 7.5H17.25Z" fill="white" />
    </svg>
  );
}

function ContactRows({ address, phone, email }: { address: string; phone: string; email: string }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <div className="flex items-start gap-2">
        <span className="mt-[3px] shrink-0">
          <LocationIcon />
        </span>
        <p className="font-open-sans text-[14px] leading-[22px]! text-[#E2F3FF] opacity-78">{address}</p>
      </div>
      <div className="flex items-start gap-2">
        <span className="mt-[3px] shrink-0">
          <PhoneIcon />
        </span>
        <p className="font-open-sans text-[14px] leading-[22px]! text-[#E2F3FF] opacity-78">{phone}</p>
      </div>
      <div className="flex items-start gap-2">
        <span className="mt-[3px] shrink-0">
          <EmailIcon />
        </span>
        <p className="font-open-sans text-[14px] leading-[22px]! text-[#E2F3FF] opacity-78">{email}</p>
      </div>
    </div>
  );
}

export default function Footer() {
  const t = useTranslations("footer");

  const quickLinks: FooterLink[] = [
    { href: "/", label: t("quickLinks.home") },
    { href: "/gioi-thieu", label: t("quickLinks.aboutUs") },
    { href: "/cong-ty-thanh-vien", label: t("quickLinks.memberCompanies") },
    { href: "/blog", label: t("quickLinks.newsEvents") },
    { href: "/tuyen-dung", label: t("quickLinks.careers") },
  ];

  const productLinks: FooterLink[] = [
    { href: "/san-pham/ledb-bo-nao-so", label: t("products.ledb") },
    { href: "/san-pham/lesm-di-chuyen-thong-minh", label: t("products.lesm") },
    { href: "/san-pham/lese-nang-luong-thong-minh", label: t("products.lese") },
    { href: "/san-pham/legm-vat-lieu-xanh", label: t("products.legm") },
    { href: "/san-pham/lesb-xay-dung-thong-minh", label: t("products.lesb") },
    { href: "/san-pham/lesc-do-thi-thong-minh", label: t("products.lesc") },
  ];

  const address = t("address");
  const phone = t("phone");
  const email = t("email");

  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 70% 45% at 42% 44%, rgba(42,159,255,0.1) 0%, rgba(42,159,255,0.03) 56%, rgba(0,0,0,0) 100%), linear-gradient(90deg, #020E30 0%, #031B4C 34%, #0D1B4B 68%, #020E30 100%)",
      }}
    >
      <SectionEdgeFade position="top" />

      <div className="container-le relative z-10 py-8 lg:py-10">
        <div
          className="relative overflow-hidden rounded-2xl border px-6 pt-8 pb-7 lg:px-9 lg:pt-8 lg:pb-7"
          style={{
            borderColor: "rgba(42,159,255,0.12)",
            backgroundImage:
              "radial-gradient(ellipse 70% 45% at 42% 44%, rgba(42,159,255,0.1) 0%, rgba(42,159,255,0.03) 56%, rgba(0,0,0,0) 100%), linear-gradient(90deg, #020E30 0%, #031B4C 34%, #0D1B4B 68%, #020E30 100%)",
          }}
        >
          {/* Big faded "LeTRON" wordmark bleeding off the bottom-right corner */}
          <img
            src={WATERMARK_DESKTOP}
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-[3%] bottom-[-6%] hidden w-[93%] lg:block"
          />
          <img
            src={WATERMARK_MOBILE}
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-[4%] bottom-[-4%] w-[92%] lg:hidden"
          />

          {/* Desktop: divider on top, 4-column row, legal row (no divider before legal) */}
          <div className="relative z-10 hidden flex-col gap-5 lg:flex">
            <div className="h-px w-full" style={{ background: "rgba(42,159,255,0.18)" }} />

            <div className="flex items-start gap-11 py-1">
              <div className="flex w-[260px] shrink-0 flex-col gap-3">
                <img src={LOGO} alt="LeTRON" width={163} height={100} />
                <p className="font-open-sans text-[14px] leading-[22px]! text-white opacity-72">{t("companyName")}</p>
                <SocialRow zaloAlt={t("socialZaloAlt")} />
              </div>

              <div className="flex w-[160px] shrink-0 flex-col gap-3">
                <ColumnHeading>{t("quickLinksHeading")}</ColumnHeading>
                <FooterLinkList items={quickLinks} />
              </div>

              <div className="flex w-[220px] shrink-0 flex-col gap-3">
                <ColumnHeading>{t("productsHeading")}</ColumnHeading>
                <FooterLinkList items={productLinks} />
              </div>

              <div className="flex flex-1 flex-col gap-3">
                <ColumnHeading>{t("contactHeading")}</ColumnHeading>
                <ContactRows address={address} phone={phone} email={email} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-open-sans text-[14px] leading-[22px]! text-white opacity-65">{t("copyright")}</p>
              <p className="font-open-sans text-[14px] leading-[22px]! text-white opacity-65">{t("tagline")}</p>
            </div>
          </div>

          {/* Mobile: single stacked column, divider only right before the legal lines */}
          <div className="relative z-10 flex flex-col gap-[18px] lg:hidden">
            <div className="flex flex-col gap-[10px]">
              <img src={LOGO} alt="LeTRON" width={163} height={100} />
              <p className="font-open-sans text-[14px] leading-[22px]! text-white opacity-72">{t("companyName")}</p>
              <SocialRow zaloAlt={t("socialZaloAlt")} />
            </div>

            <div className="flex flex-col gap-2">
              <ColumnHeading>{t("quickLinksHeading")}</ColumnHeading>
              <FooterLinkList items={quickLinks} />
            </div>

            <div className="flex flex-col gap-2">
              <ColumnHeading>{t("productsHeading")}</ColumnHeading>
              <FooterLinkList items={productLinks} />
            </div>

            <div className="flex flex-col gap-2">
              <ColumnHeading>{t("contactHeading")}</ColumnHeading>
              <ContactRows address={address} phone={phone} email={email} />
            </div>

            <div className="h-px w-full" style={{ background: "rgba(42,159,255,0.18)" }} />

            <div className="flex flex-col gap-1">
              <p className="font-open-sans text-[14px] leading-[22px]! text-white opacity-65">{t("copyright")}</p>
              <p className="font-open-sans text-[14px] leading-[22px]! text-white opacity-65">{t("tagline")}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
