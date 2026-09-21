import { ParallaxHero } from "../components/hero/ParallaxHero";

export function HomePage() {
  return (
    <main>
      <ParallaxHero />

      <section className="mx-auto grid w-full max-w-[1480px] gap-8 px-5 py-20 sm:px-8 md:grid-cols-[0.75fr_1.25fr] md:py-28 lg:px-12">
        <div>
          <p className="text-[0.68rem] font-bold tracking-[0.2em] text-[#b65d3e] uppercase">
            Company profile
          </p>
        </div>

        <div>
          <h2 className="max-w-4xl text-3xl leading-tight font-semibold tracking-[-0.035em] text-[#17201c] sm:text-5xl">
            A focused contracting partner for oil, gas, petrochemical, and
            industrial infrastructure projects.
          </h2>

          <p className="mt-7 max-w-2xl text-base leading-8 text-[#53605a]">
            We combine site experience, disciplined project controls, and
            specialist execution to deliver critical industrial work safely and
            predictably.
          </p>
        </div>
      </section>
    </main>
  );
}
