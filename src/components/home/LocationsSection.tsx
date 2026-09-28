import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, MapPin } from "lucide-react";
import { NavLink } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

// Natural Earth 110m Iran outline, projected into this SVG's 740 x 500 viewBox.
const IRAN_OUTLINE =
  "M371.3 86.8 L401.2 80.8 L425.4 63.1 L448.1 64.0 L463.1 58.2 L487.2 61.1 L524.8 76.8 L552.0 80.2 L590.8 107.7 L616.2 108.8 L619.2 134.8 L605.3 173.5 L596.0 196.0 L610.8 200.6 L596.2 217.6 L607.4 242.3 L610.0 262.0 L635.8 267.2 L638.6 287.2 L607.7 315.3 L624.6 331.6 L638.2 350.3 L670.7 364.0 L671.7 391.3 L688.0 396.3 L690.8 410.5 L641.7 426.6 L628.9 462.6 L564.9 453.2 L527.9 446.1 L489.5 442.1 L475.0 404.1 L458.7 398.6 L432.6 404.1 L398.3 419.1 L356.8 408.8 L322.4 385.0 L289.7 376.2 L267.0 346.7 L241.9 305.4 L223.6 310.4 L202.0 300.2 L189.3 312.3 L170.5 296.0 L170.2 279.5 L159.3 279.5 L164.9 257.0 L147.4 233.5 L105.7 216.5 L82.2 187.0 L90.0 162.8 L107.2 152.1 L104.6 134.0 L82.3 124.7 L60.3 87.7 L41.7 62.9 L48.3 53.3 L37.7 17.7 L61.0 8.9 L66.4 20.6 L83.6 34.9 L106.9 39.0 L119.2 38.1 L159.3 15.2 L172.0 13.0 L182.1 22.0 L170.4 37.4 L191.6 53.6 L200.0 52.1 L210.8 74.9 L243.0 81.4 L266.6 96.9 L315.0 102.3 L368.1 94.1 L371.3 86.8 Z";

const projectRegions = [
  {
    name: "South Pars",
    area: "Bushehr Province",
    description:
      "Process piping and mechanical packages across South Pars phases, including Phase 13 and gas metering works.",
    x: 326,
    y: 388,
  },
  {
    name: "Khuzestan",
    area: "Abadan · South Azadegan",
    description:
      "Refinery piping in Abadan and tank engineering, procurement, and fabrication for South Azadegan.",
    x: 180,
    y: 282,
  },
  {
    name: "Fars",
    area: "Saadat Abad Oilfield",
    description:
      "Wellhead facilities, flowlines, and related construction for the Saadat Abad oilfield.",
    x: 350,
    y: 350,
  },
];

