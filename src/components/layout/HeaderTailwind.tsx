"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { v2Href } from "@/lib/v2-routes";
import ChevronDownIcon from "./ChevronDownIcon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { SearchBar } from "./SearchBar";
import ProductMegaMenu, { ProductTile } from "./ProductMegaMenu";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { key: string; href: string; hasDropdown?: boolean }[] = [
  { key: "aboutUs", href: "/gioi-thieu" },
  { key: "products", href: "/san-pham", hasDropdown: true },
  { key: "newsEvents", href: "/blog" },
  { key: "careers", href: "/tuyen-dung" },
  { key: "contact", href: "/lien-he" },
];

type HeaderProduct = { id: string; eyebrow: string; title: string; body: string; status: string; route: string };


export default function Header() {
  const t = useTranslations("header");
  const tv = useTranslations("v2");
  const PRODUCTS = (tv.raw("products") as HeaderProduct[]).map((p) => ({
    ...p,
    href: v2Href(p.route),
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
      <div className="fixed left-0 top-0 z-999 w-full px-6 py-5">
        <NavigationMenuPrimitive.Root className="relative w-full">
          <div className="header-glass-container relative z-20 flex h-20 w-full flex-row items-center justify-around overflow-hidden px-[35px] max-[1550px]:justify-between max-[1550px]:px-6 max-lg:px-5 max-md:px-[14px]">
            {/* Logo */}
            <div className="h-full relative z-1 m-0 flex w-[15%] max-w-[15%] items-center justify-start overflow-visible p-0 max-[1550px]:w-[15%] max-[1550px]:max-w-[15%] max-lg:w-[20%] max-lg:max-w-[20%] max-md:w-[50%] max-md:max-w-[50%]">
              {/* Đã đổi h-[50px] thành h-[37px] để khớp tỷ lệ 248x57 của logo khi rộng 162px */}
              <Link className="relative w-[162px] h-[37px] inline-block" href="/">
                <Image
                  alt="LETRON Logo"
                  className="object-contain object-left"
                  src="/images/site/logo-letron-2-1.svg"
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
                            <ProductMegaMenu products={PRODUCTS} />
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
                        <ProductTile id={prod.id} size={36} />
                        <div className="flex flex-col text-start gap-1">
                          <span className="text-sm font-semibold text-white font-sans leading-none">{prod.title}</span>
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
