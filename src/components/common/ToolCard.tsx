import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Sparkles } from 'lucide-react'
import type { Tool } from '../../types/tools'
import { DynamicIcon } from './DynamicIcon'

interface ToolCardProps {
  tool: Tool
  onOpenPreview?: (tool: Tool) => void
}

/**
 * Returns a theme-matched badge style for each category
 */
function getCategoryBadgeStyle(categoryId: string): string {
  switch (categoryId) {
    case 'calculators':
    case 'finance':
    case 'math':
      return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
    case 'daily-utilities':
    case 'daily-utility':
      return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
    case 'pdf-documents':
    case 'pdf-tools':
      return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
    case 'image-media':
      return 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
    case 'text-developer':
    case 'seo-tools':
      return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
    case 'voice-audio':
      return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
    case 'ai-creator':
    case 'creator-tools':
      return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
    case 'games':
      return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
    default:
      return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
  }
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onOpenPreview }) => {
  const isReady = tool.isFunctional !== false
  const isGame = tool.categoryId === 'games'
  const badgeClass = getCategoryBadgeStyle(tool.categoryId)

  return (
    <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-blue-500/80 dark:hover:border-blue-400/80 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-500/15 will-change-transform overflow-hidden">
      {/* Top glowing accent line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Top Header: Icon + Category Badge + (New/Popular) */}
        <div className="flex items-start justify-between gap-2.5 mb-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 transition-all duration-300 ease-out group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:-rotate-2 group-hover:shadow-md group-hover:shadow-blue-500/30">
            <DynamicIcon name={tool.icon} className="h-5 w-5 transition-transform duration-300 ease-out group-hover:scale-105" />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {/* Status / Highlight Badges */}
            {tool.isNew && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/80 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                New
              </span>
            )}
            {!tool.isNew && tool.isPopular && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800/80 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                <Sparkles className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                Popular
              </span>
            )}
            {!isReady && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                <Clock className="h-2.5 w-2.5" /> Coming Soon
              </span>
            )}

            {/* Category Badge */}
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors ${badgeClass}`}>
              {tool.categoryName}
            </span>
          </div>
        </div>

        {/* Tool Name */}
        {isReady ? (
          <Link to={tool.path} className="focus:outline-none focus:underline">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-1">
              {tool.name}
            </h3>
          </Link>
        ) : (
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-1">
            {tool.name}
          </h3>
        )}

        {/* Tool Description */}
        <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
          {tool.description}
        </p>
      </div>

      {/* Card Footer: Action button */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {isGame ? 'Instant Play' : '100% Free'}
        </span>

        {isReady ? (
          <Link
            to={tool.path}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors group-hover:translate-x-0.5"
            title={`Open ${tool.name}`}
          >
            <span>{isGame ? 'Play Game' : 'Open Tool'}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => onOpenPreview ? onOpenPreview(tool) : undefined}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title={`Preview ${tool.name}`}
          >
            <span>Preview</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </div>
  )
}
