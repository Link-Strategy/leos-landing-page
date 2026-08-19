import Image from "next/image";
import type * as React from "react";

import { HeartCard } from "@/components/landing/HeartCard";

type HeartValue = {
  id: string;
  iconPath: string;
  title: string;
  titleColor: string;
  hoverBackgroundColor: string;
  hoverBorderColor: string;
  description: React.ReactNode;
};

const LEFT_VALUES: HeartValue[] = [
  {
    id: "excellence",
    iconPath: "/assets/icons/heart/excellence.svg",
    title: "E — Excellence",
    titleColor: "#C8960C",
    hoverBackgroundColor: "#C8960C66",
    hoverBorderColor: "#C8960C",
    description: "Vượt ngưỡng giới hạn. Cam kết tiêu chuẩn cao nhất trong từng sản phẩm, từng dòng code.",
  },
  {
    id: "action",
    iconPath: "/assets/icons/heart/action.svg",
    title: "A — Action",
    titleColor: "#FF7E00",
    hoverBackgroundColor: "#FF800066",
    hoverBorderColor: "#FF7E00",
    description: "Thần tốc và Linh hoạt. 'Vừa chạy vừa xếp hàng' – Sai đâu sửa đó, không dừng lại.",
  },
];

const CENTER_VALUE: HeartValue = {
  id: "humanity",
  iconPath: "/assets/icons/heart/humanity.svg",
  title: "H — Humanity",
  titleColor: "#1CBBB4",
  hoverBackgroundColor: "#1CBBB466",
  hoverBorderColor: "#1CBBB4",
  description: "Con người là Trung tâm. An toàn là mệnh lệnh, Hạnh phúc là đích đến.",
};

const RIGHT_VALUES: HeartValue[] = [
  {
    id: "technology",
    iconPath: "/assets/icons/heart/technology.svg",
    title: "T — Technology",
    titleColor: "#1CBBB4",
    hoverBackgroundColor: "#1CBBB466",
    hoverBorderColor: "#1CBBB4",
    description: "Dẫn dắt bằng Dữ liệu. Dùng công nghệ để biến điều không thể thành có thể.",
  },
  {
    id: "respect",
    iconPath: "/assets/icons/heart/respect.svg",
    title: "R — Respect",
    titleColor: "#228B22",
    hoverBackgroundColor: "#228B2266",
    hoverBorderColor: "#228B22",
    description: "Chính trực và Biết ơn. Tôn trọng Mẹ Thiên nhiên, Đối tác, và mọi Cam kết.",
  },
];

export function AboutHeartValues() {
  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3 lg:gap-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:mt-28">
        {LEFT_VALUES.map((value) => (
          <HeartCard key={value.id} {...value} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="w-full">
          <HeartCard {...CENTER_VALUE} />
        </div>
        <div className="relative w-full max-w-[500px]">
          <Image
            alt="Giá trị cốt lõi H.E.A.R.T"
            src="/wp-content/uploads/2026/05/noi-dung-1.png"
            width={707}
            height={695}
            className="h-auto w-full object-contain"
          />
          <h3 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-archivo text-2xl font-extrabold leading-[1.3] text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-3xl">
            Giá trị cốt lõi
            <br />
            <span className="text-[#2A9FFF]">H.E.A.R.T</span>
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:mt-28">
        {RIGHT_VALUES.map((value) => (
          <HeartCard key={value.id} {...value} />
        ))}
      </div>
    </div>
  );
}
