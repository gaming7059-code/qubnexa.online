import React from 'react'
import { Link } from 'react-router-dom'
import { History, Trash2, ArrowRight } from 'lucide-react'
import { useRecentTools } from '../../hooks/useRecentTools'
import { DynamicIcon } from './DynamicIcon'

interface RecentToolsBarProps {
  className?: string
  compact?: boolean
}

export const RecentToolsBar: React.FC<RecentToolsBarProps> = ({
  className = '',
  compact = false,
}) => {
  const { recentTools, clearHistory, hasRecentTools } = useRecentTools()

  if (!hasRecentTools) return null

  return (
    <div
      className={`xw-panel p-4 sm:p-5 space-y-3 ${className}`.trim()}
      aria-label="Recently Used Tools"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-blue-600 dark:text-[#00DFFF] shrink-0" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Recently Used Tools
          </h3>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Saved privately on your device
          </span>
        </div>

        <button
          type="button"
          onClick={clearHistory}
          className="inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#11182D] px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-rose-300 dark:hover:border-rose-800 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          aria-label="Clear recently used tools history"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div
        className={
          compact
            ? 'flex flex-wrap items-center gap-2'
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5'
        }
      >
        {recentTools.map((tool) => (
          <Link
            key={tool.id}
            to={tool.path}
            className="group inline-flex min-h-[44px] items-center justify-between gap-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-[#11182D]/70 px-3 py-2 hover:border-blue-500/60 dark:hover:border-[#00DFFF]/60 hover:bg-blue-50/50 dark:hover:bg-[#16203B] transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-[#0B1020] border border-slate-200/70 dark:border-slate-800 text-blue-600 dark:text-[#00DFFF]">
                <DynamicIcon name={tool.icon} className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-[#00DFFF]">
                  {tool.name}
                </div>
                {!compact && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {tool.categoryName}
                  </div>
                )}
              </div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-[#00DFFF] transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  )
}
