import React, { useState, useId, useMemo, useCallback, useRef } from 'react'
import {
  Upload,
  FileText,
  Sparkles,
  Copy,
  Check,
  Download,
  AlertCircle,
  CheckCircle2,
  SlidersHorizontal,
  Info,
  Loader2,
  FileCode,
} from 'lucide-react'
import {
  cleanPdfText,
  CLEANING_MODES,
  getTextMetrics,
  SAMPLE_RAW_PDF_TEXT,
  type CleanOptions,
  type CleaningMode,
} from '../../utils/pdfTextCleaner'
import { extractTextFromPdf, validatePdfFile } from '../../utils/pdfExtractor'

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

export const PdfTextCleaner: React.FC = () => {
  const fileInputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Editor states
  const [rawText, setRawText] = useState<string>(SAMPLE_RAW_PDF_TEXT)
  const [originalExtractedText, setOriginalExtractedText] = useState<string>(SAMPLE_RAW_PDF_TEXT)
  const [fileName, setFileName] = useState<string>('sample-document.pdf')
  const [pageCount, setPageCount] = useState<number>(3)

  // Mode and options
  const [mode, setMode] = useState<CleaningMode>('advanced')
  const [customOptions, setCustomOptions] = useState<CleanOptions>(CLEANING_MODES.advanced)

  // Processing & UI states
  const [isExtracting, setIsExtracting] = useState<boolean>(false)
  const [extractionProgress, setExtractionProgress] = useState<{ current: number; total: number } | null>(null)
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const [isScannedWarning, setIsScannedWarning] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [copied, setCopied] = useState<boolean>(false)

  // Effective cleaning options
  const activeOptions = useMemo(() => {
    if (mode === 'basic') return CLEANING_MODES.basic
    if (mode === 'advanced') return CLEANING_MODES.advanced
    return customOptions
  }, [mode, customOptions])

  // Cleaned text computation
  const cleanedText = useMemo(() => {
    return cleanPdfText(rawText, activeOptions)
  }, [rawText, activeOptions])

  // Metrics
  const originalMetrics = useMemo(() => getTextMetrics(rawText), [rawText])
  const cleanedMetrics = useMemo(() => getTextMetrics(cleanedText), [cleanedText])

  // File Upload Handler
  const handleFileUpload = useCallback(async (file: File) => {
    const val = validatePdfFile(file)
    if (!val.valid) {
      setErrorMessage(val.error || 'Invalid file')
      return
    }

    setErrorMessage(null)
    setIsScannedWarning(false)
    setIsExtracting(true)
    setExtractionProgress({ current: 1, total: 1 })
    setFileName(file.name)

    try {
      const result = await extractTextFromPdf(file, (current, total) => {
        setExtractionProgress({ current, total })
      })

      if (!result.success) {
        setErrorMessage(result.error || 'Failed to extract text from PDF.')
        setIsExtracting(false)
        return
      }

      setPageCount(result.pageCount || 1)

      if (result.isScanned) {
        setIsScannedWarning(true)
        setRawText('')
        setOriginalExtractedText('')
      } else {
        setRawText(result.text || '')
        setOriginalExtractedText(result.text || '')
      }
    } catch (err) {
      setErrorMessage(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsExtracting(false)
      setExtractionProgress(null)
    }
  }, [])

  // Drag and drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileUpload(e.dataTransfer.files[0])
      }
    },
    [handleFileUpload]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  // Preset Sample Loader
  const handleLoadSample = useCallback(() => {
    setRawText(SAMPLE_RAW_PDF_TEXT)
    setOriginalExtractedText(SAMPLE_RAW_PDF_TEXT)
    setFileName('sample-document.pdf')
    setPageCount(3)
    setIsScannedWarning(false)
    setErrorMessage(null)
  }, [])

  // Clear / Reset
  const handleClear = useCallback(() => {
    setRawText('')
    setOriginalExtractedText('')
    setFileName('')
    setIsScannedWarning(false)
    setErrorMessage(null)
  }, [])

  const handleRevert = useCallback(() => {
    setRawText(originalExtractedText)
  }, [originalExtractedText])

  // Copy to clipboard
  const handleCopyCleaned = useCallback(async () => {
    if (!cleanedText) return
    const success = await copyTextToClipboard(cleanedText)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [cleanedText])

  // Download TXT
  const handleDownloadTxt = useCallback(() => {
    if (!cleanedText) return
    const blob = new Blob([cleanedText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const downloadName = fileName ? fileName.replace(/\.pdf$/i, '-cleaned.txt') : 'cleaned-text.txt'
    a.download = downloadName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [cleanedText, fileName])

  // Custom toggle helper
  const toggleOption = (key: keyof CleanOptions) => {
    setCustomOptions((prev) => ({ ...prev, [key]: !prev[key] }))
    setMode('custom')
  }

  return (
    <div className="w-full space-y-6">
      {/* Upload & Dropzone Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`rounded-3xl border-2 border-dashed p-6 sm:p-8 text-center transition-all ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19]'
        }`}
      >
        <input
          ref={fileInputRef}
          id={fileInputId}
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileUpload(e.target.files[0])
            }
          }}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            {isExtracting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
              {isExtracting
                ? `Extracting Page ${extractionProgress?.current || 1} of ${extractionProgress?.total || 1}...`
                : 'Upload PDF Document to Clean Text'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Drag and drop your PDF here or click to browse (up to 50 MB, 100% private in browser)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isExtracting}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Choose PDF File
            </button>
            <button
              type="button"
              onClick={handleLoadSample}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#11182D] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 inline mr-1" />
              Load Sample Text
            </button>
          </div>

          {fileName && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400 mt-2">
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              <span>{fileName}</span>
              {pageCount > 0 && <span>• {pageCount} pages</span>}
            </div>
          )}
        </div>
      </div>

      {/* Scanned PDF Warning Banner */}
      {isScannedWarning && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div className="text-xs space-y-1">
            <div className="font-semibold text-amber-900 dark:text-amber-200">
              No extractable digital text found in this PDF
            </div>
            <p className="text-amber-800 dark:text-amber-300/90 leading-relaxed">
              This document appears to be scanned or contains image-only pages. PDF Text Cleaner
              extracts native digital text streams. Scanned documents require Optical Character
              Recognition (OCR) before text can be edited and cleaned.
            </p>
          </div>
        </div>
      )}

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
          <div className="text-xs space-y-1">
            <div className="font-semibold text-rose-800 dark:text-rose-200">PDF Processing Error</div>
            <p className="text-rose-700 dark:text-rose-300 font-mono">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Mode Selector & Custom Options Panel */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
            <h3 className="font-semibold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Cleaning Presets & Modes
            </h3>
          </div>

          {/* Mode Tabs */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
            {(
              [
                { id: 'basic', label: 'Basic Cleanup' },
                { id: 'advanced', label: 'Advanced Cleanup' },
                { id: 'custom', label: 'Custom Configuration' },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === m.id
                    ? 'bg-white dark:bg-[#11182D] text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Configuration Checkbox Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={activeOptions.normalizeSpaces}
              onChange={() => toggleOption('normalizeSpaces')}
              className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <span className="font-medium">Normalize Spaces</span>
              <p className="text-[10px] text-slate-400">Collapse multiple spaces into one</p>
            </div>
          </label>

          <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={activeOptions.removeDuplicateBlankLines}
              onChange={() => toggleOption('removeDuplicateBlankLines')}
              className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <span className="font-medium">Remove Blank Lines</span>
              <p className="text-[10px] text-slate-400">Collapse excess line breaks</p>
            </div>
          </label>

          <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={activeOptions.unbreakHyphenatedWords}
              onChange={() => toggleOption('unbreakHyphenatedWords')}
              className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <span className="font-medium">Join Hyphenated Words</span>
              <p className="text-[10px] text-slate-400">Rejoin word-breaks across lines</p>
            </div>
          </label>

          <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={activeOptions.unbreakParagraphLines}
              onChange={() => toggleOption('unbreakParagraphLines')}
              className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <span className="font-medium">Unbreak Paragraphs</span>
              <p className="text-[10px] text-slate-400">Flow soft wraps into single block</p>
            </div>
          </label>

          <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={activeOptions.normalizeQuotesAndDashes}
              onChange={() => toggleOption('normalizeQuotesAndDashes')}
              className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <span className="font-medium">Normalize Quotes & Dashes</span>
              <p className="text-[10px] text-slate-400">Convert smart quotes & em-dashes</p>
            </div>
          </label>

          <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={activeOptions.removePageNumbers}
              onChange={() => toggleOption('removePageNumbers')}
              className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <span className="font-medium">Strip Page Numbers</span>
              <p className="text-[10px] text-slate-400">Filter out standalone &quot;Page X&quot; lines</p>
            </div>
          </label>

          <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={activeOptions.removeControlCharacters}
              onChange={() => toggleOption('removeControlCharacters')}
              className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <span className="font-medium">Remove Control Chars</span>
              <p className="text-[10px] text-slate-400">Strip binary & unprintable bytes</p>
            </div>
          </label>

          <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={activeOptions.trimLines}
              onChange={() => toggleOption('trimLines')}
              className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <span className="font-medium">Trim Line Edges</span>
              <p className="text-[10px] text-slate-400">Remove start & end whitespace</p>
            </div>
          </label>
        </div>
      </div>

      {/* Main Two-Pane Editor Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Raw / Extracted Text Editor */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] p-4 sm:p-5 shadow-xs flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-slate-400" />
              Raw Extracted Text
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRevert}
                disabled={rawText === originalExtractedText}
                className="text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-40"
                title="Revert back to original extracted text"
              >
                Revert
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

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Extracted or pasted raw PDF text will appear here..."
            className="w-full h-[400px] p-3.5 font-mono text-xs bg-slate-50 dark:bg-[#11182D] text-slate-900 dark:text-slate-100 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y leading-relaxed"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{originalMetrics.words.toLocaleString()} words • {originalMetrics.characters.toLocaleString()} chars</span>
            <span>{originalMetrics.lines} lines • {originalMetrics.paragraphs} paragraphs</span>
          </div>
        </div>

        {/* Right: Cleaned Text Viewer */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] p-4 sm:p-5 shadow-xs flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Cleaned Output
            </span>

            {/* Output Actions */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyCleaned}
                disabled={!cleanedText}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadTxt}
                disabled={!cleanedText}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save .TXT</span>
              </button>
            </div>
          </div>

          <textarea
            readOnly
            value={cleanedText}
            placeholder="Cleaned and normalized text will render here..."
            className="w-full h-[400px] p-3.5 font-mono text-xs bg-slate-50 dark:bg-[#11182D] text-slate-900 dark:text-slate-100 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none resize-y leading-relaxed select-all"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{cleanedMetrics.words.toLocaleString()} words • {cleanedMetrics.characters.toLocaleString()} chars</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              Saved {Math.max(0, originalMetrics.characters - cleanedMetrics.characters).toLocaleString()} characters
            </span>
          </div>
        </div>
      </div>

      {/* Comparison Metrics Delta Grid */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] p-6 shadow-xs space-y-4">
        <h3 className="font-semibold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Text Reduction & Sanitization Scorecard
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#11182D] border border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] text-slate-400">Character Reduction</span>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {originalMetrics.characters > 0
                ? `${(
                    ((originalMetrics.characters - cleanedMetrics.characters) /
                      originalMetrics.characters) *
                    100
                  ).toFixed(1)}%`
                : '0%'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {originalMetrics.characters.toLocaleString()} → {cleanedMetrics.characters.toLocaleString()}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#11182D] border border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] text-slate-400">Line Cleanliness</span>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {originalMetrics.lines - cleanedMetrics.lines >= 0
                ? `-${originalMetrics.lines - cleanedMetrics.lines} lines`
                : `${cleanedMetrics.lines} lines`}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {originalMetrics.lines} → {cleanedMetrics.lines} total lines
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#11182D] border border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] text-slate-400">Cohesive Paragraphs</span>
            <div className="text-lg font-bold text-sky-600 dark:text-sky-400 mt-0.5">
              {cleanedMetrics.paragraphs}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Preserved document structure
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#11182D] border border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] text-slate-400">Total Word Count</span>
            <div className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5">
              {cleanedMetrics.words.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Content preserved without loss
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
