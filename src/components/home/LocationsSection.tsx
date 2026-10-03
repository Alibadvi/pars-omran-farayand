import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Crosshair } from "lucide-react";
import { NavLink } from "react-router-dom";
import { FEATURED_PROVINCES, IRAN_PATH, PROVINCE_LINES, WORLD_PATH } from "../../data/mapPaths";
import { useLanguage } from "../../i18n/LanguageContext";
import { homeCopy } from "../../i18n/homeCopy";

gsap.registerPlugin(ScrollTrigger);

const MAP_WIDTH = 1200;
const MAP_HEIGHT = 600;
const position = (longitude: number, latitude: number) => ({
  x: ((longitude + 180) / 360) * MAP_WIDTH,
  y: ((90 - latitude) / 180) * MAP_HEIGHT,
});

const stops = [
  {
    number: "01",
    kicker: "A closer look",
    name: "From the world to the field.",
    area: "Explore our project regions",
    description: "Scroll to trace our project footprint across Iran's energy and industrial corridors.",
    point: position(54, 32),
    province: "",
  },
  {
    number: "02",
    kicker: "Iran · project footprint",
    name: "Built on the ground.",
    area: "Industrial projects across Iran",
    description: "From the southwest's refinery and oilfield work to the gas processing facilities on the Persian Gulf.",
    point: position(54, 32),
    province: "",
  },
  {
    number: "03",
    kicker: "Khuzestan · southwest Iran",
    name: "Khuzestan.",
    area: "Abadan · South Azadegan",
    description: "Refinery piping in Abadan and tank engineering, procurement, and fabrication for South Azadegan.",
    point: position(48.7, 30.9),
    province: "Khuzestan",
  },
  {
    number: "04",
    kicker: "Fars · southern Iran",
    name: "Fars.",
    area: "Saadat Abad oilfield",
    description: "Wellhead facilities, flowlines, and related construction in the Fars project area.",
    point: position(52.5, 29.6),
    province: "Fars",
  },
  {
    number: "05",
    kicker: "Bushehr · Persian Gulf",
    name: "South Pars.",
    area: "Piping · mechanical · gas metering",
    description: "Process piping and mechanical packages across South Pars phases, including Phase 13.",
    point: position(52.6, 27.5),
    province: "Bushehr",
  },
] as const;

const markers = [
  { label: "Abadan", point: position(48.29, 30.34), stop: 2 },
  { label: "South Azadegan", point: position(48.9, 31.7), stop: 2 },
  // These regional markers indicate approximate project areas, not exact site coordinates.
  { label: "Fars project area", point: position(52.5, 29.6), stop: 3 },
  { label: "South Pars", point: position(52.6, 27.5), stop: 4 },
];

