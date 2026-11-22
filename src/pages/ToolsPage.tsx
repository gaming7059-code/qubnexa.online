import React, { useState, useMemo } from 'react'
import { useSearchParams, useOutletContext, Link } from 'react-router-dom'
import { Search, Filter, ArrowRight, X, Sparkles, Gamepad2, RotateCcw } from 'lucide-react'
import { ALL_TOOLS } from '../data/toolsData'
import {
  CATEGORIES,
  CATEGORY_MAP,
  normalizeCategoryId,
  isToolInCategory,
  getCategoryToolCount,
  getCategoryCountLabel,
} from '../data/categoriesData'
import { ToolCard } from '../components/common/ToolCard'
import { CategoryIcon } from '../components/common/CategoryIcon'
import { RecentToolsBar } from '../components/common/RecentToolsBar'
import { searchTools } from '../utils/toolSearch'
import { usePageSEO, createBreadcrumbSchema } from '../utils/seo'
import type { LayoutContextType } from '../layouts/MainLayout'
import type { CategoryId, Tool } from '../types/tools'

export type ToolsSortOption = 'featured' | 'newest' | 'az'
export type ToolsFilterPreset = 'all' | 'popular' | 'new'

export interface ToolsPageProps {
  presetFilter?: ToolsFilterPreset
  presetSort?: ToolsSortOption
}

