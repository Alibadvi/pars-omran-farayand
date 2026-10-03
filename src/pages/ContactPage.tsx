import { useRef, type FormEvent } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  ArrowUpRight,
  Building2,
  Clock3,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { useLanguage } from "../i18n/LanguageContext";

const COMPANY_EMAIL = "p.omranfarayand@gmail.com";

export function ContactPage() {
  const pageRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        "[data-contact-hero]",
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" },
      );
    },
    { scope: pageRef },
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const subject = String(formData.get("subject") || t.contact.formEyebrow);
    const body = [
      `${t.contact.name}: ${formData.get("name") || ""}`,
      `${t.contact.company}: ${formData.get("company") || ""}`,
      `${t.contact.emailLabel}: ${formData.get("email") || ""}`,
      `${t.contact.phoneLabel}: ${formData.get("phone") || ""}`,
      "",
      String(formData.get("message") || ""),
    ].join("\n");

    window.location.href = `mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <main ref={pageRef} className="overflow-clip bg-[#f1f0eb] text-[#10201c]">
      <section className="relative isolate overflow-hidden bg-[#071b1f] pt-28 text-white sm:pt-32 lg:pt-36">
        <img
          src="/images/home/safety-site.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover object-[68%_center] opacity-50"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,19,22,0.99)_0%,rgba(5,28,33,0.94)_46%,rgba(5,28,33,0.38)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:46px_46px]" />

        <div className="relative mx-auto grid min-h-[520px] max-w-[1480px] items-end gap-10 px-5 pb-12 sm:min-h-[570px] sm:px-8 sm:pb-16 lg:grid-cols-[1.1fr_0.6fr] lg:px-12">
          <div>
            <p data-contact-hero className="flex items-center gap-3 text-[0.65rem] font-black tracking-[0.25em] text-[#e2a261] uppercase sm:text-xs">
              <span className="h-px w-10 bg-[#e2a261]" />
              {t.contact.eyebrow}
            </p>
            <h1 data-contact-hero className="mt-5 max-w-[900px] text-[clamp(3.15rem,7.5vw,7rem)] leading-[0.9] font-semibold tracking-[-0.065em] text-balance">
              {t.contact.title}
            </h1>
            <p data-contact-hero className="mt-6 max-w-[660px] text-sm leading-7 text-white/72 sm:text-base sm:leading-8">
              {t.contact.intro}
            </p>
          </div>

          <div data-contact-hero className="hidden border-s border-[#e2a261]/55 ps-7 lg:block">
            <span className="text-[0.62rem] font-black tracking-[0.22em] text-white/45 uppercase">Pars Omran Farayand</span>
            <p className="mt-4 text-2xl leading-tight font-semibold">Engineering clarity.<br />Field accountability.</p>
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="mx-auto grid max-w-[1480px] lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="bg-[#0d1916] px-5 py-12 text-white sm:px-8 sm:py-14 lg:px-12 lg:py-20">
            <p className="text-[0.63rem] font-black tracking-[0.22em] text-[#e2a261] uppercase">{t.contact.office}</p>
            <address className="mt-7 not-italic">
              <p className="max-w-md text-xl leading-8 font-medium text-white/92">{t.contact.address}</p>
            </address>

            <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
              <ContactRow icon={Phone} label={t.contact.phone} value="021 4496 6799" href="tel:+982144966799" />
              <ContactRow icon={Mail} label={t.contact.email} value={COMPANY_EMAIL} href={`mailto:${COMPANY_EMAIL}`} />
              <ContactRow icon={Clock3} label={t.contact.hours} value={t.contact.hoursValue} />
            </div>
          </aside>

          <div className="bg-[#f7f5ee] px-5 py-12 sm:px-8 sm:py-14 lg:px-14 lg:py-20 xl:px-20">
            <div className="max-w-[780px]">
              <p className="text-[0.63rem] font-black tracking-[0.22em] text-[#bd5b37] uppercase">{t.contact.formEyebrow}</p>
              <h2 className="mt-3 text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.96] font-semibold tracking-[-0.055em] text-balance">
                {t.contact.formTitle}
              </h2>

              <form onSubmit={handleSubmit} className="mt-9 grid gap-x-5 gap-y-6 sm:grid-cols-2">
                <Field label={t.contact.name} name="name" placeholder={t.contact.placeholderName} required />
                <Field label={t.contact.company} name="company" placeholder={t.contact.placeholderCompany} />
                <Field label={t.contact.emailLabel} name="email" type="email" placeholder={t.contact.placeholderEmail} required />
                <Field label={t.contact.phoneLabel} name="phone" type="tel" placeholder={t.contact.placeholderPhone} />
                <div className="sm:col-span-2">
                  <Field label={t.contact.subject} name="subject" placeholder={t.contact.placeholderSubject} required />
                </div>
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-[0.62rem] font-black tracking-[0.16em] text-[#52605c] uppercase">{t.contact.message}</span>
                  <textarea
                    name="message"
                    rows={6}
                    required
                    placeholder={t.contact.placeholderMessage}
                    className="w-full resize-y border border-[#10201c]/16 bg-white px-4 py-4 text-sm leading-6 outline-none transition-colors placeholder:text-[#10201c]/35 focus:border-[#bd5b37]"
                  />
                </label>

                <div className="flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <button type="submit" className="group inline-flex min-h-12 items-center gap-3 bg-[#10201c] px-6 text-[0.67rem] font-black tracking-[0.14em] text-white uppercase transition-colors hover:bg-[#bd5b37]">
                    {t.contact.submit}
                    <ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </button>
                  <p className="max-w-sm text-xs leading-5 text-[#6f7a76]">{t.contact.note}</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#dfe4dc]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,32,28,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(16,32,28,0.07)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="relative mx-auto grid max-w-[1480px] gap-10 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:px-12 lg:py-20">
          <div>
            <p className="text-[0.63rem] font-black tracking-[0.22em] text-[#bd5b37] uppercase">{t.contact.mapEyebrow}</p>
            <h2 className="mt-4 text-[clamp(2.4rem,5vw,4.8rem)] leading-[0.96] font-semibold tracking-[-0.055em] text-balance">{t.contact.mapTitle}</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#53615d] sm:text-base">{t.contact.mapBody}</p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Ayatollah+Hakim+Highway+Payambar+Street+Tehran"
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center gap-3 border-b border-[#10201c] pb-2 text-[0.66rem] font-black tracking-[0.14em] uppercase transition-colors hover:border-[#bd5b37] hover:text-[#bd5b37]"
            >
              {t.contact.directions}
              <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="relative min-h-[360px] overflow-hidden border border-[#10201c]/12 bg-[#122721] shadow-[0_25px_70px_rgba(16,32,28,0.13)] sm:min-h-[430px]">
            <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_center,transparent_0,transparent_18%,rgba(226,162,97,0.32)_18.3%,transparent_18.8%),linear-gradient(25deg,transparent_48%,rgba(255,255,255,0.14)_49%,rgba(255,255,255,0.14)_50%,transparent_51%),linear-gradient(-25deg,transparent_48%,rgba(255,255,255,0.1)_49%,rgba(255,255,255,0.1)_50%,transparent_51%)] [background-size:100%_100%,90px_90px,110px_110px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_46%,rgba(226,162,97,0.18),transparent_27%)]" />
            <div className="absolute top-[46%] left-[62%] -translate-x-1/2 -translate-y-1/2">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#e2a261]/35" />
              <span className="relative grid size-16 place-items-center rounded-full border border-[#e2a261]/75 bg-[#0d1916] text-[#e2a261] shadow-[0_0_40px_rgba(226,162,97,0.4)]">
                <MapPin size={25} />
              </span>
            </div>
            <div className="absolute right-5 bottom-5 left-5 flex items-end justify-between border-t border-white/14 pt-4 text-white sm:right-7 sm:bottom-7 sm:left-7">
              <div>
                <span className="block text-[0.58rem] font-bold tracking-[0.2em] text-[#e2a261] uppercase">35.7219° N · 51.3347° E</span>
                <strong className="mt-2 block text-2xl font-semibold">Tehran</strong>
              </div>
              <Building2 size={27} className="text-white/55" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

type IconComponent = typeof Phone;

function ContactRow({ icon: Icon, label, value, href }: { icon: IconComponent; label: string; value: string; href?: string }) {
  const content = (
    <>
      <span className="grid size-10 shrink-0 place-items-center border border-white/12 text-[#e2a261]">
        <Icon size={18} />
      </span>
      <span>
        <span className="block text-[0.57rem] font-black tracking-[0.18em] text-white/42 uppercase">{label}</span>
        <span className="mt-1 block text-sm font-semibold" dir={value.match(/^\d|@/) ? "ltr" : undefined}>{value}</span>
      </span>
    </>
  );

  return href ? (
    <a href={href} className="flex items-center gap-4 py-5 transition-colors hover:text-[#e2a261]">{content}</a>
  ) : (
    <div className="flex items-center gap-4 py-5">{content}</div>
  );
}

function Field({ label, name, placeholder, type = "text", required = false }: { label: string; name: string; placeholder: string; type?: string; required?: boolean }) {
  return (
    <label>
      <span className="mb-2 block text-[0.62rem] font-black tracking-[0.16em] text-[#52605c] uppercase">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-12 w-full border border-[#10201c]/16 bg-white px-4 text-sm outline-none transition-colors placeholder:text-[#10201c]/35 focus:border-[#bd5b37]"
      />
    </label>
  );
}
