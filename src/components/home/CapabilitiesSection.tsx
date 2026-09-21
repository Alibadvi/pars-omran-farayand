import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { NavLink } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  {
    number: "01",
    title: "Piping & Mechanical",
    project: "South Pars · Abadan Refinery",
    description:
      "Fabrication, fit-up, welding, hydrotesting, reinstatement, supports, painting, insulation, and mechanical completion for process units and refinery systems.",
    metric: "62,000",
    unit: "inch-dia",
    metricLabel: "welding and fit-up recorded on South Pars Phase 13",
    image: "/images/home/capabilities/piping.webp",
  },
  {
    number: "02",
    title: "Oilfield Development",
    project: "Saadat Abad Oilfield",
    description:
      "Surface-facility delivery covering new well locations, flowlines, access roads, electrical works, manifold development, construction, installation, and commissioning.",
    metric: "2",
    unit: "new wells",
    metricLabel: "surface locations included in the development scope",
    image: "/images/home/capabilities/oilfield.webp",
  },
  {
    number: "03",
    title: "Tanks & Fabrication",
    project: "CTEP · South Azadegan",
    description:
      "Design, procurement, fabrication, installation, coating, and hydrotesting of atmospheric tanks and their associated steel structures.",
    metric: "710,000",
    unit: "kg",
    metricLabel: "tank plate procurement, fabrication, and installation",
    image: "/images/home/capabilities/tanks.webp",
  },
  {
    number: "04",
    title: "Power & Industrial",
    project: "Caspian Combined-Cycle Plant",
    description:
      "Installation of turbines, generators, transformers, auxiliary boilers, cooling systems, control panels, piping, and instrumentation cabling.",
    metric: "460",
    unit: "MW",
    metricLabel: "single-shaft combined-cycle power project experience",
    image: "/images/home/capabilities/power.webp",
  },
];

