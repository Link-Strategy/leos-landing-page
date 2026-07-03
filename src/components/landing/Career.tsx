import Link from "next/link";

export default function Career() {
  return (
    <section className="relative py-24 bg-transparent overflow-hidden border-t border-white/10">
      
      {/* Decorative background blur shapes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="mx-auto max-w-5xl px-6 sm:px-8 relative z-10">
        <div className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-gradient-to-b from-[#132563]/60 to-[#0D1B4B]/80 backdrop-blur-md text-center space-y-8 shadow-2xl">

          
          {/* Subtitle */}
          <div className="text-emerald-400 text-xs tracking-widest uppercase font-semibold">
            Gia nhập letron
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Xây sự nghiệp <br className="sm:hidden" />
            <span className="text-zinc-400">hay </span>
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              kiến tạo tương lai?
            </span>
          </h2>

          {/* Body Text */}
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Chúng tôi luôn tìm kiếm những bộ óc sáng tạo, không ngừng bứt phá giới hạn và có tinh thần trách nhiệm cao để cùng cách mạng hóa ngành công nghiệp tuần hoàn tại Việt Nam.
          </p>

          {/* Button */}
          <div className="pt-4 flex justify-center">
            <Link href="/tuyen-dung">
              <button className="relative group overflow-hidden px-8 py-4 rounded-full bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-2">
                Gia nhập đội ngũ Kiến trúc sư
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
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
      </div>
    </section>
  );
}
