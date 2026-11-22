import React, { useState, useMemo } from 'react'
import {
  Link as LinkIcon,
  Copy,
  Check,
  ExternalLink,
  FileSpreadsheet,
  Sparkles,
  Share2,
  Globe,
  Sliders,
  CheckSquare,
  Square,
} from 'lucide-react'

interface PlatformChannelPreset {
  id: string
  name: string
  source: string
  medium: string
  defaultContent?: string
}

const POPULAR_CHANNELS: PlatformChannelPreset[] = [
  { id: 'google_search', name: 'Google Ads (Search)', source: 'google', medium: 'cpc' },
  { id: 'google_display', name: 'Google Ads (Display)', source: 'google', medium: 'display' },
  { id: 'meta_feed', name: 'Meta / Facebook (Feed)', source: 'facebook', medium: 'paid-social' },
  { id: 'instagram_reels', name: 'Instagram (Reels / Stories)', source: 'instagram', medium: 'paid-social' },
  { id: 'linkedin_post', name: 'LinkedIn (Organic)', source: 'linkedin', medium: 'social' },
  { id: 'linkedin_ads', name: 'LinkedIn (Sponsored)', source: 'linkedin', medium: 'paid-social' },
  { id: 'twitter_x', name: 'Twitter / X', source: 'twitter', medium: 'social' },
  { id: 'tiktok_ads', name: 'TikTok Ads', source: 'tiktok', medium: 'paid-video' },
  { id: 'email_newsletter', name: 'Email Newsletter', source: 'newsletter', medium: 'email' },
  { id: 'youtube_desc', name: 'YouTube (Description)', source: 'youtube', medium: 'video' },
  { id: 'reddit_community', name: 'Reddit', source: 'reddit', medium: 'community' },
  { id: 'affiliate_partner', name: 'Affiliate Partner', source: 'affiliate', medium: 'referral' },
]

interface GeneratedUtmItem {
  id: string
  originalUrl: string
  source: string
  medium: string
  campaign: string
  term: string
  content: string
  finalUrl: string
  isValid: boolean
  error?: string
}

