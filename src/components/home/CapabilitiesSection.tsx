import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { homeCopy } from '../../i18n/homeCopy'

gsap.registerPlugin(ScrollTrigger)

const capabilities = [
  {
    number: '01',
    tab: 'Piping & Mechanical',
    project: 'South Pars · Abadan Refinery',
    title: 'Piping & Mechanical',
    description:
      'Fabrication, fit-up, welding, hydrotesting, reinstatement, supports, painting, insulation, and mechanical completion for process units and refinery systems.',
    image: '/images/home/capabilities/piping.webp',
    imagePosition: 'center center',
    metric: 'EPC',
  },
  {
    number: '02',
    tab: 'Oilfield Development',
    project: 'Saadat Abad Oilfield',
    title: 'Oilfield Development',
    description:
      'Surface-facility delivery covering new well locations, flowlines, access roads, electrical works, manifold development, construction, installation, and commissioning.',
    image: '/images/home/capabilities/oilfield.webp',
    imagePosition: 'center center',
    metric: 'Field',
  },
  {
    number: '03',
    tab: 'Tanks & Fabrication',
    project: 'CTEP · South Azadegan',
    title: 'Tanks & Fabrication',
    description:
      'Design, procurement, fabrication, installation, coating, and hydrotesting of atmospheric tanks and their associated steel structures.',
    image: '/images/home/capabilities/tanks.webp',
    imagePosition: 'center center',
    metric: 'QA/QC',
  },
  {
    number: '04',
    tab: 'Power & Industrial',
    project: 'Caspian Combined-Cycle Plant',
    title: 'Power & Industrial Construction',
    description:
      'Installation of turbines, generators, transformers, auxiliary boilers, cooling systems, control panels, piping, and instrumentation cabling.',
    image: '/images/home/capabilities/power.webp',
    imagePosition: 'center center',
    metric: 'E&I',
  },
]

