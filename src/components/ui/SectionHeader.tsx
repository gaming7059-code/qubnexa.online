import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface SectionHeaderProps {
  eyebrow: string
  title: string
  description?: string
  actionLabel?: string
  actionTo?: string
  accentColor?: 'cyan' | 'purple' | 'amber' | 'emerald'
  centered?: boolean
}

const EYEBROW_COLORS = {
  cyan: 'text-cyan-700 dark:text-[#00DFFF]',
  purple: 'text-purple-700 dark:text-purple-400',
  amber: 'text-amber-700 dark:text-amber-400',
  emerald: 'text-emerald-700 dark:text-emerald-400',
}

/**
 * Reusable section heading establishing a unified Xenova-World typographic hierarchy
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
  accentColor = 'cyan',
  centered = false,
}) => {
  if (centered) {
    return (
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <span className={`inline-block text-xs font-bold uppercase tracking-widest ${EYEBROW_COLORS[accentColor]}`}>
          {eyebrow}
        </span>
        <h2 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7 sm:mb-8">
      <div className="max-w-2xl">
        <span className={`inline-block text-xs font-bold uppercase tracking-widest ${EYEBROW_COLORS[accentColor]}`}>
          {eyebrow}
        </span>
        <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-[#00DFFF] hover:text-blue-700 dark:hover:text-cyan-300 transition-colors group shrink-0 min-h-[36px]"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}
