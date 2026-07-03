import Image from "next/image";

export default function LeOsAi() {
  const features = [
    "Phân tích dữ liệu vật liệu quy mô lớn",
    "Tối ưu cấp phối bê tông hiệu năng cao",
    "Cập nhật tín chỉ Carbon theo thời gian thực",
  ];

  return (
    <section className="relative py-24 bg-transparent overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & App Download */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="text-emerald-400 text-xs tracking-widest uppercase font-semibold">
                Kiến trúc đa tầng
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Hệ điều hành công nghiệp LeOS <br />
                <span className="text-zinc-400">&amp; Trí tuệ nhân tạo </span>
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  LeLe AI
                </span>
              </h2>
              <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-xl">
                LeTRON vận hành trên một kiến trúc công nghệ đa tầng, nơi dữ liệu, AI
                và vật liệu xanh được kết nối thành một hệ thống thống nhất và tự động hóa.
              </p>
            </div>

            {/* Feature List */}
            <ul className="space-y-4">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center">
                    <svg
                      className="w-3.5 h-3.5 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-zinc-300 font-medium text-sm sm:text-base">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* App Download Area */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-6">

              {/* QR Code */}
              <div className="relative p-2 bg-white rounded-2xl shadow-lg shadow-black/50">
                <Image
                  src="/wp-content/uploads/2026/05/QRcode-02-2.svg"
                  alt="QR Code LeTRON App"
                  width={90}
                  height={90}
                  className="rounded-xl"
                />
              </div>

              {/* Download Buttons */}
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                <a
                  href="#"
                  className="inline-block transition-transform hover:-translate-y-0.5 duration-200"
                >
                  <Image
                    src="/wp-content/uploads/2026/05/Store-download-button.svg"
                    alt="Tải trên App Store"
                    width={130}
                    height={42}
                    className="h-10 w-auto"
                  />
                </a>
                <a
                  href="#"
                  className="inline-block transition-transform hover:-translate-y-0.5 duration-200"
                >
                  <Image
                    src="/wp-content/uploads/2026/05/Store-download-button-1.svg"
                    alt="Tải trên Google Play"
                    width={130}
                    height={42}
                    className="h-10 w-auto"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Mockup/Image */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Glowing Border Box Container */}
            <div className="relative group p-1.5 rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 shadow-2xl shadow-emerald-500/5 hover:shadow-emerald-500/10 transition-all duration-500">
              {/* Glow Behind */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl -z-10 pointer-events-none" />
              
              <Image
                src="/wp-content/uploads/2026/05/img-3-1.png"
                alt="Hệ điều hành công nghiệp LeOS"
                width={500}
                height={350}
                className="rounded-2xl w-full max-w-[450px] h-auto object-cover filter brightness-90 group-hover:brightness-100 transition-all duration-500"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
