import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { useLanguage } from "../../i18n/LanguageContext";

export function MainLayout() {
  const { pathname, hash } = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const route = pathname.replace(/\/$/, "") || "/";
    const knownRoute = route === "/" || route === "/projects" || route === "/contact";
    const title = route === "/projects"
      ? t.nav.projects
      : route === "/contact"
        ? t.nav.contact
        : route === "/"
          ? t.nav.discipline
          : "404";
    const description = route === "/projects"
      ? t.projects.intro
      : route === "/contact"
        ? t.contact.intro
        : t.footer.statement;

    document.title = `${title} | Pars Omran Farayand`;
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", description);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (knownRoute) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = `${window.location.origin}${route}`;
    } else {
      canonical?.remove();
    }

    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = knownRoute ? "index, follow" : "noindex, nofollow";
  }, [pathname, t]);

  useEffect(() => {
    if (hash) {
      let frame = 0;
      let attempts = 0;
      const scrollToTarget = () => {
        const target = document.getElementById(hash.slice(1));
        if (target) {
          target.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            block: "start",
          });
        } else if (attempts++ < 60) {
          frame = window.requestAnimationFrame(scrollToTarget);
        }
      };
      frame = window.requestAnimationFrame(scrollToTarget);
      return () => window.cancelAnimationFrame(frame);
    }

    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [hash, pathname]);

  return (
    <div className="min-h-screen bg-[#f1f0eb] text-[#151a18]">
      <Navbar />
      <Suspense fallback={<main className="min-h-[100svh] bg-[#0a100e]" aria-busy="true" />}>
        <Outlet />
      </Suspense>
      <Footer />
    </div>
  );
}
