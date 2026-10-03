import type { ReactNode } from "react";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { NavLink } from "react-router-dom";

import { navigationItems } from "../../data/navigation";
import { useLanguage } from "../../i18n/LanguageContext";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { language, t } = useLanguage();
  const capabilityItems = {
    en: ["Engineering", "Procurement", "Construction", "Industrial piping"],
    fa: ["مهندسی", "تأمین", "اجرا", "پایپینگ صنعتی"],
    ar: ["الهندسة", "التوريد", "الإنشاء", "الأنابيب الصناعية"],
  }[language];

  return (
    <footer className="border-t-4 border-[#e2a261] bg-[#0a100e] text-white">
      <div className="bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px]">
        <div className="mx-auto max-w-[1480px] px-5 py-12 sm:px-8 md:py-14 lg:px-12">
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 border-b border-white/10 pb-10 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1fr] lg:gap-10">
            <div className="col-span-2 lg:col-span-1">
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
                {t.footer.statement}
              </p>

              <NavLink
                to="/contact"
                className="mt-8 inline-flex items-center gap-3 border-b border-[#e2a261] pb-2 text-xs font-semibold tracking-[0.16em] uppercase transition-colors hover:text-[#e2a261]"
              >
                {t.footer.conversation}
                <ArrowUpRight size={16} />
              </NavLink>
            </div>

            <FooterColumn title={t.footer.company}>
              {navigationItems.slice(1).map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className="text-sm leading-6 text-white/50 transition-colors duration-200 hover:text-[#e2a261]"
                >
                  {t.nav[item.key]}
                </NavLink>
              ))}
            </FooterColumn>

            <FooterColumn title={t.footer.capabilities}>
              {capabilityItems.map((item) => (
                <span
                  key={item}
                  className="cursor-default text-sm leading-6 text-white/50"
                >
                  {item}
                </span>
              ))}
            </FooterColumn>

            <div className="col-span-2 sm:col-span-1 lg:col-span-1">
              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] text-white/80 uppercase">
                {t.footer.office}
              </h2>

              <div className="mt-6 space-y-5 text-sm leading-6 text-white/55">
                <p className="flex gap-3">
                  <MapPin size={17} className="mt-1 shrink-0 text-[#e2a261]" />

                  <span>
                    {t.footer.location}
                    <br />
                    {t.footer.nationwide}
                  </span>
                </p>

                <NavLink
                  to="/contact"
                  className="flex items-center gap-3 transition-colors hover:text-white"
                >
                  <Mail size={17} className="shrink-0 text-[#e2a261]" />
                  {t.footer.contact}
                </NavLink>
              </div>

            </div>
          </div>

          <div className="flex flex-col gap-4 pt-7 text-[0.66rem] tracking-[0.12em] text-white/35 uppercase sm:flex-row sm:items-center sm:justify-between">
            <p>© {currentYear} Pars Omran Farayand. {t.footer.rights}</p>

            <p>{t.nav.discipline}</p>
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

      <div className="mt-6 flex flex-col items-start gap-2.5">{children}</div>
    </div>
  );
}
