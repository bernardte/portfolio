import { LucideIcon } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { IconType } from "react-icons";


export interface NavLinkItem {
  label: string;
  href: string;
}

export interface SocialMediaLinkItem {
  label: string;
  href: string;
  icon: IconType;
}

export const NAV_LINK: NavLinkItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Project", href: "#project" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" }
];

export const SOCIAL_MEDIA_LINK: SocialMediaLinkItem[] = [
  { label: "Github", href: "https://github.com/bernardte", icon: FaGithub },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/yu-hang-tee-8779ab306/",
    icon: FaLinkedin
  },
  {
    label: "Email",
    href: "mailto:yuhang028@gmail.com",
    icon: SiGmail
  }
];
