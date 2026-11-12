import React from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PRIMARY_CATEGORIES, getToolsByCategory, getCategoryCountLabel } from '../data/categoriesData'
import { ALL_TOOLS } from '../data/toolsData'
import { ToolCard } from '../components/common/ToolCard'
import { CategoryCard } from '../components/common/CategoryCard'
import { CategoryIcon } from '../components/common/CategoryIcon'
import { ScrollReveal } from '../components/common/ScrollReveal'
import { usePageSEO, createBreadcrumbSchema } from '../utils/seo'
import type { LayoutContextType } from '../layouts/MainLayout'

export const CategoriesPage: React.FC = () => {
  const { openToolPreview } = useOutletContext<LayoutContextType>()

  usePageSEO({
    title: `Explore All ${PRIMARY_CATEGORIES.length} Tool Categories — QUBNEXA`,
    description: `Browse ${ALL_TOOLS.length} free browser tools and games organized across ${PRIMARY_CATEGORIES.length} structured categories including AI Tools, Video Tools, Audio Studio, PDF Documents, Image Enhancement, Calculators, and Utilities on QUBNEXA.`,
    canonicalPath: '/categories',
    keywords: 'tool categories, ai tools directory, calculators, utilities, pdf tools, video downloader, audio studio, image enhancer, games, qubnexa',
    schema: createBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Categories', path: '/categories' },
    ]),
  })

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <div className="animate-fade-in-up space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-[#00DFFF]">
          Structured Collections
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Explore All {PRIMARY_CATEGORIES.length} Categories
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Discover all {ALL_TOOLS.length} free tools and browser games organized into focused workflows. Select any dedicated category page to search, sort, and explore tools by domain.
        </p>

        {/* Quick Jump Category Anchor Pills (wrapped cleanly) */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">Jump to:</span>
          {PRIMARY_CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="xw-tab xw-tab-inactive hover:border-blue-500/60 dark:hover:border-[#00DFFF]/60 hover:text-blue-600 dark:hover:text-[#00DFFF]"
            >
              <CategoryIcon categoryId={cat.id} size="xs" />
              <span>{cat.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Category Index Grid linking directly to Dedicated Category Pages */}
      <section aria-labelledby="category-directory-heading" className="space-y-4">
        <h2 id="category-directory-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Category Hubs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {PRIMARY_CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Category Tool Sections */}
      <div className="space-y-10">
        {PRIMARY_CATEGORIES.map((category) => {
          const categoryTools = getToolsByCategory(ALL_TOOLS, category.id, true)
          const countLabel = getCategoryCountLabel(ALL_TOOLS, category)

          return (
            <ScrollReveal key={category.id} delay={40}>
              <div
                id={category.id}
                className="scroll-mt-24 xw-panel p-6 sm:p-8 shadow-2xs space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-[#11182D] p-2.5 border border-blue-100 dark:border-slate-800">
                      <CategoryIcon categoryId={category.id} size="md" className="w-full h-full" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                          {category.name}
                        </h2>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#11182D] border border-slate-200/70 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                          {countLabel}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={category.path}
                    className="inline-flex min-h-[38px] items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 dark:text-[#00DFFF] hover:text-blue-800 dark:hover:text-cyan-300 transition-colors shrink-0"
                  >
                    <span>Open {category.name}</span>
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
