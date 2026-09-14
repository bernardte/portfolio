import { House, Code } from "lucide-react";

export type SidebarItem = {
  label: string;
  icon: React.ElementType;
  href?: string;
  children?: SidebarItem[];
};

export const SIDEBAR_ITEM_LINK: SidebarItem[] = [
  {
    label: "Home",
    icon: House,
    href: "/admin"
  },
  {
    label: "Skills",
    icon: Code,
    href: "/admin/skills"
  },
  {
    label: "Projects",
    icon: Code,
    children: [
      {
        label: "All Projects",
        icon: Code,
        href: "/admin/projects"
      },
      {
        label: "Create Project",
        icon: Code,
        href: "/admin/projects/create"
      }
    ]
  }
];
