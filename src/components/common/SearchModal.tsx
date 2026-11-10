import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Search, X, ArrowRight } from 'lucide-react'
import { ALL_TOOLS, POPULAR_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'
import { DynamicIcon } from './DynamicIcon'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTool: (tool: Tool) => void
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
}) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClose = useCallback(() => {
    setQuery('')
    onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  const filteredTools = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase()
    if (!cleanQuery) return POPULAR_TOOLS.slice(0, 6)

    return ALL_TOOLS.filter((tool) => {
      const matchName = tool.name.toLowerCase().includes(cleanQuery)
      const matchDesc = tool.description.toLowerCase().includes(cleanQuery)
      const matchCategory = tool.categoryName.toLowerCase().includes(cleanQuery)
      const matchKeywords = tool.keywords.some((k) => k.toLowerCase().includes(cleanQuery))
      return matchName || matchDesc || matchCategory || matchKeywords
    })
  }, [query])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div 
        className="xw-surface w-full max-w-2xl shadow-2xl overflow-hidden animate-scale-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-slate-200 dark:border-slate-800 px-4 py-3 focus-within:bg-blue-50/30 dark:focus-within:bg-[#11182D]/70 transition-colors duration-200">
          <Search className="h-5 w-5 text-slate-500 dark:text-[#00DFFF] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a tool (e.g., GST, EMI, Age, Percentage)..."
            className="w-full bg-transparent text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search query"
              className="inline-flex min-h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-[#11182D] hover:text-slate-700 dark:hover:text-white mr-1.5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={handleClose}
            className="min-h-[36px] cursor-pointer rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#11182D] transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2.5 divide-y divide-slate-100 dark:divide-slate-800/80">
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {query.trim() ? `Search Results (${filteredTools.length})` : 'Popular Tools'}
          </div>

          {filteredTools.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-600 dark:text-slate-300">
              No tools matching &ldquo;{query}&rdquo; found.
            </div>
          ) : (
            filteredTools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => {
                  onSelectTool(tool)
                  onClose()
                }}
                className="w-full min-h-[56px] cursor-pointer flex items-center justify-between p-3 rounded-xl text-left hover:bg-blue-50/70 dark:hover:bg-[#11182D] transition-all duration-200 active:scale-[0.99] group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-[#11182D] border border-blue-100 dark:border-slate-800 text-blue-600 dark:text-[#00DFFF] group-hover:bg-blue-600 group-hover:text-white dark:group-hover:border-[#00DFFF]/50 transition-all duration-200">
                    <DynamicIcon name={tool.icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-[#00DFFF] transition-colors">
                      {tool.name}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                      {tool.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="hidden sm:inline-block text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#11182D] border border-slate-200/70 dark:border-slate-800 px-2 py-0.5 rounded-md transition-colors">
                    {tool.categoryName}
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-[#00DFFF] group-hover:translate-x-0.5 transition-all duration-200" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-2.5 bg-slate-50/70 dark:bg-[#050814]/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>Navigate with mouse or keyboard</span>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Press</span>
            <kbd className="rounded bg-white dark:bg-[#11182D] px-1.5 py-0.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">Enter</kbd>
            <span>to select</span>
          </div>
        </div>
      </div>
    </div>
  )
}
