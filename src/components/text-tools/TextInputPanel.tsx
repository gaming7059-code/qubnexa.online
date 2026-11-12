import React, { useRef, useState } from 'react'
import { ClipboardPaste, FileUp, Sparkles, Trash2, AlertCircle } from 'lucide-react'
import type { TextMetrics } from '../../utils/textTransform'

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024 // 2 MB

export interface TextInputPanelProps {
  id: string
  label: string
  value: string
  onChange: (next: string) => void
  metrics: TextMetrics
  placeholder: string
  sampleText: string
  rows?: number
}

export const TextInputPanel: React.FC<TextInputPanelProps> = ({
  id,
  label,
  value,
  onChange,
  metrics,
  placeholder,
  sampleText,
  rows = 9,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const handlePaste = async () => {
    setNotice(null)
    if (!navigator.clipboard || typeof navigator.clipboard.readText !== 'function') {
      setNotice('Clipboard paste is unavailable in this browser context. Please press Ctrl+V / Cmd+V.')
      return
    }
    try {
      const clipText = await navigator.clipboard.readText()
      if (!clipText) {
        setNotice('Clipboard is currently empty or contains non-text data.')
        return
      }
      onChange(clipText)
    } catch {
      setNotice('Clipboard permission denied. Please paste directly inside the text box.')
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotice(null)
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    const isTxt = file.name.toLowerCase().endsWith('.txt') || file.type === 'text/plain' || file.type === ''
    if (!isTxt) {
      setNotice('Please select a valid plain-text (.txt) file.')
      return
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setNotice('File exceeds the 2 MB browser limit for instant text processing.')
      return
    }

    try {
      const content = await file.text()
      onChange(content)
    } catch {
      setNotice('Unable to read the selected .txt file.')
    }
  }

  return (
    <div className="xw-surface overflow-hidden focus-within:border-blue-600 dark:focus-within:border-[#00DFFF] focus-within:ring-3 focus-within:ring-blue-500/15 dark:focus-within:ring-[#00DFFF]/20">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-[#050814]/70">
        <label htmlFor={id} className="text-sm font-bold text-slate-900 dark:text-white">
          {label}
        </label>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setNotice(null)
              onChange(sampleText)
            }}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors dark:border-slate-700 dark:bg-[#11182D] dark:text-slate-200 dark:hover:border-[#00DFFF]/60 dark:hover:text-[#00DFFF]"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
            <span>Sample</span>
          </button>

          <button
            type="button"
            onClick={handlePaste}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors dark:border-slate-700 dark:bg-[#11182D] dark:text-slate-200 dark:hover:border-[#00DFFF]/60 dark:hover:text-[#00DFFF]"
            title="Paste text from clipboard"
          >
            <ClipboardPaste className="h-3.5 w-3.5 text-blue-600 dark:text-[#00DFFF]" />
            <span>Paste</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors dark:border-slate-700 dark:bg-[#11182D] dark:text-slate-200 dark:hover:border-[#00DFFF]/60 dark:hover:text-[#00DFFF]"
            title="Upload a .txt file"
          >
            <FileUp className="h-3.5 w-3.5 text-cyan-600 dark:text-[#00DFFF]" />
            <span>Upload .txt</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,text/plain"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload plain text file"
          />

          <button
            type="button"
            onClick={() => {
              setNotice(null)
              onChange('')
            }}
            disabled={!value}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-rose-200/80 bg-rose-50/70 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-40 transition-colors dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/70"
            title="Clear input text"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Inline Feedback Notice */}
      {notice && (
        <div
          role="alert"
          className="flex items-start gap-2 border-b border-amber-200 bg-amber-50/90 px-4 py-2 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* Textarea */}
      <div className="p-4 sm:p-5">
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full resize-y bg-transparent text-sm sm:text-base leading-relaxed text-slate-900 placeholder-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder-slate-500"
        />
      </div>

      {/* Live Metrics Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-2.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-[#050814]/50 dark:text-slate-300">
        <div className="flex flex-wrap items-center gap-3">
          <span>
            Words: <strong className="text-slate-900 dark:text-white">{metrics.words.toLocaleString()}</strong>
          </span>
          <span aria-hidden="true">•</span>
          <span>
            Characters: <strong className="text-slate-900 dark:text-white">{metrics.characters.toLocaleString()}</strong>
          </span>
          <span aria-hidden="true">•</span>
          <span>
            Lines: <strong className="text-slate-900 dark:text-white">{metrics.lines.toLocaleString()}</strong>
          </span>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Private browser processing
        </span>
      </div>
    </div>
  )
}
