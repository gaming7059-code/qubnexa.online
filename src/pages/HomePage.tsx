import React, { useState, useMemo } from 'react'
import { useOutletContext, Link } from 'react-router-dom'
import {
  Search,
  ArrowRight,
  Mic,
  FileText,
  Gamepad2,
  Sparkles,
  SlidersHorizontal,
  Volume2,
  FileEdit,
  FileImage,
  Zap,
  Shield,
  Gift,
  Smartphone,
  Landmark,
  CheckCircle2,
  Layers,
  Filter,
  X,
  Clock,
  Flame,
} from 'lucide-react'
import { POPULAR_TOOLS, ALL_TOOLS, RECENT_TOOLS } from '../data/toolsData'
import { CATEGORIES, PRIMARY_CATEGORIES } from '../data/categoriesData'
import { ToolCard } from '../components/common/ToolCard'
import { CategoryCard } from '../components/common/CategoryCard'
import { CategoryIcon } from '../components/common/CategoryIcon'
import { ScrollReveal } from '../components/common/ScrollReveal'
import { usePageSEO, createWebSiteSchema } from '../utils/seo'
import type { LayoutContextType } from '../layouts/MainLayout'
import type { Tool, CategoryId } from '../types/tools'

export const HomePage: React.FC = () => {
  const { openToolPreview } = useOutletContext<LayoutContextType>()
  const [heroSearchQuery, setHeroSearchQuery] = useState('')
  const [directoryCategory, setDirectoryCategory] = useState<CategoryId>('all')

  usePageSEO({
    title: 'SmartTools India — Free Online Calculators, PDF Tools, Audio Studio & Games',
    description: 'All-in-one free online tools platform for India: loan EMI & GST calculators, client-side PDF editor, neural text-to-speech, audio cleaner, AI prompts, and arcade games. 100% free, private & browser-based.',
    canonicalPath: '/',
    keywords: 'smarttools india, free online tools, emi calculator, gst calculator india, percentage calculator, pdf editor online, text to speech, audio studio, hex drift game, browser games, ai video prompt generator',
    schema: createWebSiteSchema(),
  })

  // Quick category shortcuts for hero
  const categoryShortcuts = [
    { label: '⚡ Daily Utilities', path: '/tools?category=daily-utilities' },
    { label: '🧮 Calculators', path: '/tools?category=calculators' },
    { label: '📄 PDF & Docs', path: '/tools?category=pdf-documents' },
    { label: '🎙️ Voice & Audio', path: '/tools?category=voice-audio' },
    { label: '🎮 Games', path: '/games' },
    { label: '🖼️ Image & Media', path: '/tools?category=image-media' },
    { label: '✨ AI Prompts', path: '/tools?category=ai-creator' },
    { label: '📝 Text & Dev', path: '/tools?category=text-developer' },
    { label: '🛠️ All Tools', path: '/tools' },
  ]

  // Suggested search terms for empty states
  const suggestedSearches = ['QR Code', 'Password', 'Unit Converter', 'Date Calculator', 'GST', 'EMI', 'Speech', 'PDF']

  // Live filter if user types in the hero search box
  const searchResults = useMemo(() => {
    const q = heroSearchQuery.trim().toLowerCase()
    if (!q) return null

    return ALL_TOOLS.filter((tool) => {
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.categoryName.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q))
      )
    })
  }, [heroSearchQuery])

  // Top popular tools across everyday domains
  const popularTools = useMemo(() => {
    return POPULAR_TOOLS.slice(0, 8)
  }, [])

  // Recently added flagship tools
  const recentTools = useMemo(() => {
    return RECENT_TOOLS
  }, [])

  // Tools for the "All Tools Directory" section filtered by selected category tab
  const directoryTools = useMemo(() => {
    if (directoryCategory === 'all') return ALL_TOOLS
    return ALL_TOOLS.filter((tool) => {
      if (tool.categoryId === directoryCategory) return true
      if (tool.categoryIds && tool.categoryIds.includes(directoryCategory)) return true
      return false
    })
  }, [directoryCategory])

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50 to-slate-50 dark:from-slate-900/50 dark:via-slate-950 dark:to-slate-950 pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/60 dark:border-slate-800">
        {/* Ambient Moving Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
          <div className="absolute -top-20 -left-16 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-tr from-blue-400/35 to-indigo-400/30 dark:from-blue-600/25 dark:to-cyan-500/25 blur-2xl animate-blob-1" />
          <div className="absolute top-10 -right-16 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-br from-indigo-300/35 to-sky-300/30 dark:from-indigo-600/25 dark:to-blue-700/25 blur-2xl animate-blob-2" />
          <div className="absolute -bottom-20 left-1/3 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-gradient-to-r from-cyan-300/25 to-blue-300/25 dark:from-blue-900/20 dark:to-indigo-950/25 blur-2xl animate-blob-3" />
        </div>

        {/* Ambient Floating Glass Accents */}
        <div className="hidden xl:flex absolute top-16 left-8 items-center gap-2 rounded-full border border-blue-200/80 dark:border-blue-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 shadow-sm animate-float-slow text-xs font-semibold text-blue-700 dark:text-blue-300 pointer-events-none">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span>🎙️ AI Audio &amp; Voice Studio</span>
        </div>
        <div className="hidden xl:flex absolute top-32 right-8 items-center gap-2 rounded-full border border-purple-200/80 dark:border-purple-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 shadow-sm animate-float-reverse text-xs font-semibold text-purple-700 dark:text-purple-300 pointer-events-none">
          <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
          <span>⚡ 100% Client-Side &amp; Private</span>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Trust Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-900/50 bg-blue-50/90 dark:bg-blue-950/60 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-6 shadow-2xs backdrop-blur-xs">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-subtle-pulse"></span>
            100% Free • No Sign-Up Required • Private &amp; Browser-Based
          </div>

          {/* Main Headline */}
          <h1 className="animate-fade-in-up animation-delay-100 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Everything You Need,{' '}
            <span className="animate-gradient-text">
              All in One Place
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up animation-delay-200 mt-4 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Free online calculators, client-side PDF tools, audio studio, photo enhancers, AI prompt generators, and browser games — simple, fast, and completely private.
          </p>

          {/* Prominent Instant Search Bar */}
          <div className="animate-fade-in-up animation-delay-300 mt-8 max-w-2xl mx-auto">
            <div className="relative flex items-center rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-200 dark:border-slate-800 transition-all duration-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/15 dark:focus-within:ring-blue-500/20">
              <Search className="h-5 w-5 text-slate-400 dark:text-slate-500 ml-3 shrink-0 transition-colors" />
              <input
                type="text"
                value={heroSearchQuery}
                onChange={(e) => setHeroSearchQuery(e.target.value)}
                placeholder="Search 25+ free tools & games (e.g., QR Code, Password, Units, Date, GST, EMI, Speech)..."
                aria-label="Search all tools and games"
                className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
              />
              {heroSearchQuery && (
                <button
                  type="button"
                  onClick={() => setHeroSearchQuery('')}
                  className="mr-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Category Quick Badges */}
            <div className="animate-fade-in-up animation-delay-400 mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mr-1">Quick:</span>
              {categoryShortcuts.map((cat) => (
                <Link
                  key={cat.label}
                  to={cat.path}
                  className="rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-2xs hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            {/* Quick Metrics / Stats */}
            <div className="animate-fade-in-up animation-delay-500 mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                25 Free Tools &amp; Games
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Layers className="h-3.5 w-3.5 text-blue-500" />
                8 Dedicated Categories
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Shield className="h-3.5 w-3.5 text-purple-500" />
                Zero Data Tracking
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE SEARCH RESULTS OVERLAY (WHEN SEARCHING IN HERO) */}
      {searchResults && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="rounded-3xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-blue-100 dark:border-blue-900/40">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Search Results for &ldquo;{heroSearchQuery}&rdquo;
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Found {searchResults.length} {searchResults.length === 1 ? 'tool or game' : 'tools and games'} matching your search
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHeroSearchQuery('')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 shadow-2xs"
              >
                <X className="h-3.5 w-3.5" />
                <span>Close Results</span>
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="py-8 text-center space-y-4">
                <Filter className="h-10 w-10 text-slate-400 dark:text-slate-500 mx-auto" />
                <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                  No tools found matching &ldquo;{heroSearchQuery}&rdquo;
                </p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Try searching with broader terms or click one of these popular keywords:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {suggestedSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setHeroSearchQuery(term)}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 shadow-2xs transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {searchResults.map((tool: Tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    onOpenPreview={openToolPreview}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 2. POPULAR TOOLS SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span>Most Popular Utilities</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Popular Tools
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                The most frequently used calculators, PDF annotators, and voice utilities across India.
              </p>
            </div>

            <Link
              to="/tools"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors group shrink-0"
            >
              <span>View All {ALL_TOOLS.length} Tools</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {popularTools.map((tool: Tool, index: number) => (
            <ScrollReveal key={tool.id} delay={index * 40} direction="up" className="h-full flex flex-col">
              <ToolCard
                tool={tool}
                onOpenPreview={openToolPreview}
              />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 3. RECENTLY ADDED TOOLS & GAMES SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                <Clock className="h-3.5 w-3.5 text-emerald-500" />
                <span>Newly Released Flagships</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Recently Added Tools &amp; Games
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                Explore our brand-new releases: Hex Drift arcade game, browser photo upscaler, audio effects studio, and AI prompt builder.
              </p>
            </div>

            <Link
              to="/tools"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors group shrink-0"
            >
              <span>Explore All Tools</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentTools.map((tool: Tool, index: number) => (
            <ScrollReveal key={tool.id} delay={index * 50} direction="up" className="h-full flex flex-col">
              <ToolCard
                tool={tool}
                onOpenPreview={openToolPreview}
              />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 4. FEATURED CATEGORIES SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Category Highlights
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-3">
              Explore Our Top Categories
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Private, browser-based tools designed to help creators, students, and professionals get things done with zero wait time.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CARD 1 — VOICE TOOLS */}
            <div className="card-lift group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-md hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/25 transition-all duration-300 overflow-hidden cursor-pointer">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500" />
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-lg group-hover:shadow-blue-500/40 transition-all duration-300">
                    <Mic className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    3 Studio Tools
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Voice &amp; Audio
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Convert speech, clean audio hum, record vocal tracks, and dictate in Indian languages.
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <Link
                    to="/tools/text-to-speech"
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Volume2 className="h-3.5 w-3.5 text-blue-500" />
                      Text to Speech
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">Neural TTS</span>
                  </Link>
                  <Link
                    to="/tools/audio-studio"
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-500" />
                      Audio Studio &amp; Cleaner
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">De-Hum</span>
                  </Link>
                  <Link
                    to="/tools/audio-transcriber"
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Mic className="h-3.5 w-3.5 text-cyan-500" />
                      Audio Transcriber
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">Live Dictation</span>
                  </Link>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/tools?category=voice-audio"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-600 dark:hover:bg-blue-600 text-blue-700 dark:text-blue-300 hover:text-white dark:hover:text-white px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200"
                >
                  <span>Explore Voice &amp; Audio</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* CARD 2 — PDF & DOCUMENTS */}
            <div className="card-lift group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-md hover:border-rose-500 dark:hover:border-rose-400 hover:shadow-2xl hover:shadow-rose-500/20 dark:hover:shadow-rose-500/25 transition-all duration-300 overflow-hidden cursor-pointer">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-red-500 to-amber-500" />
              <div className="absolute inset-0 bg-gradient-to-b from-rose-500/20 via-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 text-white shadow-md shadow-rose-500/30 group-hover:scale-115 group-hover:-rotate-3 group-hover:shadow-lg group-hover:shadow-rose-500/40 transition-all duration-300">
                    <FileText className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    2 PDF Tools
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  PDF &amp; Documents
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Annotate, highlight, draw, and convert image files to PDF completely inside your browser.
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <Link
                    to="/tools/pdf-editor"
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FileEdit className="h-3.5 w-3.5 text-rose-500" />
                      PDF Editor &amp; Annotator
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">Annotate</span>
                  </Link>
                  <Link
                    to="/tools/jpg-to-pdf"
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FileImage className="h-3.5 w-3.5 text-rose-500" />
                      JPG to PDF Converter
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">Multi-Image</span>
                  </Link>
                  <div className="p-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    ✏️ Merge photos into clean PDF documents with custom margins and zero server uploads.
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/tools?category=pdf-documents"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-600 dark:hover:bg-rose-600 text-rose-700 dark:text-rose-300 hover:text-white dark:hover:text-white px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200"
                >
                  <span>Explore PDF &amp; Documents</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* CARD 3 — GAMES */}
            <div className="card-lift group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-md hover:border-emerald-500 dark:hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/25 transition-all duration-300 overflow-hidden cursor-pointer">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/20 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30 group-hover:scale-115 group-hover:-rotate-3 group-hover:shadow-lg group-hover:shadow-emerald-500/40 transition-all duration-300">
                    <Gamepad2 className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    6 Free Games
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Games &amp; Arcade
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Relax and play responsive browser mini-games. Touch controls, high scores, zero installs.
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <Link
                    to="/games/hex-drift"
                    className="flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-cyan-50/80 to-indigo-50/80 dark:from-cyan-950/50 dark:to-indigo-950/50 hover:from-cyan-100 hover:to-indigo-100 dark:hover:from-cyan-900/60 dark:hover:to-indigo-900/60 text-xs font-semibold text-cyan-800 dark:text-cyan-300 transition-all border border-cyan-200/70 dark:border-cyan-800/70"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                      HEX DRIFT (Neon Runner)
                    </span>
                    <span className="text-[10px] text-cyan-700 dark:text-cyan-300 font-bold uppercase">New</span>
                  </Link>
                  <Link
                    to="/games?play=tic-tac-toe"
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <span>Tic-Tac-Toe</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Play AI</span>
                  </Link>
                  <Link
                    to="/games?play=snake"
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <span>Retro Snake Game</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Arcade</span>
                  </Link>
                  <Link
                    to="/games?play=memory-match"
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <span>Memory Card Match</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Brain Test</span>
                  </Link>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/games"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white dark:hover:text-white px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200"
                >
                  <span>Play Games Arena</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* CARD 4 — CALCULATORS */}
            <div className="card-lift group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-md hover:border-emerald-500 dark:hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/25 transition-all duration-300 overflow-hidden cursor-pointer">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/20 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30 group-hover:scale-115 group-hover:-rotate-3 group-hover:shadow-lg group-hover:shadow-emerald-500/40 transition-all duration-300">
                    <Landmark className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    9 Calculators
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Calculators &amp; Finance
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Accurate Indian loan EMI, GST slabs, take-home salary, percentages, and age computation.
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <Link
                    to="/tools/emi-calculator"
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <span>EMI Loan Calculator</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Home &amp; Car</span>
                  </Link>
                  <Link
                    to="/tools/gst-calculator"
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <span>GST Calculator</span>
                    <span className="text-[10px] text-slate-400 font-semibold">CGST / SGST</span>
                  </Link>
                  <Link
                    to="/tools/salary-calculator"
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <span>Salary Calculator</span>
                    <span className="text-[10px] text-slate-400 font-semibold">In-Hand CTC</span>
                  </Link>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/tools?category=calculators"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white dark:hover:text-white px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200"
                >
                  <span>Explore Calculators</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. EXPLORE ALL 7 CATEGORIES SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Structured Directory
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                All 7 Tool Categories
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                Choose from our specialized categories: Calculators, PDF &amp; Documents, Image &amp; Media, Text &amp; Developer, Voice &amp; Audio, AI &amp; Creator Tools, and Games.
              </p>
            </div>

            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors group shrink-0"
            >
              <span>View Category Index</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {PRIMARY_CATEGORIES.map((category, index) => (
            <ScrollReveal key={category.id} delay={index * 35} direction="up" className="h-full flex flex-col">
              <CategoryCard category={category} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 6. COMPLETE TOOLS DIRECTORY WITH INTERACTIVE CATEGORY TABS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Tools Directory
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                All Online Tools &amp; Games
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Filter by category to explore every free tool available on SmartTools India.
              </p>
            </div>

            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Showing {directoryTools.length} of {ALL_TOOLS.length} utilities
            </div>
          </div>
        </ScrollReveal>

        {/* Interactive Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = directoryCategory === cat.id
            const count = cat.id === 'all'
              ? ALL_TOOLS.length
              : ALL_TOOLS.filter((t) => t.categoryId === cat.id || (t.categoryIds && t.categoryIds.includes(cat.id))).length

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setDirectoryCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 select-none active:scale-95 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <CategoryIcon categoryId={cat.id} size="xs" />
                <span>{cat.name}</span>
                <span className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {directoryTools.map((tool: Tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onOpenPreview={openToolPreview}
            />
          ))}
        </div>
      </section>

      {/* 7. WHY SMARTTOOLS INDIA SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 shadow-xs">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Why SmartTools India
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                Simple Tools. Zero Friction.
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Everything runs directly in your web browser with zero logins, zero tracking, and zero hidden subscriptions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Benefit 1 */}
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/50 p-5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl dark:hover:shadow-blue-950/40 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">⚡ Instant &amp; Fast</h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Tools load immediately and process text, audio, and documents on your device with hardware acceleration.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/50 p-5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl dark:hover:shadow-blue-950/40 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">🔒 100% Private</h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Your calculations, PDFs, voice recordings, and images stay strictly on your local browser.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/50 p-5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl dark:hover:shadow-blue-950/40 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  <Gift className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">🆓 Completely Free</h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Zero subscriptions, zero paywalls, zero premium tiers, and zero forced account registrations.
                </p>
              </div>

              {/* Benefit 4 */}
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/50 p-5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl dark:hover:shadow-blue-950/40 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  <Smartphone className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">📱 Mobile Friendly</h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Optimized for seamless operation across smartphones, tablets, laptops, and desktop screens.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 8. SEO & PLATFORM OVERVIEW SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <ScrollReveal>
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-10 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">Platform Overview</span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  What is SmartTools India?
                </h2>
              </div>
            </div>
            <div className="space-y-3.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                SmartTools India is a dedicated, lightning-fast digital utility platform built to simplify everyday tasks for Indian internet users. Whether you are calculating equated monthly installments with the <Link to="/tools/emi-calculator" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">EMI Calculator</Link>, adding or extracting tax using our <Link to="/tools/gst-calculator" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">GST Calculator</Link>, converting speech with <Link to="/tools/text-to-speech" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Text to Speech</Link>, annotating documents in our client-side <Link to="/tools/pdf-editor" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">PDF Editor</Link>, upscaling photos in the <Link to="/tools/image-quality-increaser" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Image Quality Increaser</Link>, or playing arcade runs in <Link to="/games/hex-drift" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">HEX DRIFT: Neon Void Runner</Link>, SmartTools India delivers instant, accurate results directly in your web browser.
              </p>
              <p>
                Unlike conventional online tools cluttered with intrusive advertisements, forced email logins, or sluggish cloud processing, every utility on SmartTools India is engineered to run 100% client-side. This guarantees that your confidential documents, audio clips, and personal financial figures never leave your device.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">Why Use Our Platform</span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Fast, Private and Completely Free Web Utilities
                </h2>
              </div>
            </div>
            <div className="space-y-3.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                In our digital daily routines, fast and accurate online tools are essential. Whether you want to calculate discounts while festival shopping with our <Link to="/tools/discount-calculator" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Discount Calculator</Link>, compute date intervals with the <Link to="/tools/date-difference-calculator" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Date Difference Calculator</Link>, boost voice volume and clean microphone hum with the <Link to="/tools/audio-studio" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Audio Studio</Link>, or relax with our <Link to="/games" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Free Browser Games</Link>, SmartTools India is built to give you frictionless results on mobile and desktop.
              </p>
              <p>
                Bookmark SmartTools India to access instant utilities on your phone, tablet, or laptop whenever you need them.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}
