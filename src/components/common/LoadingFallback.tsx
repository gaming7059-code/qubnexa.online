import React from 'react'

export const LoadingFallback: React.FC = () => {
  return (
    <div
      role="status"
      aria-label="Loading page content"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 animate-fade-in"
    >
      {/* Brand Loading Indicator */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse motion-reduce:animate-none" />
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <div className="h-4 w-20 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse motion-reduce:animate-none" />
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <div className="h-4 w-28 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse motion-reduce:animate-none" />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-50/70 dark:bg-cyan-950/30 px-3 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
          <img
            src={`${import.meta.env.BASE_URL}branding/xenova-world-icon.png`}
            alt=""
            className="h-4 w-4 rounded-full object-contain bg-[#050814]"
          />
          <span>Xenova-World</span>
        </div>
      </div>

      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-32 rounded-md bg-blue-100 dark:bg-blue-950/60 animate-pulse motion-reduce:animate-none" />
        <div className="h-9 w-72 sm:w-96 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse motion-reduce:animate-none" />
        <div className="h-5 w-full max-w-xl rounded-lg bg-slate-100 dark:bg-slate-800/60 animate-pulse motion-reduce:animate-none" />
      </div>

      {/* Main Interactive Workspace Skeleton */}
      <div className="xw-panel p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-800 animate-pulse motion-reduce:animate-none" />
            <div className="h-12 w-full rounded-xl bg-slate-100 dark:bg-[#11182D] animate-pulse motion-reduce:animate-none" />
            <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800 animate-pulse motion-reduce:animate-none" />
            <div className="h-12 w-full rounded-xl bg-slate-100 dark:bg-[#11182D] animate-pulse motion-reduce:animate-none" />
            <div className="flex gap-3 pt-2">
              <div className="h-11 w-32 rounded-xl bg-blue-600/25 dark:bg-blue-500/20 animate-pulse motion-reduce:animate-none" />
              <div className="h-11 w-24 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse motion-reduce:animate-none" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800 animate-pulse motion-reduce:animate-none" />
            <div className="h-44 w-full rounded-2xl bg-slate-100 dark:bg-[#11182D] border border-slate-200/60 dark:border-slate-800 animate-pulse motion-reduce:animate-none" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingFallback
