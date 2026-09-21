import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const marqueeItems = [
  "Oil & Gas",
  "Industrial Piping",
  "EPC Delivery",
  "Tank Fabrication",
  "Civil Works",
  "Power Plants",
  "HSE",
];

function MarqueeGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {marqueeItems.map((item) => (
        <div key={item} className="flex items-center">
          <span className="px-5 text-[0.68rem] font-bold tracking-[0.2em] whitespace-nowrap text-white/75 uppercase sm:px-8 sm:text-xs lg:px-10">
            {item}
          </span>
          <span className="size-1.5 rotate-45 bg-[#e2a261]" />
        </div>
      ))}
    </div>
  );
}

export function MarqueeDivider() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.to(track, {
        xPercent: -50,
        duration: 30,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className="relative z-[60] -mt-20 overflow-hidden border-y border-[#e2a261]/55 bg-[#0a2225]/96 py-5 shadow-[0_-22px_65px_rgba(4,15,16,0.38)] backdrop-blur-md sm:py-6"
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        <MarqueeGroup />
        <MarqueeGroup hidden />
      </div>
    </div>
  );
}
