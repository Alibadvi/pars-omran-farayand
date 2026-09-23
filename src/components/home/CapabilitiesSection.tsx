import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'

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
    metric: '62,000',
    unit: 'inch-dia',
    metricDescription: 'Welding and fit-up recorded on South Pars Phase 13',
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
    metric: '2',
    unit: 'new wells',
    metricDescription: 'Surface locations included in the development scope',
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
    metric: '710,000',
    unit: 'kg',
    metricDescription: 'Tank plate procurement, fabrication, and installation',
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
    metric: '460',
    unit: 'MW',
    metricDescription: 'Single-shaft combined-cycle power project experience',
  },
]

export function CapabilitiesSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const imageStageRef = useRef<HTMLDivElement>(null)
  const metricPanelRef = useRef<HTMLDivElement>(null)
  const detailPanelRef = useRef<HTMLDivElement>(null)
  const interactionReadyRef = useRef(false)

  const activeCapability = capabilities[activeIndex]

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
      className="relative overflow-hidden bg-[#ede9df] py-14 text-[#10201c] sm:py-16 lg:py-16"
      aria-labelledby="capabilities-heading"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#10201c]/10" />

      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-end gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.62fr)] lg:gap-14">
          <div data-capability-reveal>
            <p className="flex items-center gap-3 text-[0.62rem] font-black uppercase tracking-[0.3em] text-[#bd5b37]">
              <span className="h-px w-8 bg-[#bd5b37]" />
              Core capabilities
            </p>
            <h2
              id="capabilities-heading"
              className="mt-4 max-w-[760px] text-[clamp(2.55rem,6.5vw,4.35rem)] font-black leading-[0.94] tracking-[-0.055em]"
            >
              Built for complex work in the field.
            </h2>
          </div>

          <p
            data-capability-reveal
            className="max-w-[560px] text-sm leading-6 text-[#53615d] sm:text-base sm:leading-7 lg:justify-self-end"
          >
            One accountable project team bringing piping, mechanical, civil,
            fabrication, procurement, and commissioning together.
          </p>
        </div>

        <div className="mt-8 overflow-hidden border border-[#10201c]/10 bg-[#f6f3eb] shadow-[0_26px_70px_rgba(16,32,28,0.09)] lg:grid lg:grid-cols-[1.14fr_0.86fr]">
          <div
            ref={imageStageRef}
            className="relative h-[280px] overflow-hidden bg-[#14201d] sm:h-[360px] lg:h-[460px]"
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

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,15,13,0.08)_18%,rgba(7,15,13,0.82)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-[#e2a35d]" />

            <div className="absolute left-5 top-5 flex items-center gap-3 border border-white/25 bg-[#0d1715]/72 px-3 py-2 backdrop-blur-md sm:left-7 sm:top-7">
              <span className="text-[0.62rem] font-black tracking-[0.22em] text-[#e2a35d]">
                {activeCapability.number}
              </span>
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white">
                Selected expertise
              </span>
            </div>

            <div className="absolute bottom-6 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-auto sm:max-w-[430px]">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.26em] text-[#efb16a]">
                {activeCapability.project}
              </p>
              <p className="mt-2 text-xl font-black leading-tight tracking-[-0.025em] text-white sm:text-2xl">
                {activeCapability.tab}
              </p>
            </div>
          </div>

          <div className="flex min-h-[330px] flex-col p-6 sm:min-h-[350px] sm:p-8 lg:min-h-0 lg:p-9 xl:p-10">
            <div ref={detailPanelRef}>
              <p className="text-[0.62rem] font-black uppercase tracking-[0.26em] text-[#bd5b37]">
                {activeCapability.project}
              </p>
              <h3 className="mt-3 text-[clamp(1.75rem,4vw,2.7rem)] font-black leading-[1.02] tracking-[-0.045em]">
                {activeCapability.title}
              </h3>
              <p className="mt-4 max-w-[560px] text-sm leading-6 text-[#53615d] sm:text-[0.96rem] sm:leading-7">
                {activeCapability.description}
              </p>
            </div>

            <div
              ref={metricPanelRef}
              className="mt-6 flex items-end justify-between gap-5 border-y border-[#10201c]/14 py-4"
            >
              <div className="flex min-w-0 items-end gap-3">
                <span className="text-[clamp(2.55rem,6vw,4rem)] font-black leading-none tracking-[-0.055em] text-[#bd5b37]">
                  {activeCapability.metric}
                </span>
                <span className="pb-1 text-[0.62rem] font-black uppercase tracking-[0.2em] text-[#65716d]">
                  {activeCapability.unit}
                </span>
              </div>
              <p className="hidden max-w-[210px] text-right text-xs leading-5 text-[#65716d] xl:block">
                {activeCapability.metricDescription}
              </p>
            </div>

            <NavLink
              to="/capabilities"
              className="group mt-auto inline-flex w-fit items-center gap-3 pt-6 text-[0.64rem] font-black uppercase tracking-[0.2em] text-[#10201c] transition-colors hover:text-[#bd5b37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd5b37] focus-visible:ring-offset-4"
            >
              Explore capabilities
              <span className="grid h-9 w-9 place-items-center border border-[#10201c]/25 transition-all duration-300 group-hover:border-[#bd5b37] group-hover:bg-[#bd5b37] group-hover:text-white">
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </NavLink>
          </div>
        </div>

        <div
          data-capability-reveal
          className="mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0"
          aria-label="Capability selector"
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
                className={`group min-w-[220px] snap-start border px-4 py-3.5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd5b37] focus-visible:ring-offset-2 sm:min-w-[250px] lg:min-w-0 ${
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
                    className={`transition-all duration-300 ${
                      isActive
                        ? 'translate-x-0 opacity-100'
                        : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                    }`}
                  />
                </span>
                <span className="mt-2 block text-[0.68rem] font-black uppercase tracking-[0.13em]">
                  {capability.tab}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
