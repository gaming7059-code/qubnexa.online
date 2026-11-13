import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Calendar, ListOrdered } from 'lucide-react'

export interface BreadcrumbEntry {
  name: string
  path?: string
}

export interface LegalSectionTocItem {
  id: string
  title: string
}

export interface LegalDocumentLayoutProps {
  eyebrow: string
  title: string
  subtitle: string
  lastUpdated: string
  breadcrumbs: BreadcrumbEntry[]
  tocItems?: LegalSectionTocItem[]
  children: React.ReactNode
}

export const LegalDocumentLayout: React.FC<LegalDocumentLayoutProps> = ({
  eyebrow,
  title,
  subtitle,
  lastUpdated,
  breadcrumbs,
  tocItems,
  children,
}) => {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8 animate-fade-in-up">
      {/* Visible Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
      >
        {breadcrumbs.map((item, idx) => {
          const isLast = idx === breadcrumbs.length - 1
          return (
            <React.Fragment key={`${item.name}-${idx}`}>
              {idx > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
              )}
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="hover:text-blue-600 dark:hover:text-[#00DFFF] transition-colors"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="text-slate-900 dark:text-slate-200 font-medium" aria-current="page">
                  {item.name}
                </span>
              )}
            </React.Fragment>
          )
        })}
      </nav>

      {/* Page Header */}
      <header className="space-y-3 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-[#00DFFF]">
            {eyebrow}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-[#11182D] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
            <Calendar className="h-3.5 w-3.5 text-cyan-600 dark:text-[#00DFFF]" />
            <span>Last updated: {lastUpdated}</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {subtitle}
        </p>
      </header>

      {/* Optional Table of Contents */}
      {tocItems && tocItems.length > 0 && (
        <nav
          aria-label="Table of contents"
          className="xw-surface-muted p-4 sm:p-5 space-y-3"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            <ListOrdered className="h-4 w-4 text-blue-600 dark:text-[#00DFFF]" />
            <span>Quick Section Navigation</span>
          </div>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1.5 text-xs sm:text-sm">
            {tocItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="inline-flex items-center py-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-[#00DFFF] hover:underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-[#00DFFF] rounded"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {children}
    </div>
  )
}
