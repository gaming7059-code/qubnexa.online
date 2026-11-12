import React, { useState, useMemo, useRef } from 'react'
import { useOutletContext, Link, useNavigate } from 'react-router-dom'
import {
  Search,
  ArrowRight,
  Mic,
  FileText,
  Sparkles,
  Zap,
  Shield,
  Gift,
  Smartphone,
  Landmark,
  Layers,
  Filter,
  X,
  Calculator,
  Download,
  ChevronDown,
  HelpCircle,
  Image as ImageIcon,
  FileImage,
  Compass,
} from 'lucide-react'
import { POPULAR_TOOLS, ALL_TOOLS, RECENT_TOOLS } from '../data/toolsData'
import { PRIMARY_CATEGORIES, getToolsByCategory, getCategoryCountLabel } from '../data/categoriesData'
import { ToolCard } from '../components/common/ToolCard'
import { CategoryCard } from '../components/common/CategoryCard'
import { CategoryIcon } from '../components/common/CategoryIcon'
import { DynamicIcon } from '../components/common/DynamicIcon'
import { HighlightedText } from '../components/common/HighlightedText'
import { RecentToolsBar } from '../components/common/RecentToolsBar'
import { ScrollReveal } from '../components/common/ScrollReveal'
import { SectionHeader } from '../components/ui/SectionHeader'
import { searchTools } from '../utils/toolSearch'
import { recordRecentTool } from '../utils/recentTools'
import { usePageSEO, createWebSiteSchema, createFAQSchema } from '../utils/seo'
import type { LayoutContextType } from '../layouts/MainLayout'
import type { PrimaryCategoryId, Tool } from '../types/tools'

const HOME_FAQS = [
  {
    question: 'Are all tools and utilities on Xenova-World completely free?',
    answer: 'Yes. Every calculator, converter, PDF editor, audio processor, image enhancer, AI prompt builder, video analyzer, and browser game on Xenova-World is 100% free with zero paywalls or mandatory signups.',
  },
  {
    question: 'Do my files, PDFs, or audio recordings leave my device?',
    answer: 'No. Core utilities including our PDF Editor, JPG to PDF Converter, Image Quality Increaser, Audio Studio, Password Generator, QR Generator, and financial calculators execute locally inside your browser.',
  },
  {
    question: 'Do I need to create an account or install extensions?',
    answer: 'No login, registration, or browser plugin installation is required. Every utility loads directly on mobile phones, tablets, laptops, and desktops.',
  },
  {
    question: 'How does the Universal Video Downloader stay free and safe?',
    answer: 'It uses direct browser inspection and public metadata discovery for authorized direct MP4 and WebM streams without requiring accounts, paid third-party subscriptions, or credential sharing.',
  },
]

