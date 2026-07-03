import Image from "next/image";

export default function Partners() {
  const partnerLogos = [
    "/wp-content/uploads/2026/05/Logo-7-1.svg",
    "/wp-content/uploads/2026/05/Logo-7-2.svg",
    "/wp-content/uploads/2026/05/Logo-7-3.svg",
    "/wp-content/uploads/2026/05/Logo-7-4.svg",
    "/wp-content/uploads/2026/05/Logo-7-5.svg",
    "/wp-content/uploads/2026/05/Logo-7-6.svg",
    "/wp-content/uploads/2026/05/Logo-7-7.svg",
    "/wp-content/uploads/2026/05/Logo-7.svg",
  ];

  // Double the array to make seamless scrolling
  const marqueeLogos = [...partnerLogos, ...partnerLogos];

  return (
    <section className="relative py-20 bg-[var(--letron-background)]/20 border-t border-white/10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 text-center space-y-12">
        
        {/* Title */}
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Đối tác LeTRON
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Chúng tôi không chỉ kết nối — chúng tôi cùng nhau tạo ra giá trị lâu dài và thúc đẩy chuyển đổi xanh toàn diện.
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative w-full py-4 overflow-hidden mask-gradient">
          
          {/* Fading Edges Overlays */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--letron-background)] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--letron-background)] to-transparent z-10 pointer-events-none" />

          {/* Scrolling Flex Row */}
          <div className="flex w-[200%] gap-12 animate-marquee items-center">
            {marqueeLogos.map((logo, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-40 h-16 relative flex items-center justify-center filter grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
              >
                <Image
                  src={logo}
                  alt={`Đối tác LeTRON ${idx + 1}`}
                  fill
                  className="object-contain max-h-12 w-auto filter invert"
                />
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
