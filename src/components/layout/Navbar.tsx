import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import { navigationItems } from "../../data/navigation";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 28);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useGSAP(
    () => {
      const overlay = overlayRef.current;
      const panel = panelRef.current;

      if (!overlay || !panel) return;

      const items = overlay.querySelectorAll("[data-mobile-item]");
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.killTweensOf([overlay, panel, items]);

      if (reduceMotion) {
        gsap.set(overlay, {
          autoAlpha: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        });

        gsap.set(panel, {
          clipPath: isOpen
            ? "inset(0 0 0% 0)"
            : "inset(0 0 100% 0)",
        });

        gsap.set(items, {
          autoAlpha: isOpen ? 1 : 0,
          y: 0,
        });

        return;
      }

      if (isOpen) {
        gsap.set(overlay, { pointerEvents: "auto" });

        gsap
          .timeline()
          .to(overlay, {
            autoAlpha: 1,
            duration: 0.2,
          })
          .fromTo(
            panel,
            { clipPath: "inset(0 0 100% 0)" },
            {
              clipPath: "inset(0 0 0% 0)",
              duration: 0.7,
              ease: "power4.inOut",
            },
            0,
          )
          .fromTo(
            items,
            {
              autoAlpha: 0,
              y: 30,
            },
            {
              autoAlpha: 1,
              y: 0,
              stagger: 0.055,
              duration: 0.45,
              ease: "power3.out",
            },
            0.28,
          );
      } else {
        gsap
          .timeline({
            onComplete: () => {
              gsap.set(overlay, { pointerEvents: "none" });
            },
          })
          .to(items, {
            autoAlpha: 0,
            y: -16,
            stagger: 0.025,
            duration: 0.2,
          })
          .to(
            panel,
            {
              clipPath: "inset(0 0 100% 0)",
              duration: 0.5,
              ease: "power4.inOut",
            },
            0.08,
          )
          .to(overlay, {
            autoAlpha: 0,
            duration: 0.18,
          });
      }
    },
    {
      dependencies: [isOpen],
      scope: headerRef,
    },
  );

  const solidHeader = isScrolled || isOpen;

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${
        solidHeader
          ? "border-white/10 bg-[#0a100e]/90 shadow-2xl backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[78px] max-w-[1480px] items-center justify-between px-5 sm:px-8 lg:h-[92px] lg:px-12">
        <NavLink
          to="/"
          aria-label="Pars Omran Farayand homepage"
          className="relative z-50 flex items-center gap-3"
        >
          <span className="grid size-12 place-items-center rounded-sm border border-white/20 bg-white p-1.5 shadow-lg lg:size-14">
            <img
              src="/brand/pars-omran-logo.webp"
              alt=""
              className="size-full object-contain"
            />
          </span>

          <span className="hidden sm:block">
            <span className="block text-[0.68rem] font-semibold tracking-[0.2em] text-[#e2a261] uppercase">
              Pars Omran
            </span>

            <span className="block text-sm font-semibold tracking-[0.08em] text-white uppercase lg:text-base">
              Farayand
            </span>
          </span>
        </NavLink>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `group relative px-3 py-3 text-[0.72rem] font-semibold tracking-[0.13em] uppercase transition-colors duration-300 xl:px-4 ${
                  isActive
                    ? "text-[#e2a261]"
                    : "text-white/75 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}

                  <span
                    className={`absolute right-3 bottom-1 left-3 h-px origin-left bg-[#e2a261] transition-transform duration-300 xl:right-4 xl:left-4 ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="relative z-50 flex items-center gap-2">
          <NavLink
            to="/admin"
            className="hidden items-center gap-2 border border-[#e2a261]/70 px-4 py-2.5 text-[0.68rem] font-semibold tracking-[0.12em] text-white uppercase transition-colors duration-300 hover:bg-[#e2a261] hover:text-[#111714] xl:flex"
          >
            Project portal
            <ArrowUpRight size={15} />
          </NavLink>

          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            className="grid size-11 place-items-center border border-white/20 bg-white/5 text-white transition-colors hover:border-[#e2a261] hover:text-[#e2a261] lg:hidden"
          >
            {isOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>

      <div
        ref={overlayRef}
        id="mobile-navigation"
        aria-hidden={!isOpen}
        className="invisible fixed inset-0 z-40 bg-black/70 opacity-0 lg:hidden"
      >
        <div
          ref={panelRef}
          className="relative flex min-h-[100svh] flex-col overflow-y-auto bg-[#0b1210] bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px] px-5 pt-28 pb-8 sm:px-8"
        >
          <div className="mb-8 flex items-center gap-3 text-[0.65rem] font-semibold tracking-[0.22em] text-white/45 uppercase">
            <span className="h-px w-10 bg-[#e2a261]" />
            Navigation
          </div>

          <nav aria-label="Mobile navigation" className="flex flex-col">
            {navigationItems.map((item, index) => (
              <NavLink
                key={item.href}
                to={item.href}
                data-mobile-item
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between border-t border-white/10 py-4 text-[clamp(1.55rem,8vw,2.4rem)] font-medium tracking-[-0.04em] transition-colors ${
                    isActive
                      ? "text-[#e2a261]"
                      : "text-white hover:text-[#e2a261]"
                  }`
                }
              >
                <span>{item.label}</span>

                <span className="text-xs tracking-[0.15em] text-white/35">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </NavLink>
            ))}
          </nav>

          <NavLink
            to="/admin"
            data-mobile-item
            onClick={() => setIsOpen(false)}
            className="mt-8 flex items-center justify-between bg-[#e2a261] px-5 py-4 text-sm font-bold tracking-[0.12em] text-[#101613] uppercase"
          >
            Project portal
            <ArrowUpRight size={19} />
          </NavLink>

          <p
            data-mobile-item
            className="mt-auto pt-12 text-xs leading-6 tracking-[0.08em] text-white/40 uppercase"
          >
            Engineering · Procurement · Construction
          </p>
        </div>
      </div>
    </header>
  );
}