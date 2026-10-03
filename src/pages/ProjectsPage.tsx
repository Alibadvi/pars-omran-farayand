import { useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  CheckCircle2,
  Factory,
  Filter,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

import { projects, type ProjectSector } from "../data/projects";
import { localize, useLanguage } from "../i18n/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

type FilterValue = "all" | ProjectSector;

export function ProjectsPage() {
  const [filter, setFilter] = useState<FilterValue>("all");
  const pageRef = useRef<HTMLElement>(null);
  const { language, t } = useLanguage();

  const filteredProjects = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((project) => project.sector === filter),
    [filter],
  );

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        "[data-page-hero]",
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" },
      );

      gsap.utils.toArray<HTMLElement>("[data-project-card]").forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 90%", once: true },
          },
        );
      });
    },
    { scope: pageRef, dependencies: [filter] },
  );

  const filters: { value: FilterValue; label: string }[] = [
    { value: "all", label: t.projects.all },
    { value: "oilGas", label: t.projects.oilGas },
    { value: "power", label: t.projects.power },
    { value: "civil", label: t.projects.civil },
  ];

  return (
    <main ref={pageRef} className="overflow-clip bg-[#f1f0eb] text-[#10201c]">
      <section className="relative isolate min-h-[620px] overflow-hidden bg-[#071b1f] pt-28 text-white sm:min-h-[680px] lg:pt-36">
        <img
          src="/images/home/performance-refinery.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover object-[62%_center] opacity-60"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,18,21,0.99)_0%,rgba(5,29,33,0.94)_42%,rgba(5,29,33,0.46)_76%,rgba(5,29,33,0.55)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#071b1f] to-transparent" />

        <div className="relative mx-auto flex min-h-[500px] max-w-[1480px] flex-col justify-end px-5 pb-10 sm:px-8 sm:pb-14 lg:min-h-[540px] lg:px-12">
          <p data-page-hero className="flex items-center gap-3 text-[0.65rem] font-black tracking-[0.25em] text-[#e2a261] uppercase sm:text-xs">
            <span className="h-px w-10 bg-[#e2a261]" />
            {t.projects.eyebrow}
          </p>
          <h1 data-page-hero className="mt-5 max-w-[950px] text-[clamp(3.2rem,8.2vw,7.8rem)] leading-[0.88] font-semibold tracking-[-0.065em] text-balance">
            {t.projects.title}
          </h1>
          <p data-page-hero className="mt-6 max-w-[680px] text-sm leading-7 text-white/72 sm:text-base sm:leading-8">
            {t.projects.intro}
          </p>

          <div data-page-hero className="mt-9 grid max-w-[920px] grid-cols-3 border-y border-white/16 bg-[#071b1f]/35 backdrop-blur-sm">
            <Metric value="9" label={t.projects.completed} />
            <Metric value="2017–23" label={t.projects.period} />
            <Metric value="100%" label={t.projects.acceptance} />
          </div>
        </div>
      </section>

      <section className="relative py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-5 border-b border-[#10201c]/12 pb-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-[0.63rem] font-black tracking-[0.22em] text-[#bd5b37] uppercase">
                <Filter size={14} />
                {t.projects.filter}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#52605c]">
                {filteredProjects.length.toString().padStart(2, "0")} / {projects.length.toString().padStart(2, "0")}
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label={t.projects.filter}>
              {filters.map((item) => {
                const isActive = item.value === filter;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilter(item.value)}
                    className={`shrink-0 border px-4 py-3 text-[0.63rem] font-bold tracking-[0.12em] uppercase transition-colors sm:px-5 ${
                      isActive
                        ? "border-[#10201c] bg-[#10201c] text-white"
                        : "border-[#10201c]/15 bg-white/55 text-[#10201c] hover:border-[#bd5b37] hover:text-[#bd5b37]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {filteredProjects.map((project, index) => (
              <article
                key={project.id}
                data-project-card
                className={`group overflow-hidden border border-[#10201c]/12 bg-[#f8f6ef] shadow-[0_18px_50px_rgba(16,32,28,0.055)] ${
                  index === 0 && filter === "all" ? "lg:col-span-2 lg:grid lg:grid-cols-[1.12fr_0.88fr]" : ""
                }`}
              >
                <div className={`relative overflow-hidden bg-[#13211e] ${index === 0 && filter === "all" ? "h-[300px] lg:h-full lg:min-h-[510px]" : "h-[260px] sm:h-[310px]"}`}>
                  <img
                    src={project.image}
                    alt=""
                    aria-hidden="true"
                    style={{ objectPosition: project.imagePosition ?? "center" }}
                    className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071b1f]/80 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-5">
                    <span className="border border-white/25 bg-[#071b1f]/72 px-3 py-2 text-[0.58rem] font-black tracking-[0.17em] text-white uppercase backdrop-blur-md">
                      {t.projects[project.sector]}
                    </span>
                    <span className="grid size-9 place-items-center border border-white/25 bg-[#071b1f]/72 text-[#e2a261] backdrop-blur-md">
                      {String(projects.indexOf(project) + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="absolute right-4 bottom-4 left-4 flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.14em] text-white/75 uppercase sm:right-5 sm:bottom-5 sm:left-5">
                    <MapPin size={14} className="text-[#e2a261]" />
                    {localize(project.location, language)}
                  </div>
                </div>

                <div className="flex flex-col p-5 sm:p-7 lg:p-8">
                  <div className="flex items-center justify-between gap-5">
                    <p className="text-[0.6rem] font-black tracking-[0.22em] text-[#bd5b37] uppercase">
                      {t.projects.featured}
                    </p>
                    <span className="inline-flex items-center gap-2 text-[0.58rem] font-bold tracking-[0.12em] text-[#49715f] uppercase">
                      <CheckCircle2 size={15} />
                      {t.projects.status}
                    </span>
                  </div>

                  <h2 className="mt-4 text-[clamp(1.7rem,3.2vw,2.7rem)] leading-[1.03] font-semibold tracking-[-0.045em] text-balance">
                    {localize(project.title, language)}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[#56635f]">
                    {localize(project.summary, language)}
                  </p>

                  <dl className="mt-6 border-y border-[#10201c]/10 py-5">
                    <div>
                      <dt className="text-[0.58rem] font-black tracking-[0.18em] text-[#87908d] uppercase">{t.projects.client}</dt>
                      <dd className="mt-1.5 text-sm font-semibold">{localize(project.client, language)}</dd>
                    </div>
                  </dl>

                  <div className="mt-5">
                    <p className="flex items-center gap-2 text-[0.58rem] font-black tracking-[0.18em] text-[#87908d] uppercase">
                      <Factory size={14} />
                      {t.projects.scope}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {project.scope[language].map((item) => (
                        <li key={item} className="border border-[#10201c]/10 bg-white px-3 py-2 text-xs font-semibold text-[#34443e]">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0a100e] text-white">
        <div className="mx-auto grid max-w-[1480px] gap-8 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-end lg:px-12 lg:py-20">
          <div>
            <p className="text-[0.63rem] font-black tracking-[0.24em] text-[#e2a261] uppercase">{t.projects.ctaEyebrow}</p>
            <h2 className="mt-4 max-w-[900px] text-[clamp(2.35rem,5.5vw,5.2rem)] leading-[0.95] font-semibold tracking-[-0.055em] text-balance">
              {t.projects.ctaTitle}
            </h2>
            <p className="mt-5 max-w-[660px] text-sm leading-7 text-white/58 sm:text-base">{t.projects.ctaBody}</p>
          </div>
          <Link to="/contact" className="group inline-flex min-h-12 w-fit items-center gap-3 bg-[#e2a261] px-6 text-[0.68rem] font-black tracking-[0.14em] text-[#10201c] uppercase transition-colors hover:bg-white">
            {t.projects.ctaButton}
            <ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-e border-white/14 px-3 py-5 last:border-e-0 sm:px-6 sm:py-6">
      <strong className="block text-[clamp(1.5rem,4vw,2.8rem)] leading-none font-semibold tracking-[-0.05em] text-[#e2a261]" dir="ltr">
        {value}
      </strong>
      <span className="mt-2 block text-[0.52rem] leading-4 font-bold tracking-[0.12em] text-white/52 uppercase sm:text-[0.63rem]">
        {label}
      </span>
    </div>
  );
}
