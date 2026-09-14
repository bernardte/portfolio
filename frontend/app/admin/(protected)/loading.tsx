"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) =>
        prev >= 98 ? 98 : prev + Math.floor(Math.random() * 8 + 1)
      );
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#F4F6F9] text-slate-800 antialiased">
      {/* 1. 背景线稿装饰 (极简线条遮罩) */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute top-10 left-10 h-32 w-32 rounded-lg border border-slate-300/60" />
        <div className="absolute top-20 right-16 h-48 w-36 rounded-lg border border-slate-300/60" />
        <div className="absolute bottom-16 left-20 h-40 w-40 rounded-full border border-slate-300/60" />
        <div className="absolute right-12 bottom-12 h-28 w-28 rounded-lg border border-slate-300/60" />
      </div>

      {/* 2. 核心内容 */}
      <div className="z-10 flex flex-col items-center text-center">
        {/* PS 渐变 Logo */}
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-500 to-purple-500 p-[3px] shadow-lg shadow-teal-500/10">
          <div className="flex h-full w-full items-center justify-center rounded-[13px] bg-[#F4F6F9]">
            <Image alt="Logo" src={"/logo.svg"} height={600} width={600} />
          </div>
        </div>

        {/* 标题与描述 */}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Portfolio System
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Exploring creative works...
        </p>

        {/* 3. 进度条区域 */}
        <div className="mt-8 flex w-72 items-center gap-3">
          {/* 进度条轨道 */}
          <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* 进度百分比 */}
          <span className="w-9 text-right font-mono text-xs font-semibold text-teal-600">
            {progress}%
          </span>
        </div>
      </div>

      {/* 4. 底部 Slogan */}
      <div className="absolute bottom-8 text-xs text-slate-400">
        Crafting your experience...
      </div>
    </div>
  );
}
