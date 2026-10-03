import type { RefObject } from "react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import { homeCopy } from "../../i18n/homeCopy";

gsap.registerPlugin(ScrollTrigger);

type LayerName =
  | "layer-01-sky"
  | "layer-02-distant-refinery"
  | "layer-03-main-facility";

type HeroLayerProps = {
  layer: LayerName;
  containerClassName?: string;
  imageClassName?: string;
  containerRef: RefObject<HTMLPictureElement | null>;
  imageRef: RefObject<HTMLImageElement | null>;
};

function HeroLayer({
  layer,
  containerClassName = "",
  imageClassName = "",
  containerRef,
  imageRef,
}: HeroLayerProps) {
  return (
    <picture ref={containerRef} className={`absolute inset-0 ${containerClassName}`}>
      <source media="(max-width: 767px)" srcSet={`/images/hero/mobile/${layer}.webp`} />
      <source media="(max-width: 1023px)" srcSet={`/images/hero/tablet/${layer}.webp`} />
      <source media="(min-aspect-ratio: 2/1)" srcSet={`/images/hero/ultrawide/${layer}.webp`} />
      <img
        ref={imageRef}
        src={`/images/hero/desktop/${layer}.webp`}
        alt=""
        aria-hidden="true"
        draggable={false}
        fetchPriority={layer === "layer-01-sky" ? "high" : "auto"}
        className={`absolute inset-0 size-full object-cover object-center select-none transform-gpu ${imageClassName}`}
      />
    </picture>
  );
}

