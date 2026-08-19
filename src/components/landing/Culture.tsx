export default function Culture() {
  return (
    <section className="relative py-24 bg-transparent overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-[#2A9FFF]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-6 sm:px-8 text-center space-y-4">
        {/* Subtitle */}
        <div className="text-[#4AB3FF] text-xs tracking-widest uppercase font-semibold">
          Văn hóa &amp; Con người
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight [text-shadow:4px_0px_20px_rgba(0,140,255,0.2)]">
          Công nghệ tạo nên hệ thống
          <br />
          Con người tạo nên{" "}
          <span className="text-[#2A9FFF]">
            tương lai
          </span>
        </h2>

        {/* Body text */}
        <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
          LeTRON xây dựng mô hình kinh tế tuần hoàn khép kín, nơi mỗi mắt
          xích đều tạo ra giá trị.
        </p>
      </div>
    </section>
  );
}
