import React, { useState, useMemo } from 'react'
import {
  Code2,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sliders,
  FileCode,
} from 'lucide-react'

const SAMPLE_HTML = `<div class="MsoNormal" style="font-family: 'Calibri', sans-serif; font-size: 11pt; color: #222222; margin: 0px 0px 10px 0px; line-height: 1.5;">
  <h2 style="font-size: 18pt; color: #003366; margin-top: 15px;"><span style="font-weight: bold;">Essential Guide to Modern Web Standards</span></h2>
  <p class="paragraph-1" style="margin-bottom: 12px;">
    Modern web applications require <b style="font-weight: bold;">fast loading times</b> and <i style="font-style: italic;">clean semantic markup</i>.
  </p>
  <div style="background-color: #f9f9f9; padding: 10px; border-left: 4px solid #336699;">
    <p style="margin: 0;"><b>Note:</b> Avoid bloated inline styles from Word or Google Docs.</p>
  </div>
  <p><span class="empty-span"></span></p>
  <ul style="list-style-type: disc; margin-left: 20px;">
    <li style="margin-bottom: 5px;"><a href="https://qubnexa.online?utm_source=test&utm_medium=email" target="_blank" onclick="alert('track')">Explore Free Tools</a></li>
    <li style="margin-bottom: 5px;">Built with privacy-first client-side architecture.</li>
  </ul>
  <script type="text/javascript">console.log("tracking beacon");</script>
</div>`

