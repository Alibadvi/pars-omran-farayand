import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { NavLink } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const TARGET_PERCENTAGE = 100;

export function PerformanceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const metricRef = useRef<HTMLSpanElement>(null);
  const progressCircleRef = useRef<SVGCircleElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const image = imageRef.current;
      const metric = metricRef.current;
      const progressCircle = progressCircleRef.current;

      if (!section || !image || !metric || !progressCircle) return;

      const revealItems = section.querySelectorAll<HTMLElement>("[data-performance-reveal]");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        metric.textContent = `${TARGET_PERCENTAGE}%`;
        gsap.set([...revealItems, progressCircle], {
          autoAlpha: 1,
          clearProps: "transform,strokeDashoffset",
        });
        return;
      }

      const counter = { value: 0 };

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            once: true,
          },
          defaults: { ease: "power3.out" },
        })
        .fromTo(image, { scale: 1.08 }, { scale: 1, duration: 1.7 }, 0)
        .fromTo(
          revealItems,
          { autoAlpha: 0, y: 42 },
          { autoAlpha: 1, y: 0, duration: 0.95, stagger: 0.1 },
          0.08,
        )
        .fromTo(
          progressCircle,
          { strokeDashoffset: 100 },
          { strokeDashoffset: 0, duration: 1.65, ease: "power2.inOut" },
          0.22,
        )
        .to(
          counter,
          {
            value: TARGET_PERCENTAGE,
            duration: 1.65,
            ease: "power2.out",
            onUpdate: () => {
              metric.textContent = `${Math.round(counter.value)}%`;
            },
          },
          0.22,
        );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-50 min-h-[92svh] overflow-hidden bg-[#071b1f] text-white md:min-h-[82svh]"
    >
      <img
        ref={imageRef}
        src="/images/home/performance-refinery.webp"
        alt="Industrial refinery and piping facilities"
        className="absolute inset-0 size-full object-cover object-[62%_center] will-change-transform sm:object-center"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,20,24,0.97)_0%,rgba(5,42,49,0.91)_42%,rgba(5,48,57,0.54)_70%,rgba(4,22,26,0.38)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:42px_42px] opacity-55" />
      <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,#071b1f_0%,rgba(7,27,31,0.7)_38%,transparent_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#071b1f] to-transparent" />

      <div className="relative mx-auto grid min-h-[92svh] w-full max-w-[1480px] items-center gap-12 px-5 py-28 sm:px-8 md:min-h-[82svh] md:grid-cols-[minmax(0,0.9fr)_minmax(380px,1.1fr)] md:py-24 lg:gap-20 lg:px-12">
        <div className="relative z-20 max-w-[620px]">
          <div data-performance-reveal className="mb-6 flex items-center gap-3 text-[0.65rem] font-bold tracking-[0.23em] text-[#e2a261] uppercase sm:text-xs">
            <span className="h-px w-10 bg-[#e2a261] sm:w-14" />
            Built for performance
          </div>

          <h2 data-performance-reveal className="text-[clamp(2.8rem,6vw,6.6rem)] leading-[0.9] font-semibold tracking-[-0.055em] text-balance">
            Performance without compromise.
          </h2>

          <p data-performance-reveal className="mt-7 max-w-[560px] text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
            Collaborative planning, disciplined controls, and specialist field
            execution keep every phase aligned—from the first drawing to final handover.
          </p>

          <div data-performance-reveal className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-white/18 pt-6 text-[0.63rem] font-bold tracking-[0.16em] text-white/62 uppercase sm:text-[0.68rem]">
            <span>Engineering</span>
            <span>Procurement</span>
            <span>Construction</span>
          </div>

          <NavLink
            data-performance-reveal
            to="/capabilities"
            className="mt-9 inline-flex min-h-12 items-center gap-3 bg-[#e2a261] px-6 text-[0.68rem] font-bold tracking-[0.14em] text-[#102024] uppercase transition-colors duration-300 hover:bg-white"
          >
            How we work
            <ArrowUpRight size={17} />
          </NavLink>
        </div>

        <div data-performance-reveal className="relative z-10 mx-auto aspect-square w-[min(84vw,520px)] md:ml-auto md:w-[min(42vw,600px)]">
          <div className="absolute inset-[2%] rounded-full border border-white/35" />
          <div className="absolute inset-[8%] rounded-full border border-[#e2a261]/35" />
          <div className="absolute inset-[15%] rounded-full border border-white/14" />
          <div className="absolute inset-0 rounded-full bg-[repeating-conic-gradient(from_0deg,rgba(255,255,255,0.72)_0deg,rgba(255,255,255,0.72)_0.35deg,transparent_0.35deg,transparent_3deg)] opacity-45 [mask-image:radial-gradient(circle,transparent_66%,#000_66.5%,#000_68%,transparent_68.5%)]" />

          <svg className="absolute inset-[5%] size-[90%] -rotate-90 overflow-visible" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="46" pathLength="100" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
            <circle
              ref={progressCircleRef}
              cx="50"
              cy="50"
              r="46"
              pathLength="100"
              fill="none"
              stroke="#e2a261"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset="100"
            />
          </svg>

          <div className="absolute inset-[21%] flex flex-col items-center justify-center rounded-full border border-white/15 bg-[#071b1f]/46 text-center shadow-[0_0_80px_rgba(6,21,24,0.54)] backdrop-blur-[2px]">
            <span ref={metricRef} className="text-[clamp(4.1rem,11vw,8.6rem)] leading-none font-semibold tracking-[-0.075em] tabular-nums">
              0%
            </span>
            <span className="mt-3 max-w-[210px] px-4 text-[0.58rem] leading-4 font-bold tracking-[0.18em] text-white/72 uppercase sm:text-[0.68rem] sm:leading-5">
              Commitment to safe, controlled delivery
            </span>
          </div>

          <span className="absolute top-[12%] left-[18%] size-2 rounded-full bg-[#e2a261] shadow-[0_0_18px_rgba(226,162,97,0.9)]" />
          <span className="absolute right-[8%] bottom-[28%] size-1.5 rounded-full bg-white/85 shadow-[0_0_16px_rgba(255,255,255,0.75)]" />
        </div>
      </div>
    </section>
  );
}
