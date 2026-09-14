"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FolderKanban, Terminal } from "lucide-react";

export default function PortfolioNotFound() {
  const router = useRouter();

  return (
    <main className="fixed inset-0 z-[999] flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 text-slate-100">
      {/* 渐变光晕背景 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-purple-500/20 via-indigo-500/20 to-cyan-500/20 blur-[130px]"
      />

      {/* 极客风格网格背景 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-[size:4rem_4rem]"
      />

      <div className="relative z-10 mx-auto max-w-lg text-center">
        {/* Badge 状态标签 */}
        <div className="border-brand-primary/30 bg-brand-primary/10 text-brand-primary inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs font-semibold tracking-wide">
          <Terminal className="text-brand-primary h-3.5 w-3.5" />
          <span>PORTFOLIO_NOT_FOUND (404)</span>
        </div>

        {/* 主标题 */}
        <h1 className="mt-6 bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
          Portfolio not found
        </h1>

        {/* 提示描述 */}
        <p className="mt-4 text-base leading-relaxed text-slate-400">
          Sorry, the developer portfolio page you are trying to access may have
          been deleted or renamed, or the URL slug contains a typo.
        </p>

        {/* 代码展示盒 (增加开发者氛围感) */}
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-left font-mono text-xs text-slate-300 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 pb-2 text-slate-500">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
            <span className="ml-2 text-[10px]">portfolio-status.json</span>
          </div>
          <pre className="text-indigo-300 overflow-x-auto">
            {`{\n  "status": 404,\n  "error": "Profile Not Found",\n  "message": "No portfolio matches the requested slug."\n}`}
          </pre>
        </div>

        {/* 操作按钮区 */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {/* 返回上一页 */}
          <button
            onClick={() => router.back()}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-200 shadow-md transition-all duration-200 hover:bg-slate-700 hover:text-white active:scale-[0.98] sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1.5" />
            Back to Portfolio
          </button>

          {/* 浏览作品集展示列表 */}
          <Link
            href="/admin/auth?mode=login"
            className="from-brand-primary to-brand-accent inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-blue-500 hover:to-sky-500 hover:shadow-indigo-500/40 active:scale-[0.98] sm:w-auto"
          >
            <FolderKanban className="h-4 w-4" />
            Admin Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
