"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 text-slate-100">
      {/* Gradient halo background effect */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-[120px]"
      />

      {/* Mesh glowing background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-[size:4rem_4rem]"
      />

      <div className="relative z-10 mx-auto max-w-lg text-center">
        {/* Numerical label */}
        <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 font-mono text-xs font-semibold tracking-widest text-indigo-400 uppercase">
          Error 404
        </span>

        {/* Core Headline */}
        <h1 className="mt-6 bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-6xl font-extrabold tracking-tight text-transparent sm:text-7xl">
          Page Not Found
        </h1>

        {/* Prompt text */}
        <p className="mt-4 text-base leading-relaxed text-slate-400">
          Sorry, the page you requested may have been moved, deleted, or the
          path may be incorrect. Please return to the homepage to browse my
          other works.
        </p>

        {/* Operation Button */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => router.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-medium text-white shadow-lg shadow-sky-500/25 transition-all duration-200 hover:bg-blue-500 hover:shadow-sky-500/40 active:scale-[0.98] sm:w-auto"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Back to Portfolio
          </button>
        </div>
      </div>
    </main>
  );
}
