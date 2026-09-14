// components/admin/home/strength-icons.ts

export interface IconOption {
  key: string;
  label: string;
  icon: string;
  color: string;
}

export const ICON_OPTIONS: IconOption[] = [
  {
    key: "lightbulb",
    label: "Insight",
    icon: "lightbulb",
    color: "text-amber-500"
  },
  {
    key: "code",
    label: "Code",
    icon: "code-2",
    color: "text-emerald-500"
  },
  {
    key: "rocket",
    label: "Growth",
    icon: "rocket",
    color: "text-indigo-500"
  },
  {
    key: "users",
    label: "Team",
    icon: "users",
    color: "text-purple-500"
  },
  {
    key: "sparkles",
    label: "Creative",
    icon: "sparkles",
    color: "text-pink-500"
  },
  {
    key: "target",
    label: "Focus",
    icon: "target",
    color: "text-sky-500"
  }
];

export const DEFAULT_ICON_KEY = ICON_OPTIONS[0].key;

export function getIconOption(key?: string | null): IconOption {
  return ICON_OPTIONS.find((option) => option.key === key) ?? ICON_OPTIONS[0];
}
