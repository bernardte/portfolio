import { type LucideIcon, Navigation, User, GraduationCap } from "lucide-react";
import type { IconType } from "react-icons";
import { SiGmail } from "react-icons/si";

interface InfoItem {
  icon: LucideIcon | IconType;
  label: string;
  value: string;
}

export const Info_Item: InfoItem[] = [
  { icon: User, label: "Name", value: "Tee Yu Hang" },
  { icon: SiGmail, label: "Email", value: "yuhang028@gmail.com" },
  { icon: Navigation, label: "Location", value: "Johor Bahru, Malaysia" },
  {
    icon: GraduationCap,
    label: "Education",
    value: "Bachelor of science in computer science"
  }
];
