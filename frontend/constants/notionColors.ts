export interface NotionColor {
  id: string;
  bg: string;
  border: string;
  swatch: string;
}

export const NOTION_COLORS: NotionColor[] = [
  {
    id: "none",
    bg: "bg-white/5",
    border: "border-white/10",
    swatch: "transparent"
  },
  {
    id: "gray",
    bg: "bg-slate-500/15",
    border: "border-slate-400/30",
    swatch: "#94a3b8"
  },
  {
    id: "brown",
    bg: "bg-amber-700/15",
    border: "border-amber-600/30",
    swatch: "#b45309"
  },
  {
    id: "orange",
    bg: "bg-orange-500/15",
    border: "border-orange-400/30",
    swatch: "#f97316"
  },
  {
    id: "yellow",
    bg: "bg-yellow-400/15",
    border: "border-yellow-300/30",
    swatch: "#facc15"
  },
  {
    id: "green",
    bg: "bg-emerald-500/15",
    border: "border-emerald-400/30",
    swatch: "#34d399"
  },
  {
    id: "blue",
    bg: "bg-blue-500/15",
    border: "border-blue-400/30",
    swatch: "#60a5fa"
  },
  {
    id: "purple",
    bg: "bg-purple-500/15",
    border: "border-purple-400/30",
    swatch: "#a78bfa"
  },
  {
    id: "pink",
    bg: "bg-pink-500/15",
    border: "border-pink-400/30",
    swatch: "#f472b6"
  },
  {
    id: "red",
    bg: "bg-red-500/15",
    border: "border-red-400/30",
    swatch: "#f87171"
  }
];