export function CapabilitiesSection() {
  const { language } = useLanguage()
  const home = homeCopy[language]
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const imageStageRef = useRef<HTMLDivElement>(null)
  const metricPanelRef = useRef<HTMLDivElement>(null)
  const detailPanelRef = useRef<HTMLDivElement>(null)
  const interactionReadyRef = useRef(false)

  const activeCapability = capabilities[activeIndex]
  const activeCopy = home.capabilities.items[activeIndex]

  useEffect(() => {
    const section = sectionRef.current
    const imageStage = imageStageRef.current

    if (!section || !imageStage) return

    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduceMotion) {
        gsap.set('[data-capability-reveal]', { autoAlpha: 1, y: 0 })
        interactionReadyRef.current = true
        return
      }

      gsap.set(imageStage, { clipPath: 'inset(0 100% 0 0)' })
      gsap.set('[data-capability-reveal]', { autoAlpha: 0, y: 24 })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 76%',
          once: true,
        },
        onComplete: () => {
          interactionReadyRef.current = true
        },
      })

      timeline
        .to(imageStage, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1,
          ease: 'power3.inOut',
        })
        .to(
          '[data-capability-reveal]',
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            stagger: 0.07,
            ease: 'power3.out',
          },
          0.18,
        )
    }, section)

    return () => context.revert()
  }, [])

  useEffect(() => {
    if (!interactionReadyRef.current) return

    const targets = [metricPanelRef.current, detailPanelRef.current].filter(Boolean)

    gsap.fromTo(
      targets,
      { autoAlpha: 0, y: 12 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.48,
        stagger: 0.06,
        ease: 'power3.out',
        overwrite: true,
      },
    )
  }, [activeIndex])

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative scroll-mt-24 overflow-hidden bg-[#ede9df] py-9 text-[#10201c] sm:py-11"
      aria-labelledby="capabilities-heading"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#10201c]/10" />

      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-end gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.62fr)] lg:gap-14">
          <div data-capability-reveal>
            <p className="flex items-center gap-3 text-[0.62rem] font-black uppercase tracking-[0.3em] text-[#bd5b37]">
              <span className="h-px w-8 bg-[#bd5b37]" />
              {home.capabilities.eyebrow}
            </p>
            <h2
              id="capabilities-heading"
              className="mt-3 max-w-[760px] text-[clamp(2.25rem,5.3vw,3.75rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-balance"
            >
              {home.capabilities.title}
            </h2>
          </div>

          <p
            data-capability-reveal
            className="max-w-[470px] text-sm leading-6 text-[#53615d] sm:text-base lg:justify-self-end"
          >
            {home.capabilities.intro}
          </p>
        </div>

        <div
          data-capability-reveal
          className="mt-7 grid grid-cols-2 gap-2 lg:grid-cols-4"
          aria-label={home.capabilities.selector}
        >
          {capabilities.map((capability, index) => {
            const isActive = index === activeIndex

            return (
              <button
                key={capability.number}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => {
                  if (window.matchMedia('(hover: hover)').matches) {
                    setActiveIndex(index)
                  }
                }}
                className={`group min-h-14 min-w-0 border px-3 py-2.5 text-start transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd5b37] focus-visible:ring-offset-2 sm:px-4 ${
                  isActive
                    ? 'border-[#10201c] bg-[#10201c] text-white'
                    : 'border-[#10201c]/12 bg-[#f6f3eb] text-[#10201c] hover:-translate-y-0.5 hover:border-[#bd5b37]/55 hover:bg-white'
                }`}
              >
                <span className="flex items-center justify-between gap-4">
                  <span className="text-[0.58rem] font-black tracking-[0.22em] text-[#d6864d]">
                    {capability.number}
                  </span>
                  <ArrowUpRight
                    size={14}
                    className={`rtl-flip transition-all duration-300 ${
                      isActive
                        ? 'translate-x-0 opacity-100'
                        : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                    }`}
                  />
                </span>
                <span className="mt-1 block text-[0.62rem] font-bold uppercase leading-4 tracking-[0.1em] sm:text-[0.68rem]">
                  {home.capabilities.items[index].tab}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-3 overflow-hidden border border-[#10201c]/10 bg-[#f6f3eb] shadow-[0_18px_44px_rgba(16,32,28,0.07)] lg:grid lg:grid-cols-[1.08fr_0.92fr]">
          <div
            ref={imageStageRef}
            className="relative h-[190px] overflow-hidden bg-[#14201d] sm:h-[250px] lg:h-[340px]"
          >
            {capabilities.map((capability, index) => (
              <img
                key={capability.number}
                src={capability.image}
                alt=""
                aria-hidden="true"
                style={{ objectPosition: capability.imagePosition }}
                className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out ${
                  index === activeIndex
                    ? 'scale-100 opacity-100'
                    : 'scale-[1.035] opacity-0'
                }`}
              />
            ))}

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,15,13,0.12)_0%,transparent_48%,rgba(7,15,13,0.22)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-[#e2a35d]" />

            <div className="absolute start-4 top-4 flex items-center gap-3 border border-white/25 bg-[#0d1715]/75 px-3 py-2 backdrop-blur-md sm:start-6 sm:top-6">
              <span className="text-[0.62rem] font-black tracking-[0.22em] text-[#e2a35d]">
                {activeCapability.number}
              </span>
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white">
                {home.capabilities.selected}
              </span>
            </div>

          </div>

          <div className="flex min-h-0 flex-col p-5 sm:p-7 lg:p-8">
            <div ref={detailPanelRef}>
              <p className="text-[0.62rem] font-black uppercase tracking-[0.26em] text-[#bd5b37]">
                {activeCopy.project}
              </p>
              <h3 className="mt-2 text-[clamp(1.65rem,3vw,2.35rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
                {activeCopy.title}
              </h3>
              <p className="mt-3 max-w-[560px] text-sm leading-6 text-[#53615d]">
                {activeCopy.description}
              </p>
            </div>

            <div
              ref={metricPanelRef}
              className="mt-5 flex items-end justify-between gap-5 border-t border-[#10201c]/14 pt-4"
            >
              <div className="flex min-w-0 items-end gap-3">
                <span dir="ltr" className="latin-copy text-[clamp(2.15rem,4.3vw,3.25rem)] font-semibold leading-none tracking-[-0.055em] text-[#bd5b37]">
                  {activeCapability.metric}
                </span>
                <span className="pb-1 text-[0.62rem] font-black uppercase tracking-[0.2em] text-[#65716d]">
                  {activeCopy.unit}
                </span>
              </div>
              <p className="hidden max-w-[210px] text-end text-xs leading-5 text-[#65716d] xl:block">
                {activeCopy.metricDescription}
              </p>
            </div>

            <NavLink
              to="/projects"
              className="group mt-auto inline-flex w-fit items-center gap-3 pt-4 text-[0.64rem] font-black uppercase tracking-[0.2em] text-[#10201c] transition-colors hover:text-[#bd5b37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd5b37] focus-visible:ring-offset-4"
            >
              {home.capabilities.view}
              <span className="grid h-9 w-9 place-items-center border border-[#10201c]/25 transition-all duration-300 group-hover:border-[#bd5b37] group-hover:bg-[#bd5b37] group-hover:text-white">
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.8}
                  className="rtl-flip transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </NavLink>
          </div>
        </div>

      </div>
    </section>
  )
}