export const HtmlContentCleaner: React.FC = () => {
  const [rawHtml, setRawHtml] = useState(SAMPLE_HTML)

  // Cleaning options
  const [removeInlineStyles, setRemoveInlineStyles] = useState(true)
  const [removeClassAndId, setRemoveClassAndId] = useState(true)
  const [removeEmptyTags, setRemoveEmptyTags] = useState(true)
  const [removeScriptsAndStyles, setRemoveScriptsAndStyles] = useState(true)
  const [unwrapDivsAndSpans, setUnwrapDivsAndSpans] = useState(true)
  const [normalizeSemanticTags, setNormalizeSemanticTags] = useState(true) // <b> -> <strong>, <i> -> <em>
  const [removeTrackingAttributes, setRemoveTrackingAttributes] = useState(true) // onclick, data-*

  // UI state
  const [viewMode, setViewMode] = useState<'clean_html' | 'markdown' | 'preview'>('clean_html')
  const [copied, setCopied] = useState(false)

  // Cleaning Algorithm
  const cleanedHtml = useMemo(() => {
    if (!rawHtml.trim()) return ''

    let html = rawHtml

    // 1. Remove script, style, iframe blocks
    if (removeScriptsAndStyles) {
      html = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    }

    // 2. Remove inline styles
    if (removeInlineStyles) {
      html = html.replace(/\s*style="[^"]*"/gi, '').replace(/\s*style='[^']*'/gi, '')
    }

    // 3. Remove class and id attributes
    if (removeClassAndId) {
      html = html
        .replace(/\s*class="[^"]*"/gi, '')
        .replace(/\s*class='[^']*'/gi, '')
        .replace(/\s*id="[^"]*"/gi, '')
        .replace(/\s*id='[^']*'/gi, '')
    }

    // 4. Remove tracking and event attributes (onclick, onmouseover, data-*)
    if (removeTrackingAttributes) {
      html = html
        .replace(/\s*on\w+="[^"]*"/gi, '')
        .replace(/\s*on\w+='[^']*'/gi, '')
        .replace(/\s*data-[\w-]+="[^"]*"/gi, '')
        .replace(/\s*data-[\w-]+='[^']*'/gi, '')
    }

    // 4b. Strip dangerous protocol schemes in href and src (javascript:, data:, vbscript:)
    html = html.replace(/\s*(?:href|src)=["'](?:javascript|vbscript|data):[^"']*["']/gi, '')

    // 5. Normalize b -> strong, i -> em
    if (normalizeSemanticTags) {
      html = html
        .replace(/<b>/gi, '<strong>')
        .replace(/<\/b>/gi, '</strong>')
        .replace(/<i>/gi, '<em>')
        .replace(/<\/i>/gi, '</em>')
    }

    // 6. Unwrap redundant div and span wrappers (preserve content)
    if (unwrapDivsAndSpans) {
      // Remove opening and closing spans
      html = html.replace(/<span\b[^>]*>/gi, '').replace(/<\/span>/gi, '')
      // Replace outer divs with paragraphs if not followed by tag
      html = html.replace(/<div\b[^>]*>/gi, '<p>').replace(/<\/div>/gi, '</p>')
    }

    // 7. Remove empty tags (e.g. <p></p>, <strong></strong>, <p>&nbsp;</p>)
    if (removeEmptyTags) {
      html = html
        .replace(/<(\w+)\b[^>]*>\s*(?:&nbsp;)?\s*<\/\1>/gi, '')
        .replace(/<p>\s*<\/p>/gi, '')
    }

    // Clean up multiple extra spaces and newlines
    html = html
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/<p><p>/gi, '<p>')
      .replace(/<\/p><\/p>/gi, '</p>')
      .trim()

    return html
  }, [
    rawHtml,
    removeInlineStyles,
    removeClassAndId,
    removeEmptyTags,
    removeScriptsAndStyles,
    unwrapDivsAndSpans,
    normalizeSemanticTags,
    removeTrackingAttributes,
  ])

  // Convert Clean HTML to Markdown
  const markdownOutput = useMemo(() => {
    let md = cleanedHtml
      .replace(/<h1\b[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2\b[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3\b[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<strong\b[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<em\b[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<a\b[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      .replace(/<li\b[^>]*>(.*?)<\/li>/gi, '- $1\n')
      .replace(/<ul\b[^>]*>|<\/ul>/gi, '\n')
      .replace(/<ol\b[^>]*>|<\/ol>/gi, '\n')
      .replace(/<p\b[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<blockquote\b[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')
      .replace(/<hr\b[^>]*\/?>/gi, '\n---\n')
      .replace(/<\/?[^>]+(>|$)/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    return md
  }, [cleanedHtml])

  // Stats calculation
  const stats = useMemo(() => {
    const rawLen = rawHtml.length
    const cleanLen = cleanedHtml.length
    const reduction = rawLen > 0 ? Math.round(((rawLen - cleanLen) / rawLen) * 100) : 0
    return { rawLen, cleanLen, reduction: Math.max(0, reduction) }
  }, [rawHtml, cleanedHtml])

  const currentOutput = viewMode === 'markdown' ? markdownOutput : cleanedHtml

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentOutput)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  const handleDownload = () => {
    const ext = viewMode === 'markdown' ? 'md' : 'html'
    const blob = new Blob([currentOutput], { type: 'text/plain;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `cleaned-content.${ext}`
    link.click()
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Toolbar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500">
            <Code2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Semantic HTML & Rich Text Cleaner
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Strip bloated Word/Google Docs styles, redundant divs, tracking scripts, and convert to clean CMS HTML or Markdown.
            </p>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold self-start md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('clean_html')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'clean_html'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Clean HTML
          </button>
          <button
            type="button"
            onClick={() => setViewMode('markdown')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'markdown'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Markdown (.md)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'preview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Visual Preview
          </button>
        </div>
      </div>

      {/* 2. Top Savings KPI Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">Original Bloat</div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {stats.rawLen} <span className="text-xs font-normal text-slate-400">bytes</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">Cleaned Size</div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {stats.cleanLen} <span className="text-xs font-normal text-slate-400">bytes</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">Payload Reduction</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            -{stats.reduction}%
          </div>
        </div>
      </div>

      {/* 3. Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input & Options (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* HTML Input Area */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <FileCode className="h-4 w-4 text-blue-500" />
                Raw Messy HTML Code
              </label>
              <button
                type="button"
                onClick={() => setRawHtml('')}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" /> Clear
              </button>
            </div>

            <textarea
              rows={8}
              value={rawHtml}
              onChange={(e) => setRawHtml(e.target.value)}
              placeholder="Paste rich text HTML from Word, Google Docs, or websites..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all leading-relaxed"
            />
          </div>

          {/* Cleaning Rules */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-purple-500" />
              Sanitization Filters
            </h3>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={removeInlineStyles}
                  onChange={(e) => setRemoveInlineStyles(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Remove all inline style="..." attributes
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={removeClassAndId}
                  onChange={(e) => setRemoveClassAndId(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Remove all class="..." and id="..." attributes
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={removeScriptsAndStyles}
                  onChange={(e) => setRemoveScriptsAndStyles(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Strip &lt;script&gt;, &lt;style&gt;, and &lt;iframe&gt; blocks
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={unwrapDivsAndSpans}
                  onChange={(e) => setUnwrapDivsAndSpans(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Unwrap redundant &lt;div&gt; and &lt;span&gt; containers
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={normalizeSemanticTags}
                  onChange={(e) => setNormalizeSemanticTags(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Normalize legacy &lt;b&gt; to &lt;strong&gt; and &lt;i&gt; to &lt;em&gt;
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={removeTrackingAttributes}
                  onChange={(e) => setRemoveTrackingAttributes(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Remove onclick and data-* tracking event attributes
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={removeEmptyTags}
                  onChange={(e) => setRemoveEmptyTags(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Purge empty tags and redundant &amp;nbsp; paragraphs
              </label>
            </div>
          </div>
        </div>

        {/* Right Output Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Cleaned Content Output
                </h3>
                <p className="text-xs text-slate-400">
                  Ready for WordPress, Ghost, Substack, Webflow, or static site generators.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download .{viewMode === 'markdown' ? 'md' : 'html'}
                </button>
              </div>
            </div>

            {/* Display View */}
            {viewMode === 'preview' ? (
              <iframe
                title="Cleaned HTML Preview"
                srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;font-size:13px;line-height:1.6;color:#1e293b;padding:16px;margin:0;}@media(prefers-color-scheme:dark){body{color:#e2e8f0;background:#050814;}}</style></head><body>${cleanedHtml}</body></html>`}
                sandbox=""
                className="w-full h-[520px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#050814]"
              />
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 max-h-[580px] overflow-y-auto whitespace-pre-wrap select-all leading-relaxed">
                {currentOutput || 'Cleaned output will appear here.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HtmlContentCleaner
