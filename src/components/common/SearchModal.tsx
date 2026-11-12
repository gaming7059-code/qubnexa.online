import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, ArrowRight, History, Sparkles } from 'lucide-react'
import { ALL_TOOLS, POPULAR_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'
import { DynamicIcon } from './DynamicIcon'
import { HighlightedText } from './HighlightedText'
import { searchTools } from '../../utils/toolSearch'
import { useRecentTools } from '../../hooks/useRecentTools'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTool: (tool: Tool) => void
}

const SUGGESTED_INTENTS = [
  'calculate loan',
  'download video',
  'edit pdf',
  'convert units',
  'compress image',
  'AI video prompt',
]

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
}) => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const { recentTools } = useRecentTools()

  const handleClose = useCallback(() => {
    setQuery('')
    setActiveIndex(0)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 40)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault()
        handleClose()
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (isOpen) handleClose()
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [isOpen, handleClose])

  const filteredTools = useMemo(() => {
    const cleanQuery = query.trim()
    if (!cleanQuery) {
      if (recentTools.length > 0) {
        const recentIds = new Set(recentTools.map((t) => t.id))
        const remainingPopular = POPULAR_TOOLS.filter((t) => !recentIds.has(t.id))
        return [...recentTools.slice(0, 3), ...remainingPopular].slice(0, 6)
      }
      return POPULAR_TOOLS.slice(0, 6)
    }
    return searchTools(ALL_TOOLS, cleanQuery)
  }, [query, recentTools])

  const clampedIndex =
    filteredTools.length === 0 ? -1 : Math.min(activeIndex, filteredTools.length - 1)

  useEffect(() => {
    if (clampedIndex < 0 || !listRef.current) return
    const activeEl = listRef.current.querySelector<HTMLElement>(
      `[data-search-index="${clampedIndex}"]`,
    )
    activeEl?.scrollIntoView({ block: 'nearest' })
  }, [clampedIndex])

  const handleSelectItem = useCallback(
    (tool: Tool) => {
      onSelectTool(tool)
      setQuery('')
      setActiveIndex(0)
      onClose()
    },
    [onSelectTool, onClose],
  )

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (filteredTools.length > 0) {
        setActiveIndex((prev) => (prev + 1) % filteredTools.length)
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (filteredTools.length > 0) {
        setActiveIndex((prev) => (prev - 1 + filteredTools.length) % filteredTools.length)
      }
    } else if (e.key === 'Enter' && clampedIndex >= 0 && filteredTools[clampedIndex]) {
      e.preventDefault()
      handleSelectItem(filteredTools[clampedIndex])
    }
  }

  if (!isOpen) return null

  const hasQuery = query.trim().length > 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 pt-12 sm:pt-20 bg-slate-900/65 dark:bg-slate-950/85 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div
        className="xw-surface w-full max-w-2xl shadow-2xl overflow-hidden animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-label="Global tool search"
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-slate-200 dark:border-slate-800 px-3.5 sm:px-4 py-3 focus-within:bg-blue-50/30 dark:focus-within:bg-[#11182D]/70 transition-colors duration-200">
          <Search className="h-5 w-5 text-slate-500 dark:text-[#00DFFF] mr-2.5 sm:mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Search by tool or task (e.g., calculate loan, edit pdf, video)..."
            aria-label="Search tools by name, category, or task"
            aria-controls="global-search-listbox"
            aria-activedescendant={
              clampedIndex >= 0 && filteredTools[clampedIndex]
                ? `search-opt-${filteredTools[clampedIndex].id}`
                : undefined
            }
            className="w-full min-h-[38px] bg-transparent text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setActiveIndex(0)
                inputRef.current?.focus()
              }}
              aria-label="Clear search query"
              className="inline-flex min-h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-[#11182D] hover:text-slate-700 dark:hover:text-white mr-1.5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close search dialog"
            className="min-h-[36px] cursor-pointer rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#11182D] transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div
          id="global-search-listbox"
          ref={listRef}
          role="listbox"
          className="max-h-96 overflow-y-auto p-2.5 space-y-1"
        >
          <div className="px-3 py-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              {!hasQuery && recentTools.length > 0 ? (
                <History className="h-3.5 w-3.5 text-blue-600 dark:text-[#00DFFF]" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-[#00DFFF]" />
              )}
              <span>
                {hasQuery
                  ? `Matching Results (${filteredTools.length})`
                  : recentTools.length > 0
                  ? 'Recent & Suggested Tools'
                  : 'Quick Suggestions'}
              </span>
            </span>

            {hasQuery && filteredTools.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  const targetQuery = query.trim()
                  handleClose()
                  navigate(`/tools?q=${encodeURIComponent(targetQuery)}`)
                }}
                className="normal-case font-semibold text-blue-600 dark:text-[#00DFFF] hover:underline cursor-pointer"
              >
                View in All Tools →
              </button>
            )}
          </div>

          {filteredTools.length === 0 ? (
            <div className="py-8 px-4 text-center space-y-4">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                No tools found matching &ldquo;{query}&rdquo;.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Try searching by task or tap one of these common requests:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {SUGGESTED_INTENTS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term)
                      setActiveIndex(0)
                    }}
                    className="min-h-[34px] cursor-pointer rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#11182D] px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-blue-500 dark:hover:border-[#00DFFF] hover:text-blue-600 dark:hover:text-[#00DFFF] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            filteredTools.map((tool, index) => {
              const isSelected = index === clampedIndex
              return (
                <button
                  key={tool.id}
                  id={`search-opt-${tool.id}`}
                  data-search-index={index}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => handleSelectItem(tool)}
                  className={`w-full min-h-[56px] cursor-pointer flex items-center justify-between p-3 rounded-xl text-left transition-colors duration-150 group ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-[#16203B] ring-1 ring-blue-500/40 dark:ring-[#00DFFF]/40'
                      : 'hover:bg-slate-50 dark:hover:bg-[#11182D]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-blue-50 dark:bg-[#11182D] border-blue-100 dark:border-slate-800 text-blue-600 dark:text-[#00DFFF]'
                      }`}
                    >
                      <DynamicIcon name={tool.icon} className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div
                        className={`text-sm font-semibold truncate ${
                          isSelected
                            ? 'text-blue-700 dark:text-[#00DFFF]'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        <HighlightedText text={tool.name} query={query} />
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                        <HighlightedText text={tool.description} query={query} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="hidden sm:inline-block text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#0B1020] border border-slate-200/70 dark:border-slate-800 px-2 py-0.5 rounded-md">
                      <HighlightedText text={tool.categoryName} query={query} />
                    </span>
                    <ArrowRight
                      className={`h-4 w-4 transition-transform duration-150 ${
                        isSelected
                          ? 'text-blue-600 dark:text-[#00DFFF] translate-x-0.5'
                          : 'text-slate-400'
                      }`}
                    />
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-2.5 bg-slate-50/70 dark:bg-[#050814]/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <kbd className="rounded bg-white dark:bg-[#11182D] px-1.5 py-0.5 border border-slate-200 dark:border-slate-700 text-[11px]">
              ↑ ↓
            </kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <kbd className="rounded bg-white dark:bg-[#11182D] px-1.5 py-0.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
              Enter
            </kbd>
            <span>Open Tool</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <kbd className="rounded bg-white dark:bg-[#11182D] px-1.5 py-0.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
              Esc
            </kbd>
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  )
}
