import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function MainLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#f1f0eb] text-[#151a18]">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}