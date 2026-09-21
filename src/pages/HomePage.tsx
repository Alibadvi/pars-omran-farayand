import { ParallaxHero } from "../components/hero/ParallaxHero";
import { PerformanceSection } from "../components/home/PerformanceSection";

export function HomePage() {
  return (
    <main className="overflow-clip bg-[#071b1f]">
      <ParallaxHero />
      <PerformanceSection />
    </main>
  );
}
