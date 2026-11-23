import React, { useState, useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import {
  ChevronRight,
  HelpCircle,
  BookOpen,
  Calculator,
  Sparkles,
  ChevronDown,
  ArrowLeft,
  LayoutGrid,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  UserCheck,
  Target,
} from 'lucide-react'
import { ALL_TOOLS } from '../../data/toolsData'
import { normalizeCategoryId } from '../../data/categoriesData'
import { recordRecentTool } from '../../utils/recentTools'
import { ToolCard } from '../common/ToolCard'
import { ScrollReveal } from '../common/ScrollReveal'
import {
  usePageSEO,
  createWebApplicationSchema,
  createBreadcrumbSchema,
  createFAQSchema,
} from '../../utils/seo'
import type { LayoutContextType } from '../../layouts/MainLayout'
import type { Tool } from '../../types/tools'

export interface FAQItem {
  question: string
  answer: string
}

export interface FormulaItem {
  title: string
  formula: string
  explanation: string
}

export interface ExampleItem {
  title: string
  description: string
  input: string
  output: string
}

export interface ToolPageLayoutProps {
  tool: Tool
  seoTitle: string
  seoDescription: string
  keywords?: string
  howToUseSteps: string[]
  formulas: FormulaItem[]
  examples: ExampleItem[]
  faqs: FAQItem[]
  relatedSlugs: string[]
  children: React.ReactNode
  whoShouldUse?: string[]
  problemsSolved?: string[]
  bestPractices?: string[]
  commonMistakes?: string[]
}

export const ToolPageLayout: React.FC<ToolPageLayoutProps> = ({
  tool,
  seoTitle,
  seoDescription,
  keywords,
  howToUseSteps,
  formulas,
  examples,
  faqs,
  relatedSlugs,
  children,
  whoShouldUse,
  problemsSolved,
  bestPractices,
  commonMistakes,
}) => {
  const primaryCatId = normalizeCategoryId(tool.primaryCategory || tool.categoryId)
  const categoryPath = primaryCatId !== 'all' ? `/categories/${primaryCatId}` : '/categories'

  // Build structured data schemas
  const schemas: Array<Record<string, unknown>> = [
    createWebApplicationSchema(tool.name, seoDescription || tool.description, tool.path),
    createBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Categories', path: '/categories' },
      { name: tool.categoryName, path: categoryPath },
      { name: tool.name, path: tool.path },
    ]),
  ]

  const faqSchema = createFAQSchema(faqs)
  if (faqSchema) {
    schemas.push(faqSchema)
  }

  usePageSEO({
    title: seoTitle,
    description: seoDescription,
    canonicalPath: tool.path,
    schema: schemas,
    keywords: keywords || (tool.keywords ? tool.keywords.join(', ') : undefined),
  })

  const { openToolPreview } = useOutletContext<LayoutContextType>()
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  useEffect(() => {
    recordRecentTool(tool.id)
  }, [tool.id])

  // Find related tools from slugs or IDs for complete cross-compatibility
  const relatedTools = ALL_TOOLS.filter((t) => relatedSlugs.includes(t.slug) || relatedSlugs.includes(t.id))

  // Accurate processing mode to avoid overclaiming offline capabilities
  const networkTools = ['video-downloader', 'youtube-thumbnail-downloader', 'google-review-link-generator']
  const isNetworkDependent = networkTools.includes(tool.slug || tool.id)
  const privacyBadgeLabel = isNetworkDependent ? 'Direct Browser Processing' : 'Local In-Browser Processing'

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="animate-fade-in flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
        <Link to="/categories" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Categories
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
        <Link
          to={categoryPath}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {tool.categoryName}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
        <span className="text-slate-900 dark:text-slate-200 font-medium truncate" aria-current="page">
          {tool.name}
        </span>
      </nav>

      {/* 2. Page Header */}
      <header className="space-y-2 animate-fade-in-up">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            to={categoryPath}
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-[#11182D] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:text-[#00DFFF] border border-blue-100 dark:border-slate-800 hover:border-blue-400 dark:hover:border-[#00DFFF]/50 transition-colors"
          >
            <Sparkles className="h-3 w-3" />
            <span>{tool.categoryName}</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={categoryPath}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-500/50 dark:hover:border-[#00DFFF]/50 hover:text-blue-600 dark:hover:text-[#00DFFF] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to {tool.categoryName}</span>
            </Link>
            <Link
              to="/tools"
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#11182D] px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-500/50 dark:hover:border-[#00DFFF]/50 hover:text-blue-600 dark:hover:text-[#00DFFF] transition-colors"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>All Tools</span>
            </Link>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {tool.name}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          {tool.description}
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Verified by QUBNEXA Team</span>
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>{privacyBadgeLabel}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>Updated November 2026</span>
        </div>
      </header>

      {/* 3. Main Calculator Area (Calculator + Result Cards) */}
      <section aria-label="Calculator Workspace" className="animate-fade-in">
        {children}
      </section>

      {/* 4. How to Use */}
      {howToUseSteps.length > 0 && (
        <ScrollReveal>
          <section aria-labelledby="how-to-use-heading" className="xw-panel p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-[#00DFFF]" />
              <h2 id="how-to-use-heading">How to Use the {tool.name}</h2>
            </div>
            <ol className="list-decimal list-inside space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
              {howToUseSteps.map((step, index) => (
                <li key={index} className="leading-relaxed pl-1">
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </ScrollReveal>
      )}

      {/* Audience & Problem Solving */}
      {((whoShouldUse && whoShouldUse.length > 0) || (problemsSolved && problemsSolved.length > 0)) && (
        <ScrollReveal delay={50}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {whoShouldUse && whoShouldUse.length > 0 && (
              <section className="xw-surface p-6 space-y-3.5 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <UserCheck className="h-5 w-5 text-blue-600 dark:text-[#00DFFF]" />
                  <h2 className="text-base font-bold">Who Should Use This Tool</h2>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {whoShouldUse.map((user, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-[#00DFFF] mt-2 shrink-0" />
                      <span>{user}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {problemsSolved && problemsSolved.length > 0 && (
              <section className="xw-surface p-6 space-y-3.5 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Target className="h-5 w-5 text-emerald-500" />
                  <h2 className="text-base font-bold">Problems This Tool Solves</h2>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {problemsSolved.map((prob, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{prob}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </ScrollReveal>
      )}

      {/* 5. Formula & Explanation */}
      {formulas.length > 0 && (
        <ScrollReveal delay={50}>
          <section aria-labelledby="formula-heading" className="xw-panel p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
              <Calculator className="h-5 w-5 text-blue-600 dark:text-[#00DFFF]" />
              <h2 id="formula-heading">Formulas &amp; Calculation Method</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formulas.map((item, idx) => (
                <div key={idx} className="xw-surface-muted p-4 space-y-2 transition-colors hover:border-slate-300 dark:hover:border-slate-700">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                  <div className="rounded-lg bg-white dark:bg-[#050814] p-3 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-blue-700 dark:text-[#00DFFF] select-all overflow-x-auto">
                    {item.formula}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.explanation}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* 6. Worked Examples */}
      {examples.length > 0 && (
        <ScrollReveal delay={50}>
          <section aria-labelledby="examples-heading" className="xw-panel p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 id="examples-heading" className="text-lg font-bold text-slate-900 dark:text-white">
              Practical Examples
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {examples.map((ex, idx) => (
                <div key={idx} className="xw-surface-muted p-4 space-y-2 transition-colors hover:border-slate-300 dark:hover:border-slate-700">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{ex.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{ex.description}</p>
                  <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 flex flex-col gap-1 text-xs">
                    <div className="text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Input:</span> {ex.input}
                    </div>
                    <div className="text-blue-700 dark:text-[#00DFFF] font-medium">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Result:</span> {ex.output}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Best Practices & Common Mistakes */}
      {((bestPractices && bestPractices.length > 0) || (commonMistakes && commonMistakes.length > 0)) && (
        <ScrollReveal delay={50}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bestPractices && bestPractices.length > 0 && (
              <section className="xw-surface p-6 space-y-3.5 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  <h2 className="text-base font-bold">Best Practices &amp; Operational Tips</h2>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {bestPractices.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {commonMistakes && commonMistakes.length > 0 && (
              <section className="xw-surface p-6 space-y-3.5 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <AlertTriangle className="h-5 w-5 text-rose-500" />
                  <h2 className="text-base font-bold">Common Mistakes to Avoid</h2>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {commonMistakes.map((mistake, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </ScrollReveal>
      )}

      {/* 7. FAQ Section */}
      {faqs.length > 0 && (
        <ScrollReveal delay={50}>
          <section aria-labelledby="faq-heading" className="xw-panel p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
              <HelpCircle className="h-5 w-5 text-blue-600 dark:text-[#00DFFF]" />
              <h2 id="faq-heading">Frequently Asked Questions</h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx
                return (
                  <div key={idx} className="py-2">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="flex min-h-[44px] cursor-pointer w-full items-center justify-between gap-3 py-2 text-left text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-[#00DFFF] transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400 transition-transform duration-200 ease-out ${
                          isOpen ? 'rotate-180 text-blue-600 dark:text-[#00DFFF]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="animate-fade-in pb-2">
                        <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pr-4">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* 8. Related Tools */}
      {relatedTools.length > 0 && (
        <ScrollReveal delay={50}>
          <section aria-labelledby="related-heading" className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 id="related-heading" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Related Tools &amp; Calculators
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Explore complementary calculation and conversion helpers for everyday tasks.
                </p>
              </div>
              <Link
                to="/tools"
                className="text-xs font-semibold text-blue-600 dark:text-[#00DFFF] hover:text-blue-800 dark:hover:text-cyan-300 hover:underline inline-flex items-center gap-1"
              >
                Browse all tools →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedTools.map((relTool) => (
                <ToolCard
                  key={relTool.id}
                  tool={relTool}
                  onOpenPreview={openToolPreview}
                />
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}
    </div>
  )
}
