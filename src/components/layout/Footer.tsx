import type { ReactNode } from "react";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { NavLink } from "react-router-dom";

import { capabilityItems, navigationItems } from "../../data/navigation";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t-4 border-[#e2a261] bg-[#0a100e] text-white">
      <div className="bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px]">
        <div className="mx-auto max-w-[1480px] px-5 py-16 sm:px-8 md:py-20 lg:px-12">
          <div className="grid gap-14 border-b border-white/10 pb-14 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1fr] lg:gap-10 lg:pb-20">
            <div>
              <NavLink to="/" className="inline-flex items-center gap-4">
                <span className="grid size-16 place-items-center rounded-sm bg-white p-2">
                  <img
                    src="/brand/pars-omran-logo.webp"
                    alt=""
                    className="size-full object-contain"
                  />
                </span>

                <span>
                  <span className="block text-xs font-semibold tracking-[0.22em] text-[#e2a261] uppercase">
                    Pars Omran
                  </span>

                  <span className="mt-1 block text-lg font-semibold tracking-[0.08em] uppercase">
                    Farayand
                  </span>
                </span>
              </NavLink>

              <p className="mt-7 max-w-md text-sm leading-7 text-white/55">
                Delivering disciplined engineering, procurement, construction,
                and industrial piping solutions for complex energy projects.
              </p>

              <NavLink
                to="/contact"
                className="mt-8 inline-flex items-center gap-3 border-b border-[#e2a261] pb-2 text-xs font-semibold tracking-[0.16em] uppercase transition-colors hover:text-[#e2a261]"
              >
                Start a conversation
                <ArrowUpRight size={16} />
              </NavLink>
            </div>

            <FooterColumn title="Company">
              {navigationItems.slice(1).map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className="text-sm leading-6 text-white/50 transition-colors duration-200 hover:text-[#e2a261]"
                >
                  {item.label}
                </NavLink>
              ))}
            </FooterColumn>

            <FooterColumn title="Capabilities">
              {capabilityItems.map((item) => (
                <span
                  key={item}
                  className="cursor-default text-sm leading-6 text-white/50"
                >
                  {item}
                </span>
              ))}
            </FooterColumn>

            <div>
              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] text-white/80 uppercase">
                Head office
              </h2>

              <div className="mt-6 space-y-5 text-sm leading-6 text-white/55">
                <p className="flex gap-3">
                  <MapPin size={17} className="mt-1 shrink-0 text-[#e2a261]" />

                  <span>
                    Tehran, Iran
                    <br />
                    Project operations nationwide
                  </span>
                </p>

                <NavLink
                  to="/contact"
                  className="flex items-center gap-3 transition-colors hover:text-white"
                >
                  <Mail size={17} className="shrink-0 text-[#e2a261]" />
                  Contact the company
                </NavLink>
              </div>

              <a
                href="#"
                aria-label="LinkedIn"
                className="mt-8 grid size-10 place-items-center border border-white/15 text-xs font-bold text-white/65 transition-colors hover:border-[#e2a261] hover:text-[#e2a261]"
              >
                in
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-7 text-[0.66rem] tracking-[0.12em] text-white/35 uppercase sm:flex-row sm:items-center sm:justify-between">
            <p>© {currentYear} Pars Omran Farayand. All rights reserved.</p>

            <div className="flex gap-5">
              <a href="#" className="transition-colors hover:text-white">
                Privacy
              </a>

              <a href="#" className="transition-colors hover:text-white">
                Legal
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

type FooterColumnProps = {
  title: string;
  children: ReactNode;
};

function FooterColumn({ title, children }: FooterColumnProps) {
  return (
    <div>
      <h2 className="text-[0.68rem] font-bold tracking-[0.2em] text-white/80 uppercase">
        {title}
      </h2>

      <div className="mt-6 flex flex-col items-start gap-3">{children}</div>
    </div>
  );
}
