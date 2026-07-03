import React from "react";

type ComponentPlaceholderProps = {
  name: string;
  category: string;
  status?: "planned" | "ready";
  size?: "sm" | "md" | "lg";
  note: string;
};

export function ComponentPlaceholder({
  name,
  category,
  status = "planned",
  size = "md",
  note,
}: ComponentPlaceholderProps) {
  const sizeClasses = {
    sm: "min-h-[120px] p-6",
    md: "min-h-[180px] p-8",
    lg: "min-h-[240px] p-10",
  };

  return (
    <article 
      className={`relative w-full overflow-hidden rounded-[24px] border border-white/10 bg-[#0d1b4b]/40 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:shadow-[0_8px_32px_rgba(0,161,219,0.15)] flex flex-col justify-between ${sizeClasses[size]}`}
      data-name="component-placeholder"
    >
      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#56b9ff]/10 blur-[40px] pointer-events-none" />
      
      <div className="flex items-center justify-between relative z-10 w-full mb-4">
        <span className="text-[10px] font-bold tracking-[0.15em] text-[#6ef2ff] uppercase opacity-80">
          {category}
        </span>
        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
          status === "ready" 
            ? "bg-[#1cbbb4]/20 text-[#1cbbb4] border border-[#1cbbb4]/30" 
            : "bg-white/5 text-white/40 border border-white/10"
        }`}>
          {status === "ready" ? "Ready" : "Placeholder"}
        </span>
      </div>

      <div className="relative z-10">
        <h3 className="font-display text-[20px] font-extrabold text-white mb-2 tracking-tight">
          {name}
        </h3>
        <p className="text-[14px] leading-relaxed text-[#abcaeb]/70 max-w-[40ch]">
          {note}
        </p>
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#56b9ff] to-transparent transition-all duration-500 group-hover:w-full opacity-60" />
    </article>
  );
}
