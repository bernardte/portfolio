// 技术栈颜色字典
const BADGE_STYLES: Record<string, string> = {
  React: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  TypeScript: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  Tailwind: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  Nextjs: "border-slate-500/30 bg-slate-500/10 text-slate-200",
  Nodejs: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
};

export default function ProjectBadges({ badge }: { badge: string }) {
  // 获取匹配的颜色，若无匹配则使用默认灰色
  const style =
    BADGE_STYLES[badge] || "border-slate-700/50 bg-slate-800/40 text-slate-300";

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium backdrop-blur-sm transition-all duration-200 hover:scale-105 ${style}`}
    >
      {badge}
    </span>
  );
}