const SUGGESTED_INTENTS = [
  'calculate loan',
  'download video',
  'edit pdf',
  'convert units',
  'compress image',
  'AI video prompt',
]

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { openToolPreview } = useOutletContext<LayoutContextType>()
  const [heroSearchQuery, setHeroSearchQuery] = useState('')
  const [heroActiveIndex, setHeroActiveIndex] = useState(0)
  const [activeBrowseCategory, setActiveBrowseCategory] = useState<PrimaryCategoryId>('calculators')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const heroInputRef = useRef<HTMLInputElement>(null)

  const faqSchema = useMemo(() => createFAQSchema(HOME_FAQS), [])

  usePageSEO({
    title: 'Xenova-World — Explore Beyond Limits | Free Online Tools, AI & Utilities',
    description: `Access ${ALL_TOOLS.length} free browser-based utilities across ${PRIMARY_CATEGORIES.length} structured categories including calculators, PDF editors, audio studio, AI tools, video tools, and games.`,
    canonicalPath: '/',
    keywords: 'xenova-world, free online tools, ai tools, calculators, pdf editor, video downloader, audio studio, qr generator, browser games',
    schema: faqSchema ? [createWebSiteSchema(), faqSchema] : createWebSiteSchema(),
  })

  const searchResults = useMemo(() => {
    const query = heroSearchQuery.trim()
    if (!query) return null
    return searchTools(ALL_TOOLS, query)
  }, [heroSearchQuery])

  const clampedHeroIndex =
    !searchResults || searchResults.length === 0
      ? -1
      : Math.min(heroActiveIndex, searchResults.length - 1)

  const openSearchResult = (tool: Tool) => {
    recordRecentTool(tool.id)
    setHeroSearchQuery('')
    setHeroActiveIndex(0)
    if (tool.isFunctional) {
      navigate(tool.path)
    } else {
      openToolPreview(tool)
    }
  }

  const handleHeroKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (heroSearchQuery) {
        e.preventDefault()
        setHeroSearchQuery('')
        setHeroActiveIndex(0)
      }
      return
    }
    if (!searchResults || searchResults.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHeroActiveIndex((prev) => (prev + 1) % searchResults.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHeroActiveIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length)
    } else if (e.key === 'Enter' && clampedHeroIndex >= 0 && searchResults[clampedHeroIndex]) {
      e.preventDefault()
      openSearchResult(searchResults[clampedHeroIndex])
    }
  }

  const popularTools = useMemo(() => POPULAR_TOOLS.slice(0, 8), [])
  const recentTools = useMemo(() => RECENT_TOOLS.slice(0, 6), [])

  const selectedCategoryObj = useMemo(
    () => PRIMARY_CATEGORIES.find((c) => c.id === activeBrowseCategory) || PRIMARY_CATEGORIES[0],
    [activeBrowseCategory],
  )

  const selectedCategoryTools = useMemo(
    () => getToolsByCategory(ALL_TOOLS, activeBrowseCategory, true).slice(0, 4),
    [activeBrowseCategory],
  )

  const quickAccessItems = [
    { label: 'All Tools', subtitle: `${ALL_TOOLS.length} items`, to: '/tools', icon: Compass },
    { label: 'All Categories', subtitle: `${PRIMARY_CATEGORIES.length} hubs`, to: '/categories', icon: Layers },
    { label: 'Image Tools', subtitle: 'Enhance & export', to: '/categories/image-tools', icon: ImageIcon },
    { label: 'Video Tools', subtitle: 'Inspect & save', to: '/categories/video-tools', icon: Download },
    { label: 'PDF Tools', subtitle: 'Edit & convert', to: '/categories/pdf-documents', icon: FileText },
    { label: 'Audio Tools', subtitle: 'TTS & clean voice', to: '/categories/audio-tools', icon: Mic },
    { label: 'AI Tools', subtitle: 'Prompts & speech', to: '/categories/ai-tools', icon: Sparkles },
    { label: 'Calculators', subtitle: 'EMI, GST & finance', to: '/categories/calculators', icon: Calculator },
  ]

  return (
    <div className="space-y-14 sm:space-y-18 pb-16">
      {/* 1. HERO SECTION WITH SMART KEYBOARD SEARCH */}
      <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-slate-50 via-white to-white dark:from-[#050814] dark:via-[#080D1F] dark:to-[#0B1020] pt-9 pb-12 sm:pt-12 sm:pb-14">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-16 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-tr from-cyan-400/20 to-blue-500/15 dark:from-[#00DFFF]/12 dark:to-blue-600/12 blur-3xl animate-blob-1" />
          <div className="absolute top-6 -right-16 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-br from-purple-400/20 to-fuchsia-400/15 dark:from-[#8B5CF6]/12 dark:to-[#D946EF]/12 blur-3xl animate-blob-2" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up mb-4 flex justify-center">
            <div className="relative inline-flex items-center justify-center rounded-full p-1 bg-gradient-to-tr from-cyan-500/35 via-blue-500/25 to-purple-500/35 shadow-[0_0_24px_rgba(0,223,255,0.2)]">
              <img
                src={`${import.meta.env.BASE_URL}branding/xenova-world-icon.png`}
                alt="Xenova-World official emblem"
                width={80}
                height={80}
                className="h-16 w-16 sm:h-20 sm:w-20 object-contain rounded-full bg-[#050814]"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>

          <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-cyan-200 dark:border-[#00DFFF]/30 bg-cyan-50/90 dark:bg-[#11182D] px-3.5 py-1 text-xs font-semibold text-cyan-800 dark:text-[#00DFFF] mb-4 shadow-2xs">
            <span className="inline-block h-2 w-2 rounded-full bg-cyan-600 dark:bg-[#00DFFF] animate-subtle-pulse" />
            <span>Xenova-World • Explore Beyond Limits. • 100% Free &amp; Private</span>
          </div>

          <h1 className="animate-fade-in-up animation-delay-100 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Everything You Need,{' '}
            <span className="animate-gradient-text">Explore Beyond Limits.</span>
          </h1>

          <p className="animate-fade-in-up animation-delay-200 mt-3.5 text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Find any tool in seconds. Private browser calculators, PDF editors, image enhancement, video inspection, audio studio, AI workflows, and games.
          </p>

          <div className="animate-fade-in-up animation-delay-200 mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/tools" className="xw-btn-primary min-h-[44px] px-6 py-2.5 text-sm shadow-md shadow-blue-600/20">
              <span>Explore All {ALL_TOOLS.length} Tools</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/categories" className="xw-btn-secondary min-h-[44px] px-5 py-2.5 text-sm">
              <Layers className="h-4 w-4 text-blue-600 dark:text-[#00DFFF]" />
              <span>Browse {PRIMARY_CATEGORIES.length} Categories</span>
            </Link>
          </div>

          {/* Smart Instant Search Bar with Keyboard Navigation & Highlighted Results */}
          <div className="animate-fade-in-up animation-delay-300 mt-7 max-w-2xl mx-auto text-left space-y-3">
            <div className="relative flex items-center rounded-2xl bg-white dark:bg-[#0B1020] p-1.5 shadow-xl shadow-slate-200/60 dark:shadow-[0_0_28px_rgba(0,223,255,0.08)] border border-slate-200 dark:border-slate-800 transition-all duration-200 focus-within:border-blue-600 dark:focus-within:border-[#00DFFF] focus-within:ring-4 focus-within:ring-blue-500/15 dark:focus-within:ring-[#00DFFF]/20">
              <Search className="h-5 w-5 text-slate-500 dark:text-[#00DFFF] ml-3 shrink-0" />
              <input
                ref={heroInputRef}
                type="text"
                value={heroSearchQuery}
                onChange={(e) => {
                  setHeroSearchQuery(e.target.value)
                  setHeroActiveIndex(0)
                }}
                onKeyDown={handleHeroKeyDown}
                placeholder={`Try "calculate loan", "edit pdf", "download video", or "convert units"...`}
                aria-label="Global tool search"
                aria-controls="hero-search-results"
                aria-activedescendant={
                  clampedHeroIndex >= 0 && searchResults?.[clampedHeroIndex]
                    ? `hero-opt-${searchResults[clampedHeroIndex].id}`
                    : undefined
                }
                className="w-full min-h-[44px] bg-transparent px-3 py-2 text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none"
              />
              {heroSearchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setHeroSearchQuery('')
                    setHeroActiveIndex(0)
                    heroInputRef.current?.focus()
                  }}
                  aria-label="Clear search query"
                  className="mr-1 inline-flex min-h-[36px] cursor-pointer items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#11182D] border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {!searchResults && (
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Try searching:</span>
                {SUGGESTED_INTENTS.slice(0, 4).map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setHeroSearchQuery(term)
                      setHeroActiveIndex(0)
                    }}
                    className="cursor-pointer rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-[#00DFFF] hover:text-blue-600 dark:hover:text-[#00DFFF] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}

            {/* Instant Search Results Box inside Hero */}
            {searchResults && (
              <div
                id="hero-search-results"
                role="listbox"
                className="xw-panel border-blue-200 dark:border-[#00DFFF]/30 bg-white dark:bg-[#0B1020] p-4 sm:p-5 shadow-lg animate-fade-in space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      Search Results for &ldquo;{heroSearchQuery}&rdquo; ({searchResults.length})
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Use ↑ ↓ to pick a tool and Enter to open immediately
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {searchResults.length > 0 && (
                      <Link
                        to={`/tools?q=${encodeURIComponent(heroSearchQuery.trim())}`}
                        className="text-xs font-semibold text-blue-600 dark:text-[#00DFFF] hover:underline"
                      >
                        View in Directory →
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setHeroSearchQuery('')
                        setHeroActiveIndex(0)
                      }}
                      className="inline-flex min-h-[32px] cursor-pointer items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#11182D]"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Close</span>
                    </button>
                  </div>
                </div>

                {searchResults.length === 0 ? (
                  <div className="py-5 text-center space-y-3">
                    <Filter className="h-8 w-8 text-slate-400 dark:text-slate-500 mx-auto" />
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      No exact match for &ldquo;{heroSearchQuery}&rdquo;
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {SUGGESTED_INTENTS.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => {
                            setHeroSearchQuery(term)
                            setHeroActiveIndex(0)
                          }}
                          className="min-h-[34px] cursor-pointer px-3 py-1 rounded-full text-xs font-medium bg-slate-50 dark:bg-[#11182D] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-500 dark:hover:border-[#00DFFF] transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto space-y-1.5 pr-1">
                    {searchResults.map((tool: Tool, idx: number) => {
                      const isSelected = idx === clampedHeroIndex
                      return (
                        <button
                          key={tool.id}
                          id={`hero-opt-${tool.id}`}
                          role="option"
                          aria-selected={isSelected}
                          type="button"
                          onMouseEnter={() => setHeroActiveIndex(idx)}
                          onClick={() => openSearchResult(tool)}
                          className={`w-full min-h-[54px] cursor-pointer flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-[#16203B] ring-1 ring-blue-500/40 dark:ring-[#00DFFF]/40'
                              : 'hover:bg-slate-50 dark:hover:bg-[#11182D]'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-blue-50 dark:bg-[#11182D] border-blue-100 dark:border-slate-800 text-blue-600 dark:text-[#00DFFF]'
                              }`}
                            >
                              <DynamicIcon name={tool.icon} className="h-4.5 w-4.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                <HighlightedText text={tool.name} query={heroSearchQuery} />
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                                <HighlightedText text={tool.description} query={heroSearchQuery} />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="hidden sm:inline-block rounded-md bg-slate-100 dark:bg-[#11182D] border border-slate-200/70 dark:border-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                              <HighlightedText text={tool.categoryName} query={heroSearchQuery} />
                            </span>
                            <ArrowRight
                              className={`h-4 w-4 ${
                                isSelected ? 'text-blue-600 dark:text-[#00DFFF]' : 'text-slate-400'
                              }`}
                            />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. CATEGORY HUBS SECTION (TOP PRIORITY IMMEDIATELY AFTER HERO) */}
      <section id="category-hubs" aria-labelledby="category-hubs-heading" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-7">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Top-Level Directory"
            title="Explore Category Hubs"
            description="Discover the right tools, organized by category."
            actionLabel="View All Categories"
            actionTo="/categories"
            accentColor="cyan"
          />
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
          {PRIMARY_CATEGORIES.map((category, index) => (
            <ScrollReveal key={category.id} delay={index * 25} direction="up" className="h-full flex flex-col">
              <CategoryCard category={category} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 3. QUICK ACCESS TOOLS & RECENTLY USED HISTORY */}
      <section id="quick-access" aria-labelledby="quick-access-heading" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <RecentToolsBar />

        <div className="xw-panel p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-[#00DFFF]">
                One-Click Destinations
              </span>
              <h2 id="quick-access-heading" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Quick Access Tools &amp; Categories
              </h2>
            </div>
            <Link
              to="/tools"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 dark:text-[#00DFFF] hover:underline shrink-0"
            >
              <span>Browse full directory</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
            {quickAccessItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className="group flex min-h-[72px] flex-col justify-between rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-[#11182D]/70 p-3 hover:border-blue-500/60 dark:hover:border-[#00DFFF]/60 hover:bg-blue-50/50 dark:hover:bg-[#16203B] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-[#0B1020] border border-slate-200/70 dark:border-slate-800 text-blue-600 dark:text-[#00DFFF]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-[#00DFFF] transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <div className="mt-2.5">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {item.subtitle}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. POPULAR TOOLS SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Most Popular Utilities"
            title="Popular Tools"
            description="Everyday calculators, PDF tools, QR generators, video links, and voice utilities ready to run."
            actionLabel="View Popular Tools"
            actionTo="/popular"
            accentColor="amber"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {popularTools.map((tool: Tool, index: number) => (
            <ScrollReveal key={tool.id} delay={index * 25} direction="up" className="h-full flex flex-col">
              <ToolCard tool={tool} onOpenPreview={openToolPreview} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 5. RECENTLY ADDED TOOLS SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Latest Releases"
            title="Recently Added Tools"
            description="Newest utilities including Universal Video Downloader, HEX DRIFT, Audio Transcriber, Image Quality Increaser, and AI Video Prompts."
            actionLabel="View All New Releases"
            actionTo="/new-tools"
            accentColor="emerald"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentTools.map((tool: Tool, index: number) => (
            <ScrollReveal key={tool.id} delay={index * 25} direction="up" className="h-full flex flex-col">
              <ToolCard tool={tool} onOpenPreview={openToolPreview} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 6. TOOLS BY CATEGORY (Curated Tabbed Preview) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Explore by Domain"
            title="Tools by Category"
            description="Switch between categories to preview tools or jump straight into any category hub."
            actionLabel={`Open ${selectedCategoryObj.name}`}
            actionTo={selectedCategoryObj.path}
            accentColor="cyan"
          />
        </ScrollReveal>

        <div className="xw-panel p-5 sm:p-7 space-y-6">
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            {PRIMARY_CATEGORIES.map((cat) => {
              const isSelected = activeBrowseCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveBrowseCategory(cat.id as PrimaryCategoryId)}
                  className={`xw-tab ${isSelected ? 'xw-tab-active' : 'xw-tab-inactive'}`}
                >
                  <CategoryIcon categoryId={cat.id} size="xs" />
                  <span>{cat.name}</span>
                </button>
              )
            })}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedCategoryObj.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {selectedCategoryObj.description} ({getCategoryCountLabel(ALL_TOOLS, selectedCategoryObj)})
              </p>
            </div>
            <Link
              to={selectedCategoryObj.path}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 dark:text-[#00DFFF] hover:underline shrink-0"
            >
              <span>View all in {selectedCategoryObj.name}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {selectedCategoryTools.map((tool: Tool) => (
              <ToolCard key={tool.id} tool={tool} onOpenPreview={openToolPreview} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. HELPFUL USAGE GUIDANCE & WHY CHOOSE XENOVA-WORLD */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal>
          <div className="xw-panel p-6 sm:p-10 shadow-xs space-y-8">
            <SectionHeader
              eyebrow="Simple Workflow & Privacy"
              title="Built for Speed, Privacy, and Precision"
              description="Everything runs fast in your browser — zero signups, zero tracking, zero subscriptions."
              accentColor="cyan"
              centered
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="xw-surface-muted p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 mb-3">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Instant &amp; Fast</h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Tools open right away with interactive workspaces first — no scrolling past walls of text.
                </p>
              </div>

              <div className="xw-surface-muted p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-[#00DFFF] mb-3">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">100% Private</h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Financial numbers, PDFs, voice recordings, and photos stay locally inside your browser.
                </p>
              </div>

              <div className="xw-surface-muted p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 mb-3">
                  <Gift className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Completely Free</h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Zero paywalls, zero locked pro features, and zero forced account registrations.
                </p>
              </div>

              <div className="xw-surface-muted p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 mb-3">
                  <Smartphone className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Mobile Ready</h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Responsive interfaces verified across smartphones, tablets, laptops, and desktops.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 dark:bg-[#11182D] border border-cyan-100 dark:border-slate-800 text-cyan-700 dark:text-[#00DFFF]">
                    <Landmark className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Quick Finance &amp; Document Tasks
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Compute loan schedules in the <Link to="/tools/emi-calculator" className="font-medium text-blue-600 dark:text-[#00DFFF] hover:underline">EMI Calculator</Link>, check tax slabs via the <Link to="/tools/gst-calculator" className="font-medium text-blue-600 dark:text-[#00DFFF] hover:underline">GST Calculator</Link>, generate natural audio with <Link to="/tools/text-to-speech" className="font-medium text-blue-600 dark:text-[#00DFFF] hover:underline">Text to Speech</Link>, or annotate files in our private <Link to="/tools/pdf-editor" className="font-medium text-blue-600 dark:text-[#00DFFF] hover:underline">PDF Editor</Link>.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 dark:bg-[#11182D] border border-purple-100 dark:border-slate-800 text-purple-700 dark:text-[#8B5CF6]">
                    <FileImage className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    How to Get Started in Seconds
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  1. Search any task or tap a Category Hub. 2. Enter values or load files locally inside the interactive tool — such as <Link to="/tools/image-quality-increaser" className="font-medium text-blue-600 dark:text-[#00DFFF] hover:underline">Image Quality Increaser</Link> or <Link to="/tools/video-downloader" className="font-medium text-blue-600 dark:text-[#00DFFF] hover:underline">Universal Video Downloader</Link>. 3. Export or revisit anytime from Recently Used Tools.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
        <ScrollReveal>
          <div className="xw-panel p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xl">
              <HelpCircle className="h-5 w-5 text-blue-600 dark:text-[#00DFFF]" />
              <h2>Frequently Asked Questions</h2>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {HOME_FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx
                return (
                  <div key={faq.question} className="py-2">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="flex min-h-[44px] w-full cursor-pointer items-center justify-between gap-3 py-2 text-left text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-[#00DFFF] transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-blue-600 dark:text-[#00DFFF]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="pb-3 pr-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed animate-fade-in">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}
