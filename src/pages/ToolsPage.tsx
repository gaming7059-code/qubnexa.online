import React, { useState, useMemo } from 'react'
import { useSearchParams, useOutletContext, Link } from 'react-router-dom'
import { Search, Filter, ArrowRight, X, Sparkles, Gamepad2 } from 'lucide-react'
import { ALL_TOOLS } from '../data/toolsData'
import { CATEGORIES, normalizeCategoryId } from '../data/categoriesData'
import { ToolCard } from '../components/common/ToolCard'
import { CategoryIcon } from '../components/common/CategoryIcon'
import { usePageSEO, createBreadcrumbSchema } from '../utils/seo'
import type { LayoutContextType } from '../layouts/MainLayout'
import type { CategoryId, Tool } from '../types/tools'

export const ToolsPage: React.FC = () => {
  const { openToolPreview } = useOutletContext<LayoutContextType>()
  const [searchParams, setSearchParams] = useSearchParams()
  const rawCategoryParam = searchParams.get('category')
  const activeCategory: CategoryId = normalizeCategoryId(rawCategoryParam)

  const currentCategoryObj = useMemo(() => {
    return CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0]
  }, [activeCategory])

  const dynamicTitle = activeCategory !== 'all'
    ? `${currentCategoryObj.name} — Free Online Tools | Xenova-World`
    : 'All Online Tools & Calculators — Xenova-World'

  const dynamicDescription = activeCategory !== 'all'
    ? `Browse free ${currentCategoryObj.name.toLowerCase()} on Xenova-World. ${currentCategoryObj.description}`
    : 'Browse our complete catalog of free online calculators, PDF editors, voice tools, and arcade browser games on Xenova-World. 100% free, private, and browser-based.'

  const dynamicKeywords = activeCategory !== 'all'
    ? `${currentCategoryObj.name.toLowerCase()}, free ${currentCategoryObj.name.toLowerCase()}, online calculators, xenova-world`
    : 'all online tools, free calculators, web utilities, unit converters, xenova-world directory, browser tools, games'

  usePageSEO({
    title: dynamicTitle,
    description: dynamicDescription,
    keywords: dynamicKeywords,
    canonicalPath: activeCategory !== 'all' ? `/tools?category=${activeCategory}` : '/tools',
    schema: createBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools' },
      ...(activeCategory !== 'all'
        ? [{ name: currentCategoryObj.name, path: `/tools?category=${activeCategory}` }]
        : []),
    ]),
  })

  const [searchQuery, setSearchQuery] = useState('')

  // Check if a tool belongs to a given category
  const isToolInCategory = (tool: Tool, catId: string): boolean => {
    if (catId === 'all') return true
    if (tool.categoryId === catId) return true
    if (tool.categoryIds && tool.categoryIds.includes(catId as CategoryId)) return true
    return false
  }

  const handleSelectCategory = (catId: string) => {
    if (catId === 'all') {
      searchParams.delete('category')
      setSearchParams(searchParams)
    } else {
      setSearchParams({ category: catId })
    }
  }

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchCategory = isToolInCategory(tool, activeCategory)
      const query = searchQuery.trim().toLowerCase()
      if (!query) return matchCategory

      const matchText =
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.categoryName.toLowerCase().includes(query) ||
        tool.keywords.some((k) => k.toLowerCase().includes(query))

      return matchCategory && matchText
    })
  }, [activeCategory, searchQuery])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Dynamic Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {activeCategory === 'all' ? 'Complete Directory' : 'Tool Category'}
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {activeCategory === 'all' ? `${ALL_TOOLS.length} Utilities & Games` : currentCategoryObj.itemLabel}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-[#11182D] p-2.5 border border-blue-100 dark:border-slate-800 shadow-2xs">
            <CategoryIcon categoryId={activeCategory} size="md" className="w-full h-full" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {activeCategory !== 'all' ? currentCategoryObj.name : 'All Online Tools & Games'}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {activeCategory !== 'all'
                ? currentCategoryObj.description
                : 'Browse our complete catalog of calculators, PDF tools, photo upscalers, voice utilities, and playable browser games. Free, private, and ready in seconds.'}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="animate-fade-in flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center pb-4 border-b border-slate-200/80 dark:border-slate-800">
        {/* Search input */}
        <div className="relative w-full lg:w-88 shrink-0">
          <Search className="h-4 w-4 text-slate-500 dark:text-[#00DFFF] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, category, or keyword..."
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

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count = cat.id === 'all'
              ? ALL_TOOLS.length
              : ALL_TOOLS.filter((t) => isToolInCategory(t, cat.id)).length

            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
                className={`xw-tab ${
                  isActive ? 'xw-tab-active' : 'xw-tab-inactive'
                }`}
              >
                <CategoryIcon categoryId={cat.id} size="xs" />
                <span>{cat.name}</span>
                <span className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-[#11182D] text-slate-600 dark:text-slate-300'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Special Games Arena Callout Banner if activeCategory === 'games' */}
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
        <div className="xw-panel border-dashed p-12 text-center animate-fade-in shadow-2xs">
          <Filter className="h-10 w-10 text-slate-500 dark:text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No tools match your criteria</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-md mx-auto">
            We couldn&apos;t find any tools matching &ldquo;{searchQuery}&rdquo; in {currentCategoryObj.name}.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                handleSelectCategory('all')
              }}
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
            />
          ))}
        </div>
      )}
    </div>
  )
}
