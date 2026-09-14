import {
  type LucideIcon,
  ExternalLink,
  Globe,
  Pencil,
  Trash2
} from "lucide-react";
import type { IconType } from "react-icons";
import { SiGithub } from "react-icons/si";

export interface SocialLinkItem {
  label: string;
  Icon: LucideIcon | IconType;
  className: string;
  hasDivider: boolean;
}

export const SOCIAL_LINK: SocialLinkItem[] = [
  {
    label: "Live Demo",
    Icon: Globe,
    className:
      "flex h-8 w-8 items-center justify-center text-gray-400 hover:text-gray-600",
    hasDivider: true
  },
  {
    label: "Github",
    Icon: SiGithub,
    className:
      "flex h-8 w-8 items-center justify-center text-gray-400 hover:text-gray-600",
    hasDivider: true
  },
  {
    label: "Edit",
    Icon: Pencil,
    className:
      "flex h-8 w-8 items-center justify-center rounded-lg border bg-brand-primary/10 border-brand-primary/10 text-brand-accent hover:text-brand-primary hover:bg-brand-primary/20",
    hasDivider: false
  },
  {
    label: "Delete",
    Icon: Trash2,
    className:
      "flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-red-50/60 text-red-400 hover:bg-red-100/80 hover:text-red-500",
    hasDivider: false
  }
];
