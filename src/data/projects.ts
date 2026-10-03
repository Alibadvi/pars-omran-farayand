import type { LocalizedText } from "../i18n/LanguageContext";

export type ProjectSector = "oilGas" | "power" | "civil";

export type Project = {
  id: string;
  sector: ProjectSector;
  title: LocalizedText;
  location: LocalizedText;
  client: LocalizedText;
  summary: LocalizedText;
  scope: Record<"en" | "fa" | "ar", string[]>;
  image: string;
  imagePosition?: string;
};

export const projects: Project[] = [
  {
    id: "south-azadegan-ctep",
    sector: "oilGas",
    title: {
      en: "South Azadegan Phase 1 — CTEP Atmospheric Tanks",
      fa: "فاز نخست آزادگان جنوبی — مخازن اتمسفریک CTEP",
      ar: "المرحلة الأولى من جنوب آزادگان — خزانات CTEP الجوية",
    },
    location: { en: "Khuzestan", fa: "خوزستان", ar: "خوزستان" },
    client: {
      en: "Sekaf Construction / Petropars Iran",
      fa: "شرکت ساختمانی سکاف / پتروپارس ایران",
      ar: "سكاف للإنشاءات / بتروبارس إيران",
    },
    summary: {
      en: "Design, procurement, fabrication, installation, coating, hydrotesting, and pre-commissioning of atmospheric tanks and associated structures.",
      fa: "طراحی، تأمین، ساخت، نصب، رنگ، هیدروتست و پیش‌راه‌اندازی مخازن اتمسفریک و سازه‌های مرتبط.",
      ar: "تصميم وتوريد وتصنيع وتركيب وطلاء واختبار هيدروليكي وما قبل التشغيل للخزانات الجوية والمنشآت المرتبطة.",
    },
    scope: {
      en: ["Tank fabrication", "Steel structures", "Hydrotesting & coating"],
      fa: ["ساخت مخازن", "سازه‌های فلزی", "هیدروتست و پوشش"],
      ar: ["تصنيع الخزانات", "الهياكل الفولاذية", "الاختبار والطلاء"],
    },
    image: "/images/home/capabilities/tanks.webp",
  },
  {
    id: "caspian-power-plant",
    sector: "power",
    title: {
      en: "West Mazandaran Single-Shaft Combined-Cycle Power Plant",
      fa: "نیروگاه سیکل ترکیبی تک‌محور غرب مازندران",
      ar: "محطة غرب مازندران ذات الدورة المركبة أحادية المحور",
    },
    location: { en: "Mazandaran", fa: "مازندران", ar: "مازندران" },
    client: {
      en: "Niroo Va Tavan / Caspian Energy Structures",
      fa: "مشارکت نیرو و توان / توسعه سازه‌های انرژی خزر",
      ar: "نيرو وتوان / منشآت طاقة بحر قزوين",
    },
    summary: {
      en: "Installation and pre-commissioning of turbine, generator, transformers, auxiliary systems, industrial piping, control panels, and instrumentation cabling.",
      fa: "نصب و پیش‌راه‌اندازی توربین، ژنراتور، ترانسفورماتورها، سامانه‌های جانبی، پایپینگ صنعتی، تابلوهای کنترل و کابل‌کشی ابزار دقیق.",
      ar: "تركيب وما قبل تشغيل التوربين والمولد والمحولات والأنظمة المساعدة والأنابيب الصناعية ولوحات التحكم وكابلات الأجهزة.",
    },
    scope: {
      en: ["Generation equipment", "Industrial piping", "Power & instrument cabling"],
      fa: ["تجهیزات تولید", "پایپینگ صنعتی", "کابل‌کشی برق و ابزار دقیق"],
      ar: ["معدات التوليد", "الأنابيب الصناعية", "كابلات الكهرباء والأجهزة"],
    },
    image: "/images/home/capabilities/power.webp",
  },
  {
    id: "south-pars-phase-13-piping",
    sector: "oilGas",
    title: {
      en: "South Pars Phase 13 — Remaining Piping Works",
      fa: "فاز ۱۳ پارس جنوبی — تکمیل عملیات پایپینگ",
      ar: "المرحلة 13 من بارس الجنوبي — استكمال أعمال الأنابيب",
    },
    location: { en: "Assaluyeh", fa: "عسلویه", ar: "عسلويه" },
    client: { en: "Nir Pars — MAPNA Group", fa: "نیرپارس — گروه مپنا", ar: "نير بارس — مجموعة مپنا" },
    summary: {
      en: "Completion of above-ground piping, structural repair and installation, and closing piping, painting, and mechanical punch items in refinery units.",
      fa: "تکمیل پایپینگ رو زمینی، ساخت و تعمیرات سازه و رفع پانچ‌های پایپینگ، رنگ و مکانیک در واحدهای پالایشگاهی.",
      ar: "استكمال الأنابيب فوق الأرض وإصلاح وتركيب الهياكل وإغلاق ملاحظات الأنابيب والطلاء والأعمال الميكانيكية.",
    },
    scope: {
      en: ["Refinery units", "Above-ground piping", "Punch-list closeout"],
      fa: ["واحدهای پالایشگاهی", "پایپینگ رو زمینی", "رفع پانچ و تحویل"],
      ar: ["وحدات المصفاة", "أنابيب فوق الأرض", "إغلاق الملاحظات والتسليم"],
    },
    image: "/images/home/capabilities/piping.webp",
  },
  {
    id: "abadan-unit-56",
    sector: "oilGas",
    title: {
      en: "Abadan Refinery — Unit 56 Piping Installation",
      fa: "پالایشگاه آبادان — اجرای پایپینگ واحد ۵۶",
      ar: "مصفاة آبادان — تركيب أنابيب الوحدة 56",
    },
    location: { en: "Abadan", fa: "آبادان", ar: "آبادان" },
    client: { en: "Sekaf Construction", fa: "شرکت ساختمانی سکاف", ar: "شركة سكاف للإنشاءات" },
    summary: {
      en: "Field execution of refinery piping with coordinated fabrication, installation, testing, mechanical completion, and turnover activities.",
      fa: "اجرای میدانی پایپینگ پالایشگاهی شامل ساخت، نصب، تست، تکمیل مکانیکی و تحویل هماهنگ‌شده.",
      ar: "تنفيذ ميداني لأنابيب المصفاة يشمل التصنيع والتركيب والاختبار والإكمال الميكانيكي والتسليم.",
    },
    scope: {
      en: ["Refinery piping", "Mechanical completion", "Testing & handover"],
      fa: ["پایپینگ پالایشگاهی", "تکمیل مکانیکی", "تست و تحویل"],
      ar: ["أنابيب المصفاة", "الإكمال الميكانيكي", "الاختبار والتسليم"],
    },
    image: "/images/home/performance-refinery.webp",
  },
  {
    id: "phase-13-units-108-144",
    sector: "oilGas",
    title: {
      en: "South Pars Phase 13 — Units 108 & 144 Completion",
      fa: "فاز ۱۳ پارس جنوبی — تکمیل واحدهای ۱۰۸ و ۱۴۴",
      ar: "المرحلة 13 من بارس الجنوبي — استكمال الوحدتين 108 و144",
    },
    location: { en: "Assaluyeh", fa: "عسلویه", ar: "عسلويه" },
    client: { en: "Nir Pars — MAPNA Group", fa: "نیرپارس — گروه مپنا", ar: "نير بارس — مجموعة مپنا" },
    summary: {
      en: "Multi-discipline completion works integrating piping, mechanical activities, structural works, painting, insulation, and coordinated punch clearance.",
      fa: "عملیات تکمیلی چندرشته‌ای شامل پایپینگ، مکانیک، سازه، رنگ، عایق و رفع هماهنگ پانچ‌ها.",
      ar: "أعمال استكمال متعددة التخصصات تشمل الأنابيب والميكانيك والهياكل والطلاء والعزل وإغلاق الملاحظات.",
    },
    scope: {
      en: ["Piping completion", "Mechanical works", "Structural & finishing"],
      fa: ["تکمیل پایپینگ", "عملیات مکانیکی", "سازه و تکمیلی"],
      ar: ["استكمال الأنابيب", "الأعمال الميكانيكية", "الهياكل والتشطيبات"],
    },
    image: "/images/home/capabilities/piping.webp",
    imagePosition: "62% center",
  },
  {
    id: "phase-19-metering",
    sector: "oilGas",
    title: {
      en: "South Pars Phase 19 — Ethane Gas Metering System",
      fa: "فاز ۱۹ پارس جنوبی — سامانه اندازه‌گیری گاز اتان",
      ar: "المرحلة 19 من بارس الجنوبي — نظام قياس غاز الإيثان",
    },
    location: { en: "South Pars", fa: "پارس جنوبی", ar: "بارس الجنوبي" },
    client: { en: "Petropars Iran / SPGC", fa: "پتروپارس ایران / مجتمع گاز پارس جنوبی", ar: "بتروبارس إيران / مجمع غاز بارس الجنوبي" },
    summary: {
      en: "Installation and commissioning of the ethane-gas metering package with tightly controlled mechanical, piping, instrumentation, and turnover interfaces.",
      fa: "نصب و راه‌اندازی پکیج اندازه‌گیری گاز اتان با کنترل دقیق رابط‌های مکانیک، پایپینگ، ابزار دقیق و تحویل.",
      ar: "تركيب وتشغيل حزمة قياس غاز الإيثان مع ضبط واجهات الميكانيك والأنابيب والأجهزة والتسليم.",
    },
    scope: {
      en: ["Metering package", "Installation", "Commissioning"],
      fa: ["پکیج اندازه‌گیری", "نصب", "راه‌اندازی"],
      ar: ["حزمة القياس", "التركيب", "التشغيل"],
    },
    image: "/images/home/capabilities/oilfield.webp",
  },
  {
    id: "amine-tanks",
    sector: "oilGas",
    title: {
      en: "South Pars Phase 13 — Unit 108 Amine Tanks",
      fa: "فاز ۱۳ پارس جنوبی — مخازن آمین واحد ۱۰۸",
      ar: "المرحلة 13 من بارس الجنوبي — خزانات الأمين للوحدة 108",
    },
    location: { en: "South Pars", fa: "پارس جنوبی", ar: "بارس الجنوبي" },
    client: { en: "Nir Pars — MAPNA Group", fa: "نیرپارس — گروه مپنا", ar: "نير بارس — مجموعة مپنا" },
    summary: {
      en: "Fabrication, radiography, sandblasting, painting, and installation of two 80-ton amine tanks for refinery Unit 108.",
      fa: "ساخت، رادیوگرافی، سندبلاست، رنگ و نصب دو مخزن ۸۰ تنی آمین برای واحد ۱۰۸ پالایشگاه.",
      ar: "تصنيع وفحص إشعاعي وسفع رملي وطلاء وتركيب خزانَي أمين بوزن 80 طناً للوحدة 108.",
    },
    scope: {
      en: ["2 × 80 t tanks", "NDT & radiography", "Coating & installation"],
      fa: ["۲ مخزن ۸۰ تنی", "NDT و رادیوگرافی", "رنگ و نصب"],
      ar: ["خزانان × 80 طن", "فحوص غير إتلافية", "الطلاء والتركيب"],
    },
    image: "/images/home/capabilities/tanks.webp",
  },
  {
    id: "phase-13-coastal-line",
    sector: "civil",
    title: {
      en: "South Pars Phase 13 — Coastal Line Completion",
      fa: "فاز ۱۳ پارس جنوبی — تکمیل عملیات خط ساحلی",
      ar: "المرحلة 13 من بارس الجنوبي — استكمال الخط الساحلي",
    },
    location: { en: "Persian Gulf Coast", fa: "ساحل خلیج فارس", ar: "ساحل الخليج العربي" },
    client: { en: "Petropars Iran", fa: "پتروپارس ایران", ar: "بتروبارس إيران" },
    summary: {
      en: "Completion of coastal-line civil and industrial works, coordinating field interfaces, construction access, and final turnover requirements.",
      fa: "تکمیل عملیات عمرانی و صنعتی خط ساحلی با هماهنگی جبهه‌های کاری، دسترسی اجرا و الزامات تحویل نهایی.",
      ar: "استكمال الأعمال المدنية والصناعية للخط الساحلي مع تنسيق واجهات الموقع ومتطلبات التسليم النهائي.",
    },
    scope: {
      en: ["Coastal works", "Civil interfaces", "Final turnover"],
      fa: ["عملیات ساحلی", "رابط‌های عمرانی", "تحویل نهایی"],
      ar: ["أعمال ساحلية", "واجهات مدنية", "التسليم النهائي"],
    },
    image: "/images/home/capabilities/oilfield.webp",
    imagePosition: "center 70%",
  },
  {
    id: "mashal-pouya-civil",
    sector: "civil",
    title: {
      en: "Mashal Pouya Industrial Site — Civil & Structural Works",
      fa: "سایت صنعتی مشعل پویا — عملیات سیویل و سازه",
      ar: "موقع مشعل بويا الصناعي — الأعمال المدنية والإنشائية",
    },
    location: { en: "Iran", fa: "ایران", ar: "إيران" },
    client: { en: "Mashal Pouya Sepadana", fa: "مشعل پویا اسپادانا", ar: "مشعل بويا سبادانا" },
    summary: {
      en: "Civil, structural, building, architectural, site-development, and industrial-shed works across an operating company site.",
      fa: "عملیات سیویل، سازه، ساختمان، معماری، محوطه‌سازی و ساخت و نصب سوله در محدوده سایت صنعتی.",
      ar: "أعمال مدنية وإنشائية ومعمارية وتطوير الموقع وتصنيع وتركيب المباني الصناعية ضمن موقع تشغيلي.",
    },
    scope: {
      en: ["Site development", "Industrial structures", "Building & architecture"],
      fa: ["محوطه‌سازی", "سازه‌های صنعتی", "ساختمان و معماری"],
      ar: ["تطوير الموقع", "منشآت صناعية", "مبانٍ وأعمال معمارية"],
    },
    image: "/images/home/people-workshop.webp",
  },
];
