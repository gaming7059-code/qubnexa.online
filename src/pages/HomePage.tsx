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
  Calculator,
  Type,
  Wrench,
  Wand2,
  QrCode,
  Play,
} from 'lucide-react'
import { POPULAR_TOOLS, ALL_TOOLS, RECENT_TOOLS } from '../data/toolsData'
import { PRIMARY_CATEGORIES } from '../data/categoriesData'
import { GAMES_LIST } from '../games/types'
import { GameIcon } from '../games/GameIcon'
import { ToolCard } from '../components/common/ToolCard'
import { CategoryCard } from '../components/common/CategoryCard'
import { ScrollReveal } from '../components/common/ScrollReveal'
import { SectionHeader } from '../components/ui/SectionHeader'
import { usePageSEO, createWebSiteSchema } from '../utils/seo'
import type { LayoutContextType } from '../layouts/MainLayout'
import type { Tool } from '../types/tools'

export const HomePage: React.FC = () => {
  const { openToolPreview } = useOutletContext<LayoutContextType>()
  const [heroSearchQuery, setHeroSearchQuery] = useState('')

  usePageSEO({
    title: 'Xenova-World — Explore Beyond Limits',
    description: 'Discover useful online tools, calculators, PDF utilities, creative tools and digital experiences with Xenova-World.',
    canonicalPath: '/',
    keywords: 'Xenova-World, online tools, calculators, EMI calculator, GST calculator, percentage calculator, PDF editor online, text to speech, audio studio, hex drift game, browser games, ai video prompt generator',
    schema: createWebSiteSchema(),
  })

  const categoryShortcuts = [
    { label: 'Daily Utilities', path: '/tools?category=daily-utilities', icon: Zap },
    { label: 'Calculators', path: '/tools?category=calculators', icon: Calculator },
    { label: 'PDF & Docs', path: '/tools?category=pdf-documents', icon: FileText },
    { label: 'Voice & Audio', path: '/tools?category=voice-audio', icon: Mic },
    { label: 'Games', path: '/games', icon: Gamepad2 },
    { label: 'Image & Media', path: '/tools?category=image-media', icon: FileImage },
    { label: 'AI Prompts', path: '/tools?category=ai-creator', icon: Sparkles },
    { label: 'Text & Dev', path: '/tools?category=text-developer', icon: Type },
    { label: 'All Tools', path: '/tools', icon: Wrench },
  ]

  const suggestedSearches = ['QR Code', 'Password', 'Unit Converter', 'Date Calculator', 'GST', 'EMI', 'Speech', 'PDF']

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

  const popularTools = useMemo(() => POPULAR_TOOLS.slice(0, 8), [])
  const recentTools = useMemo(() => RECENT_TOOLS.slice(0, 6), [])
  const previewGames = useMemo(() => GAMES_LIST.slice(0, 4), [])

  return (
    <div className="space-y-14 sm:space-y-18 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cyan-50/75 via-slate-50 to-slate-50 dark:from-[#0B1020] dark:via-[#050814] dark:to-[#050814] pt-10 pb-14 sm:pt-16 sm:pb-20 border-b border-slate-200/80 dark:border-cyan-500/15">
        {/* Subtle Ambient Orbs — Cyan / Electric Blue / Neon Purple */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
          <div className="absolute -top-24 -left-16 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-tr from-cyan-400/25 to-blue-500/20 dark:from-[#00DFFF]/15 dark:to-blue-600/15 blur-3xl animate-blob-1" />
          <div className="absolute top-6 -right-16 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-br from-purple-400/25 to-fuchsia-400/20 dark:from-[#8B5CF6]/15 dark:to-[#D946EF]/15 blur-3xl animate-blob-2" />
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Official Xenova-World Logo Emblem */}
          <div className="animate-fade-in-up mb-5 flex justify-center">
            <div className="relative inline-flex rounded-full p-0.5 bg-gradient-to-r from-[#00DFFF]/70 via-blue-500/60 to-[#8B5CF6]/70 shadow-[0_0_28px_rgba(0,223,255,0.2)]">
              <img
                src={`${import.meta.env.BASE_URL}branding/xenova-world-icon.png`}
                alt="Xenova-World official emblem"
                width={88}
                height={88}
                className="h-18 w-18 sm:h-22 sm:w-22 object-contain rounded-full bg-[#050814]"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>

          {/* Brand Pill */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-cyan-200 dark:border-[#00DFFF]/30 bg-cyan-50/90 dark:bg-[#11182D] px-3.5 py-1 text-xs font-semibold text-cyan-800 dark:text-[#00DFFF] mb-4 shadow-2xs">
            <span className="inline-block h-2 w-2 rounded-full bg-cyan-600 dark:bg-[#00DFFF] animate-subtle-pulse" />
            <span>Xenova-World • Explore Beyond Limits. • 100% Free &amp; Private</span>
          </div>

          {/* Main Headline */}
          <h1 className="animate-fade-in-up animation-delay-100 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Everything You Need,{' '}
            <span className="animate-gradient-text">
              Explore Beyond Limits.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up animation-delay-200 mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover useful online tools, high-precision calculators, client-side PDF utilities, neural audio studio, creative AI workflows, and browser games.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="animate-fade-in-up animation-delay-200 mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/tools"
              className="xw-btn-primary min-h-[44px] px-6 py-2.5 text-sm shadow-md shadow-blue-600/20"
            >
              <span>Explore All {ALL_TOOLS.length} Tools</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/categories"
              className="xw-btn-secondary min-h-[44px] px-5 py-2.5 text-sm"
            >
              <Layers className="h-4 w-4 text-blue-600 dark:text-[#00DFFF]" />
              <span>Browse Categories</span>
            </Link>
          </div>

          {/* Prominent Instant Search Bar */}
          <div className="animate-fade-in-up animation-delay-300 mt-7 max-w-2xl mx-auto">
            <div className="relative flex items-center rounded-2xl bg-white dark:bg-[#0B1020] p-2 shadow-xl shadow-slate-200/60 dark:shadow-[0_0_28px_rgba(0,223,255,0.08)] border border-slate-200 dark:border-slate-800 transition-all duration-200 focus-within:border-blue-600 dark:focus-within:border-[#00DFFF] focus-within:ring-4 focus-within:ring-blue-500/15 dark:focus-within:ring-[#00DFFF]/20">
              <Search className="h-5 w-5 text-slate-500 dark:text-[#00DFFF] ml-3 shrink-0" />
              <input
                type="text"
                value={heroSearchQuery}
                onChange={(e) => setHeroSearchQuery(e.target.value)}
                placeholder="Search 25+ tools & games (QR Code, Password, PDF, GST, Speech)..."
                aria-label="Search all tools and games"
                className="w-full min-h-[42px] bg-transparent px-3 py-2 text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none"
              />
              {heroSearchQuery && (
                <button
                  type="button"
                  onClick={() => setHeroSearchQuery('')}
                  className="mr-1.5 inline-flex min-h-[36px] cursor-pointer items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#11182D] transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Category Quick Badges */}
            <div className="animate-fade-in-up animation-delay-400 mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">Quick:</span>
              {categoryShortcuts.map((cat) => {
                const ShortcutIcon = cat.icon
                return (
                  <Link
                    key={cat.label}
                    to={cat.path}
                    className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-2xs hover:border-blue-500/60 dark:hover:border-[#00DFFF]/60 hover:text-blue-600 dark:hover:text-[#00DFFF] transition-colors duration-200"
                  >
                    <ShortcutIcon className="h-3.5 w-3.5 text-blue-600 dark:text-[#00DFFF]" />
                    <span>{cat.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Quick Metrics / Stats */}
            <div className="animate-fade-in-up animation-delay-500 mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                {ALL_TOOLS.length} Free Tools &amp; Games
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Layers className="h-3.5 w-3.5 text-blue-600 dark:text-[#00DFFF]" />
                8 Dedicated Categories
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Shield className="h-3.5 w-3.5 text-purple-600 dark:text-[#8B5CF6]" />
                Zero Data Tracking
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE SEARCH RESULTS OVERLAY (WHEN SEARCHING IN HERO) */}
      {searchResults && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="xw-panel border-blue-200 dark:border-[#00DFFF]/30 bg-blue-50/35 dark:bg-[#0B1020] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-blue-100 dark:border-slate-800">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Search Results for &ldquo;{heroSearchQuery}&rdquo;
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  Found {searchResults.length} {searchResults.length === 1 ? 'tool or game' : 'tools and games'} matching your search
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHeroSearchQuery('')}
                className="xw-btn-secondary min-h-[38px] px-3 py-1.5 text-xs"
              >
                <X className="h-3.5 w-3.5" />
                <span>Close Results</span>
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="py-8 text-center space-y-4">
                <Filter className="h-10 w-10 text-slate-400 dark:text-slate-500 mx-auto" />
                <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                  No tools found matching &ldquo;{heroSearchQuery}&rdquo;
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Try searching with broader terms or click one of these popular keywords:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {suggestedSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setHeroSearchQuery(term)}
                      className="min-h-[34px] cursor-pointer px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-[#11182D] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-500 dark:hover:border-[#00DFFF] hover:text-blue-600 dark:hover:text-[#00DFFF] shadow-2xs transition-colors"
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
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Most Popular Utilities"
            title="Popular Tools"
            description="The most frequently used calculators, PDF annotators, QR generators, and voice utilities on Xenova-World."
            actionLabel={`View All ${ALL_TOOLS.length} Tools`}
            actionTo="/tools"
            accentColor="amber"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {popularTools.map((tool: Tool, index: number) => (
            <ScrollReveal key={tool.id} delay={index * 35} direction="up" className="h-full flex flex-col">
              <ToolCard tool={tool} onOpenPreview={openToolPreview} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 3. EXPLORE ALL 8 CATEGORIES SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Structured Directory"
            title="Explore Tool Categories"
            description="Browse specialized hubs for Daily Utilities, Calculators, PDF & Documents, Image & Media, Text & Developer, Voice & Audio, AI & Creator Tools, and Games."
            actionLabel="View Category Index"
            actionTo="/categories"
            accentColor="cyan"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {PRIMARY_CATEGORIES.map((category, index) => (
            <ScrollReveal key={category.id} delay={index * 30} direction="up" className="h-full flex flex-col">
              <CategoryCard category={category} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 4. FEATURED FLAGSHIP EXPERIENCES (3 balanced Spotlight Cards) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Studio Spotlights"
            title="Featured Flagships"
            description="Browser-native multimedia, document annotation, and creator workflows with zero installation."
            accentColor="purple"
            centered
          />
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SPOTLIGHT 1 — VOICE & AUDIO */}
            <div className="card-lift group relative flex flex-col justify-between xw-panel p-6 sm:p-7 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#00DFFF] via-blue-500 to-indigo-500" />
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/25">
                    <Mic className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-blue-50 dark:bg-[#11182D] text-blue-700 dark:text-[#00DFFF] border border-blue-200 dark:border-slate-800">
                    3 Studio Tools
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Voice &amp; Audio Studio
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Convert speech offline, clean microphone hum, apply vocal EQ, and dictate live across Indian languages.
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <Link
                    to="/tools/text-to-speech"
                    className="flex min-h-[40px] items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#11182D] hover:bg-blue-50 dark:hover:bg-[#16203B] text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-[#00DFFF] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-blue-600 dark:text-[#00DFFF]" />
                      Text to Speech
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Neural TTS</span>
                  </Link>
                  <Link
                    to="/tools/audio-studio"
                    className="flex min-h-[40px] items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#11182D] hover:bg-blue-50 dark:hover:bg-[#16203B] text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-[#00DFFF] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                      Audio Studio &amp; Cleaner
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">De-Hum</span>
                  </Link>
                  <Link
                    to="/tools/audio-transcriber"
                    className="flex min-h-[40px] items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#11182D] hover:bg-blue-50 dark:hover:bg-[#16203B] text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-[#00DFFF] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Mic className="h-4 w-4 text-cyan-600 dark:text-[#00DFFF]" />
                      Audio Transcriber
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Live Dictation</span>
                  </Link>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <Link
                  to="/tools?category=voice-audio"
                  className="xw-btn-secondary w-full min-h-[42px] px-4 py-2 text-xs sm:text-sm"
                >
                  <span>Explore Voice &amp; Audio</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* SPOTLIGHT 2 — PDF & DOCUMENTS */}
            <div className="card-lift group relative flex flex-col justify-between xw-panel p-6 sm:p-7 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500" />
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-600 text-white shadow-md shadow-rose-600/25">
                    <FileText className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                    2 Document Tools
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  PDF &amp; Document Suite
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Edit, highlight, draw, add signatures, and merge images into crisp PDF documents strictly client-side.
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <Link
                    to="/tools/pdf-editor"
                    className="flex min-h-[40px] items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#11182D] hover:bg-rose-50 dark:hover:bg-[#16203B] text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-300 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FileEdit className="h-4 w-4 text-rose-500" />
                      PDF Editor &amp; Annotator
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Annotate</span>
                  </Link>
                  <Link
                    to="/tools/jpg-to-pdf"
                    className="flex min-h-[40px] items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#11182D] hover:bg-rose-50 dark:hover:bg-[#16203B] text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-300 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FileImage className="h-4 w-4 text-rose-500" />
                      JPG to PDF Converter
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Multi-Image</span>
                  </Link>
                  <div className="px-3 py-2 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Zero server uploads — confidential files never leave your browser memory.
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <Link
                  to="/tools?category=pdf-documents"
                  className="xw-btn-secondary w-full min-h-[42px] px-4 py-2 text-xs sm:text-sm"
                >
                  <span>Explore PDF &amp; Documents</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* SPOTLIGHT 3 — DAILY UTILITIES & AI CREATOR */}
            <div className="card-lift group relative flex flex-col justify-between xw-panel p-6 sm:p-7 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#00DFFF]" />
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/25">
                    <Wand2 className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/60">
                    Creator &amp; Daily
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Media, QR &amp; AI Creators
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Upscale images in real time, build custom QR codes, and structure cinematic AI video prompts.
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <Link
                    to="/tools/image-quality-increaser"
                    className="flex min-h-[40px] items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#11182D] hover:bg-purple-50 dark:hover:bg-[#16203B] text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FileImage className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      Image Quality Increaser
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">4x Upscale</span>
                  </Link>
                  <Link
                    to="/tools/qr-code-generator"
                    className="flex min-h-[40px] items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#11182D] hover:bg-purple-50 dark:hover:bg-[#16203B] text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <QrCode className="h-4 w-4 text-blue-600 dark:text-[#00DFFF]" />
                      QR Code Generator
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">SVG / PNG</span>
                  </Link>
                  <Link
                    to="/tools/ai-video-prompt-generator"
                    className="flex min-h-[40px] items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#11182D] hover:bg-purple-50 dark:hover:bg-[#16203B] text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-fuchsia-500" />
                      AI Video Prompt Generator
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Cinema Prompts</span>
                  </Link>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <Link
                  to="/tools?category=daily-utilities"
                  className="xw-btn-secondary w-full min-h-[42px] px-4 py-2 text-xs sm:text-sm"
                >
                  <span>Explore Daily &amp; AI Tools</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. RECENTLY ADDED UTILITIES SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Newly Released"
            title="Recently Added Utilities"
            description="Brand-new releases across productivity converters, media upscalers, audio processing, and interactive experiences."
            actionLabel="Explore Full Directory"
            actionTo="/tools"
            accentColor="emerald"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentTools.map((tool: Tool, index: number) => (
            <ScrollReveal key={tool.id} delay={index * 40} direction="up" className="h-full flex flex-col">
              <ToolCard tool={tool} onOpenPreview={openToolPreview} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 6. GAMES ARENA PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Instant Browser Arcade"
            title="Games Arena Preview"
            description="Take a break with zero-install browser games featuring synthesized WebAudio and touch-friendly controls."
            actionLabel="Open Games Arena"
            actionTo="/games"
            accentColor="purple"
          />
        </ScrollReveal>

        <ScrollReveal delay={60}>
          <div className="xw-panel relative overflow-hidden p-6 sm:p-8">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#00DFFF] via-blue-500 to-[#D946EF]" />
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 mb-6 border-b border-slate-100 dark:border-slate-800/80">
              <div className="space-y-2 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 dark:bg-[#11182D] border border-cyan-200 dark:border-[#00DFFF]/30 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-cyan-800 dark:text-[#00DFFF]">
                  <Sparkles className="h-3 w-3" />
                  Featured Runner
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  HEX DRIFT: Neon Void Runner &amp; Classic Mini-Games
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Launch our flagship sci-fi survival shooter directly in fullscreen or pick a classic match in Tic-Tac-Toe, Snake, Memory Card Match, and more.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  to="/games/hex-drift"
                  className="xw-btn-primary min-h-[44px] px-5 py-2.5 text-sm"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Launch HEX DRIFT</span>
                </Link>
                <Link
                  to="/games"
                  className="xw-btn-secondary min-h-[44px] px-5 py-2.5 text-sm"
                >
                  <Gamepad2 className="h-4 w-4 text-blue-600 dark:text-[#00DFFF]" />
                  <span>All {GAMES_LIST.length} Games</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {previewGames.map((game) => {
                const targetHref = game.id === 'hex-drift' ? '/games/hex-drift' : `/games?play=${game.id}`
                return (
                  <Link
                    key={game.id}
                    to={targetHref}
                    className="card-lift group flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-[#11182D]/70 p-4 hover:border-blue-500/60 dark:hover:border-[#00DFFF]/60 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <GameIcon gameId={game.id} size="sm" withContainer />
                      <span className="rounded-full bg-white dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                        {game.tag}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#00DFFF] transition-colors">
                        {game.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {game.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-[#00DFFF]">
                      <span>Play Now</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 7. WHY XENOVA-WORLD & PLATFORM OVERVIEW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal>
          <div className="xw-panel p-6 sm:p-10 shadow-xs space-y-8">
            <SectionHeader
              eyebrow="Why Xenova-World"
              title="Built for Speed, Privacy, and Precision"
              description="Everything executes locally in your browser — zero signups, zero tracking, zero subscriptions."
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
                  Tools load immediately and process text, audio, and documents directly on your device.
                </p>
              </div>

              <div className="xw-surface-muted p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-[#00DFFF] mb-3">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">100% Private</h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Your calculations, PDFs, voice recordings, and images never leave your browser session.
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
                  Consistent responsive design tested across smartphones, tablets, laptops, and desktops.
                </p>
              </div>
            </div>

            {/* Platform Overview & Useful Internal Links */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 dark:bg-[#11182D] border border-cyan-100 dark:border-slate-800 text-cyan-700 dark:text-[#00DFFF]">
                    <Landmark className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    What is Xenova-World?
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Xenova-World is a client-side technology suite built to simplify daily workflows. Compute loan schedules with the <Link to="/tools/emi-calculator" className="font-medium text-blue-600 dark:text-[#00DFFF] hover:underline">EMI Calculator</Link>, verify tax slabs via our <Link to="/tools/gst-calculator" className="font-medium text-blue-600 dark:text-[#00DFFF] hover:underline">GST Calculator</Link>, synthesize voice with <Link to="/tools/text-to-speech" className="font-medium text-blue-600 dark:text-[#00DFFF] hover:underline">Text to Speech</Link>, or annotate documents in the browser <Link to="/tools/pdf-editor" className="font-medium text-blue-600 dark:text-[#00DFFF] hover:underline">PDF Editor</Link>.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 dark:bg-[#11182D] border border-purple-100 dark:border-slate-800 text-purple-700 dark:text-[#8B5CF6]">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Fast, Private &amp; Accessible Anywhere
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  From sharpening visuals with the <Link to="/tools/image-quality-increaser" className="font-medium text-blue-600 dark:text-[#00DFFF] hover:underline">Image Quality Increaser</Link> and checking savings with the <Link to="/tools/discount-calculator" className="font-medium text-blue-600 dark:text-[#00DFFF] hover:underline">Discount Calculator</Link> to cleaning audio in <Link to="/tools/audio-studio" className="font-medium text-blue-600 dark:text-[#00DFFF] hover:underline">Audio Studio</Link>, calculating spans with the <Link to="/tools/date-difference-calculator" className="font-medium text-blue-600 dark:text-[#00DFFF] hover:underline">Date Difference Calculator</Link>, or playing <Link to="/games/hex-drift" className="font-medium text-blue-600 dark:text-[#00DFFF] hover:underline">HEX DRIFT</Link>, every experience stays fast and private.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}
