export type NavigationKey =
  | "home"
  | "about"
  | "capabilities"
  | "projects"
  | "hse"
  | "contact";

export type NavigationItem = {
  key: NavigationKey;
  href: string;
};

export const navigationItems: NavigationItem[] = [
  { key: "home", href: "/" },
  { key: "about", href: "/#about" },
  { key: "capabilities", href: "/#capabilities" },
  { key: "projects", href: "/projects" },
  { key: "hse", href: "/#hse" },
  { key: "contact", href: "/contact" },
];

export const capabilityItems = [
  "Engineering",
  "Procurement",
  "Construction",
  "Industrial piping",
];
