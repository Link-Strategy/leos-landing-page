"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import ChevronDownIcon from "./ChevronDownIcon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SearchBar } from "./SearchBar";
import { cn } from "@/lib/utils";

function GradientBorder() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] p-px gradient-border-span"
    />
  );
}

function HeaderFeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="font-sans text-[11px] font-normal leading-[140%] text-white/80! hover:text-white transition-colors duration-200 list-none relative pl-2 before:absolute before:left-0 before:top-1.5 before:h-1 before:w-1 before:rounded-full before:bg-white/40">
      {children}
    </li>
  );
}



const NAV_ITEMS: { key: string; href: string; hasDropdown?: boolean }[] = [
  { key: "aboutUs", href: "/gioi-thieu" },
  { key: "memberCompanies", href: "/cong-ty-thanh-vien", hasDropdown: true },
  { key: "products", href: "/san-pham", hasDropdown: true },
  { key: "newsEvents", href: "/blog" },
  { key: "careers", href: "/tuyen-dung" },
  { key: "contact", href: "/lien-he" },
];

const COMPANY_MEMBERS_META = [
  { key: "ledb", logo: "/assets/logos/ledb-logo.svg", alt: "LeDB", indicator: "/assets/company-indicator-blue.svg", href: "/san-pham/ledb-bo-nao-so" },
  { key: "lese", logo: "/assets/logos/lese-logo.svg", alt: "LeSE", indicator: "/assets/company-indicator-blue.svg", href: "/san-pham/lese-nang-luong-thong-minh" },
  { key: "legm", logo: "/assets/logos/legm-logo.svg", alt: "LeGM", indicator: "/assets/company-indicator-green.svg", href: "/san-pham/legm-vat-lieu-xanh" },
  { key: "lesc", logo: "/assets/logos/lesc-logo.svg", alt: "LeSC", indicator: "/assets/company-indicator-blue.svg", href: "/san-pham/lesc-do-thi-thong-minh" },
  { key: "lesm", logo: "/assets/logos/lesm-logo.svg", alt: "LeSM", indicator: "/assets/company-indicator-blue.svg", href: "/san-pham/lesm-di-chuyen-thong-minh" },
  { key: "lesb", logo: "/assets/logos/lesb-logo.svg", alt: "LeSB", indicator: "/assets/company-indicator-blue.svg", href: "/san-pham/lesb-xay-dung-thong-minh" },
];


const PRODUCTS_META = [
  {
    key: "lesc",
    href: "/san-pham/lesc-do-thi-thong-minh",
    img: "/wp-content/uploads/2026/04/img-11.jpg",
    logo: "/assets/logos/lesc-logo.svg",
    prefix: "Le",
    suffix: "SC",
    textClass: "text-brand-teal",
    h3TextSizeClass: "max-[1550px]:text-xl",
    priority: "high" as const,
  },
  {
    key: "lesm",
    href: "/san-pham/lesm-di-chuyen-thong-minh",
    img: "/wp-content/uploads/2026/04/img-13.jpg",
    logo: "/assets/logos/lesm-logo.svg",
    prefix: "Le",
    suffix: "SM",
    textClass: "text-brand-lime",
    h3TextSizeClass: "max-[1550px]:text-[22px]",
  },
  {
    key: "ledb",
    href: "/san-pham/ledb-bo-nao-so",
    img: "/wp-content/uploads/2026/04/img-14.jpg",
    logo: "/assets/logos/ledb-logo.svg",
    prefix: "Le",
    suffix: "DB",
    textClass: "text-brand-cyan",
    h3TextSizeClass: "max-[1550px]:text-[22px]",
  },
  {
    key: "lese",
    href: "/san-pham/lese-nang-luong-thong-minh",
    img: "/wp-content/uploads/2026/04/img-15.jpg",
    logo: "/assets/logos/lese-logo.svg",
    prefix: "Le",
    suffix: "SE",
    textClass: "text-brand-orange-deep",
    h3TextSizeClass: "max-[1550px]:text-[22px]",
  },
  {
    key: "lesb",
    href: "/san-pham/lesb-xay-dung-thong-minh",
    img: "/wp-content/uploads/2026/04/img-16.jpg",
    logo: "/assets/logos/lesb-logo.svg",
    prefix: "Le",
    suffix: "SB",
    textClass: "text-brand-gray",
    h3TextSizeClass: "max-[1550px]:text-[22px]",
  },
  {
    key: "legm",
    href: "/san-pham/legm-vat-lieu-xanh",
    img: "/wp-content/uploads/2026/04/img-17.jpg",
    logo: "/assets/logos/legm-logo.svg",
    prefix: "Le",
    suffix: "GM",
    textClass: "text-brand-emerald",
    h3TextSizeClass: "max-[1550px]:text-[22px]",
  },
];