export function ParallaxHero() {
  const { language } = useLanguage();
  const home = homeCopy[language];
  const sectionRef = useRef<HTMLElement>(null);
  const skyWrapRef = useRef<HTMLPictureElement>(null);
  const distantWrapRef = useRef<HTMLPictureElement>(null);
  const foregroundWrapRef = useRef<HTMLPictureElement>(null);
  const skyRef = useRef<HTMLImageElement>(null);
  const distantRef = useRef<HTMLImageElement>(null);
  const foregroundRef = useRef<HTMLImageElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const skyWrap = skyWrapRef.current;
      const distantWrap = distantWrapRef.current;
      const foregroundWrap = foregroundWrapRef.current;
      const sky = skyRef.current;
      const distant = distantRef.current;
      const foreground = foregroundRef.current;
      const copy = copyRef.current;
      const progress = progressRef.current;
      const transition = transitionRef.current;

      if (
        !section ||
        !skyWrap ||
        !distantWrap ||
        !foregroundWrap ||
        !sky ||
        !distant ||
        !foreground ||
        !copy ||
        !progress ||
        !transition
      ) {
        return;
      }

      const copyParts = copy.querySelectorAll<HTMLElement>("[data-hero-copy]");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        gsap.set([skyWrap, distantWrap, foregroundWrap, ...copyParts], {
          autoAlpha: 1,
          clearProps: "transform",
        });
        gsap.set(sky, { scale: 1.06 });
        gsap.set(distant, { yPercent: 0 });
        gsap.set(foreground, { yPercent: 4 });
        gsap.set(progress, { scaleY: 1 });
        gsap.set(transition, { autoAlpha: 1 });
        return;
      }

      gsap.set([skyWrap, distantWrap, foregroundWrap], { autoAlpha: 0 });
      gsap.set(copyParts, { autoAlpha: 0, y: 24 });

      const intro = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        .fromTo(
          skyWrap,
          { autoAlpha: 0, scale: 1.055 },
          { autoAlpha: 1, scale: 1, duration: 1.45 },
          0,
        )
        .fromTo(
          distantWrap,
          { autoAlpha: 0, y: 54 },
          { autoAlpha: 1, y: 0, duration: 1.15 },
          0.18,
        )
        .fromTo(
          foregroundWrap,
          { autoAlpha: 0, y: 82 },
          { autoAlpha: 1, y: 0, duration: 1.25 },
          0.3,
        )
        .to(
          copyParts,
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.075 },
          0.48,
        );

      let cancelled = false;
      const revealHero = async () => {
        await Promise.race([
          Promise.all(
            [sky, distant, foreground].map((image) =>
              image.decode ? image.decode().catch(() => undefined) : Promise.resolve(),
            ),
          ),
          new Promise<void>((resolve) => window.setTimeout(resolve, 600)),
        ]);

        if (!cancelled) intro.play(0);
      };

      void revealHero();

      const media = gsap.matchMedia();

      media.add("(min-width: 768px)", () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(sky, { yPercent: -3, scale: 1.08 }, { yPercent: 4, scale: 1.115 }, 0)
          .fromTo(distant, { yPercent: 5, scale: 1.035 }, { yPercent: -5, scale: 1.055 }, 0)
          .fromTo(
            foreground,
            { yPercent: 17, scale: 0.995 },
            { yPercent: -7, scale: 1.03 },
            0,
          )
          .fromTo(copy, { yPercent: 0, autoAlpha: 1 }, { yPercent: -12, autoAlpha: 0 }, 0.5)
          .fromTo(progress, { scaleY: 0 }, { scaleY: 1 }, 0)
          .fromTo(transition, { autoAlpha: 0 }, { autoAlpha: 1 }, 0.72);
      });

      media.add("(max-width: 767px)", () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(sky, { yPercent: -1, scale: 1.05 }, { yPercent: 1, scale: 1.065, duration: 1 }, 0)
          .fromTo(distant, { yPercent: 2, scale: 1.015 }, { yPercent: -1, scale: 1.025, duration: 1 }, 0)
          .fromTo(foreground, { yPercent: 5, scale: 1.01 }, { yPercent: -1, scale: 1.018, duration: 1 }, 0)
          .fromTo(copy, { yPercent: 0, autoAlpha: 1 }, { yPercent: -3, autoAlpha: 0, duration: 0.22 }, 0.78)
          .fromTo(progress, { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0)
          .fromTo(transition, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.7);
      });

      return () => {
        cancelled = true;
        intro.kill();
        media.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative h-[138svh] bg-[#09100e] md:h-[180svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden text-white">
        <div className="absolute inset-0 bg-[#121c21]" />

        <HeroLayer
          layer="layer-01-sky"
          containerRef={skyWrapRef}
          imageRef={skyRef}
          containerClassName="z-0 will-change-[opacity,transform]"
          imageClassName="will-change-transform object-[64%_center] sm:object-[58%_center] md:object-center"
        />
        <HeroLayer
          layer="layer-02-distant-refinery"
          containerRef={distantWrapRef}
          imageRef={distantRef}
          containerClassName="z-10 will-change-[opacity,transform]"
          imageClassName="will-change-transform object-[64%_center] brightness-[0.82] saturate-[0.82] sm:object-[58%_center] md:object-center md:brightness-[0.88] md:saturate-[0.86] md:drop-shadow-[0_-2px_8px_rgba(225,130,72,0.18)]"
        />

        <div className="rtl-gradient-start pointer-events-none absolute inset-0 z-[15] bg-[linear-gradient(90deg,rgba(5,11,10,0.86)_0%,rgba(5,11,10,0.57)_38%,rgba(5,11,10,0.12)_70%),linear-gradient(0deg,rgba(5,11,10,0.62)_0%,transparent_52%)] md:bg-[linear-gradient(90deg,rgba(5,11,10,0.9)_0%,rgba(5,11,10,0.6)_35%,rgba(5,11,10,0.06)_72%),linear-gradient(0deg,rgba(5,11,10,0.62)_0%,transparent_48%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[16] h-[52%] bg-[radial-gradient(ellipse_at_72%_35%,rgba(224,125,65,0.1),transparent_46%),linear-gradient(0deg,rgba(6,13,12,0.4),transparent_78%)]" />

        <HeroLayer
          layer="layer-03-main-facility"
          containerRef={foregroundWrapRef}
          imageRef={foregroundRef}
          containerClassName="z-20 will-change-[opacity,transform]"
          imageClassName="will-change-transform object-[64%_center] saturate-[0.86] contrast-[1.02] sm:object-[58%_center] md:object-center md:saturate-[0.92] md:contrast-[1.035] md:drop-shadow-[0_-2px_7px_rgba(224,139,83,0.16)]"
        />

        <div className="pointer-events-none absolute inset-0 z-[28] bg-[linear-gradient(180deg,rgba(4,9,8,0.24)_0%,rgba(4,9,8,0.18)_34%,rgba(4,9,8,0.76)_68%,rgba(4,9,8,0.96)_100%)] md:hidden" />
        <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(0deg,rgba(4,9,8,0.76)_0%,transparent_42%)] md:bg-[linear-gradient(0deg,rgba(4,9,8,0.72)_0%,transparent_35%)]" />
        <div className="pointer-events-none absolute inset-0 z-30 hidden bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] opacity-45 md:block" />

        <div className="relative z-40 mx-auto flex h-full w-full max-w-[1480px] items-end px-4 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-24 [@media(max-height:650px)]:pb-4 sm:px-8 md:items-center md:pb-0 md:pt-20 lg:px-12">
          <div ref={copyRef} className="w-full max-w-[520px] border-s-2 border-[#e2a261] bg-[#061311]/90 px-5 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.36)] backdrop-blur-sm will-change-transform [@media(max-height:650px)]:py-4 md:max-w-[780px] md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">
            <div data-hero-copy className="mb-7 hidden items-center gap-3 text-xs font-bold tracking-[0.2em] text-[#efb16a] uppercase md:flex">
              <span className="h-px w-8 bg-[#e2a261] sm:w-12" />
              {home.hero.kicker}
            </div>

            <h1 data-hero-copy className="max-w-[760px] text-[clamp(2.3rem,10.6vw,3.35rem)] leading-[0.98] font-semibold tracking-[-0.05em] text-balance [@media(max-height:650px)]:text-[clamp(2.1rem,9.7vw,3rem)] sm:text-[clamp(2.8rem,8vw,3.6rem)] md:text-[clamp(4.8rem,8.5vw,8.2rem)] md:leading-[0.86] md:tracking-[-0.068em] md:drop-shadow-[0_5px_25px_rgba(0,0,0,0.38)]">
              <span className="md:hidden">{home.hero.titleMobile}</span>
              <span className="hidden md:inline">{home.hero.title}</span>
            </h1>

            <div data-hero-copy className="mt-3 max-w-[650px] md:mt-7 md:border-s md:border-white/30 md:ps-7">
              <p className="max-w-[520px] text-sm leading-6 text-white/90 [@media(max-height:540px)]:hidden md:max-w-[590px] md:text-lg md:leading-8 md:text-white/72">
                <span className="md:hidden">{home.hero.bodyMobile}</span>
                <span className="hidden md:inline">{home.hero.body}</span>
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-9">
                <NavLink
                  to="/projects"
                  className="inline-flex min-h-11 items-center gap-3 bg-[#d95d39] px-4 text-[0.64rem] font-bold tracking-[0.14em] uppercase shadow-[0_14px_36px_rgba(0,0,0,0.22)] transition-colors duration-300 hover:bg-[#e2a261] hover:text-[#101613] sm:min-h-12 sm:px-6 sm:text-[0.68rem]"
                >
                  {home.hero.projects}
                  <ArrowUpRight size={17} className="rtl-flip" />
                </NavLink>

                <NavLink
                  to="/#capabilities"
                  className="hidden min-h-12 items-center border border-white/30 bg-black/10 px-5 text-[0.68rem] font-bold tracking-[0.14em] uppercase backdrop-blur-sm transition-colors duration-300 hover:border-white hover:bg-white hover:text-[#101613] md:inline-flex md:px-6"
                >
                  {home.hero.capabilities}
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute end-5 bottom-6 z-40 hidden items-end gap-4 md:flex lg:end-12 lg:bottom-10">
          <span className="pb-1 text-[0.6rem] font-semibold tracking-[0.2em] text-white/45 uppercase [writing-mode:vertical-rl]">
            {home.hero.scroll}
          </span>
          <div className="relative h-24 w-px overflow-hidden bg-white/20">
            <div ref={progressRef} className="absolute inset-0 origin-top scale-y-0 bg-[#e2a261]" />
          </div>
          <ArrowDown size={17} className="text-[#e2a261]" />
        </div>

        <div className="absolute bottom-0 start-0 z-40 h-1 w-24 bg-[#e2a261] sm:w-36" />
        <div
          ref={transitionRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[38svh] bg-[linear-gradient(180deg,transparent_0%,rgba(6,19,21,0.28)_36%,#071b1f_100%)] opacity-0"
        />
      </div>
    </section>
  );
}
