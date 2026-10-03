import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { NavLink } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export function PeopleSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(
      section.querySelectorAll("[data-people-reveal]"),
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1,
        y: 0,
        stagger: 0.09,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 76%", once: true },
      },
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="bg-[#ede9df] text-[#10201c]" aria-labelledby="people-heading">
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-2">
        <div className="group relative min-h-[285px] overflow-hidden bg-[#183238] sm:min-h-[370px] lg:min-h-[480px]">
          <img
            src="/images/home/people-workshop.webp"
            alt="Industrial specialists reviewing a technical drawing in a fabrication workshop, illustrative image"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-[48%_center] transition-transform duration-1000 ease-out group-hover:scale-[1.035] lg:object-[42%_center]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(7,26,31,0.64),transparent_48%)]" />
          <div className="absolute bottom-5 left-5 flex items-center gap-3 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white sm:bottom-7 sm:left-8">
            <span className="h-px w-8 bg-[#e2a261]" />
            The people behind the work
          </div>
        </div>

        <div className="flex flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 lg:px-[clamp(2.5rem,6vw,6.5rem)] lg:py-16">
          <div className="max-w-[580px]">
            <p data-people-reveal className="text-[0.63rem] font-bold uppercase tracking-[0.24em] text-[#bd5b37]">Our people / Our strength</p>
            <h2 id="people-heading" data-people-reveal className="mt-4 text-[clamp(2.6rem,4.8vw,4.6rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-balance">
              Good work is built together.
            </h2>
            <p data-people-reveal className="mt-5 max-w-[510px] text-sm leading-7 text-[#52615d] sm:text-base">
              Engineers, field teams, and specialists bring their skills together to solve real challenges on site and carry each project through to delivery.
            </p>

            <div data-people-reveal className="mt-7 flex flex-wrap gap-2.5 border-t border-[#10201c]/15 pt-6 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#52615d] sm:gap-3">
              <span className="border border-[#10201c]/16 px-3 py-2">Engineering</span>
              <span className="border border-[#10201c]/16 px-3 py-2">Field execution</span>
              <span className="border border-[#10201c]/16 px-3 py-2">Delivery</span>
            </div>

            <div data-people-reveal className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <NavLink
                to="/#about"
                className="group inline-flex min-h-11 items-center gap-3 bg-[#102b2f] px-5 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#bd5b37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd5b37] focus-visible:ring-offset-4"
              >
                About the company
                <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </NavLink>
              <NavLink to="/contact" className="inline-flex min-h-11 items-center border-b border-[#bd5b37] text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#10201c] transition-colors hover:text-[#bd5b37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd5b37]">
                Work with us
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
