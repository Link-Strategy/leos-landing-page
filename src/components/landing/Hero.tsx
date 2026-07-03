import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-transparent">
      {/* Video Background with fallback gradient */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover opacity-25"
          poster="/wp-content/uploads/2026/04/img-11.jpg"
        >
          <source
            src="/wp-content/uploads/2026/05/Video-Project-3-1.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--letron-background)]/40 via-[var(--letron-background)]/80 to-[var(--letron-background)]" />
        {/* Glow effect overlay */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center flex flex-col items-center">
        {/* Subtitle */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/30 backdrop-blur-sm text-emerald-400 text-xs tracking-[0.2em] uppercase font-semibold mb-6 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Mở màn Kỷ nguyên
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15] mb-6 animate-fade-in-up">
          Tiên phong công nghệ
          <span className="block mt-2">
            Kiến tạo tương lai{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent filter drop-shadow-[0_2px_15px_rgba(52,211,153,0.3)]">
              tuần hoàn
            </span>
          </span>
        </h1>

        {/* Description */}
        <p className="text-zinc-400 text-base sm:text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-light">
          Chúng tôi biến chất thải thành tài nguyên, dữ liệu thành giá trị, và
          công nghệ thành nền tảng cho một hệ sinh thái{" "}
          <strong className="text-zinc-200 font-medium">Net Zero</strong> bền
          vững.
        </p>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link href="/category/tin-tuc-su-kien">
            <button className="relative group overflow-hidden px-8 py-4 rounded-full bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.45)] flex items-center gap-2">
              Kích hoạt Hệ sinh thái
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </Link>
        </div>
      </div>

      {/* Decorative Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--letron-background)] to-transparent pointer-events-none" />

    </section>
  );
}