export function LocationsSection() {
  const { language } = useLanguage();
  const home = homeCopy[language];
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<SVGSVGElement>(null);
  const activeRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = stops[activeIndex];
  const activeCopy = home.locations.stops[activeIndex];

  useGSAP(() => {
    const section = sectionRef.current;
    const map = mapRef.current;
    if (!section || !map) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ratio = () => map.clientWidth / Math.max(1, map.clientHeight);
    const camera = { x: 600, y: 300, zoom: 1 };
    const draw = () => {
      const width = MAP_WIDTH / camera.zoom;
      const height = width / ratio();
      map.setAttribute("viewBox", `${camera.x - width / 2} ${camera.y - height / 2} ${width} ${height}`);
    };

    if (reduce) {
      camera.x = stops[1].point.x;
      camera.y = stops[1].point.y;
      camera.zoom = window.innerWidth < 768 ? 9 : 7;
      draw();
      activeRef.current = 1;
      setActiveIndex(1);
      return;
    }

    const media = gsap.matchMedia();
    const setup = (isMobile: boolean) => {
      camera.x = 600;
      camera.y = 300;
      camera.zoom = 1;
      draw();
      activeRef.current = 0;
      setActiveIndex(0);

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = Math.min(stops.length - 1, Math.floor(self.progress * stops.length));
            if (next !== activeRef.current) {
              activeRef.current = next;
              setActiveIndex(next);
            }
          },
        },
      });

      // Each stop has a short hold, giving the reader time to see the map and copy.
      const targets = [
        { point: stops[1].point, zoom: isMobile ? 9 : 7 },
        { point: stops[2].point, zoom: isMobile ? 37 : 26 },
        { point: stops[3].point, zoom: isMobile ? 34 : 24 },
        { point: stops[4].point, zoom: isMobile ? 43 : 30 },
      ];
      targets.forEach(({ point, zoom }, index) => {
        timeline.to(camera, { x: point.x, y: point.y, zoom, duration: 0.78, onUpdate: draw }, index);
        if (index < targets.length - 1) timeline.to({}, { duration: 0.22 }, index + 0.78);
      });

      const onResize = () => draw();
      window.addEventListener("resize", onResize, { passive: true });
      return () => {
        window.removeEventListener("resize", onResize);
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    };

    media.add("(max-width: 767px)", () => setup(true));
    media.add("(min-width: 768px)", () => setup(false));
    return () => media.revert();
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="locations"
      className="relative h-[340svh] bg-[#071d25] text-white md:h-[370svh] motion-reduce:h-auto"
      aria-labelledby="locations-heading"
    >
      <div className="sticky top-0 isolate h-[100svh] overflow-hidden bg-[#071d25] motion-reduce:relative motion-reduce:h-[720px] sm:motion-reduce:h-[620px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_52%_56%,#174552_0%,#0a2831_52%,#071d25_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-50 bg-[linear-gradient(rgba(153,199,203,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(153,199,203,0.07)_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:64px_64px]" />
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(7,29,37,0.48),transparent_38%,rgba(7,29,37,0.2)),linear-gradient(0deg,#071d25,transparent_23%,transparent_70%,rgba(7,29,37,0.5))]" />

        <svg
          ref={mapRef}
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid meet"
          className="pointer-events-none absolute inset-0 h-full w-full"
          role="img"
          aria-label={home.locations.areas}
        >
          <defs>
            <linearGradient id="location-iran" x1="0" x2="1" y1="0" y2="1">
              <stop stopColor="#44727b" />
              <stop offset="1" stopColor="#214653" />
            </linearGradient>
            <pattern id="location-map-dots" width="2.8" height="2.8" patternUnits="userSpaceOnUse">
              <circle cx="0.5" cy="0.5" r="0.18" fill="#b5ced0" opacity="0.32" />
            </pattern>
          </defs>
          <path d={WORLD_PATH} fill="#244954" fillOpacity="0.8" stroke="#7ca6a9" strokeOpacity="0.42" strokeWidth="0.38" vectorEffect="non-scaling-stroke" />
          <path d={IRAN_PATH} fill="url(#location-iran)" stroke="#d9a469" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
          <g opacity={activeIndex > 0 ? 1 : 0} className="transition-opacity duration-700">
            <path d={IRAN_PATH} fill="url(#location-map-dots)" />
            {Object.entries(FEATURED_PROVINCES).map(([name, path]) => (
              <path
                key={name}
                d={path}
                fill={active.province === name ? "#d98d52" : "transparent"}
                fillOpacity={active.province === name ? 0.38 : 0}
                className="transition-[fill,fill-opacity] duration-700"
              />
            ))}
            <path d={PROVINCE_LINES} fill="none" stroke="#b6ced0" strokeOpacity="0.52" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
          </g>
          {markers.map((marker) => {
            const selected = marker.stop === activeIndex;
            return (
              <g key={marker.label} opacity={selected ? 1 : activeIndex > 0 ? 0.3 : 0} className="transition-opacity duration-500">
                <circle cx={marker.point.x} cy={marker.point.y} r="0.7" fill="#f4b777" opacity="0.28" />
                <circle cx={marker.point.x} cy={marker.point.y} r="0.24" fill={selected ? "#ffcb8f" : "#a9c9ca"} />
              </g>
            );
          })}
        </svg>

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#efb679]/30 opacity-0 transition-opacity duration-700 md:size-24" style={{ opacity: activeIndex > 1 ? 0.65 : 0 }}>
          <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-[#efb679]" />
          <span className="absolute left-1/2 bottom-0 h-3 w-px -translate-x-1/2 translate-y-1/2 bg-[#efb679]" />
          <span className="absolute left-0 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-[#efb679]" />
          <span className="absolute right-0 top-1/2 h-px w-3 translate-x-1/2 -translate-y-1/2 bg-[#efb679]" />
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col px-5 pt-[clamp(6.25rem,13vh,8.5rem)] pb-6 sm:px-8 lg:px-12 lg:pb-10">
          <div className="mx-auto w-full max-w-[1480px]">
            <div className="flex items-center gap-3 text-[0.61rem] font-bold uppercase tracking-[0.24em] text-[#edb576] sm:text-[0.69rem]">
              <span className="h-px w-8 bg-[#edb576]" /> {home.locations.eyebrow} / <span dir="ltr">0{activeIndex + 1}</span>
            </div>
            <h2 id="locations-heading" className="mt-3 max-w-[650px] text-[clamp(2.45rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-balance">
              {home.locations.title}
            </h2>
            <p className="mt-3 max-w-[430px] text-xs leading-5 text-[#c5d7d8] sm:text-sm sm:leading-6 [@media(max-height:570px)]:hidden">
              {home.locations.intro}
            </p>
          </div>

          <div className="mx-auto mt-auto flex w-full max-w-[1480px] items-end justify-between gap-4">
            <div className="pointer-events-auto w-full max-w-[490px] border border-white/15 bg-[#0b2832]/90 p-4 shadow-[0_22px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[0.59rem] font-bold uppercase tracking-[0.19em] text-[#edb576] sm:text-[0.65rem]">{activeCopy.kicker}</span>
                <Crosshair size={17} className="shrink-0 text-[#edb576]" aria-hidden="true" />
              </div>
              <h3 className="mt-2 text-[clamp(1.55rem,3vw,2.5rem)] font-semibold leading-tight tracking-[-0.045em]">{activeCopy.name}</h3>
              <p className="mt-1 text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-white/65 sm:text-xs">{activeCopy.area}</p>
              <p className="mt-3 max-w-[410px] text-xs leading-5 text-[#cad8da] sm:text-sm sm:leading-6 [@media(max-height:520px)]:hidden">{activeCopy.description}</p>
              <NavLink to="/projects" className="group mt-4 inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#edb576] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#edb576] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b2832]">
                {home.locations.explore} <ArrowUpRight size={15} className="rtl-flip transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </NavLink>
            </div>

            <div className="hidden items-end gap-5 pb-1 lg:flex">
              <span className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-white/55">{home.locations.scroll}</span>
              <ArrowDown size={17} className="text-[#edb576]" aria-hidden="true" />
            </div>
          </div>

          <div className="mx-auto mt-4 flex w-full max-w-[1480px] gap-1.5 sm:mt-5" aria-hidden="true">
            {stops.map((stop, index) => (
              <div key={stop.number} className={`h-[2px] flex-1 transition-colors duration-500 ${index <= activeIndex ? "bg-[#edb576]" : "bg-white/20"}`} />
            ))}
          </div>
        </div>

        <p className="pointer-events-none absolute end-5 top-[clamp(6.75rem,13vh,9rem)] z-20 hidden text-[0.56rem] uppercase tracking-[0.2em] text-white/40 lg:block lg:end-12">{home.locations.approximate}</p>
        <span className="sr-only">{home.locations.areas}</span>
      </div>
    </section>
  );
}
