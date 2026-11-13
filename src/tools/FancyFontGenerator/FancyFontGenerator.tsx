import React, { useState, useMemo, useCallback, useId } from 'react'
import {
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Search,
  X,
  Layers,
  FileCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import {
  FANCY_FONT_STYLES,
  DEFAULT_SAMPLE_TEXT,
} from '../../utils/fancyFont'

type CategoryFilter = 'All' | 'Modern & Clean' | 'Classic & Gothic' | 'Enclosed & Bubble' | 'Decorative & Effects' | 'Sub & Super'

async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fall through to fallback below
    }
  }
  if (typeof document !== 'undefined' && document.createElement && document.execCommand) {
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      textArea.setAttribute('readonly', '')
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      return successful
    } catch {
      return false
    }
  }
  return false
}

export const FancyFontGenerator: React.FC = () => {
  const inputId = useId()
  const [inputText, setInputText] = useState<string>(DEFAULT_SAMPLE_TEXT)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedAll, setCopiedAll] = useState<boolean>(false)
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleCopy = useCallback(async (text: string, id: string) => {
    const success = await copyTextToClipboard(text)
    if (success) {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1800)
    }
  }, [])

  const handleCopyAll = useCallback(async () => {
    if (!inputText) return
    const allText = FANCY_FONT_STYLES.map((style) => {
      const res = style.transform(inputText)
      return `[${style.name}]\n${res.output}`
    }).join('\n\n')

    const success = await copyTextToClipboard(allText)
    if (success) {
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2000)
    }
  }, [inputText])

  const handleClear = () => {
    setInputText('')
  }

  const handleReset = () => {
    setInputText(DEFAULT_SAMPLE_TEXT)
    setActiveCategory('All')
    setSearchQuery('')
  }

  const handleSample = () => {
    setInputText('QUBNEXA • Explore. Create. Simplify. ✨ 2026')
  }

  // Filter styles by category and search
  const filteredStyles = useMemo(() => {
    return FANCY_FONT_STYLES.filter((style) => {
      const matchesCat = activeCategory === 'All' || style.category === activeCategory
      const matchesSearch =
        searchQuery === '' ||
        style.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        style.category.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCat && matchesSearch
    })
  }, [activeCategory, searchQuery])

  // Count metrics
  const charCount = inputText.length
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0

  return (
    <div className="w-full space-y-8">
      {/* Top Input Card */}
      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor={inputId} className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
            Type or Paste Text Below
          </label>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>{charCount} characters</span>
            <span>•</span>
            <span>{wordCount} words</span>
          </div>
        </div>

        <div className="relative">
          <textarea
            id={inputId}
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your text here (e.g. Hello World or your Instagram bio)..."
            className="w-full px-4 py-3 bg-slate-50 dark:bg-[#11182D] border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-base resize-y transition-colors pr-10"
          />
          {inputText && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear text input"
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#11182D] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Try Sample</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#11182D] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#11182D] hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-700 dark:text-slate-300 hover:text-rose-600 text-xs font-medium transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={handleCopyAll}
              disabled={!inputText}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-xs transition-all cursor-pointer disabled:opacity-40"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied All Styles!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All 35+ Styles</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills & Search Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {(
            [
              'All',
              'Modern & Clean',
              'Classic & Gothic',
              'Enclosed & Bubble',
              'Decorative & Effects',
              'Sub & Super',
            ] as CategoryFilter[]
          ).map((cat) => {
            const isSelected = activeCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500'
                    : 'bg-white dark:bg-[#0B0F19] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Style Search Input */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search styles..."
            className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Styles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>Showing {filteredStyles.length} Unicode styles</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            100% Copyable Unicode
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStyles.map((style) => {
            const textToTransform = inputText || style.samplePreview
            const { output, unsupportedChars } = style.transform(textToTransform)
            const isCopied = copiedId === style.id

            return (
              <div
                key={style.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] p-4 hover:border-emerald-500/50 dark:hover:border-emerald-400/40 shadow-xs transition-all group"
              >
                <div>
                  {/* Style Header */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      {style.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400">
                      {style.category}
                    </span>
                  </div>

                  {/* Output Preview Area */}
                  <div className="min-h-[52px] py-2 px-3 rounded-xl bg-slate-50 dark:bg-[#11182D] border border-slate-100 dark:border-slate-800/80 font-normal text-slate-900 dark:text-slate-100 text-base break-words select-all">
                    {output}
                  </div>

                  {/* Partial Character Warning (if any) */}
                  {unsupportedChars.length > 0 && (
                    <div className="mt-1.5 flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>
                        Characters kept as original (no Unicode equivalent):{' '}
                        <span className="font-mono">{unsupportedChars.slice(0, 5).join(' ')}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Action */}
                <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleCopy(output, style.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-[#11182D] text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Feature Highlights Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#11182D]/70 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm mb-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Universal Social Compatibility</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            All styles are actual Unicode Mathematical Alphanumerics and symbols that paste into Instagram bio, TikTok, Twitter/X, Discord, YouTube, and WhatsApp.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#11182D]/70 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-1.5">
            <Layers className="w-4 h-4" />
            <span>35+ Distinct Text Aesthetics</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            From classic Gothic Fraktur and Cursive Script to Cyberpunk Zalgo, Bubble text, and Vaporwave fullwidth typography.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#11182D]/70 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-sm mb-1.5">
            <FileCheck className="w-4 h-4" />
            <span>Emoji & Multi-Byte Safe</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Uses Unicode code-point segmentation so your emoji, symbols, and non-Latin scripts remain crisp and uncorrupted.
          </p>
        </div>
      </div>
    </div>
  )
}
