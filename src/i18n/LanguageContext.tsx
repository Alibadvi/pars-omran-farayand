import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "fa" | "ar";

export type LocalizedText = Record<Language, string>;

const languageOptions: { code: Language; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "EN" },
  { code: "fa", label: "Persian", nativeLabel: "فا" },
  { code: "ar", label: "Arabic", nativeLabel: "ع" },
];

export const copy = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      capabilities: "Capabilities",
      projects: "Projects",
      hse: "HSE",
      contact: "Contact",
      portal: "Project portal",
      navigation: "Navigation",
      discipline: "Engineering · Procurement · Construction",
    },
    footer: {
      statement:
        "Disciplined engineering, procurement, construction, and industrial piping solutions for complex energy projects.",
      conversation: "Start a conversation",
      company: "Company",
      capabilities: "Capabilities",
      office: "Head office",
      location: "Tehran, Iran",
      nationwide: "Project operations nationwide",
      contact: "Contact the company",
      rights: "All rights reserved.",
    },
    projects: {
      eyebrow: "Selected project record",
      title: "Built in the field. Proven at handover.",
      intro:
        "A record of completed energy and industrial contracts across power generation, refineries, gas processing, tank fabrication, piping, and civil construction.",
      completed: "Completed contracts",
      period: "Delivery record",
      acceptance: "Final acceptance",
      filter: "Filter projects",
      all: "All projects",
      oilGas: "Oil & gas",
      power: "Power",
      civil: "Civil & industrial",
      client: "Employer",
      contract: "Contract",
      scope: "Core scope",
      status: "Final acceptance",
      featured: "Project record",
      ctaEyebrow: "Plan the next project",
      ctaTitle: "Bring a disciplined field team into the conversation early.",
      ctaBody:
        "Share your scope, delivery requirements, and project location. Our team will respond with the right technical lead.",
      ctaButton: "Discuss a project",
    },
    contact: {
      eyebrow: "Contact Pars Omran Farayand",
      title: "Start with the scope. We will bring the right team.",
      intro:
        "For tenders, project partnerships, vendor coordination, and technical enquiries, contact our Tehran head office.",
      office: "Head office",
      phone: "Office phone",
      mobile: "Project enquiries",
      email: "Email",
      hours: "Coordination",
      hoursValue: "Saturday–Wednesday · 08:00–17:00",
      address:
        "No. 233, 4th Floor, Unit 7, Ayatollah Hakim Highway, Payambar Street, Mehran, Tehran, Iran",
      formEyebrow: "Project enquiry",
      formTitle: "Tell us what needs to be delivered.",
      name: "Full name",
      company: "Company",
      emailLabel: "Work email",
      phoneLabel: "Phone",
      subject: "Subject",
      message: "Project scope or enquiry",
      placeholderName: "Your name",
      placeholderCompany: "Organisation name",
      placeholderEmail: "name@company.com",
      placeholderPhone: "+98 ...",
      placeholderSubject: "Tender, partnership, capability...",
      placeholderMessage:
        "Project location, discipline, schedule, and the support you need.",
      submit: "Prepare email",
      note:
        "Submitting opens your email application with the enquiry prepared for our team.",
      mapEyebrow: "Tehran head office",
      mapTitle: "Connected to projects nationwide.",
      mapBody:
        "Management and commercial coordination are based in Tehran, with project operations mobilised across Iran.",
      directions: "View on Google Maps",
    },
  },
  fa: {
    nav: {
      home: "خانه",
      about: "درباره ما",
      capabilities: "توانمندی‌ها",
      projects: "پروژه‌ها",
      hse: "ایمنی و HSE",
      contact: "تماس",
      portal: "پرتال پروژه",
      navigation: "دسترسی",
      discipline: "مهندسی · تأمین · اجرا",
    },
    footer: {
      statement:
        "راهکارهای منضبط مهندسی، تأمین، اجرا و پایپینگ صنعتی برای پروژه‌های پیچیده انرژی.",
      conversation: "شروع گفتگو",
      company: "شرکت",
      capabilities: "توانمندی‌ها",
      office: "دفتر مرکزی",
      location: "تهران، ایران",
      nationwide: "فعالیت پروژه‌ای در سراسر کشور",
      contact: "تماس با شرکت",
      rights: "تمامی حقوق محفوظ است.",
    },
    projects: {
      eyebrow: "سوابق منتخب پروژه‌ها",
      title: "اجرا در میدان؛ اثبات‌شده در تحویل.",
      intro:
        "کارنامه‌ای از قراردادهای تکمیل‌شده در نیروگاه، پالایشگاه، فرآورش گاز، ساخت مخازن، پایپینگ و عملیات عمرانی.",
      completed: "قرارداد تکمیل‌شده",
      period: "دوره اجرای سوابق",
      acceptance: "تحویل قطعی",
      filter: "فیلتر پروژه‌ها",
      all: "همه پروژه‌ها",
      oilGas: "نفت و گاز",
      power: "نیروگاهی",
      civil: "عمرانی و صنعتی",
      client: "کارفرما",
      contract: "شماره قرارداد",
      scope: "دامنه اصلی کار",
      status: "تحویل قطعی",
      featured: "سابقه پروژه",
      ctaEyebrow: "برنامه‌ریزی پروژه بعدی",
      ctaTitle: "تیم اجرایی منضبط را از ابتدای کار وارد گفتگو کنید.",
      ctaBody:
        "دامنه کار، الزامات تحویل و محل پروژه را با ما در میان بگذارید تا مسئول فنی مرتبط پاسخ‌گو باشد.",
      ctaButton: "گفتگو درباره پروژه",
    },
    contact: {
      eyebrow: "تماس با پارس عمران فرآیند",
      title: "از شرح کار شروع کنید؛ تیم مناسب را همراه می‌کنیم.",
      intro:
        "برای مناقصات، همکاری پروژه‌ای، هماهنگی تأمین‌کنندگان و پرسش‌های فنی با دفتر مرکزی تهران تماس بگیرید.",
      office: "دفتر مرکزی",
      phone: "تلفن دفتر",
      mobile: "پیگیری پروژه‌ها",
      email: "ایمیل",
      hours: "ساعات هماهنگی",
      hoursValue: "شنبه تا چهارشنبه · ۸:۰۰ تا ۱۷:۰۰",
      address:
        "تهران، مهران، خیابان پیامبر، بزرگراه آیت‌الله حکیم، پلاک ۲۳۳، طبقه ۴، واحد ۷",
      formEyebrow: "درخواست همکاری پروژه‌ای",
      formTitle: "نیاز پروژه را برای ما شرح دهید.",
      name: "نام و نام خانوادگی",
      company: "شرکت",
      emailLabel: "ایمیل کاری",
      phoneLabel: "شماره تماس",
      subject: "موضوع",
      message: "شرح پروژه یا درخواست",
      placeholderName: "نام شما",
      placeholderCompany: "نام سازمان",
      placeholderEmail: "name@company.com",
      placeholderPhone: "+98 ...",
      placeholderSubject: "مناقصه، همکاری، توانمندی‌ها...",
      placeholderMessage: "محل پروژه، حوزه کار، برنامه زمانی و پشتیبانی موردنیاز.",
      submit: "آماده‌سازی ایمیل",
      note: "با ارسال فرم، برنامه ایمیل شما با متن آماده‌شده باز می‌شود.",
      mapEyebrow: "دفتر مرکزی تهران",
      mapTitle: "متصل به پروژه‌های سراسر کشور.",
      mapBody:
        "مدیریت و هماهنگی بازرگانی در تهران انجام می‌شود و عملیات پروژه‌ای در نقاط مختلف ایران تجهیز می‌گردد.",
      directions: "مشاهده در نقشه گوگل",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      capabilities: "القدرات",
      projects: "المشاريع",
      hse: "السلامة وHSE",
      contact: "اتصل بنا",
      portal: "بوابة المشاريع",
      navigation: "التنقل",
      discipline: "الهندسة · التوريد · الإنشاء",
    },
    footer: {
      statement:
        "حلول منضبطة للهندسة والتوريد والإنشاء وخطوط الأنابيب الصناعية لمشاريع الطاقة المعقدة.",
      conversation: "ابدأ المحادثة",
      company: "الشركة",
      capabilities: "القدرات",
      office: "المكتب الرئيسي",
      location: "طهران، إيران",
      nationwide: "عمليات المشاريع في أنحاء إيران",
      contact: "اتصل بالشركة",
      rights: "جميع الحقوق محفوظة.",
    },
    projects: {
      eyebrow: "سجل المشاريع المختارة",
      title: "نُفّذ في الميدان. وثبت عند التسليم.",
      intro:
        "سجل من العقود المكتملة في توليد الطاقة والمصافي ومعالجة الغاز وتصنيع الخزانات وخطوط الأنابيب والأعمال المدنية.",
      completed: "عقود مكتملة",
      period: "سجل التنفيذ",
      acceptance: "استلام نهائي",
      filter: "تصفية المشاريع",
      all: "جميع المشاريع",
      oilGas: "النفط والغاز",
      power: "الطاقة",
      civil: "مدني وصناعي",
      client: "صاحب العمل",
      contract: "العقد",
      scope: "نطاق العمل",
      status: "استلام نهائي",
      featured: "سجل المشروع",
      ctaEyebrow: "خطط للمشروع التالي",
      ctaTitle: "أدخل فريقاً ميدانياً منضبطاً في النقاش منذ البداية.",
      ctaBody:
        "شارك نطاق العمل ومتطلبات التسليم وموقع المشروع، وسيرد عليك المسؤول الفني المناسب.",
      ctaButton: "ناقش مشروعاً",
    },
    contact: {
      eyebrow: "اتصل بشركة بارس عمران فرايند",
      title: "ابدأ بنطاق العمل، وسنوفّر الفريق المناسب.",
      intro:
        "للمناقصات وشراكات المشاريع وتنسيق الموردين والاستفسارات الفنية، تواصل مع مكتبنا الرئيسي في طهران.",
      office: "المكتب الرئيسي",
      phone: "هاتف المكتب",
      mobile: "استفسارات المشاريع",
      email: "البريد الإلكتروني",
      hours: "التنسيق",
      hoursValue: "السبت–الأربعاء · 08:00–17:00",
      address:
        "رقم 233، الطابق الرابع، الوحدة 7، طريق آية الله حكيم، شارع پيامبر، مهران، طهران، إيران",
      formEyebrow: "استفسار مشروع",
      formTitle: "أخبرنا بما يجب تنفيذه.",
      name: "الاسم الكامل",
      company: "الشركة",
      emailLabel: "بريد العمل",
      phoneLabel: "الهاتف",
      subject: "الموضوع",
      message: "نطاق المشروع أو الاستفسار",
      placeholderName: "اسمك",
      placeholderCompany: "اسم المؤسسة",
      placeholderEmail: "name@company.com",
      placeholderPhone: "+98 ...",
      placeholderSubject: "مناقصة، شراكة، قدرات...",
      placeholderMessage: "موقع المشروع والتخصص والجدول الزمني والدعم المطلوب.",
      submit: "إعداد البريد",
      note: "عند الإرسال سيفتح تطبيق البريد مع رسالة جاهزة لفريقنا.",
      mapEyebrow: "المكتب الرئيسي في طهران",
      mapTitle: "متصلون بالمشاريع في أنحاء البلاد.",
      mapBody:
        "تتم الإدارة والتنسيق التجاري من طهران، بينما تُحشد فرق المشاريع في أنحاء إيران.",
      directions: "عرض على خرائط Google",
    },
  },
} as const;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  options: typeof languageOptions;
  t: (typeof copy)[Language];
  isRtl: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = window.localStorage.getItem("pof-language");
    return savedLanguage === "fa" || savedLanguage === "ar" ? savedLanguage : "en";
  });

  const isRtl = language === "fa" || language === "ar";

  useEffect(() => {
    window.localStorage.setItem("pof-language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
  }, [isRtl, language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      options: languageOptions,
      t: copy[language],
      isRtl,
    }),
    [isRtl, language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}

export function localize(text: LocalizedText, language: Language) {
  return text[language];
}