export const ToolsPage: React.FC<ToolsPageProps> = ({
  presetFilter,
  presetSort,
}) => {
  const { openToolPreview } = useOutletContext<LayoutContextType>()
  const [searchParams, setSearchParams] = useSearchParams()

  const rawCategoryParam = searchParams.get('category')
  const rawFilterParam = searchParams.get('filter') as ToolsFilterPreset | null
  const rawSortParam = searchParams.get('sort') as ToolsSortOption | null

  const activeCategory: CategoryId = normalizeCategoryId(rawCategoryParam)
  const activeQuickFilter: ToolsFilterPreset =
    rawFilterParam && ['all', 'popular', 'new'].includes(rawFilterParam)
      ? rawFilterParam
      : presetFilter || 'all'

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '')
  const sortBy: ToolsSortOption = useMemo(() => {
    if (rawSortParam && ['featured', 'newest', 'az'].includes(rawSortParam)) return rawSortParam
    return presetSort || 'featured'
  }, [rawSortParam, presetSort])

  const currentCategoryObj = useMemo(() => {
    return CATEGORY_MAP[activeCategory] || CATEGORIES[0]
  }, [activeCategory])

  const pageHeading = useMemo(() => {
    if (activeCategory !== 'all') return currentCategoryObj.name
    if (activeQuickFilter === 'popular') return 'Popular Tools & Trending Utilities'
    if (activeQuickFilter === 'new') return 'Recently Added Tools & Latest Releases'
    return 'All Online Tools & Games'
  }, [activeCategory, currentCategoryObj.name, activeQuickFilter])

  const dynamicTitle = useMemo(() => {
    if (activeCategory !== 'all') return `${currentCategoryObj.name} — Free Online Utilities | QUBNEXA`
    if (activeQuickFilter === 'popular') return 'Most Popular Online Tools & Top Web Utilities | QUBNEXA'
    if (activeQuickFilter === 'new') return 'Recently Added Tools & Latest Web Utilities | QUBNEXA'
    return 'All Online Tools & Web Utilities Directory | QUBNEXA'
  }, [activeCategory, currentCategoryObj.name, activeQuickFilter])

  const dynamicDescription = useMemo(() => {
    if (activeCategory !== 'all') {
      return `Browse free ${currentCategoryObj.name.toLowerCase()} on QUBNEXA. ${currentCategoryObj.description}`
    }
    if (activeQuickFilter === 'popular') {
      return 'Discover the most popular online tools on QUBNEXA. Access our community’s highest-rated financial calculators, PDF editors, image tools, and daily productivity utilities.'
    }
    if (activeQuickFilter === 'new') {
      return 'Explore the newest online tools and latest utility releases on QUBNEXA. Discover newly added converters, AI prompt builders, document utilities, and browser games.'
    }
    return 'Browse the complete directory of free online calculators, PDF utilities, converters, audio & video tools, image enhancers, and browser games on QUBNEXA.'
  }, [activeCategory, currentCategoryObj.name, currentCategoryObj.description, activeQuickFilter])

  const dynamicIntro = useMemo(() => {
    if (activeCategory !== 'all') return currentCategoryObj.description
    if (activeQuickFilter === 'popular') {
      return 'Access our community’s most frequently used and trusted utilities — from loan EMI and GST calculators to multi-image PDF converters and secure password tools.'
    }
    if (activeQuickFilter === 'new') {
      return 'Stay up to date with the newest additions to the QUBNEXA suite. Explore newly released format converters, developer utilities, and browser-first tools designed for fast daily workflows.'
    }
    return 'Explore our comprehensive catalog of calculators, converters, PDF editors, multimedia utilities, and arcade games — 100% free with privacy-first client-side browser execution.'
  }, [activeCategory, currentCategoryObj.description, activeQuickFilter])

  const dynamicEyebrow = useMemo(() => {
    if (activeCategory !== 'all') return 'Tool Category'
    if (activeQuickFilter === 'popular') return 'Trending & Most-Used'
    if (activeQuickFilter === 'new') return 'Latest Releases & Updates'
    return 'QUBNEXA Master Directory'
  }, [activeCategory, activeQuickFilter])

  const dynamicKeywords = useMemo(() => {
    if (activeCategory !== 'all') return `${currentCategoryObj.name.toLowerCase()}, free online tools, qubnexa`
    if (activeQuickFilter === 'popular') return 'popular online tools, trending web utilities, top calculators, best pdf tools, most used online utilities, qubnexa'
    if (activeQuickFilter === 'new') return 'new online tools, latest web utilities, recently added calculators, new converters, qubnexa updates'
    return 'all online tools, web utilities directory, free browser tools, calculators, pdf utilities, converters, qubnexa'
  }, [activeCategory, currentCategoryObj.name, activeQuickFilter])

  const breadcrumbs = useMemo(() => {
    const items = [{ name: 'Home', path: '/' }, { name: 'Tools', path: '/tools' }]
    if (activeCategory !== 'all') {
      items.push({ name: currentCategoryObj.name, path: `/categories/${activeCategory}` })
    } else if (activeQuickFilter === 'popular') {
      items.push({ name: 'Popular Tools', path: '/popular' })
    } else if (activeQuickFilter === 'new') {
      items.push({ name: 'Recently Added', path: '/new-tools' })
    }
    return items
  }, [activeCategory, currentCategoryObj.name, activeQuickFilter])

  const canonicalPath =
    activeQuickFilter === 'popular' && activeCategory === 'all'
      ? '/popular'
      : activeQuickFilter === 'new' && activeCategory === 'all'
      ? '/new-tools'
      : activeCategory !== 'all'
      ? `/categories/${activeCategory}`
      : '/tools'

  usePageSEO({
    title: dynamicTitle,
    description: dynamicDescription,
    keywords: dynamicKeywords,
    canonicalPath,
    schema: createBreadcrumbSchema(breadcrumbs),
  })

  const updateParams = (updates: {
    category?: string
    filter?: ToolsFilterPreset
    sort?: ToolsSortOption
  }) => {
    const next = new URLSearchParams(searchParams)
    if (updates.category !== undefined) {
      if (updates.category === 'all') next.delete('category')
      else next.set('category', updates.category)
    }
    if (updates.filter !== undefined) {
      if (updates.filter === 'all') next.delete('filter')
      else next.set('filter', updates.filter)
    }
    if (updates.sort !== undefined) {
      if (updates.sort === 'featured') next.delete('sort')
      else next.set('sort', updates.sort)
    }
    setSearchParams(next)
  }

  const handleSortChange = (nextSort: ToolsSortOption) => {
    updateParams({ sort: nextSort })
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSearchParams({})
  }

  const filteredTools = useMemo(() => {
    const query = searchQuery.trim()
    const baseSearched = query ? searchTools(ALL_TOOLS, query) : ALL_TOOLS

    const matches = baseSearched.filter((tool) => {
      if (!isToolInCategory(tool, activeCategory, true)) return false
      if (activeQuickFilter === 'popular' && !tool.isPopular) return false
      if (activeQuickFilter === 'new' && !tool.isNew) return false
      return true
    })

    // Preserve search relevance ordering unless user explicitly picks non-default sort with empty query or A-Z/newest
    const sorted = [...matches]
    if (sortBy === 'az') {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => (b.releaseOrder ?? 0) - (a.releaseOrder ?? 0))
    } else if (!query) {
      sorted.sort((a, b) => {
        const scoreA = (a.isPopular ? 3 : 0) + (a.isFeatured ? 2 : 0) + (a.isNew ? 1 : 0)
        const scoreB = (b.isPopular ? 3 : 0) + (b.isFeatured ? 2 : 0) + (b.isNew ? 1 : 0)
        return scoreB - scoreA || (b.releaseOrder ?? 0) - (a.releaseOrder ?? 0)
      })
    }

    return sorted
  }, [activeCategory, activeQuickFilter, searchQuery, sortBy])

  const hasActiveFilters =
    activeCategory !== 'all' ||
    activeQuickFilter !== (presetFilter || 'all') ||
    searchQuery.trim().length > 0 ||
    sortBy !== (presetSort || 'featured')

  const headerCountLabel =
    activeCategory === 'all'
      ? `${filteredTools.length} of ${ALL_TOOLS.length} Utilities & Games`
      : getCategoryCountLabel(ALL_TOOLS, currentCategoryObj)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-7">
      {/* Dynamic Header */}
      <div className="animate-fade-in-up">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-[#00DFFF]">
            {dynamicEyebrow}
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {headerCountLabel}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-[#11182D] p-2.5 border border-blue-100 dark:border-slate-800 shadow-2xs">
              <CategoryIcon categoryId={activeCategory} size="md" className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {pageHeading}
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                {dynamicIntro}
              </p>
            </div>
          </div>

          {activeCategory !== 'all' && (
            <Link
              to={`/categories/${activeCategory}`}
              className="xw-btn-secondary min-h-[42px] px-4 py-2 text-xs sm:text-sm shrink-0"
            >
              <span>Dedicated Category Page</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Recently Used Tools Strip (hidden automatically when empty) */}
      <RecentToolsBar compact />

      {/* Search, Quick Filter & Sort Controls */}
      <div className="xw-panel p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center">
          {/* Search input */}
          <div className="relative w-full lg:max-w-md shrink-0">
            <Search className="h-4 w-4 text-slate-500 dark:text-[#00DFFF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools by name, category, or keyword..."
              aria-label="Filter tools by keyword"
              className="xw-input pl-10 pr-10 py-2.5 text-sm min-h-[44px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-[#11182D] hover:text-slate-700 dark:hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Highlight Filter + Sort Bar */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2">
            {/* Highlight Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              {([
                { id: 'all', label: 'All' },
                { id: 'popular', label: 'Popular' },
                { id: 'new', label: 'New' },
              ] as const).map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => updateParams({ filter: pill.id })}
                  className={`xw-tab ${
                    activeQuickFilter === pill.id ? 'xw-tab-active' : 'xw-tab-inactive'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <span className="hidden sm:inline-block h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="tools-sort-select" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Sort:
              </label>
              <select
                id="tools-sort-select"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as ToolsSortOption)}
                className="xw-input min-h-[40px] py-1.5 px-3 text-xs sm:text-sm font-medium w-auto cursor-pointer"
              >
                <option value="featured">Popular &amp; Featured</option>
                <option value="newest">Recently Added</option>
                <option value="az">Alphabetical (A → Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Chips (Wrapped for full visibility on mobile & desktop) */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          {CATEGORIES.map((cat) => {
            const count =
              cat.id === 'all'
                ? ALL_TOOLS.length
                : getCategoryToolCount(ALL_TOOLS, cat.id, true)
            const isActive = activeCategory === cat.id

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => updateParams({ category: cat.id })}
                className={`xw-tab ${isActive ? 'xw-tab-active' : 'xw-tab-inactive'}`}
              >
                <CategoryIcon categoryId={cat.id} size="xs" />
                <span>{cat.name}</span>
                <span
                  className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-[#11182D] text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Result Count, Active Filter Chips & Clear Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{filteredTools.length}</strong> of{' '}
              <strong className="text-slate-900 dark:text-white">{ALL_TOOLS.length}</strong> tools &amp; games
            </span>

            {activeCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-[#11182D] border border-blue-200 dark:border-slate-700 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:text-[#00DFFF]">
                Category: {currentCategoryObj.name}
              </span>
            )}
            {activeQuickFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                Filter: {activeQuickFilter === 'popular' ? 'Popular' : 'New'}
              </span>
            )}
            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-[#11182D] border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-200">
                Search: &ldquo;{searchQuery.trim()}&rdquo;
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-[#00DFFF] hover:bg-blue-50 dark:hover:bg-[#11182D] transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Special Games Arena Callout Banner when viewing Games */}
      {activeCategory === 'games' && (
        <div className="xw-panel relative overflow-hidden p-6 sm:p-8 animate-fade-in shadow-sm">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#00DFFF] via-blue-500 to-[#8B5CF6]" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/25">
                <Gamepad2 className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-[#00DFFF]">
                  Interactive Browser Arena
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Play Free Games With Touch &amp; Sound
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Experience HEX DRIFT Neon Void Runner with mega boss battles, or play classic Tic-Tac-Toe, Snake, and Memory Match.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/games/hex-drift"
                className="xw-btn-primary min-h-[44px] px-4 py-2.5 text-xs sm:text-sm"
              >
                <Sparkles className="h-4 w-4" />
                <span>Play HEX DRIFT</span>
              </Link>
              <Link
                to="/games"
                className="xw-btn-secondary min-h-[44px] px-4 py-2.5 text-xs sm:text-sm"
              >
                <span>Full Games Hub</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tools Grid / Empty State */}
      {filteredTools.length === 0 ? (
        <div className="xw-panel border-dashed p-10 sm:p-12 text-center animate-fade-in shadow-2xs space-y-4">
          <Filter className="h-10 w-10 text-slate-500 dark:text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No tools match your criteria</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            {searchQuery
              ? `We couldn't find any tools matching "${searchQuery}" under your current filters.`
              : `No tools match the current filter combination in ${currentCategoryObj.name}.`}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {['calculate loan', 'edit pdf', 'download video', 'convert units', 'AI video prompt'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  updateParams({ category: 'all', filter: 'all' })
                  setSearchQuery(term)
                }}
                className="min-h-[34px] cursor-pointer rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#11182D] px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-blue-500 dark:hover:border-[#00DFFF] transition-colors"
              >
                Try &ldquo;{term}&rdquo;
              </button>
            ))}
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className="xw-btn-primary min-h-[44px] px-5 py-2.5 text-xs sm:text-sm"
            >
              Reset All Filters
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="xw-btn-secondary min-h-[44px] px-5 py-2.5 text-xs sm:text-sm"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in">
          {filteredTools.map((tool: Tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onOpenPreview={openToolPreview}
              highlightQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  )
}