export const BulkUtmBuilder: React.FC = () => {
  // Modes: 'matrix' (One/Few URLs x Multi-Channels) or 'bulk' (List of URLs with shared UTMs)
  const [mode, setMode] = useState<'matrix' | 'bulk'>('matrix')

  // Common Parameters
  const [campaign, setCampaign] = useState('spring_launch')
  const [term, setTerm] = useState('')
  const [content, setContent] = useState('')

  // Sanitization Options
  const [forceLowercase, setForceLowercase] = useState(true)
  const [replaceSpacesWith, setReplaceSpacesWith] = useState<'-' | '_' | '%20'>('-')
  const [stripTrailingSlash, setStripTrailingSlash] = useState(false)

  // Mode 1: Matrix State
  const [matrixUrlsText, setMatrixUrlsText] = useState('https://qubnexa.online\nhttps://qubnexa.online/tools')
  const [selectedChannelIds, setSelectedChannelIds] = useState<string[]>([
    'google_search',
    'meta_feed',
    'linkedin_ads',
    'email_newsletter',
  ])

  // Mode 2: Bulk List State
  const [bulkUrlsText, setBulkUrlsText] = useState(
    'https://qubnexa.online/tools/image-converter\nhttps://qubnexa.online/tools/qr-code-generator\nhttps://qubnexa.online/tools/pdf-merger'
  )
  const [bulkSource, setBulkSource] = useState('newsletter')
  const [bulkMedium, setBulkMedium] = useState('email')

  // UI state
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copyAllStatus, setCopyAllStatus] = useState<string | null>(null)

  // Generate Items
  const items: GeneratedUtmItem[] = useMemo(() => {
    const cleanParam = (val: string): string => {
      let cleaned = val.trim()
      if (forceLowercase) cleaned = cleaned.toLowerCase()
      if (replaceSpacesWith === '-') cleaned = cleaned.replace(/\s+/g, '-')
      else if (replaceSpacesWith === '_') cleaned = cleaned.replace(/\s+/g, '_')
      return cleaned
    }

    const buildTaggedUrl = (
      rawUrl: string,
      uSource: string,
      uMedium: string,
      uCampaign: string,
      uTerm: string,
      uContent: string
    ): { url: string; isValid: boolean; error?: string } => {
      let trimmed = rawUrl.trim()
      if (!trimmed) return { url: '', isValid: false, error: 'Empty URL' }

      if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        trimmed = 'https://' + trimmed
      }

      try {
        const parsed = new URL(trimmed)
        if (stripTrailingSlash && parsed.pathname.endsWith('/') && parsed.pathname.length > 1) {
          parsed.pathname = parsed.pathname.slice(0, -1)
        }

        if (uSource) parsed.searchParams.set('utm_source', cleanParam(uSource))
        if (uMedium) parsed.searchParams.set('utm_medium', cleanParam(uMedium))
        if (uCampaign) parsed.searchParams.set('utm_campaign', cleanParam(uCampaign))
        if (uTerm) parsed.searchParams.set('utm_term', cleanParam(uTerm))
        if (uContent) parsed.searchParams.set('utm_content', cleanParam(uContent))

        return { url: parsed.toString(), isValid: true }
      } catch {
        return { url: trimmed, isValid: false, error: 'Invalid URL structure' }
      }
    }

    const results: GeneratedUtmItem[] = []

    if (mode === 'matrix') {
      const urls = matrixUrlsText
        .split('\n')
        .map((u) => u.trim())
        .filter(Boolean)
      const channels = POPULAR_CHANNELS.filter((ch) => selectedChannelIds.includes(ch.id))

      urls.forEach((u, uIdx) => {
        channels.forEach((ch, chIdx) => {
          const finalContent = content || ch.defaultContent || ''
          const { url, isValid, error } = buildTaggedUrl(u, ch.source, ch.medium, campaign, term, finalContent)
          results.push({
            id: `matrix_${uIdx}_${chIdx}`,
            originalUrl: u,
            source: ch.source,
            medium: ch.medium,
            campaign,
            term,
            content: finalContent,
            finalUrl: url,
            isValid,
            error,
          })
        })
      })
    } else {
      const urls = bulkUrlsText
        .split('\n')
        .map((u) => u.trim())
        .filter(Boolean)

      urls.forEach((u, idx) => {
        const { url, isValid, error } = buildTaggedUrl(u, bulkSource, bulkMedium, campaign, term, content)
        results.push({
          id: `bulk_${idx}`,
          originalUrl: u,
          source: bulkSource,
          medium: bulkMedium,
          campaign,
          term,
          content,
          finalUrl: url,
          isValid,
          error,
        })
      })
    }

    return results
  }, [
    mode,
    matrixUrlsText,
    selectedChannelIds,
    bulkUrlsText,
    bulkSource,
    bulkMedium,
    campaign,
    term,
    content,
    forceLowercase,
    replaceSpacesWith,
    stripTrailingSlash,
  ])

  // Channel toggle
  const toggleChannel = (id: string) => {
    setSelectedChannelIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const selectAllChannels = () => {
    setSelectedChannelIds(POPULAR_CHANNELS.map((c) => c.id))
  }

  const deselectAllChannels = () => {
    setSelectedChannelIds([])
  }

  // Copy individual
  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // fallback
    }
  }

  // Copy All as URLs
  const copyAllUrls = async () => {
    const validUrls = items.filter((i) => i.isValid).map((i) => i.finalUrl).join('\n')
    if (!validUrls) return
    try {
      await navigator.clipboard.writeText(validUrls)
      setCopyAllStatus('Copied all URLs!')
      setTimeout(() => setCopyAllStatus(null), 2500)
    } catch {
      setCopyAllStatus('Failed to copy')
    }
  }

  // Export CSV
  const exportCsv = () => {
    const validItems = items.filter((i) => i.isValid)
    if (validItems.length === 0) return

    const headers = ['Original URL', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'UTM Term', 'UTM Content', 'Final Tagged URL']
    const rows = validItems.map((item) => [
      `"${item.originalUrl.replace(/"/g, '""')}"`,
      `"${item.source.replace(/"/g, '""')}"`,
      `"${item.medium.replace(/"/g, '""')}"`,
      `"${item.campaign.replace(/"/g, '""')}"`,
      `"${item.term.replace(/"/g, '""')}"`,
      `"${item.content.replace(/"/g, '""')}"`,
      `"${item.finalUrl.replace(/"/g, '""')}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `qubnexa_bulk_utm_${campaign || 'campaign'}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Toolbar & Mode Tabs */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <LinkIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Bulk UTM Parameter Generator & Matrix
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate, sanitize, and export high-conversion tracking links across 12+ channels simultaneously.
              </p>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setMode('matrix')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'matrix'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Multi-Channel Matrix
          </button>
          <button
            onClick={() => setMode('bulk')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'bulk'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Bulk URL List
          </button>
        </div>
      </div>

      {/* 2. Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Config Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Target URLs input */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                {mode === 'matrix' ? 'Landing Page URLs (One per line)' : 'Target URLs to Tag (One per line)'}
              </label>
              <span className="text-xs text-slate-400">
                {mode === 'matrix'
                  ? `${matrixUrlsText.split('\n').filter(Boolean).length} URLs`
                  : `${bulkUrlsText.split('\n').filter(Boolean).length} URLs`}
              </span>
            </div>

            <textarea
              rows={4}
              value={mode === 'matrix' ? matrixUrlsText : bulkUrlsText}
              onChange={(e) =>
                mode === 'matrix' ? setMatrixUrlsText(e.target.value) : setBulkUrlsText(e.target.value)
              }
              placeholder="https://example.com/page-1&#10;https://example.com/page-2"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>

          {/* Campaign Global Parameters */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Campaign Attributes
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  utm_campaign <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  placeholder="e.g. black_friday_2026, webinar_ai"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {mode === 'bulk' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      utm_source <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bulkSource}
                      onChange={(e) => setBulkSource(e.target.value)}
                      placeholder="e.g. google, newsletter"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      utm_medium <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bulkMedium}
                      onChange={(e) => setBulkMedium(e.target.value)}
                      placeholder="e.g. cpc, email, social"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    utm_term (Optional Keyword)
                  </label>
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="e.g. free tools, saas promo"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    utm_content (Creative Variant)
                  </label>
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="e.g. hero_btn, banner_v2"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mode 1: Multi-Channel Checkbox Matrix */}
          {mode === 'matrix' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-emerald-500" />
                  Target Marketing Channels ({selectedChannelIds.length} Active)
                </h3>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={selectAllChannels}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <button
                    onClick={deselectAllChannels}
                    className="text-slate-500 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                {POPULAR_CHANNELS.map((ch) => {
                  const isChecked = selectedChannelIds.includes(ch.id)
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => toggleChannel(ch.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all text-xs ${
                        isChecked
                          ? 'border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20 text-slate-900 dark:text-white'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isChecked ? (
                          <CheckSquare className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Square className="h-3.5 w-3.5 text-slate-400" />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="font-semibold truncate">{ch.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {ch.source} / {ch.medium}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Normalization & Formatting Rules */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-purple-500" />
              URL Normalization & Hygiene
            </h3>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={forceLowercase}
                  onChange={(e) => setForceLowercase(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Force all UTM parameter values to lowercase (prevents Google Analytics fragmentation)
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={stripTrailingSlash}
                  onChange={(e) => setStripTrailingSlash(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Strip trailing slash before adding query string (clean URL structure)
              </label>

              <div className="pt-2 flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Replace spaces in tags with:</span>
                <div className="flex gap-1.5">
                  {(['-', '_', '%20'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setReplaceSpacesWith(opt)}
                      className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-all ${
                        replaceSpacesWith === opt
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {opt === '%20' ? 'Raw (%20)' : opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Table & Actions Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Generated Tracking URLs ({items.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Ready to copy, test, or export directly to your ad manager or spreadsheet.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyAllUrls}
                  disabled={items.length === 0}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copyAllStatus || 'Copy All URLs'}
                </button>
                <button
                  type="button"
                  onClick={exportCsv}
                  disabled={items.length === 0}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* URL List Container */}
            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {items.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  No URLs generated. Please enter at least one URL and select marketing channels.
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-semibold">
                          {item.source}
                        </span>
                        <span className="text-slate-400 text-xs">/</span>
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-mono text-[10px] font-semibold">
                          {item.medium}
                        </span>
                        {item.content && (
                          <>
                            <span className="text-slate-400 text-xs">•</span>
                            <span className="text-[10px] text-slate-500 font-mono truncate max-w-[120px]">
                              content: {item.content}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(item.finalUrl, item.id)}
                          className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all"
                          title="Copy Tagged URL"
                        >
                          {copiedId === item.id ? (
                            <Check className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                        <a
                          href={item.finalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-blue-500 transition-all"
                          title="Open URL in new tab"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>

                    <div className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all bg-white dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800/80">
                      {item.finalUrl}
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="truncate">Source URL: {item.originalUrl}</span>
                      <span className="shrink-0">{item.finalUrl.length} chars</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BulkUtmBuilder
