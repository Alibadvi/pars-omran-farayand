import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function MainLayout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      window.requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [hash, pathname]);

  return (
    <div className="min-h-screen bg-[#f1f0eb] text-[#151a18]">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
