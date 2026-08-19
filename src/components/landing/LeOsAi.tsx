import Image from "next/image";

export default function LeOsAi() {
  const features = [
    "Phân tích dữ liệu vật liệu quy mô lớn",
    "Tối ưu cấp phối bê tông hiệu năng cao",
    "Cập nhật tín chỉ Carbon theo thời gian thực",
  ];

  return (
    <section className="relative py-16 md:py-20 lg:py-24 bg-transparent overflow-hidden">
      <div className="w-full px-4 md:px-8 lg:px-16">
        <div
          className="relative rounded-[20px] backdrop-blur-[36px] shadow-[0px_2px_20px_0px_rgba(12,178,255,0.12)] overflow-hidden bg-no-repeat"
          style={{
            backgroundImage: "url('/wp-content/uploads/2026/05/bg-color-1.png')",
            backgroundSize: "cover",
            backgroundPosition: "55% 0%",
          }}
        >
          {/* Gradient border ring — masked so the transparent center is untouched (no leak into the card background) */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] p-px leosai-glow-border-span"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Left Column: Text & App Download */}
            <div className="p-5 md:p-[30px] lg:pt-10 lg:pb-10 lg:px-[60px] space-y-8">
                <div className="space-y-4">
                  <div className="text-[#4AB3FF] text-xs tracking-widest uppercase font-semibold">
                    Kiến trúc đa tầng
                  </div>
                  <h2 className="text-[22px] md:text-[28px] lg:text-[32px] 2xl:text-[40px] font-extrabold tracking-tight text-white leading-[1.3] [text-shadow:4px_0px_20px_rgba(0,140,255,0.2)]">
                    Hệ điều hành công nghiệp LeTRON <br />
                    &amp; Trí tuệ nhân tạo <span className="text-[#2A9FFF]">LeLe AI</span>
                  </h2>
                  <p className="text-zinc-400 text-[14px] lg:text-[16px] 2xl:text-[18px] font-light leading-[1.3] mt-3 md:mt-[14px] 2xl:mt-4 mb-6 md:mb-7 2xl:mb-9 max-w-xl">
                    LeTRON vận hành trên một kiến trúc công nghệ đa tầng, nơi dữ liệu, AI và vật
                    liệu xanh được kết nối thành một hệ thống thống nhất và tự động hóa.
                  </p>
                </div>

                {/* Feature List */}
                <ul className="space-y-4">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Image
                        src="/landing/LeOsAi/Tick.svg"
                        alt=""
                        width={30}
                        height={28}
                        className="flex-shrink-0"
                      />
                      <span className="text-white font-light text-[14px] lg:text-[16px]">
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
                  <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
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
            <div className="relative flex justify-center p-[10px] md:pt-[30px] md:pb-[30px] md:pl-5 md:pr-[30px] lg:p-0 2xl:pt-5 2xl:pb-5 2xl:pl-0 2xl:pr-5">
              <Image
                src="/wp-content/uploads/2026/05/img-3-1.png"
                alt="Hệ điều hành công nghiệp LeTRON"
                width={500}
                height={350}
                className="rounded-[20px] lg:rounded-none w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
