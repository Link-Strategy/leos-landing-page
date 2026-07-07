import Link from "next/link";
import { getCachedLatestPublishedBlogArticles } from "@/lib/blog/queries";
import { Button } from "@/components/ui/button";

export default async function News() {
  let articles: Awaited<ReturnType<typeof getCachedLatestPublishedBlogArticles>> = [];
  try {
    articles = await getCachedLatestPublishedBlogArticles(6);
  } catch {
    articles = [];
  }

  if (articles.length === 0) return null;

  return (
    <section className="relative w-full bg-[#0d1b4b] px-4 py-[60px] sm:px-6 lg:px-10 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[350px] h-[350px] bg-[#2a9fff]/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1704px] flex-col items-center gap-[60px]">
        <header className="flex w-full flex-col items-center gap-[60px]">
          <div className="flex w-full flex-col items-center gap-2.5">
            <div className="flex w-full flex-col items-center gap-[26px]">
              <p className="relative w-fit mt-[-2.00px] -ml-px [text-shadow:0px_4px_20px_#008cff33] font-sans text-center text-[32px] font-normal leading-[44px] sm:text-[40px] sm:leading-[60px] whitespace-nowrap tracking-normal">
                <span className="font-extrabold text-white">
                  Tin tức -
                </span>
                <span className="font-extrabold text-[#2a9fff]"> Sự kiện</span>
              </p>
            </div>
            <p className="relative w-fit font-sans text-center text-base font-normal leading-[24px] tracking-normal text-white sm:text-lg sm:leading-[27px]">
              Những câu chuyện, dữ liệu và chuyển động mới nhất
              <br /> từ hành trình kiến tạo công nghiệp xanh và tương lai Net Zero.
            </p>
          </div>
          <Button
            asChild
            variant="glass"
            className="h-auto min-h-[52px] px-[13px] py-1"
          >
            <Link href="/blog">
              <span className="relative z-2 inline-flex items-center justify-center gap-1 px-2 py-0">
                <span className="font-sans text-center text-base font-semibold leading-7 tracking-normal text-white sm:text-xl sm:leading-8 whitespace-nowrap">
                  Xem tất cả bài tin
                </span>
                <img
                  className="relative h-6 w-6"
                  alt="Huge icon"
                  src="/right.svg"
                />
              </span>
            </Link>
          </Button>
        </header>
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.slice(0, 3).map((article, index) => {
            const publishDate = article.publishedAt ? new Date(article.publishedAt) : new Date();
            const day = String(publishDate.getDate()).padStart(2, "0");
            const month = `THÁNG ${publishDate.getMonth() + 1}`;

            return (
              <article key={article.externalId || `news-item-${index}`} className="w-full">
                <Link href={`/blog/${article.slug}`} className="group block w-full">
                  <div className="border-0 bg-transparent p-0 shadow-none">
                    <div className="flex flex-col items-start gap-[26px]">
                      <div className="relative h-[360px] w-full overflow-hidden rounded-[26px]">
                        <img
                          src={article.coverImage || "/figmaAssets/b-i-tin-1.png"}
                          alt={article.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 right-0 z-10 flex h-[113px] w-28 items-center justify-center gap-2.5 rounded-[0px_0px_20px_0px] px-[27px] py-6 shadow-[0px_1px_10px_#00000026,inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] backdrop-blur-[2.0px] backdrop-brightness-110 [-webkit-backdrop-filter:blur(2.0px)_brightness(110%)] bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(244,244,244,0.2)_100%)]">
                          <div className="flex w-[70px] flex-col items-center">
                            <div className="relative self-stretch -mt-px font-sans text-center text-4xl font-bold leading-[54px] tracking-normal text-white">
                              {day}
                            </div>
                            <div className="relative self-stretch font-sans text-center text-base font-normal leading-6 tracking-normal text-white uppercase">
                              {month}
                            </div>
                          </div>
                        </div>
                      </div>
                      <img
                        className="relative h-px w-full self-stretch"
                        alt="Line"
                        src="/line.svg"
                      />
                      <p className="relative self-stretch font-sans text-xl font-bold leading-[30px] tracking-normal text-white line-clamp-3">
                        {article.title}
                      </p>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