export function LocationsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const activeRegion = projectRegions[activeIndex];

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const items = section.querySelectorAll<HTMLElement>("[data-location-reveal]");
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#0b2429] py-14 text-white sm:py-16 lg:py-20"
      aria-labelledby="locations-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(141,198,192,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(141,198,192,0.055)_1px,transparent_1px)] bg-[size:52px_52px]" />
      <div className="pointer-events-none absolute -right-28 top-0 size-[620px] rounded-full bg-[#247280]/12 blur-3xl" />

      <div className="relative mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-stretch lg:gap-12">
          <div className="contents lg:flex lg:flex-col">
            <div data-location-reveal className="order-1 lg:pt-3">
              <p className="flex items-center gap-3 text-[0.64rem] font-bold uppercase tracking-[0.24em] text-[#e5aa6a]">
                <span className="h-px w-9 bg-[#e5aa6a]" />
                Selected project areas
              </p>
              <h2
                id="locations-heading"
                className="mt-5 max-w-[570px] text-[clamp(2.65rem,5.6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-balance"
              >
                Where we work.
              </h2>
              <p className="mt-5 max-w-[475px] text-sm leading-6 text-[#bfced0] sm:text-base sm:leading-7">
                On the ground across Iran&apos;s energy and industrial corridors,
                from refinery units to wellhead facilities.
              </p>
            </div>

            <div
              data-location-reveal
              className="order-3 border border-white/15 bg-[#102e33]/90 p-5 sm:p-6 lg:mt-auto"
              aria-live="polite"
            >
              <p className="text-[0.59rem] font-bold uppercase tracking-[0.24em] text-[#e5aa6a]">
                0{activeIndex + 1} / In focus
              </p>
              <div className="mt-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                    {activeRegion.name}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/55">
                    {activeRegion.area}
                  </p>
                </div>
                <MapPin size={20} className="mt-1 shrink-0 text-[#e5aa6a]" aria-hidden="true" />
              </div>
              <p className="mt-4 max-w-[490px] text-sm leading-6 text-[#bfced0]">
                {activeRegion.description}
              </p>
              <NavLink
                to="/projects"
                className="group mt-5 inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#e5aa6a] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5aa6a] focus-visible:ring-offset-4 focus-visible:ring-offset-[#102e33]"
              >
                Explore projects
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </NavLink>
            </div>

            <div data-location-reveal className="order-4 grid grid-cols-3 gap-2 lg:mt-4">
              {projectRegions.map((region, index) => {
                const selected = index === activeIndex;

                return (
                  <button
                    key={region.name}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setActiveIndex(index)}
                    onMouseEnter={() => {
                      if (window.matchMedia("(hover: hover)").matches) setActiveIndex(index);
                    }}
                    className={`min-h-14 border px-2 py-2.5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5aa6a] sm:px-3 ${
                      selected
                        ? "border-[#e5aa6a] bg-[#e5aa6a] text-[#132321]"
                        : "border-white/15 bg-white/[0.035] text-white/75 hover:border-[#e5aa6a]/65 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="block text-[0.55rem] font-bold tracking-[0.18em] opacity-70">
                      0{index + 1}
                    </span>
                    <span className="mt-1 block text-[0.65rem] font-bold leading-4 sm:text-xs">
                      {region.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            data-location-reveal
            className="relative order-2 aspect-[740/500] w-full overflow-hidden border border-white/10 bg-[#103039] lg:order-2"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_55%_45%,rgba(55,124,131,0.26),transparent_62%)]" />
            <svg
              viewBox="0 0 740 500"
              className="absolute inset-0 size-full"
              role="img"
              aria-label="Map of Iran with approximate project regions in Bushehr, Khuzestan, and Fars"
            >
              <defs>
                <linearGradient id="iran-map-fill" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#245661" />
                  <stop offset="100%" stopColor="#123940" />
                </linearGradient>
                <pattern id="iran-map-dots" width="12" height="12" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.8" fill="#c2d8d0" opacity="0.18" />
                </pattern>
              </defs>

              <path d={IRAN_OUTLINE} fill="url(#iran-map-fill)" stroke="#89b3b2" strokeWidth="1.6" />
              <path d={IRAN_OUTLINE} fill="url(#iran-map-dots)" stroke="none" />

              <circle cx="286" cy="133" r="4" fill="#bfced0" />
              <circle cx="286" cy="133" r="10" fill="none" stroke="#bfced0" strokeOpacity="0.35" />

              {projectRegions.map((region, index) => (
                <g key={region.name} aria-hidden="true" className="transition-opacity duration-300">
                  <circle
                    cx={region.x}
                    cy={region.y}
                    r={index === activeIndex ? 23 : 14}
                    fill="#e5aa6a"
                    fillOpacity={index === activeIndex ? 0.2 : 0.07}
                    className="transition-all duration-300"
                  />
                  <circle
                    cx={region.x}
                    cy={region.y}
                    r={index === activeIndex ? 7 : 5}
                    fill={index === activeIndex ? "#ffc47e" : "#a9c5c1"}
                    stroke="#0b2429"
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                </g>
              ))}

              <g className="hidden fill-[#d7e6e5] text-[11px] font-semibold tracking-[0.14em] sm:block">
                <text x="303" y="129">TEHRAN / HQ</text>
                <text x="74" y="266">KHUZESTAN</text>
                <text x="381" y="350">FARS</text>
                <text x="359" y="413">SOUTH PARS</text>
              </g>
            </svg>

            <div className="pointer-events-none absolute left-3 top-3 border border-white/15 bg-[#0b2429]/85 px-3 py-2 text-[0.55rem] font-bold uppercase tracking-[0.18em] text-white/70 backdrop-blur-sm sm:left-5 sm:top-5">
              Iran / project footprint
            </div>
            <p className="pointer-events-none absolute bottom-3 right-3 text-[0.55rem] tracking-[0.06em] text-white/55 sm:bottom-5 sm:right-5">
              Project locations approximate
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