export default function Header() {
  const t = useTranslations("header");
  const COMPANY_MEMBERS = COMPANY_MEMBERS_META.map((meta) => ({
    ...meta,
    desc: t(`companies.${meta.key}`),
  }));
  const PRODUCTS = PRODUCTS_META.map((meta) => ({
    ...meta,
    name: t(`products.${meta.key}.name`),
    features: t.raw(`products.${meta.key}.features`) as string[],
  }));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});
  const [activeMegaMenu, setActiveMegaMenu] = useState<"company" | "product" | null>(null);

  const toggleSubMenu = (menuKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    setOpenSubMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };
  return (
    <header className="sticky top-0 z-50 w-full" onMouseLeave={() => setActiveMegaMenu(null)}>
      <div className="fixed left-0 top-0 z-999 flex w-full flex-col px-20 pb-0 pt-[18px] max-[1550px]:px-[60px] max-[1550px]:pt-[14px] max-lg:px-[25px] max-lg:pt-[10px] max-md:px-4 max-md:pt-[10px]">
        <NavigationMenuPrimitive.Root className="relative w-full">
          <div className="header-glass-container relative z-20 flex flex-row items-center justify-around overflow-hidden px-[35px] py-[22px] max-[1550px]:justify-between max-[1550px]:px-6 max-[1550px]:py-[13.5px] max-lg:px-5 max-lg:pb-[14px] max-lg:pt-[10px] max-md:items-end max-md:px-[14px] max-md:pb-[10px] max-md:pt-[6px]">
            <GradientBorder />

            {/* Logo */}
            <div className="h-full relative z-1 m-0 flex w-[15%] max-w-[15%] items-center justify-start overflow-visible p-0 max-[1550px]:w-[15%] max-[1550px]:max-w-[15%] max-lg:w-[20%] max-lg:max-w-[20%] max-md:w-[50%] max-md:max-w-[50%]">
              {/* Đã đổi h-[50px] thành h-[37px] để khớp tỷ lệ 248x57 của logo khi rộng 162px */}
              <Link className="relative w-[162px] h-[37px] inline-block" href="/">
                <Image
                  alt="LETRON Logo"
                  className="object-contain object-left"
                  src="/wp-content/uploads/2026/05/logo-letron-2-1.svg"
                  fill
                  priority
                />
              </Link>
            </div>

            {/* Navigation Menu */}
            <div className="relative z-1 w-[73%] max-w-[73%] max-[1550px]:w-[70%] max-[1550px]:max-w-[70%] max-lg:hidden flex justify-center">
              <div className="max-w-full">
                <NavigationMenuList className="mx-auto flex max-w-full flex-wrap items-center justify-center gap-x-[42px] max-[1550px]:gap-x-[30px] space-x-0">
                  {NAV_ITEMS.map((item, index) => {
                    if (item.hasDropdown) {
                      return (
                        <NavigationMenuItem key={index} className="relative">
                          <NavigationMenuPrimitive.Trigger asChild>
                            <a className={cn(navigationMenuTriggerStyle({ variant: "brandNav" }), "group relative flex grow items-center cursor-pointer whitespace-nowrap h-auto! px-0! py-2.5!")} href={item.href}>
                              <span>{t(`nav.${item.key}`)}</span>
                              <ChevronDownIcon className="ml-1.5 h-3 w-3 fill-current transition duration-200 group-data-[state=open]:rotate-180" />
                            </a>
                          </NavigationMenuPrimitive.Trigger>
                          <NavigationMenuContent className="w-full">
                            {item.href === "/cong-ty-thanh-vien" ? (
                              <div className="header-dropdown-glass header-dropdown">
                                <div className="relative z-6 grid grid-cols-6 gap-6 w-full">
                                  {COMPANY_MEMBERS.map((comp, compIdx) => (
                                    <div key={compIdx} className="relative z-2">
                                      <Link href={comp.href}>
                                        <Card variant="glass" hover="lift" size="mini" className="p-0! rounded-[20px]! h-[100px] text-start shadow-[0_4px_30px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden relative justify-center cursor-pointer">
                                          {/* Indicator on the left edge */}
                                          <div className="absolute left-0 top-0 bottom-0 w-[10px] overflow-hidden rounded-l-[inherit]">
                                            <Image
                                              src={comp.indicator}
                                              alt=""
                                              fill
                                              className="object-cover"
                                            />
                                          </div>

                                          {/* Content inside the card */}
                                          <div className="pl-6 pr-4 py-3 flex flex-col gap-2 relative z-10">
                                            <div>
                                              <span className="relative block h-[20px] w-[90px] transition duration-600">
                                                <Image
                                                  src={comp.logo}
                                                  alt={comp.alt}
                                                  fill
                                                  className="object-contain object-left"
                                                />
                                              </span>
                                            </div>
                                            <div>
                                              <p className="font-sans text-xs font-semibold leading-[1.3em] text-white/90">{comp.desc}</p>
                                            </div>
                                          </div>
                                        </Card>
                                      </Link>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="header-dropdown-glass products-dropdown">
                                <div className="relative z-6 grid grid-cols-4 gap-6 w-full">
                                  {PRODUCTS.map((prod, prodIdx) => (
                                    <div key={prodIdx} className="relative z-2">
                                      <Card variant="glass" hover="lift" size="mini" className="p-0! rounded-[20px]! h-[200px] text-start shadow-[0_4px_30px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden relative">
                                        {/* Background Image Container (Full Card Size) */}
                                        <div className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
                                          <img
                                            alt={prod.name}
                                            className="w-full! h-full! object-cover! rounded-none! transition-all duration-700 group-hover/card:scale-110"
                                            src={prod.img}
                                          />
                                          {/* Dark Gradient Overlay for Typography Readability */}
                                          <div className="absolute inset-0 bg-linear-to-b from-[#0d1b4b]/90 via-[#0d1b4b]/60 to-[#0d1b4b]/95 transition-opacity duration-500 group-hover/card:opacity-90" />
                                        </div>

                                        {/* Card content overlay - Starting from top */}
                                        <div className="relative z-10 flex flex-col gap-3 p-4 w-full h-full justify-start overflow-hidden">
                                          <CardHeader className="p-0 gap-1">
                                            <CardTitle className={`font-sans text-lg font-bold uppercase leading-[1.3em] ${prod.textClass} max-[1550px]:mb-0`}>
                                              <Link href={prod.href} className="flex items-end gap-2 hover:opacity-90">
                                                <div className="relative h-[20px] w-[80px]"><Image src={prod.logo} alt={prod.prefix + prod.suffix} className="object-contain object-left" fill /></div>
                                                <span className="font-sans text-sm font-semibold normal-case leading-[1.4em] text-white/95">
                                                  {prod.name}
                                                </span>
                                              </Link>
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent className="p-0">
                                            <ul className="pl-3 space-y-0.5 border-l border-white/20">
                                              {prod.features.map((feat, featIdx) => (
                                                <HeaderFeatureItem key={featIdx}>
                                                  {feat}
                                                </HeaderFeatureItem>
                                              ))}
                                            </ul>
                                          </CardContent>
                                        </div>
                                      </Card>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      );
                    }

                    return (
                      <NavigationMenuItem key={index} className="relative">
                        <NavigationMenuPrimitive.Link asChild>
                          <Link href={item.href} className={cn(navigationMenuTriggerStyle({ variant: "brandNav" }), "relative flex grow whitespace-nowrap h-auto! px-0! py-2.5!")}>
                            {t(`nav.${item.key}`)}
                          </Link>
                        </NavigationMenuPrimitive.Link>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </div>
            </div>

            {/* Search Box / Bar — inline on tablet/desktop, moved to its own row below on mobile */}
            <div className="hidden lg:block">
              <SearchBar />
            </div>
            <div className="relative z-1 hidden lg:block ml-4 mt-1!">
              <LanguageSwitcher />
            </div>
            <div className="hidden w-full max-w-full items-center justify-end gap-3 pt-2 max-lg:flex">
              <LanguageSwitcher />
              <button
                type="button"
                aria-expanded={isMobileMenuOpen}
                aria-label="Menu Toggle"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-white"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              >
                <Image
                  src="/about/Menu.png"
                  alt=""
                  width={40}
                  height={40}
                  className={isMobileMenuOpen ? "hidden" : "block"}
                />
                <Image
                  src="/about/Close.png"
                  alt=""
                  width={40}
                  height={40}
                  className={isMobileMenuOpen ? "block" : "hidden"}
                />
              </button>
            </div>
          </div>

          {/* Mobile search row — separate line below the main header bar */}
          <div className="relative z-20 mt-2 w-full lg:hidden">
            <SearchBar fullWidth />
          </div>

          {/* Mobile menu dropdown */}
          <nav
            aria-hidden={!isMobileMenuOpen}
            className={`${isMobileMenuOpen ? "block" : "hidden"} absolute left-0 top-full w-full rounded-mobile-menu bg-background/98 p-5 shadow-glow backdrop-blur-[30px] lg:hidden`}
          >
            <ul id="menu-2-044b89b">
              <li>
                <Link className="block py-2 font-sans text-base font-medium text-white" href="/gioi-thieu" tabIndex={-1}>
                  {t(`nav.aboutUs`)}
                </Link>
              </li>
              <li>
                <div className="flex items-center justify-between">
                  <Link className="block py-2 font-sans text-base font-medium text-white" href="/cong-ty-thanh-vien" tabIndex={-1}>
                    {t(`nav.memberCompanies`)}
                  </Link>
                  <button className="flex h-8 w-8 items-center justify-center text-white" type="button" onClick={(e) => toggleSubMenu('company', e)}>
                    <ChevronDownIcon className={`h-3 w-3 fill-current transition-transform ${openSubMenus["company"] ? "rotate-180" : ""}`} />
                  </button>
                </div>
                <ul className={`${openSubMenus['company'] ? 'grid' : 'hidden'} pl-4 py-2 grid-cols-2 gap-3`}>
                  {COMPANY_MEMBERS.map((comp, compIdx) => (
                    <li key={compIdx}>
                      <Link className="flex flex-col items-start gap-1 rounded-xl bg-white/3 p-3 hover:bg-white/8 transition-all duration-300 border border-white/10" href="/cong-ty-thanh-vien" tabIndex={-1}>
                        <div className="relative h-[20px] w-[80px]">
                          <Image
                            src={comp.logo}
                            alt={comp.alt}
                            fill
                            className="object-contain object-left"
                          />
                        </div>
                        <span className="text-[10px] text-white/60 font-sans leading-none">{comp.desc}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <div className="flex items-center justify-between">
                  <Link className="block py-2 font-sans text-base font-medium text-white" href="/san-pham" tabIndex={-1}>
                    {t(`nav.products`)}
                  </Link>
                  <button className="flex h-8 w-8 items-center justify-center text-white" type="button" onClick={(e) => toggleSubMenu('product', e)}>
                    <ChevronDownIcon className={`h-3 w-3 fill-current transition-transform ${openSubMenus["product"] ? "rotate-180" : ""}`} />
                  </button>
                </div>
                <ul className={`${openSubMenus['product'] ? 'grid' : 'hidden'} pl-4 py-2 grid-cols-1 gap-2`}>
                  {PRODUCTS.map((prod, prodIdx) => (
                    <li key={prodIdx}>
                      <Link className="flex items-center gap-3 rounded-xl bg-white/3 p-3 hover:bg-white/8 transition-all duration-300 border border-white/10" href={prod.href} tabIndex={-1}>
                        <div className="relative h-[36px] w-[58px] overflow-hidden rounded-md shrink-0">
                          <img
                            src={prod.img}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col text-start gap-1">
                          <div className="relative h-[18px] w-[70px]">
                            <Image
                              src={prod.logo}
                              alt={prod.prefix + prod.suffix}
                              className="object-contain object-left"
                              fill
                            />
                          </div>
                          <span className="text-[10px] text-white/60 font-sans leading-none">{prod.name}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <Link className="block py-2 font-sans text-base font-medium text-white" href="/blog" tabIndex={-1}>
                  {t(`nav.newsEvents`)}
                </Link>
              </li>
              <li>
                <Link className="block py-2 font-sans text-base font-medium text-white" href="/tuyen-dung" tabIndex={-1}>
                  {t(`nav.careers`)}
                </Link>
              </li>
              <li>
                <Link className="block py-2 font-sans text-base font-medium text-white" href="/lien-he" tabIndex={-1}>
                  {t(`nav.contact`)}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Render viewport ở ngoài header-glass-container */}
          <div className="absolute left-0 top-full flex justify-center w-full z-30 pointer-events-none max-[1550px]:-mt-4">
            <NavigationMenuPrimitive.Viewport className="origin-top-center relative h-(--radix-navigation-menu-viewport-height) w-full overflow-visible text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 pointer-events-auto" />
          </div>
        </NavigationMenuPrimitive.Root>
      </div>
    </header>
  );
}
