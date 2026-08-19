import Image from "next/image";
import { X } from "lucide-react";

type LeadershipMember = {
  id: string;
  name: string;
  title: string;
  photo: string;
};

const LEADERSHIP_MEMBERS: LeadershipMember[] = [
  { id: "815", name: "Ông Nguyễn Văn Công", title: "CFO", photo: "/about/CFO.png" },
  { id: "813", name: "Ông Lê Minh Tiến", title: "Chủ tịch HĐQT", photo: "/about/COB.png" },
  { id: "811", name: "Bà Hoàng Lệ Thủy", title: "CEO", photo: "/about/CEO.png" },
  { id: "809", name: "Ông Lê Đức Anh", title: "LeAR", photo: "/about/LeAR.png" },
];

type LeadershipGridProps = {
  onClose?: () => void;
};

export function LeadershipGrid({ onClose }: LeadershipGridProps) {
  return (
    <div className="relative grid grid-cols-2 gap-x-3 gap-y-5 px-4 py-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10 lg:px-20 lg:py-15 bg-white/20 rounded-2xl lg:rounded-[20px] shadow-[0_6px_8px_0_rgba(0,0,0,0.4)] backdrop-blur-[35px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] p-px"
        style={{
          background:
            "linear-gradient(132.4deg, rgba(255,255,255,0) 2.52%, rgba(255,255,255,0) 19.76%, #FFFFFF 35.32%, rgba(255,255,255,0) 62.27%, #FFFFFF 73.1%, rgba(255,255,255,0) 93.41%)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-3 top-3 z-10 grid size-7 place-items-center rounded-full bg-white/20 text-white lg:hidden"
        >
          <X className="size-4" />
        </button>
      )}

      {LEADERSHIP_MEMBERS.map((member) => (
        <div key={member.id} className="flex flex-col">
          <div className="relative aspect-[304/308] w-full overflow-hidden rounded-2xl">
            <Image
              alt={member.name}
              src={member.photo}
              fill
              sizes="(max-width: 767px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          </div>
          <div className="mt-2 flex flex-col items-center text-center rounded-lg p-2 bg-white/25 lg:mt-3 lg:rounded-[8px] lg:p-3.5">
            <h3 className="font-archivo font-semibold leading-[1.3] text-white text-sm! whitespace-nowrap lg:text-xl!">
              {member.name}
            </h3>
            <p className="mt-1 font-archivo text-xs! font-normal leading-[1.3] text-white lg:text-base!">
              {member.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
