import { AuthContainer } from "@/components/admin/auth/AuthContainer";
import { GripVertical, Loader2, ToggleLeft, Tags } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

const HIGHLIGHTS = [
  {
    icon: GripVertical,
    label: "Drag and drop to sort the order of items displayed"
  },
  {
    icon: ToggleLeft,
    label: "One-click deployment/deployment of a single project"
  },
  { icon: Tags, label: "Flexible management of technology stack tags" }
];

export default function AuthPage() {
  return (
    <div className="grid h-dvh w-full grid-cols-1 bg-[#F8F9FA] lg:grid-cols-2">
      {/* 左侧：黑夜视觉海报 */}
      <div className="relative hidden h-full min-h-0 overflow-hidden bg-[#0B0C10] lg:block">
        <Image
          src="https://bright-white-8zv92gdj.edgeone.dev/file.png"
          alt="Portfolio Dashboard Preview"
          fill
          priority
          className="object-cover"
        />

        {/* 底部渐变遮罩，压住文字对比度 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {/* 左上角品牌角标，跟右侧表单呼应 */}
        <div className="absolute top-8 left-8 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            P
          </div>
          <span className="text-sm font-semibold text-white">
            Portfolio Admin
          </span>
        </div>

        {/* 底部文案与功能点 */}
        <div className="absolute inset-x-0 bottom-0 p-10">
          <h2 className="max-w-sm text-2xl leading-snug font-semibold text-white">
            Create a portfolio that is memorable at first glance
          </h2>
          <p className="mt-2 max-w-sm text-sm text-white/60">
            Log in to the backend and you can update your project showcase in
            just a few minutes.
          </p>

          <ul className="mt-6 space-y-3">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2.5 text-sm text-white/80"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 右侧：登录区域 */}
      <div className="relative flex h-full min-h-0 flex-col items-center justify-center overflow-y-auto p-6 sm:p-12">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="bg-brand-primary/30 absolute -top-24 -right-16 h-72 w-72 rounded-full blur-3xl" />
          <div className="bg-brand-primary/30 absolute -bottom-28 -left-20 h-80 w-80 rounded-full blur-3xl" />
          <div className="bg-brand-primary/10 absolute top-1/3 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-lg">
          <main className="flex w-full items-center justify-center p-8 sm:p-10">
            <Suspense
              fallback={
                <div className="flex h-[420px] w-full items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                </div>
              }
            >
              <AuthContainer />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
