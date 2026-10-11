import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

const notFoundCopy = {
  en: { title: "Page not found.", detail: "The address may have changed. Return to the site or get in touch.", home: "Back to home", contact: "Contact us" },
  fa: { title: "صفحه پیدا نشد.", detail: "ممکن است نشانی تغییر کرده باشد. به صفحه اصلی برگردید یا با ما تماس بگیرید.", home: "صفحه اصلی", contact: "تماس با ما" },
  ar: { title: "الصفحة غير موجودة.", detail: "ربما تغيّر العنوان. عد إلى الصفحة الرئيسية أو تواصل معنا.", home: "الصفحة الرئيسية", contact: "اتصل بنا" },
} as const;

export function PlaceholderPage() {
  const { language } = useLanguage();
  const text = notFoundCopy[language];

  return (
    <main className="flex min-h-[75svh] items-center bg-[#121a16] bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px] px-5 pt-32 pb-16 text-white sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-[1384px]">
        <p className="text-sm font-bold tracking-[0.18em] text-[#e2a261]">404</p>
        <h1 className="mt-4 max-w-4xl text-[clamp(2.8rem,8vw,6.5rem)] leading-tight font-semibold text-balance">{text.title}</h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-white/65">{text.detail}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link to="/" className="inline-flex min-h-12 items-center bg-[#e2a261] px-6 text-sm font-bold text-[#101613] transition hover:bg-white">{text.home}</Link>
          <Link to="/contact" className="inline-flex min-h-12 items-center border border-white/35 px-6 text-sm font-bold transition hover:bg-white hover:text-[#101613]">{text.contact}</Link>
        </div>
      </div>
    </main>
  );
}
