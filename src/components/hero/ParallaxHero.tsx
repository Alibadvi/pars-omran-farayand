import type { RefObject } from "react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { NavLink } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

type LayerName =
  | "layer-01-sky"
  | "layer-02-distant-refinery"
  | "layer-03-main-facility";

type HeroLayerProps = {
  layer: LayerName;
  className: string;
  imageRef: RefObject<HTMLImageElement | null>;
};

function HeroLayer({ layer, className, imageRef }: HeroLayerProps) {
  return (
    <picture className="absolute inset-0">
      <source media="(max-width: 767px)" srcSet={`/images/hero/mobile/${layer}.webp`} />
      <source media="(max-width: 1023px)" srcSet={`/images/hero/tablet/${layer}.webp`} />
      <source media="(min-aspect-ratio: 2/1)" srcSet={`/images/hero/ultrawide/${layer}.webp`} />
      <img
        ref={imageRef}
        src={`/images/hero/desktop/${layer}.webp`}
        alt=""
        aria-hidden="true"
        draggable={false}
        className={`absolute inset-0 size-full object-cover select-none ${className}`}
      />
    </picture>
  );
}

export function ParallaxHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const skyRef = useRef<HTMLImageElement>(null);
  const distantRef = useRef<HTMLImageElement>(null);
  const foregroundRef = useRef<HTMLImageElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const sky = skyRef.current;
      const distant = distantRef.current;
      const foreground = foregroundRef.current;
      const copy = copyRef.current;
      const progress = progressRef.current;

      if (!section || !sky || !distant || !foreground || !copy || !progress) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(sky, { scale: 1.06 });
        gsap.set(distant, { yPercent: 0 });
        gsap.set(foreground, { yPercent: 4 });
        gsap.set(progress, { scaleY: 1 });
        return;
      }

      const media = gsap.matchMedia();

      media.add("(min-width: 768px)", () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(sky, { yPercent: -3, scale: 1.08 }, { yPercent: 5, scale: 1.12 }, 0)
          .fromTo(distant, { yPercent: 9, scale: 1.04 }, { yPercent: -10, scale: 1.06 }, 0)
          .fromTo(
            foreground,
            { yPercent: 22, scale: 0.99 },
            { yPercent: -8, scale: 1.035 },
            0,
          )
          .fromTo(copy, { yPercent: 0, autoAlpha: 1 }, { yPercent: -15, autoAlpha: 0 }, 0.44)
          .fromTo(progress, { scaleY: 0 }, { scaleY: 1 }, 0);
      });

      media.add("(max-width: 767px)", () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.45,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(sky, { yPercent: -2, scale: 1.07 }, { yPercent: 3, scale: 1.1 }, 0)
          .fromTo(distant, { yPercent: 5, scale: 1.02 }, { yPercent: -6, scale: 1.04 }, 0)
          .fromTo(
            foreground,
            { yPercent: 12, scale: 0.995 },
            { yPercent: -4, scale: 1.01 },
            0,
          )
          .fromTo(copy, { yPercent: 0, autoAlpha: 1 }, { yPercent: -10, autoAlpha: 0 }, 0.52)
          .fromTo(progress, { scaleY: 0 }, { scaleY: 1 }, 0);
      });

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative h-[145svh] bg-[#09100e] md:h-[180svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden text-white">
        <div className="absolute inset-0 bg-[#121c21]" />

        <HeroLayer layer="layer-01-sky" imageRef={skyRef} className="will-change-transform" />
        <HeroLayer
          layer="layer-02-distant-refinery"
          imageRef={distantRef}
          className="will-change-transform"
        />

        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(5,11,10,0.86)_0%,rgba(5,11,10,0.57)_38%,rgba(5,11,10,0.12)_70%),linear-gradient(0deg,rgba(5,11,10,0.62)_0%,transparent_52%)] md:bg-[linear-gradient(90deg,rgba(5,11,10,0.9)_0%,rgba(5,11,10,0.6)_35%,rgba(5,11,10,0.06)_72%),linear-gradient(0deg,rgba(5,11,10,0.62)_0%,transparent_48%)]" />

        <HeroLayer
          layer="layer-03-main-facility"
          imageRef={foregroundRef}
          className="z-20 will-change-transform"
        />

        <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(0deg,rgba(4,9,8,0.7)_0%,transparent_33%)]" />
        <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] opacity-50" />

        <div className="relative z-40 mx-auto flex h-full w-full max-w-[1480px] items-start px-5 pt-32 sm:px-8 md:items-center md:pt-20 lg:px-12">
          <div ref={copyRef} className="max-w-[780px] will-change-transform">
            <div className="mb-5 flex items-center gap-3 text-[0.65rem] font-bold tracking-[0.22em] text-[#e2a261] uppercase sm:mb-7 sm:text-xs">
              <span className="h-px w-9 bg-[#e2a261] sm:w-12" />
              Oil · Gas · Industrial piping
            </div>

            <h1 className="max-w-[760px] text-[clamp(3.2rem,8.5vw,8.2rem)] leading-[0.86] font-semibold tracking-[-0.068em] text-balance drop-shadow-[0_5px_25px_rgba(0,0,0,0.38)]">
              Precision beneath every line.
            </h1>

            <div className="mt-7 max-w-[650px] border-l border-white/30 pl-5 sm:mt-9 sm:pl-7">
              <p className="max-w-[590px] text-sm leading-6 text-white/72 sm:text-lg sm:leading-8">
                Engineering, procurement, construction, and piping execution for
                high-demand energy and industrial environments.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9">
                <NavLink
                  to="/projects"
                  className="inline-flex min-h-12 items-center gap-3 bg-[#d95d39] px-5 text-[0.68rem] font-bold tracking-[0.14em] uppercase transition-colors duration-300 hover:bg-[#e2a261] hover:text-[#101613] sm:px-6"
                >
                  Explore projects
                  <ArrowUpRight size={17} />
                </NavLink>

                <NavLink
                  to="/capabilities"
                  className="inline-flex min-h-12 items-center border border-white/30 bg-black/10 px-5 text-[0.68rem] font-bold tracking-[0.14em] uppercase backdrop-blur-sm transition-colors duration-300 hover:border-white hover:bg-white hover:text-[#101613] sm:px-6"
                >
                  Capabilities
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-5 bottom-6 z-40 hidden items-end gap-4 sm:flex lg:right-12 lg:bottom-10">
          <span className="pb-1 text-[0.6rem] font-semibold tracking-[0.2em] text-white/45 uppercase [writing-mode:vertical-rl]">
            Scroll to explore
          </span>
          <div className="relative h-24 w-px overflow-hidden bg-white/20">
            <div ref={progressRef} className="absolute inset-0 origin-top scale-y-0 bg-[#e2a261]" />
          </div>
          <ArrowDown size={17} className="text-[#e2a261]" />
        </div>

        <div className="absolute bottom-0 left-0 z-40 h-1 w-24 bg-[#e2a261] sm:w-36" />
      </div>
    </section>
  );
}