export function CapabilitiesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const imageStageRef = useRef<HTMLDivElement>(null);
  const metricPanelRef = useRef<HTMLDivElement>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const interactionReadyRef = useRef(false);
  const activeCapability = capabilities[activeIndex];

  useGSAP(
    () => {
      const section = sectionRef.current;
      const imageStage = imageStageRef.current;
      if (!section || !imageStage) return;

      const revealItems = section.querySelectorAll<HTMLElement>("[data-capability-reveal]");
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(revealItems, { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 76%",
            once: true,
          },
          defaults: { ease: "power3.out" },
        })
        .fromTo(imageStage, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.25 }, 0)
        .fromTo(
          revealItems,
          { autoAlpha: 0, y: 36 },
          { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.08 },
          0.25,
        );
    },
    { scope: sectionRef },
  );

  useGSAP(
    () => {
      if (!interactionReadyRef.current) {
        interactionReadyRef.current = true;
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        [metricPanelRef.current, detailPanelRef.current],
        { autoAlpha: 0.45, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.46, stagger: 0.06, ease: "power2.out" },
      );
    },
    { scope: sectionRef, dependencies: [activeIndex] },
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#ede9df] text-[#13201d]">
      <div className="grid min-h-[920px] lg:grid-cols-[1.08fr_0.92fr] xl:min-h-[860px]">
        <div ref={imageStageRef} className="relative min-h-[720px] overflow-hidden lg:min-h-full">
          {capabilities.map((capability, index) => (
            <img
              key={capability.title}
              src={capability.image}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className={`absolute inset-0 size-full object-cover transition-[opacity,transform] duration-700 ease-out ${
                index === activeIndex ? "scale-100 opacity-100" : "pointer-events-none scale-[1.045] opacity-0"
              }`}
            />
          ))}

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,14,15,0.08)_0%,rgba(4,14,15,0.16)_38%,rgba(4,14,15,0.86)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] opacity-55" />

          <div className="absolute top-7 left-5 flex items-center gap-3 text-[0.62rem] font-bold tracking-[0.2em] text-white/75 uppercase sm:top-10 sm:left-8 lg:left-12">
            <span className="h-px w-10 bg-[#e2a261]" />
            Selected expertise
          </div>

          <div className="absolute inset-x-4 bottom-5 z-20 grid gap-2 sm:inset-x-8 sm:bottom-8 sm:grid-cols-2 lg:right-0 lg:bottom-12 lg:left-auto lg:w-[min(82%,620px)] lg:translate-x-[7%]">
            {capabilities.map((capability, index) => {
              const active = index === activeIndex;

              return (
                <button
                  key={capability.title}
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={active}
                  className={`group flex min-h-[92px] items-center gap-4 border px-4 py-4 text-left backdrop-blur-md transition-all duration-500 sm:min-h-[106px] sm:px-5 ${
                    active
                      ? "translate-x-0 border-[#e2a261] bg-[#e2a261] text-[#10201d] shadow-[0_18px_55px_rgba(0,0,0,0.3)]"
                      : "border-white/14 bg-[#101d1d]/84 text-white hover:-translate-y-1 hover:border-[#e2a261]/75 hover:bg-[#132727]/94"
                  }`}
                >
                  <span className={`text-xs font-bold tracking-[0.16em] transition-colors duration-500 ${active ? "text-[#783f2a]" : "text-[#e2a261]"}`}>
                    {capability.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.72rem] font-bold tracking-[0.1em] uppercase sm:text-sm">
                      {capability.title}
                    </span>
                    <span className={`mt-1 hidden text-[0.58rem] tracking-[0.08em] uppercase sm:block ${active ? "text-[#10201d]/65" : "text-white/48"}`}>
                      {capability.project}
                    </span>
                  </span>
                  <ArrowUpRight size={17} className={`shrink-0 transition-transform duration-500 ${active ? "translate-x-0" : "-translate-x-1 opacity-45 group-hover:translate-x-0 group-hover:opacity-100"}`} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative flex items-center bg-[#f4f1e8] px-5 py-20 sm:px-8 sm:py-24 lg:px-14 xl:px-20">
          <div className="absolute top-0 left-0 h-1.5 w-28 bg-[#e2a261] sm:w-44" />
          <div className="w-full max-w-[620px]">
            <p data-capability-reveal className="text-[0.68rem] font-bold tracking-[0.22em] text-[#b65d3e] uppercase">
              Core capabilities
            </p>

            <h2 data-capability-reveal className="mt-5 text-[clamp(2.8rem,5.4vw,6rem)] leading-[0.92] font-semibold tracking-[-0.055em] text-balance">
              Integrated delivery, proven in the field.
            </h2>

            <p data-capability-reveal className="mt-7 max-w-[550px] text-base leading-8 text-[#53605a] sm:text-lg">
              Pars Omran Farayand brings piping, mechanical, civil, fabrication,
              procurement, and commissioning disciplines together under one controlled project team.
            </p>

            <div ref={metricPanelRef} data-capability-reveal className="mt-10 border-y border-[#13201d]/15 py-7">
              <div className="flex items-end gap-3">
                <span className="text-[clamp(3.2rem,6vw,5.8rem)] leading-none font-semibold tracking-[-0.06em] text-[#b65d3e] transition-all duration-500">
                  {activeCapability.metric}
                </span>
                <span className="pb-2 text-xs font-bold tracking-[0.14em] text-[#13201d]/58 uppercase sm:text-sm">
                  {activeCapability.unit}
                </span>
              </div>
              <p className="mt-3 max-w-[450px] text-sm leading-6 text-[#53605a]">
                {activeCapability.metricLabel}
              </p>
            </div>

            <div ref={detailPanelRef} data-capability-reveal className="mt-8 min-h-[168px]">
              <p className="text-xs font-bold tracking-[0.16em] text-[#b65d3e] uppercase">
                {activeCapability.project}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                {activeCapability.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#53605a] sm:text-base">
                {activeCapability.description}
              </p>
            </div>

            <NavLink
              data-capability-reveal
              to="/capabilities"
              className="group mt-7 inline-flex min-h-12 items-center gap-4 bg-[#13201d] px-6 text-[0.68rem] font-bold tracking-[0.14em] text-white uppercase transition-colors duration-300 hover:bg-[#b65d3e]"
            >
              Explore capabilities
              <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}
