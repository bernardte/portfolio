import {
  CheckCircle2,
  Code2,
  Folder,
  Star,
  type LucideIcon
} from "lucide-react";

export const METRIC_ITEM_STATS: {
  key:
    "projectsCount" | "skillsCount" | "strengthsCount" | "completionPercentage";
  label: string;
  icon: LucideIcon;
  color: string;
}[] = [
  {
    key: "projectsCount",
    label: "Projects",
    icon: Folder,
    color: "text-blue-500"
  },
  {
    key: "skillsCount",
    label: "Skills",
    icon: Code2,
    color: "text-purple-500"
  },
  {
    key: "strengthsCount",
    label: "Strengths",
    icon: Star,
    color: "text-amber-400"
  },
  {
    key: "completionPercentage",
    label: "Profile Complete",
    icon: CheckCircle2,
    color: "text-emerald-500"
  }
];
