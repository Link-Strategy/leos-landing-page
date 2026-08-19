import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[450px] md:min-h-[550px] lg:min-h-screen flex items-center justify-center overflow-hidden bg-transparent pt-[calc(var(--header-height-mobile)+20px)] lg:pt-[calc(var(--header-height)+32px)]">
      {/* Video Background with fallback gradient */}
      <div className="absolute inset-0 z-0">
        {/* Base circuit-pattern background (visible through the semi-transparent video) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundColor: "#6C90D0",
            backgroundImage: "url('/wp-content/uploads/2026/05/light-load-2-1.jpg')",
          }}
        />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover opacity-25"
          poster="/wp-content/uploads/2026/04/img-11.jpg"
        >
          <source src="/wp-content/uploads/2026/05/Video-Project-3-1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--letron-background)]/40 via-[var(--letron-background)]/80 to-[var(--letron-background)]" />
        {/* Glow effect overlay */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2A9FFF]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-[#4AB3FF]/10 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center flex flex-col items-center">
        {/* Subtitle */}
        <div
          className="p-px rounded-full mb-5 animate-fade-in border border-[#538DC3] shadow-[0px_2px_16px_0px_rgba(0,149,255,0.26)]"
        >
          <div
            className="inline-flex items-center px-6! py-1 lg:px-[13px] lg:h-10 lg:py-0 rounded-full backdrop-blur-sm text-[#4AB3FF] text-sm 2xl:text-base font-normal font-display leading-[2]"
          >
            Mở màn Kỷ nguyên
          </div>
        </div>

        {/* Title */}
        <h1 className="text-[26px]! md:text-[42px]! lg:text-[64px]! font-extrabold text-white tracking-tight leading-[1.5] mt-4 md:mt-5 lg:mt-[30px] 2xl:mt-10 mb-[26px] md:mb-[30px] lg:mb-8 2xl:mb-[35px] animate-fade-in-up [text-shadow:4px_0px_20px_rgba(0,140,255,0.2)]">
          Tiên phong công nghệ
          <span className="block mt-2">
            Kiến tạo tương lai <span className="text-[#2A9FFF]">tuần hoàn</span>
          </span>
        </h1>

        {/* Description */}
        <p className="text-white text-[16px] md:text-[18px] font-normal font-display leading-[1.5] max-w-3xl mb-11! md:mb-[50px] lg:mb-[62px] 2xl:mb-20">
          Chúng tôi biến chất thải thành tài nguyên, dữ liệu thành giá trị,
          <br />
          và công nghệ thành nền tảng cho một hệ sinh thái Net Zero bền vững.
        </p>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link href="/category/tin-tuc-su-kien">
            <div
              className="p-px rounded-full hover:-translate-y-1 transition-transform duration-300"
              style={{ backgroundImage: "linear-gradient(180deg, #31B0FF 0%, #81AEF2 100%)" }}
            >
              <button
                className="relative cursor-pointer overflow-hidden px-6 lg:py-1 h-[52px] rounded-full text-white text-sm lg:text-base 2xl:text-xl font-semibold font-display hover:brightness-110 transition-all duration-300 flex items-center gap-[10px]"
                style={{
                  backgroundImage: "linear-gradient(180deg, #76C6FF 0%, #2A75F3 100%)",
                  boxShadow:
                    "inset 0 -4px 16px 0 rgba(0,106,255,0.30), inset 0 -2px 6px 0 rgba(255,255,255,0.75), inset 0 -3px 0 0 rgba(30,154,255,0.18), 0 1px 10px 0 rgba(0,0,0,0.15)",
                }}
              >
                Kích hoạt Hệ sinh thái
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </Link>
        </div>
      </div>

      {/* Decorative Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--letron-background)] to-transparent pointer-events-none" />
    </section>
  );
}
