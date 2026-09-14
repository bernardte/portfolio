import React from "react";

// 扩展后的完整技术栈颜色字典
const BADGE_STYLES: Record<string, string> = {
  // --- 前端框架 & 核心 ---
  "React.js": "border-sky-500/30 bg-sky-500/10 text-sky-400",
  "Next.js": "border-slate-500/30 bg-slate-500/10 text-slate-200",
  "TypeScript": "border-blue-500/30 bg-blue-500/10 text-blue-400",
  "Typescript": "border-blue-500/30 bg-blue-500/10 text-blue-400",

  // --- 样式 & UI 组件 ---
  "Tailwind CSS": "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  "Shadcn UI": "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
  "Framer Motion": "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400",

  // --- 后端 & 运行环境 ---
  "Node.js": "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  "Nest.js": "border-rose-500/30 bg-rose-500/10 text-rose-400",
  "MERN Stack": "border-teal-500/30 bg-teal-500/10 text-teal-300",

  // --- 数据库 & ORM ---
  "Supabase": "border-emerald-600/30 bg-emerald-600/10 text-emerald-400",
  "Prisma ORM": "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
  "TypeORM": "border-orange-500/30 bg-orange-500/10 text-orange-400",
  "Mongodb": "border-green-600/30 bg-green-600/10 text-green-400",
  "mongoose": "border-red-600/30 bg-red-600/10 text-red-400",
  "Neon DB": "border-lime-500/30 bg-lime-500/10 text-lime-400",

  // --- 身份认证 & 安全 ---
  "OAuth": "border-amber-500/30 bg-amber-500/10 text-amber-400",
  "2FA Authentication": "border-violet-500/30 bg-violet-500/10 text-violet-400",
  "JWT Authentication": "border-purple-500/30 bg-purple-500/10 text-purple-400",

  // --- 状态管理 & 功能 / AI 工具 ---
  "zustand": "border-amber-700/30 bg-amber-700/10 text-amber-300",
  "CRUD": "border-blue-400/30 bg-blue-400/10 text-blue-300",
  "Third Party API Integration": "border-indigo-400/30 bg-indigo-400/10 text-indigo-300",
  "AI tools - Claude code": "border-orange-400/30 bg-orange-400/10 text-orange-300",
};

export default function ProjectBadges({ badge }: { badge: string }) {
  // 获取匹配的颜色，若未定义则使用极简暗色风格回退方案
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