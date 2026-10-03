import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLanguage } from "../../i18n/LanguageContext";
import { homeCopy } from "../../i18n/homeCopy";

function MarqueeGroup({ items, hidden = false }: { items: readonly string[]; hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <div key={item} className="flex items-center">
          <span dir="auto" className="px-5 text-[0.68rem] font-bold tracking-[0.2em] whitespace-nowrap text-white/75 uppercase sm:px-8 sm:text-xs lg:px-10">
            {item}
          </span>
          <span className="size-1.5 rotate-45 bg-[#e2a261]" />
        </div>
      ))}
    </div>
  );
}

export function MarqueeDivider() {
  const { language } = useLanguage();
  const home = homeCopy[language];
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
      className="relative z-30 -mt-14 overflow-hidden border-y border-[#e2a261]/55 bg-[#0a2225]/96 py-5 shadow-[0_-22px_65px_rgba(4,15,16,0.38)] backdrop-blur-md sm:py-5"
    >
      <div ref={trackRef} dir="ltr" className="flex w-max will-change-transform">
        <MarqueeGroup items={home.marquee} />
        <MarqueeGroup items={home.marquee} hidden />
      </div>
    </div>
  );
}
