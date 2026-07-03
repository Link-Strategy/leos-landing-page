"use client";

import { useEffect, useRef, useState } from "react";

interface CounterItemProps {
  endValue: number;
  duration: number; // in ms
  title: string;
  unit: string;
  description: string;
}

function CounterCard({ endValue, duration, title, unit, description }: CounterItemProps) {
  const [count, setCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTimestamp: number | null = null;
          
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Ease out quad function
            const easeProgress = progress * (2 - progress);
            
            setCount(Math.floor(easeProgress * endValue));
            
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [endValue, duration]);

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div
      ref={cardRef}
      className="p-8 rounded-2xl bg-[#132563]/40 border border-white/10 hover:border-emerald-500/20 hover:bg-[#132563]/60 transition-all duration-300 flex flex-col justify-between space-y-4"
    >
      <div className="space-y-2">
        <h3 className="text-zinc-200 text-sm font-semibold tracking-wide uppercase">
          {title}
        </h3>
        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-light">
          {description}
        </p>
      </div>

      <div className="pt-4 flex items-baseline gap-2">
        <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent filter drop-shadow-[0_2px_10px_rgba(52,211,153,0.2)]">
          {formatNumber(count)}
        </span>
        <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
          {unit}
        </span>
      </div>
    </div>
  );
}

export default function Counters() {
  const stats = [
    {
      id: "waste",
      endValue: 1250000,
      duration: 2000,
      title: "Chất thải đã được tái tạo",
      unit: "tấn",
      description: "Biến tài nguyên bị bỏ quên thành vật liệu xây dựng có giá trị kinh tế cao.",
    },
    {
      id: "co2",
      endValue: 485200,
      duration: 2000,
      title: "CO₂ đã được cắt giảm",
      unit: "tấn CO₂",
      description: "Tối ưu hóa các chu trình vận hành công nghệ và sản xuất để hướng tới Net Zero.",
    },
    {
      id: "carbon",
      endValue: 360000,
      duration: 2000,
      title: "Tín chỉ Carbon dự kiến phát hành",
      unit: "Tín chỉ",
      description: "Số hóa và chuyển hóa các tác động môi trường tích cực thành tài sản giao dịch.",
    },
  ];

  return (
    <section className="relative py-24 bg-transparent overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="text-emerald-400 text-xs tracking-widest uppercase font-semibold">
            Chỉ số phát triển bền vững
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            ESG – Không phải cam kết <br />
            <span className="text-zinc-400">Là </span>
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              dữ liệu đang vận hành
            </span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Mọi tác động môi trường và kết quả tuần hoàn tài nguyên tại LeTRON đều được ghi nhận số hóa, đo lường tự động và cập nhật trực tiếp theo thời gian thực.
          </p>
        </div>

        {/* Counter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <CounterCard
              key={stat.id}
              endValue={stat.endValue}
              duration={stat.duration}
              title={stat.title}
              unit={stat.unit}
              description={stat.description}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
