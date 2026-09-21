export type NavigationItem = {
  label: string;
  href: string;
};

export const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Projects", href: "/projects" },
  { label: "HSE", href: "/hse" },
  { label: "Contact", href: "/contact" },
];

export const capabilityItems = [
  "Engineering",
  "Procurement",
  "Construction",
  "Industrial piping",
];