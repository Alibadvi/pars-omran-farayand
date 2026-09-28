import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export function SafetySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    if (!section || !image || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(
      image,
      { scale: 1.07 },
      {
        scale: 1,
        duration: 1.65,
        ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 82%", once: true },
      },
    );

    gsap.fromTo(
      section.querySelectorAll("[data-safety-reveal]"),
      { autoAlpha: 0, y: 22 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 76%", once: true },
      },
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden bg-[#0b2429] text-white" aria-labelledby="safety-heading">
      <img
        ref={imageRef}
        src="/images/home/safety-site.webp"
        alt="Two construction workers checking piping at an industrial site, illustrative image"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover object-[64%_center] sm:object-[58%_center] lg:object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,21,25,0.98)_0%,rgba(5,21,25,0.91)_32%,rgba(5,21,25,0.56)_60%,rgba(5,21,25,0.1)_100%)] max-lg:bg-[linear-gradient(0deg,rgba(5,21,25,0.97)_0%,rgba(5,21,25,0.86)_35%,rgba(5,21,25,0.25)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(191,217,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(191,217,212,0.05)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#071d25] to-transparent" />

      <div className="relative mx-auto flex min-h-[530px] max-w-[1480px] flex-col justify-end px-5 pb-12 pt-32 sm:min-h-[570px] sm:px-8 sm:pb-16 lg:min-h-[510px] lg:justify-center lg:px-12 lg:py-20">
        <div className="max-w-[670px] border-l border-[#e2a261]/65 pl-5 sm:pl-8">
          <p data-safety-reveal className="flex items-center gap-3 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[#eab477] sm:text-xs">
            <ShieldCheck size={17} aria-hidden="true" />
            HSE / A shared responsibility
          </p>
          <h2 id="safety-heading" data-safety-reveal className="mt-5 max-w-[670px] text-[clamp(2.65rem,5.8vw,5.2rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-balance">
            Safety starts before the first step.
          </h2>
          <p data-safety-reveal className="mt-5 max-w-[530px] text-sm leading-6 text-[#d5e0df] sm:text-base sm:leading-7">
            Clear plans, careful coordination, and attention to people and the environment belong in every phase of the work.
          </p>
          <NavLink
            data-safety-reveal
            to="/hse"
            className="group mt-7 inline-flex min-h-11 items-center gap-3 border border-[#e2a261] bg-[#e2a261] px-5 text-[0.66rem] font-bold uppercase tracking-[0.15em] text-[#10201c] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b2429]"
          >
            Our HSE approach
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </NavLink>
        </div>
        <span className="absolute bottom-5 right-5 hidden text-[0.55rem] uppercase tracking-[0.18em] text-white/55 sm:block sm:right-8 lg:right-12">People · Site · Environment</span>
      </div>
    </section>
  );
}
