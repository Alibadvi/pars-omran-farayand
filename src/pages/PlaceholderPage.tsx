type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
};

export function PlaceholderPage({
  eyebrow,
  title,
}: PlaceholderPageProps) {
  return (
    <main className="flex min-h-[72svh] items-end bg-[#121a16] bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px] px-5 pt-36 pb-16 text-white sm:px-8 md:pb-24 lg:px-12">
      <div className="mx-auto w-full max-w-[1384px]">
       <p className="text-[0.68rem] font-bold tracking-[0.2em] text-[#c87550] uppercase">
  {eyebrow}
</p>

        <h1 className="mt-5 max-w-5xl text-[clamp(3.25rem,9vw,8rem)] leading-[0.9] font-semibold tracking-[-0.065em]">
          {title}
        </h1>

        <p className="mt-7 max-w-xl text-base leading-7 text-white/55">
          This page is ready for its content.
        </p>
      </div>
    </main>
  );
}