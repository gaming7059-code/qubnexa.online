import React, { useRef, useState } from 'react'
import {
  Check,
  CheckSquare,
  Copy,
  CornerUpLeft,
  Download,
  Info,
  Share2,
  AlertTriangle,
} from 'lucide-react'
import {
  MAX_USE_AS_INPUT_CHARS,
  buildWhatsAppShareUrl,
  formatBytesCompact,
  getTextMetrics,
} from '../../utils/textTransform'

export interface TextOutputPanelProps {
  id: string
  title: string
  fullOutput: string
  previewOutput?: string
  downloadFilename: string
  emptyPlaceholder: string
  onUseResultAsInput: (text: string) => void
  isPreviewTruncated?: boolean
  errorBanner?: string | null
  infoBanner?: string | null
}

export const TextOutputPanel: React.FC<TextOutputPanelProps> = ({
  id,
  title,
  fullOutput,
  previewOutput,
  downloadFilename,
  emptyPlaceholder,
  onUseResultAsInput,
  isPreviewTruncated = false,
  errorBanner = null,
  infoBanner = null,
}) => {
  const outputRef = useRef<HTMLTextAreaElement>(null)
  const [copied, setCopied] = useState(false)
  const [actionNotice, setActionNotice] = useState<string | null>(null)

  const displayText = previewOutput !== undefined ? previewOutput : fullOutput
  const hasOutput = fullOutput.length > 0 && !errorBanner
  const metrics = React.useMemo(
    () => (hasOutput ? getTextMetrics(fullOutput) : { words: 0, characters: 0, codeUnits: 0, lines: 0, bytes: 0 }),
    [fullOutput, hasOutput],
  )

  const handleCopy = async () => {
    if (!hasOutput) return
    setActionNotice(null)
    try {
      await navigator.clipboard.writeText(fullOutput)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      outputRef.current?.focus()
      outputRef.current?.select()
      setActionNotice('Automatic clipboard write was blocked. Text selected — press Ctrl+C / Cmd+C.')
    }
  }

  const handleDownload = () => {
    if (!hasOutput) return
    setActionNotice(null)
    const blob = new Blob([fullOutput], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = downloadFilename
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const handleSelectAll = () => {
    if (!hasOutput || !outputRef.current) return
    outputRef.current.focus()
    outputRef.current.select()
    outputRef.current.setSelectionRange(0, outputRef.current.value.length)
  }

  const handleUseAsInput = () => {
    if (!hasOutput) return
    setActionNotice(null)
    if (fullOutput.length > MAX_USE_AS_INPUT_CHARS) {
      setActionNotice(
        `Output (${fullOutput.length.toLocaleString()} characters) is too large to load safely back into the editor box. Use Copy Result or Download .txt instead.`,
      )
      return
    }
    onUseResultAsInput(fullOutput)
  }

  const handleWhatsAppShare = () => {
    if (!hasOutput) return
    const share = buildWhatsAppShareUrl(fullOutput)
    if (!share.url) return
    if (share.wasTruncated) {
      setActionNotice(
        `Shared the first ${share.sharedChars.toLocaleString()} characters to WhatsApp due to URL length limits. Use Copy Result or Download .txt for full text.`,
      )
    } else {
      setActionNotice(null)
    }
    window.open(share.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="xw-surface overflow-hidden">
      {/* Header + Actions */}
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-3.5 dark:border-slate-800 dark:bg-[#050814]/70">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <label htmlFor={id} className="text-sm font-bold text-slate-900 dark:text-white">
              {title}
            </label>
            {hasOutput && (
              <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-800 dark:border-cyan-500/30 dark:bg-cyan-950/50 dark:text-[#00DFFF]">
                {formatBytesCompact(metrics.bytes)}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
            <span>
              Words: <strong className="text-slate-900 dark:text-white">{metrics.words.toLocaleString()}</strong>
            </span>
            <span aria-hidden="true">•</span>
            <span>
              Characters: <strong className="text-slate-900 dark:text-white">{metrics.characters.toLocaleString()}</strong>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!hasOutput}
            className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              copied
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 shadow-xs'
            }`}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Result'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!hasOutput}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 transition-colors dark:border-slate-700 dark:bg-[#11182D] dark:text-slate-200 dark:hover:border-[#00DFFF]/60 dark:hover:text-[#00DFFF]"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download .txt</span>
          </button>

          <button
            type="button"
            onClick={handleSelectAll}
            disabled={!hasOutput}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 transition-colors dark:border-slate-700 dark:bg-[#11182D] dark:text-slate-200 dark:hover:border-[#00DFFF]/60 dark:hover:text-[#00DFFF]"
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Select All</span>
          </button>

          <button
            type="button"
            onClick={handleUseAsInput}
            disabled={!hasOutput}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-purple-400 hover:text-purple-600 disabled:opacity-40 transition-colors dark:border-slate-700 dark:bg-[#11182D] dark:text-slate-200 dark:hover:border-purple-400/60 dark:hover:text-purple-300"
          >
            <CornerUpLeft className="h-3.5 w-3.5" />
            <span>Use Result as Input</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            disabled={!hasOutput}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-40 transition-colors dark:border-emerald-800/70 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950/80"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Banners */}
      {errorBanner && (
        <div
          role="alert"
          className="flex items-start gap-2.5 border-b border-rose-200 bg-rose-50 px-4 py-3 text-xs sm:text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200"
        >
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <span>{errorBanner}</span>
        </div>
      )}

      {!errorBanner && isPreviewTruncated && (
        <div className="flex items-start gap-2.5 border-b border-cyan-200 bg-cyan-50/80 px-4 py-2.5 text-xs text-cyan-900 dark:border-cyan-900/50 dark:bg-cyan-950/30 dark:text-cyan-200">
          <Info className="h-4 w-4 shrink-0 mt-0.5 text-cyan-600 dark:text-[#00DFFF]" />
          <span>
            Showing the first {displayText.length.toLocaleString()} characters in preview to keep scrolling fast.{' '}
            <strong>Copy Result</strong> and <strong>Download .txt</strong> use the full{' '}
            {fullOutput.length.toLocaleString()}-character output.
          </span>
        </div>
      )}

      {!errorBanner && infoBanner && (
        <div className="flex items-start gap-2.5 border-b border-amber-200 bg-amber-50/80 px-4 py-2.5 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <span>{infoBanner}</span>
        </div>
      )}

      {actionNotice && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start gap-2.5 border-b border-blue-200 bg-blue-50/80 px-4 py-2.5 text-xs text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200"
        >
          <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-600 dark:text-[#00DFFF]" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Output Textarea */}
      <div className="p-4 sm:p-5 bg-slate-50/30 dark:bg-[#050814]/25">
        <textarea
          ref={outputRef}
          id={id}
          readOnly
          value={errorBanner ? '' : displayText}
          rows={9}
          placeholder={emptyPlaceholder}
          aria-label={title}
          className="w-full resize-y bg-transparent text-sm sm:text-base leading-relaxed text-slate-900 placeholder-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder-slate-500"
        />
      </div>
    </div>
  )
}
