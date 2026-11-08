import React from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PRIMARY_CATEGORIES } from '../data/categoriesData'
import { ALL_TOOLS } from '../data/toolsData'
import { ToolCard } from '../components/common/ToolCard'
import { CategoryIcon } from '../components/common/CategoryIcon'
import { ScrollReveal } from '../components/common/ScrollReveal'
import { usePageSEO, createBreadcrumbSchema } from '../utils/seo'
import type { LayoutContextType } from '../layouts/MainLayout'
import type { CategoryId, Tool } from '../types/tools'

export const CategoriesPage: React.FC = () => {
  const { openToolPreview } = useOutletContext<LayoutContextType>()

  usePageSEO({
    title: 'Explore All 8 Tool Categories — SmartTools India',
    description: 'Explore the complete directory of SmartTools India: Calculators, Daily Utilities, PDF & Documents, Image & Media, Text & Developer, Voice & Audio, AI & Creator Tools, and Games.',
    canonicalPath: '/categories',
    keywords: 'tool categories, online calculators directory, daily utilities, qr code generator, password generator, pdf tools, voice tools, ai prompt generator, image enhancer, free online games, smarttools india',
    schema: createBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Categories', path: '/categories' },
    ]),
  })

  // Multi-category helper
  const isToolInCategory = (tool: Tool, catId: string): boolean => {
    if (tool.categoryId === catId) return true
    if (tool.categoryIds && tool.categoryIds.includes(catId as CategoryId)) return true
    return false
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <div className="animate-fade-in-up">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Collections Directory
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
          Explore All 8 Categories
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
          Discover all 25 free tools and games grouped by specialized domain: daily utilities, high-precision calculators, private PDF editors, photo upscalers, developer text utilities, voice and neural audio, cinematic AI prompts, and playable arcade games.
        </p>

        {/* Quick Jump Category Anchor Pills */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mr-1 shrink-0">Jump to:</span>
          {PRIMARY_CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 whitespace-nowrap active:scale-95"
            >
              <CategoryIcon categoryId={cat.id} size="xs" />
              <span>{cat.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Category Sections */}
      <div className="space-y-12">
        {PRIMARY_CATEGORIES.map((category) => {
          const categoryTools = ALL_TOOLS.filter((t) => isToolInCategory(t, category.id))
          const isGamesCategory = category.id === 'games'
          const targetUrl = category.path || `/tools?category=${category.id}`

          return (
            <ScrollReveal key={category.id} delay={50}>
              <div
                id={category.id}
                className="scroll-mt-24 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xs space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 p-2.5 transition-transform duration-300 hover:scale-105 border border-blue-100 dark:border-blue-900/40">
                      <CategoryIcon categoryId={category.id} size="md" className="w-full h-full" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                          {category.name}
                        </h2>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {category.itemLabel || `${categoryTools.length} Items`}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={targetUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors shrink-0"
                  >
                    <span>{isGamesCategory ? 'Play in Games Arena' : `View all ${category.name}`}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {categoryTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      onOpenPreview={openToolPreview}
                    />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )
        })}
      </div>
    </div>
  )
}
