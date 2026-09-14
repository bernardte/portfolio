import { GraduationCap, type LucideIcon, User, Navigation } from "lucide-react";
import { SiGmail } from "react-icons/si";
import { ProfileResponse } from "../interface/portfolio.interface";
import type { IconType } from "react-icons";

interface InfoItem {
  icon: LucideIcon | IconType;
  label: string;
  value: string;
}

export const getInfoItems = (profile: ProfileResponse): InfoItem[] => [
  {
    icon: User,
    label: "Name",
    value: profile.name
  },
  {
    icon: SiGmail,
    label: "Email",
    value: profile.email
  },
  {
    icon: Navigation,
    label: "Location",
    value: profile.location ?? ""
  },
  {
    icon: GraduationCap,
    label: "Education",
    value: profile.highestEducationLevel ?? ""
  }
];
