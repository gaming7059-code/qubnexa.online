import React, { useState, useMemo } from 'react'
import { Link, useParams, useOutletContext } from 'react-router-dom'
import {
  ChevronRight,
  Search,
  X,
  ArrowLeft,
  ArrowRight,
  Filter,
  Gamepad2,
  Sparkles,
  Layers,
} from 'lucide-react'
import { ALL_TOOLS } from '../data/toolsData'
import {
  CATEGORY_MAP,
  isValidPrimaryCategorySlug,
  getToolsByCategory,
  getCategoryCountLabel,
  getRelatedCategories,
} from '../data/categoriesData'
import { ToolCard } from '../components/common/ToolCard'
import { CategoryCard } from '../components/common/CategoryCard'
import { CategoryIcon } from '../components/common/CategoryIcon'
import { searchTools } from '../utils/toolSearch'
import { usePageSEO, createBreadcrumbSchema } from '../utils/seo'
import type { LayoutContextType } from '../layouts/MainLayout'
import type { Tool } from '../types/tools'

type CategorySortMode = 'featured' | 'newest' | 'az'

export const CategoryDetailPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const { openToolPreview } = useOutletContext<LayoutContextType>()

  const resolvedId = isValidPrimaryCategorySlug(categorySlug)
  const category = resolvedId ? CATEGORY_MAP[resolvedId] : null

  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<CategorySortMode>('featured')

  usePageSEO({
    title: category
      ? `${category.name} — Free Online Tools | Xenova-World`
      : 'Category Not Found — Xenova-World',
    description: category
      ? `${category.description} Explore free browser-based ${category.name.toLowerCase()} with zero logins.`
      : 'The requested tool category could not be found on Xenova-World.',
    canonicalPath: category ? `/categories/${category.slug}` : '/categories',
    keywords: category?.keywords?.join(', '),
    schema: category
      ? createBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Categories', path: '/categories' },
          { name: category.name, path: `/categories/${category.slug}` },
        ])
      : undefined,
  })

  const categoryTools = useMemo(() => {
    if (!category || category.id === 'all') return []
    return getToolsByCategory(ALL_TOOLS, category.id, true)
  }, [category])

  const filteredTools = useMemo(() => {
    const query = searchQuery.trim()
    const matching = query ? searchTools(categoryTools, query) : categoryTools

    const sorted = [...matching]
    if (sortBy === 'az') {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => (b.releaseOrder ?? 0) - (a.releaseOrder ?? 0))
    } else {
      sorted.sort((a, b) => {
        const scoreA = (a.primaryCategory === category?.id ? 4 : 0) + (a.isPopular ? 2 : 0) + (a.isNew ? 1 : 0)
        const scoreB = (b.primaryCategory === category?.id ? 4 : 0) + (b.isPopular ? 2 : 0) + (b.isNew ? 1 : 0)
        return scoreB - scoreA || (b.releaseOrder ?? 0) - (a.releaseOrder ?? 0)
      })
    }
    return sorted
  }, [categoryTools, searchQuery, sortBy, category])

  const relatedCategories = useMemo(() => {
    if (!resolvedId) return []
    return getRelatedCategories(resolvedId, 3)
  }, [resolvedId])

  if (!category) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6 animate-fade-in">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-[#11182D] text-slate-500 dark:text-slate-400">
          <Layers className="h-8 w-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Category Not Found
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          The category you requested does not exist. Explore all available categories or search our complete tools catalog.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/categories" className="xw-btn-primary min-h-[44px] px-5 py-2.5 text-sm">
            Browse All Categories
          </Link>
          <Link to="/tools" className="xw-btn-secondary min-h-[44px] px-5 py-2.5 text-sm">
            Explore All Tools
          </Link>
        </div>
      </div>
    )
  }

  const countLabel = getCategoryCountLabel(ALL_TOOLS, category)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-[#00DFFF] transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
        <Link to="/categories" className="hover:text-blue-600 dark:hover:text-[#00DFFF] transition-colors">
          Categories
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
        <span className="font-semibold text-slate-900 dark:text-slate-200" aria-current="page">
          {category.name}
        </span>
      </nav>

      {/* Category Hero Header */}
      <div className="xw-panel relative overflow-hidden p-6 sm:p-8 shadow-xs animate-fade-in-up">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#00DFFF] via-blue-500 to-[#8B5CF6]" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 dark:bg-[#11182D] p-3 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <CategoryIcon categoryId={category.id} size="lg" className="w-full h-full" />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-[#11182D] border border-blue-200/80 dark:border-slate-800 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-[#00DFFF]">
                  {countLabel}
                </span>
                {categoryTools.length > 0 && categoryTools.length !== ALL_TOOLS.filter((t) => t.primaryCategory === category.id).length && (
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    ({categoryTools.length} total including cross-category utilities)
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {category.name}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/categories"
              className="xw-btn-secondary min-h-[44px] px-4 py-2.5 text-xs sm:text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>All Categories</span>
            </Link>
            <Link
              to="/tools"
              className="xw-btn-primary min-h-[44px] px-4 py-2.5 text-xs sm:text-sm"
            >
              <span>Full Catalog</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Games Arena Highlight if viewing Games category */}
      {category.id === 'games' && (
        <div className="xw-surface p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-purple-200/70 dark:border-purple-800/40">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/20">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Interactive Browser Games Arena
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Play HEX DRIFT: Neon Void Runner fullscreen or switch between classic games with audio and score tracking.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link to="/games/hex-drift" className="xw-btn-primary min-h-[42px] px-4 py-2 text-xs sm:text-sm">
              <Sparkles className="h-4 w-4" />
              <span>Play HEX DRIFT</span>
            </Link>
            <Link to="/games" className="xw-btn-secondary min-h-[42px] px-4 py-2 text-xs sm:text-sm">
              <span>Games Arena</span>
            </Link>
          </div>
        </div>
      )}

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="relative w-full sm:max-w-sm">
          <Search className="h-4 w-4 text-slate-500 dark:text-[#00DFFF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search in ${category.name}...`}
            aria-label={`Search tools in ${category.name}`}
            className="xw-input pl-10 pr-10 py-2.5 text-sm min-h-[44px]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-[#11182D]"
              aria-label="Clear category search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">Sort:</span>
          {([
            { id: 'featured', label: 'Popular' },
            { id: 'newest', label: 'Recently Added' },
            { id: 'az', label: 'A → Z' },
          ] as const).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSortBy(opt.id)}
              className={`xw-tab ${sortBy === opt.id ? 'xw-tab-active' : 'xw-tab-inactive'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tools Grid */}
      {filteredTools.length === 0 ? (
        <div className="xw-panel border-dashed p-10 text-center space-y-3">
          <Filter className="h-9 w-9 text-slate-400 mx-auto" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            No matching tools in {category.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Try clearing your search or exploring the full Xenova-World directory.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="xw-btn-primary min-h-[42px] px-4 py-2 text-xs sm:text-sm"
            >
              Clear Search
            </button>
            <Link to="/tools" className="xw-btn-secondary min-h-[42px] px-4 py-2 text-xs sm:text-sm">
              Search All Tools
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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

      {/* Related Categories */}
      {relatedCategories.length > 0 && (
        <section aria-labelledby="related-categories-heading" className="pt-8 border-t border-slate-200/80 dark:border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 id="related-categories-heading" className="text-xl font-bold text-slate-900 dark:text-white">
                Related Categories
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Continue exploring neighboring tool collections on Xenova-World.
              </p>
            </div>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 dark:text-[#00DFFF] hover:underline"
            >
              <span>View all categories</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedCategories.map((relCat) => (
              <CategoryCard key={relCat.id} category={relCat} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
