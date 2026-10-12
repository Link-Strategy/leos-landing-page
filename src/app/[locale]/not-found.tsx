import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

// Shown inside the site layout (header/footer) when a route under /[locale] calls notFound().
const COPY = {
  vi: {
    title: "Không tìm thấy trang",
    body: "Trang bạn tìm không tồn tại hoặc đã được chuyển đi. Hãy quay về trang chủ hoặc xem các sản phẩm của LeTRON.",
    home: "Về trang chủ",
    products: "Xem sản phẩm",
  },
  en: {
    title: "Page not found",
    body: "The page you are looking for does not exist or has moved. Go back home or explore LeTRON's products.",
    home: "Back to home",
    products: "View products",
  },
} as const;

export default async function NotFound() {
  const locale = (await getLocale()) === "en" ? "en" : "vi";
  const t = COPY[locale];

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-[#0d1b4b] px-6 pb-16 pt-[calc(var(--header-height-mobile)+40px)] text-center text-white lg:pt-[calc(var(--header-height)+40px)]">
      <div className="max-w-xl">
        <p className="m-0 text-[96px] font-extrabold leading-none text-[#2a9fff]">404</p>
        <h1 className="mb-3 mt-4 text-3xl font-bold">{t.title}</h1>
        <p className="mb-8 leading-relaxed text-white/80">{t.body}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-gradient-to-b from-[#76c6ff] to-[#2a75f3] px-7 py-3 font-semibold text-white no-underline"
          >
            {t.home}
          </Link>
          <Link
            href="/san-pham"
            className="rounded-full border border-white/40 px-7 py-3 font-semibold text-white no-underline"
          >
            {t.products}
          </Link>
        </div>
      </div>
    </section>
  );
}
