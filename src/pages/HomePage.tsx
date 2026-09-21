import { ParallaxHero } from "../components/hero/ParallaxHero";
import { CapabilitiesSection } from "../components/home/CapabilitiesSection";
import { MarqueeDivider } from "../components/home/MarqueeDivider";
import { PerformanceSection } from "../components/home/PerformanceSection";

export function HomePage() {
  return (
    <main className="overflow-clip bg-[#071b1f]">
      <ParallaxHero />
      <MarqueeDivider />
      <PerformanceSection />
      <CapabilitiesSection />
    </main>
  );
}
