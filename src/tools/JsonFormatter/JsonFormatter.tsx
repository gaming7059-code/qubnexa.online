import React, { useState, useId, useMemo, useCallback } from 'react'
import {
  Code2,
  Minimize2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Download,
  Trash2,
  FileCode,
  ArrowDownUp,
  Search,
  Sparkles,
  Layers,
  Brackets,
} from 'lucide-react'
import {
  validateJson,
  formatJson,
  minifyJson,
  computeJsonStats,
  escapeJsonString,
  unescapeJsonString,
  SAMPLE_JSON,
  type IndentType,
  type JsonStats,
  type ValidationResult,
} from '../../utils/jsonFormatter'
import { JsonTreeView } from './JsonTreeView'

async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fall through to fallback
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

type ViewMode = 'editor' | 'tree'

export const JsonFormatter: React.FC = () => {
  const inputId = useId()
  const searchId = useId()

  const [rawInput, setRawInput] = useState<string>(SAMPLE_JSON)
  const [indent, setIndent] = useState<IndentType>(2)
  const [sortKeys, setSortKeys] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<ViewMode>('editor')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const [copiedFormatted, setCopiedFormatted] = useState<boolean>(false)
  const [copiedMinified, setCopiedMinified] = useState<boolean>(false)

  // Validation state
  const validation: ValidationResult = useMemo(() => {
    return validateJson(rawInput)
  }, [rawInput])

  // Formatted output
  const { formatted } = useMemo(() => {
    if (!validation.isValid) return { formatted: '' }
    return formatJson(rawInput, { indent, sortKeys })
  }, [rawInput, indent, sortKeys, validation.isValid])

  // Minified output
  const { minified } = useMemo(() => {
    if (!validation.isValid) return { minified: '' }
    return minifyJson(rawInput)
  }, [rawInput, validation.isValid])

  // Computed statistics
  const stats: JsonStats | null = useMemo(() => {
    if (!validation.isValid || validation.parsedValue === undefined) {
      return null
    }
    return computeJsonStats(validation.parsedValue, formatted || rawInput)
  }, [validation.isValid, validation.parsedValue, formatted, rawInput])

  // Actions
  const handleLoadSample = useCallback(() => {
    setRawInput(SAMPLE_JSON)
  }, [])

  const handleClear = useCallback(() => {
    setRawInput('')
  }, [])

  const handleFormat = useCallback(() => {
    if (validation.isValid && formatted) {
      setRawInput(formatted)
    }
  }, [validation.isValid, formatted])

  const handleMinify = useCallback(() => {
    if (validation.isValid && minified) {
      setRawInput(minified)
    }
  }, [validation.isValid, minified])

  const handleEscape = useCallback(() => {
    setRawInput(escapeJsonString(rawInput))
  }, [rawInput])

  const handleUnescape = useCallback(() => {
    const { result } = unescapeJsonString(rawInput)
    setRawInput(result)
  }, [rawInput])

  const handleCopyFormatted = useCallback(async () => {
    const textToCopy = formatted || rawInput
    const ok = await copyTextToClipboard(textToCopy)
    if (ok) {
      setCopiedFormatted(true)
      setTimeout(() => setCopiedFormatted(false), 2000)
    }
  }, [formatted, rawInput])

  const handleCopyMinified = useCallback(async () => {
    const textToCopy = minified || rawInput
    const ok = await copyTextToClipboard(textToCopy)
    if (ok) {
      setCopiedMinified(true)
      setTimeout(() => setCopiedMinified(false), 2000)
    }
  }, [minified, rawInput])

  const handleDownload = useCallback(() => {
    const content = formatted || rawInput
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'data.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [formatted, rawInput])

  const handlePaste = useCallback(async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
      try {
        const text = await navigator.clipboard.readText()
        if (text) setRawInput(text)
      } catch {
        // Silently skip if clipboard read permission is blocked
      }
    }
  }, [])

  return (
    <div className="w-full space-y-6">
      {/* Top Configuration & Status Header */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {validation.isEmpty ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold">
                <FileCode className="w-3.5 h-3.5" />
                Empty Editor
              </span>
            ) : validation.isValid ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Valid JSON Syntax
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 text-xs font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                Invalid JSON Syntax
              </span>
            )}

            {/* Quick Stats Summary */}
            {stats && (
              <span className="hidden sm:inline-flex text-xs text-slate-500 dark:text-slate-400">
                • {stats.lines} lines, {stats.keys} keys, {stats.objects} objects
              </span>
            )}
          </div>

          {/* Config Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Indent Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <span className="text-slate-400">Indent:</span>
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
                {(
                  [
                    { label: '2 Spaces', val: 2 },
                    { label: '4 Spaces', val: 4 },
                    { label: 'Tab', val: 'tab' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setIndent(opt.val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      indent === opt.val
                        ? 'bg-white dark:bg-[#11182D] text-slate-900 dark:text-slate-100 shadow-xs'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Keys Toggle */}
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sortKeys}
                onChange={(e) => setSortKeys(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="inline-flex items-center gap-1">
                <ArrowDownUp className="w-3 h-3 text-slate-400" />
                Sort Keys
              </span>
            </label>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Main Operations */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleFormat}
              disabled={!validation.isValid}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-40"
              title="Format JSON with selected indentation"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Format / Pretty</span>
            </button>

            <button
              type="button"
              onClick={handleMinify}
              disabled={!validation.isValid}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-40"
              title="Compact JSON into a single line without spaces"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Minify</span>
            </button>

            <button
              type="button"
              onClick={handleEscape}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#11182D] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              title="Escape quotes and special characters for string literals"
            >
              <span>Escape</span>
            </button>

            <button
              type="button"
              onClick={handleUnescape}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#11182D] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              title="Unescape escaped JSON string"
            >
              <span>Unescape</span>
            </button>
          </div>

          {/* Utility Tools */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#11182D] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Sample JSON</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#11182D] hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-700 dark:text-slate-300 hover:text-rose-600 text-xs font-medium transition-colors cursor-pointer"
              title="Clear editor"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Error Alert Banner */}
        {!validation.isValid && !validation.isEmpty && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
            <div className="text-xs space-y-1">
              <div className="font-semibold text-rose-800 dark:text-rose-200">
                JSON Syntax Error detected
                {validation.line !== null && validation.column !== null && (
                  <span className="font-mono ml-2 px-1.5 py-0.5 rounded bg-rose-200/70 dark:bg-rose-900/60 text-rose-900 dark:text-rose-100">
                    Line {validation.line}, Column {validation.column}
                  </span>
                )}
              </div>
              <p className="text-rose-700 dark:text-rose-300 font-mono break-all">
                {validation.error}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Two-Pane Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Pane: Input Editor */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] p-4 sm:p-5 shadow-xs space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Input JSON Editor
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePaste}
                className="text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Paste from clipboard"
              >
                Paste
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="text-[11px] font-medium text-rose-500 hover:text-rose-700 px-2 py-0.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="relative flex-1">
            <textarea
              id={inputId}
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Paste or write your raw JSON here..."
              spellCheck={false}
              className="w-full h-[420px] p-3.5 font-mono text-xs bg-slate-50 dark:bg-[#11182D] text-slate-900 dark:text-slate-100 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{rawInput.length.toLocaleString()} characters</span>
            <span>{rawInput ? rawInput.split('\n').length : 0} lines</span>
          </div>
        </div>

        {/* Right Pane: Formatted / Tree Output */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] p-4 sm:p-5 shadow-xs space-y-3 flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* View Mode Toggle */}
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('editor')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'editor'
                    ? 'bg-white dark:bg-[#11182D] text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Code2 className="w-3 h-3" />
                <span>Editor View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('tree')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'tree'
                    ? 'bg-white dark:bg-[#11182D] text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Tree Explorer</span>
              </button>
            </div>

            {/* Quick Output Actions */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyFormatted}
                disabled={!validation.isValid}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40"
                title="Copy formatted JSON"
              >
                {copiedFormatted ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopyMinified}
                disabled={!validation.isValid}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40"
                title="Copy minified JSON"
              >
                {copiedMinified ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span>Minified!</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-3 h-3" />
                    <span>Copy Minified</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={!validation.isValid}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-40"
                title="Download formatted JSON file"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Right Pane Body */}
          <div className="flex-1">
            {viewMode === 'editor' ? (
              <div className="relative">
                <textarea
                  readOnly
                  value={formatted || (validation.isEmpty ? '' : rawInput)}
                  placeholder="Formatted JSON will render here..."
                  className="w-full h-[420px] p-3.5 font-mono text-xs bg-slate-50 dark:bg-[#11182D] text-slate-900 dark:text-slate-100 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none resize-y leading-relaxed select-all"
                />
              </div>
            ) : (
              <div className="space-y-2">
                {/* Search bar inside tree view */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id={searchId}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search keys or values in tree..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-[#11182D] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {validation.isValid && validation.parsedValue !== undefined ? (
                  <JsonTreeView
                    data={validation.parsedValue}
                    searchQuery={searchQuery}
                    initialExpandedDepth={2}
                  />
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    Tree Explorer requires valid JSON input. Fix errors in the editor to inspect the
                    collapsible hierarchy.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* JSON Statistics Dashboard */}
      {stats && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Brackets className="w-4 h-4 text-emerald-500" />
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              Structural JSON Metrics
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#11182D] border border-slate-100 dark:border-slate-800/80">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Total Characters</div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {stats.characters.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#11182D] border border-slate-100 dark:border-slate-800/80">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Total Lines</div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {stats.lines.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#11182D] border border-slate-100 dark:border-slate-800/80">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Objects Count</div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {stats.objects.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#11182D] border border-slate-100 dark:border-slate-800/80">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Arrays Count</div>
              <div className="text-lg font-bold text-sky-600 dark:text-sky-400 mt-0.5">
                {stats.arrays.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#11182D] border border-slate-100 dark:border-slate-800/80">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Total Keys</div>
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                {stats.keys.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#11182D] border border-slate-100 dark:border-slate-800/80">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Max Depth</div>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                {stats.maxDepth}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
