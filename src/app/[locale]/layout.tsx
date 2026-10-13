import type { Metadata, Viewport } from "next";
import { Archivo, Outfit, Inter, Open_Sans } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/blog/seo";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/jsonld";
import "../globals.css";
import { ContactDialogProvider } from "@/components/contact/ContactDialog";
import HeaderTailwind from "@/components/layout/HeaderTailwind";
import Footer from "@/components/layout/Footer";
import ClientScripts from "@/components/layout/ClientScripts";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { routing } from "@/i18n/routing";
import { pickClientMessages } from "@/i18n/client-messages";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

// Outfit and Open Sans are used below the fold / on small text; skip their <link rel=preload> so the critical request
// chain only carries the fonts the first screen needs (Inter for headings, Archivo). They still load when used.
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
  preload: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: {
      default: t("title"),
      template: "%s | LeTRON Group",
    },
    description: t("description"),
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.APP_URL?.trim() || "https://letrongroup.com"),
    // Explicit: the app/opengraph-image file sits outside the [locale] root layout, so Next does not attach it.
    openGraph: {
      siteName: "LeTRON",
      type: "website",
      locale: locale === "en" ? "en_US" : "vi_VN",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "LeTRON" }],
    },
    twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
    robots: { index: true, follow: true },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180" },
      ],
    },
    manifest: "/site.webmanifest",
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${archivo.variable} ${outfit.variable} ${inter.variable} ${openSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <JsonLd data={buildOrganizationJsonLd(getSiteUrl())} />
        <JsonLd data={buildWebSiteJsonLd(getSiteUrl())} />
        <NextIntlClientProvider messages={pickClientMessages(messages)}>
          <ContactDialogProvider>
            <HeaderTailwind />
            <main>{children}</main>
            <Footer />
          </ContactDialogProvider>
          <ScrollToTop />
          <ClientScripts />
          <Analytics />
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
