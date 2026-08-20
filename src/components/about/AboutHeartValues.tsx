import Image from "next/image";
import { useTranslations } from "next-intl";

import { HeartCard } from "@/components/landing/HeartCard";

type HeartValueMeta = {
  id: string;
  iconPath: string;
  titleColor: string;
  hoverBackgroundColor: string;
  hoverBorderColor: string;
};

const LEFT_VALUES_META: HeartValueMeta[] = [
  { id: "excellence", iconPath: "/assets/icons/heart/excellence.svg", titleColor: "#C8960C", hoverBackgroundColor: "#C8960C66", hoverBorderColor: "#C8960C" },
  { id: "action", iconPath: "/assets/icons/heart/action.svg", titleColor: "#FF7E00", hoverBackgroundColor: "#FF800066", hoverBorderColor: "#FF7E00" },
];

const CENTER_VALUE_META: HeartValueMeta = {
  id: "humanity",
  iconPath: "/assets/icons/heart/humanity.svg",
  titleColor: "#1CBBB4",
  hoverBackgroundColor: "#1CBBB466",
  hoverBorderColor: "#1CBBB4",
};

const RIGHT_VALUES_META: HeartValueMeta[] = [
  { id: "technology", iconPath: "/assets/icons/heart/technology.svg", titleColor: "#1CBBB4", hoverBackgroundColor: "#1CBBB466", hoverBorderColor: "#1CBBB4" },
  { id: "respect", iconPath: "/assets/icons/heart/respect.svg", titleColor: "#228B22", hoverBackgroundColor: "#228B2266", hoverBorderColor: "#228B22" },
];

export function AboutHeartValues() {
  const t = useTranslations("aboutHeartValues");

  const toValue = (meta: HeartValueMeta) => ({
    ...meta,
    title: t(`values.${meta.id}.title`),
    description: t(`values.${meta.id}.description`),
  });

  const LEFT_VALUES = LEFT_VALUES_META.map(toValue);
  const CENTER_VALUE = toValue(CENTER_VALUE_META);
  const RIGHT_VALUES = RIGHT_VALUES_META.map(toValue);

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
            alt={t("overlayImageAlt")}
            src="/wp-content/uploads/2026/05/noi-dung-1.png"
            width={707}
            height={695}
            className="h-auto w-full object-contain"
          />
          <h3 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-archivo text-2xl font-extrabold leading-[1.3] text-white drop-shadow-[4px_0_20px_rgba(0,140,255,0.2)] sm:text-3xl">
            {t("overlayTitleLine1")}
            <br />
            <span className="text-[#2A9FFF]">{t("overlayTitleHighlight")}</span>
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
